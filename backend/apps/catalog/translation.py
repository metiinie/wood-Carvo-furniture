"""Modeltranslation registrations for catalog app."""

from modeltranslation.translator import TranslationOptions, register

from .models import Category, GalleryItem, Product, ProductImage


@register(Category)
class CategoryTranslationOptions(TranslationOptions):
    fields = ("name", "description")


@register(Product)
class ProductTranslationOptions(TranslationOptions):
    fields = (
        "name",
        "description",
        "material",
        "color",
        "lead_time",
        "seo_title",
        "seo_description",
    )


@register(ProductImage)
class ProductImageTranslationOptions(TranslationOptions):
    fields = ("alt_text",)


@register(GalleryItem)
class GalleryItemTranslationOptions(TranslationOptions):
    fields = ("title",)
