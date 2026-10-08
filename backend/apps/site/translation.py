"""Modeltranslation registration for site app."""

from modeltranslation.translator import TranslationOptions, register

from .models import SiteSettings


@register(SiteSettings)
class SiteSettingsTranslationOptions(TranslationOptions):
    fields = (
        "address",
        "working_hours",
        "about_text",
        "custom_furniture_text",
    )
