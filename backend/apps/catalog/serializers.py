"""Serializers for catalog API with multilingual resolution and image variants."""

from __future__ import annotations

from rest_framework import serializers

from .models import Category, GalleryItem, Product, ProductImage
from .utils import get_image_variants, resolve_translated_field


class CategorySerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "image",
            "sort_order",
            "products_count",
        ]

    def _get_lang(self) -> str:
        request = self.context.get("request")
        if request:
            return request.query_params.get("lang", "en")
        return self.context.get("lang", "en")

    def get_name(self, obj: Category) -> str:
        return resolve_translated_field(obj, "name", self._get_lang())

    def get_description(self, obj: Category) -> str:
        return resolve_translated_field(obj, "description", self._get_lang())

    def get_image(self, obj: Category) -> str | None:
        if obj.image:
            request = self.context.get("request")
            url = obj.image.url
            if request and not url.startswith("http"):
                return request.build_absolute_uri(url)
            return url
        return None

    def get_products_count(self, obj: Category) -> int:
        return obj.products.filter(status=Product.Status.PUBLISHED).count()


class ProductImageSerializer(serializers.ModelSerializer):
    alt_text = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "url", "sort_order", "is_primary", "alt_text", "variants"]

    def _get_lang(self) -> str:
        request = self.context.get("request")
        if request:
            return request.query_params.get("lang", "en")
        return self.context.get("lang", "en")

    def get_alt_text(self, obj: ProductImage) -> str:
        return resolve_translated_field(obj, "alt_text", self._get_lang())

    def get_variants(self, obj: ProductImage) -> dict[str, str]:
        request = self.context.get("request")
        return get_image_variants(obj.image, request)

    def get_url(self, obj: ProductImage) -> str:
        request = self.context.get("request")
        variants = get_image_variants(obj.image, request)
        return variants.get("raw", "")


class ProductListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    lead_time = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    formatted_price = serializers.CharField(read_only=True)
    availability_label = serializers.CharField(source="get_availability_display", read_only=True)
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "code",
            "slug",
            "name",
            "category",
            "availability",
            "availability_label",
            "lead_time",
            "price_mode",
            "price_etb",
            "formatted_price",
            "featured",
            "thumbnail_url",
            "is_customizable",
            "published_at",
        ]

    def _get_lang(self) -> str:
        request = self.context.get("request")
        if request:
            return request.query_params.get("lang", "en")
        return self.context.get("lang", "en")

    def get_name(self, obj: Product) -> str:
        return resolve_translated_field(obj, "name", self._get_lang())

    def get_lead_time(self, obj: Product) -> str:
        return resolve_translated_field(obj, "lead_time", self._get_lang())

    def get_category(self, obj: Product) -> dict[str, str | int]:
        lang = self._get_lang()
        return {
            "id": obj.category.id,
            "slug": obj.category.slug,
            "name": resolve_translated_field(obj.category, "name", lang),
        }

    def get_thumbnail_url(self, obj: Product) -> str | None:
        primary = obj.primary_image
        if primary and primary.image:
            request = self.context.get("request")
            variants = get_image_variants(primary.image, request)
            return variants.get("thumb") or variants.get("raw")
        return None


class ProductDetailSerializer(ProductListSerializer):
    description = serializers.SerializerMethodField()
    material = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    seo_title = serializers.SerializerMethodField()
    seo_description = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    related_products = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            "description",
            "material",
            "color",
            "dimensions",
            "seo_title",
            "seo_description",
            "images",
            "related_products",
            "created_at",
        ]

    def get_description(self, obj: Product) -> str:
        return resolve_translated_field(obj, "description", self._get_lang())

    def get_material(self, obj: Product) -> str:
        return resolve_translated_field(obj, "material", self._get_lang())

    def get_color(self, obj: Product) -> str:
        return resolve_translated_field(obj, "color", self._get_lang())

    def get_seo_title(self, obj: Product) -> str:
        val = resolve_translated_field(obj, "seo_title", self._get_lang())
        return val or f"{self.get_name(obj)} ({obj.code}) | WOOD CARVO"

    def get_seo_description(self, obj: Product) -> str:
        val = resolve_translated_field(obj, "seo_description", self._get_lang())
        return val or self.get_description(obj)[:160]

    def get_images(self, obj: Product) -> list[dict]:
        images_qs = obj.images.all()
        return ProductImageSerializer(images_qs, many=True, context=self.context).data

    def get_related_products(self, obj: Product) -> list[dict]:
        related_qs = (
            Product.objects.filter(category=obj.category, status=Product.Status.PUBLISHED)
            .exclude(pk=obj.pk)
            .order_by("-featured", "-created_at")[:4]
        )
        return ProductListSerializer(related_qs, many=True, context=self.context).data


class GalleryItemSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    variants = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = ["id", "title", "image", "category", "sort_order", "variants"]

    def _get_lang(self) -> str:
        request = self.context.get("request")
        if request:
            return request.query_params.get("lang", "en")
        return self.context.get("lang", "en")

    def get_title(self, obj: GalleryItem) -> str:
        return resolve_translated_field(obj, "title", self._get_lang())

    def get_category(self, obj: GalleryItem) -> dict[str, str | int] | None:
        if obj.category:
            lang = self._get_lang()
            return {
                "id": obj.category.id,
                "slug": obj.category.slug,
                "name": resolve_translated_field(obj.category, "name", lang),
            }
        return None

    def get_variants(self, obj: GalleryItem) -> dict[str, str]:
        request = self.context.get("request")
        return get_image_variants(obj.image, request)

    def get_image(self, obj: GalleryItem) -> str:
        request = self.context.get("request")
        variants = get_image_variants(obj.image, request)
        return variants.get("raw", "")
