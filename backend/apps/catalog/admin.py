"""Django Unfold admin configuration for catalog app."""
from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from unfold.admin import ModelAdmin, TabularInline
from unfold.decorators import action, display

from .models import Category, GalleryItem, Product, ProductImage


class ProductImageInline(TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "sort_order", "is_primary", "alt_text_en", "alt_text_am", "preview")
    readonly_fields = ("preview",)

    @display(description="Preview")
    def preview(self, instance: ProductImage):
        if instance.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px;" />',
                instance.image.url,
            )
        return "—"


@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ("name_en", "name_am", "slug", "sort_order", "is_active", "preview")
    list_editable = ("sort_order", "is_active")
    search_fields = ("name_en", "name_am", "name_om", "slug")
    list_filter = ("is_active",)
    prepopulated_fields = {"slug": ("name_en",)}

    fieldsets = (
        (
            "General",
            {
                "fields": (
                    "is_active",
                    "sort_order",
                    "image",
                    "slug",
                )
            },
        ),
        (
            "English",
            {
                "fields": ("name_en", "description_en"),
            },
        ),
        (
            "Amharic (አማርኛ)",
            {
                "fields": ("name_am", "description_am"),
            },
        ),
        (
            "Afaan Oromoo",
            {
                "fields": ("name_om", "description_om"),
            },
        ),
    )

    @display(description="Image")
    def preview(self, instance: Category):
        if instance.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" />',
                instance.image.url,
            )
        return "—"


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = (
        "thumbnail",
        "code",
        "name_en",
        "status_badge",
        "availability_badge",
        "category",
        "formatted_price_display",
        "featured",
        "created_at",
    )
    list_display_links = ("thumbnail", "code", "name_en")
    list_filter = ("status", "availability", "category", "featured", "price_mode")
    search_fields = ("code", "name_en", "name_am", "name_om", "material_en", "color_en")
    list_filter_submit = True
    inlines = [ProductImageInline]
    actions = [
        "publish_products",
        "archive_products",
        "mark_sold",
        "toggle_featured",
    ]

    fieldsets = (
        (
            "Product Identity",
            {
                "fields": (
                    ("code", "status"),
                    ("category", "featured"),
                    "availability",
                    ("price_mode", "price_etb"),
                    "slug",
                )
            },
        ),
        (
            "Specs & Attributes",
            {
                "fields": (
                    "dimensions",
                    "is_customizable",
                    ("material_en", "color_en"),
                    ("material_am", "color_am"),
                    ("material_om", "color_om"),
                )
            },
        ),
        (
            "English Content",
            {
                "fields": ("name_en", "description_en", "lead_time_en"),
            },
        ),
        (
            "Amharic Content (አማርኛ)",
            {
                "fields": ("name_am", "description_am", "lead_time_am"),
            },
        ),
        (
            "Afaan Oromoo Content",
            {
                "fields": ("name_om", "description_om", "lead_time_om"),
            },
        ),
        (
            "SEO & Meta",
            {
                "classes": ("collapse",),
                "fields": (
                    "seo_title_en",
                    "seo_description_en",
                    "seo_title_am",
                    "seo_description_am",
                    "seo_title_om",
                    "seo_description_om",
                ),
            },
        ),
        (
            "System & Telegram",
            {
                "classes": ("collapse",),
                "fields": (
                    "published_at",
                    "telegram_posted_at",
                    "telegram_message_id",
                ),
            },
        ),
    )

    @display(description="Photo")
    def thumbnail(self, instance: Product):
        img = instance.primary_image
        if img and img.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" />',
                img.image.url,
            )
        return format_html(
            '<div style="width: 50px; height: 50px; background: #3A2921; color: #D9B77A; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 10px; font-weight: bold;">NO PIC</div>'
        )

    @display(description="Status", label=True)
    def status_badge(self, instance: Product):
        badge_styles = {
            Product.Status.PUBLISHED: "success",
            Product.Status.DRAFT: "warning",
            Product.Status.ARCHIVED: "danger",
        }
        return instance.status, badge_styles.get(instance.status, "info")

    @display(description="Availability", label=True)
    def availability_badge(self, instance: Product):
        styles = {
            Product.Availability.READY: "success",
            Product.Availability.MADE_TO_ORDER: "info",
            Product.Availability.SOLD: "warning",
        }
        return instance.get_availability_display(), styles.get(instance.availability, "info")

    @display(description="Price")
    def formatted_price_display(self, instance: Product):
        return instance.formatted_price

    # Bulk actions
    @action(description="Publish selected products")
    def publish_products(self, request, queryset):
        count = queryset.update(status=Product.Status.PUBLISHED, published_at=timezone.now())
        self.message_user(request, f"{count} products successfully published.")

    @action(description="Archive selected products")
    def archive_products(self, request, queryset):
        count = queryset.update(status=Product.Status.ARCHIVED)
        self.message_user(request, f"{count} products moved to archived.")

    @action(description="Mark as Sold / Previously Made")
    def mark_sold(self, request, queryset):
        count = queryset.update(availability=Product.Availability.SOLD)
        self.message_user(request, f"{count} products marked as Sold (in portfolio).")

    @action(description="Toggle Featured highlight")
    def toggle_featured(self, request, queryset):
        for prod in queryset:
            prod.featured = not prod.featured
            prod.save(update_fields=["featured"])
        self.message_user(request, f"Toggled featured status on {queryset.count()} products.")


@admin.register(GalleryItem)
class GalleryItemAdmin(ModelAdmin):
    list_display = ("preview", "title_en", "title_am", "category", "sort_order", "is_active", "created_at")
    list_editable = ("sort_order", "is_active")
    list_filter = ("is_active", "category")
    search_fields = ("title_en", "title_am", "title_om")

    fieldsets = (
        (
            "General",
            {
                "fields": ("image", "category", "sort_order", "is_active"),
            },
        ),
        (
            "English",
            {"fields": ("title_en",)},
        ),
        (
            "Amharic (አማርኛ)",
            {"fields": ("title_am",)},
        ),
        (
            "Afaan Oromoo",
            {"fields": ("title_om",)},
        ),
    )

    @display(description="Preview")
    def preview(self, instance: GalleryItem):
        if instance.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />',
                instance.image.url,
            )
        return "—"
