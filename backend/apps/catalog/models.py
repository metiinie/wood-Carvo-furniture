"""Catalog data models for WOOD CARVO."""

from __future__ import annotations

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class Category(models.Model):
    """Furniture category (e.g., Living Room, Dining, Bedroom, Workshop Specials)."""

    name = models.CharField(max_length=150, help_text="Category name")
    slug = models.SlugField(max_length=160, unique=True, blank=True, allow_unicode=True)
    description = models.TextField(blank=True, help_text="Short description of the category")
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    sort_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.name or f"Category #{self.pk}"

    def save(self, *args, **kwargs) -> None:
        if not self.slug:
            base_slug = slugify(self.name, allow_unicode=True) or f"category-{self.pk or 'new'}"
            candidate = base_slug
            counter = 1
            while Category.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = candidate
        super().save(*args, **kwargs)


class Product(models.Model):
    """Furniture item crafted by WOOD CARVO workshop."""

    class Availability(models.TextChoices):
        READY = "READY", "Ready to Deliver"
        MADE_TO_ORDER = "MADE_TO_ORDER", "Made to Order"
        SOLD = "SOLD", "Previously Made / Sold"

    class PriceMode(models.TextChoices):
        FIXED = "FIXED", "Fixed Price"
        FROM = "FROM", "Starting From"
        ASK = "ASK", "Ask for Price"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Draft"
        PUBLISHED = "PUBLISHED", "Published"
        ARCHIVED = "ARCHIVED", "Archived"

    code = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
        db_index=True,
        help_text="Customer facing identifier e.g. WC-001",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, allow_unicode=True)
    description = models.TextField(blank=True)
    material = models.CharField(
        max_length=200, blank=True, help_text="e.g. Solid Mahogany, Oak veneer"
    )
    color = models.CharField(max_length=100, blank=True, help_text="e.g. Dark Walnut, Natural Teak")
    dimensions = models.CharField(
        max_length=150,
        blank=True,
        help_text="Free text dimensions e.g. 210cm W x 90cm D x 75cm H",
    )
    is_customizable = models.BooleanField(
        default=True,
        help_text="Allows customer to request custom dimensions/materials",
    )
    availability = models.CharField(
        max_length=20,
        choices=Availability.choices,
        default=Availability.MADE_TO_ORDER,
        db_index=True,
    )
    lead_time = models.CharField(
        max_length=100,
        blank=True,
        help_text="Production lead time e.g. '2-3 weeks' for Made-to-Order",
    )
    price_mode = models.CharField(
        max_length=10,
        choices=PriceMode.choices,
        default=PriceMode.ASK,
    )
    price_etb = models.PositiveIntegerField(
        null=True,
        blank=True,
        help_text="Price in Ethiopian Birr (ETB). Ignored if price_mode is ASK.",
    )
    featured = models.BooleanField(default=False, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT,
        db_index=True,
    )

    # SEO fields
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)

    # Timestamps & Tracking
    published_at = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Telegram Auto-Post tracking
    telegram_posted_at = models.DateTimeField(null=True, blank=True)
    telegram_message_id = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        code_prefix = f"[{self.code}] " if self.code else ""
        return f"{code_prefix}{self.name or 'Untitled Product'}"

    @property
    def formatted_price(self) -> str:
        """User friendly formatted price string."""
        if self.price_mode == self.PriceMode.ASK or self.price_etb is None:
            return "Ask for price"
        formatted_num = f"ETB {self.price_etb:,}"
        if self.price_mode == self.PriceMode.FROM:
            return f"From {formatted_num}"
        return formatted_num

    @property
    def primary_image(self) -> ProductImage | None:
        """Returns the primary image or first available image."""
        primary = self.images.filter(is_primary=True).first()
        if primary:
            return primary
        return self.images.first()

    def clean(self) -> None:
        super().clean()
        if self.status == self.Status.PUBLISHED:
            # Must have at least one name
            has_name = bool(
                self.name
                or getattr(self, "name_en", None)
                or getattr(self, "name_am", None)
                or getattr(self, "name_om", None)
            )
            if not has_name:
                raise ValidationError(
                    "A published product must have a name in at least one language."
                )

    def save(self, *args, **kwargs) -> None:
        # Generate sequential code if empty: WC-001, WC-002...
        if not self.code:
            self.code = self.generate_unique_code()

        # Generate unique slug if empty
        if not self.slug:
            name_val = (
                self.name
                or getattr(self, "name_en", None)
                or getattr(self, "name_am", None)
                or self.code
            )
            base_slug = slugify(name_val, allow_unicode=True) or f"product-{self.code.lower()}"
            candidate = base_slug
            counter = 1
            while Product.objects.filter(slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{counter}"
                counter += 1
            self.slug = candidate

        # Handle published_at timestamp
        if self.status == self.Status.PUBLISHED and not self.published_at:
            self.published_at = timezone.now()

        super().save(*args, **kwargs)

    @classmethod
    def generate_unique_code(cls) -> str:
        """Generates the next sequential WC-XXX code."""
        highest = 0
        for code_str in cls.objects.filter(code__startswith="WC-").values_list("code", flat=True):
            try:
                digits = int(code_str.replace("WC-", ""))
                if digits > highest:
                    highest = digits
            except ValueError:
                continue
        candidate_num = highest + 1
        while cls.objects.filter(code=f"WC-{candidate_num:03d}").exists():
            candidate_num += 1
        return f"WC-{candidate_num:03d}"


class ProductImage(models.Model):
    """High resolution photo for a product."""

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="products/")
    sort_order = models.PositiveIntegerField(default=0, db_index=True)
    is_primary = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Product Photo"
        verbose_name_plural = "Product Photos"
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"Image for {self.product.code} (#{self.pk})"

    def save(self, *args, **kwargs) -> None:
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).exclude(
                pk=self.pk
            ).update(is_primary=False)
        super().save(*args, **kwargs)


class GalleryItem(models.Model):
    """Portfolio gallery item showcasing custom works and workshop projects."""

    title = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="gallery/")
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="gallery_items",
    )
    sort_order = models.PositiveIntegerField(default=0, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Gallery Item"
        verbose_name_plural = "Gallery Items"
        ordering = ["sort_order", "-id"]

    def __str__(self) -> str:
        return self.title or f"Gallery Item #{self.pk}"
