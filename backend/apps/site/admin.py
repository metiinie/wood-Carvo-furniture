"""Django Unfold admin configuration for SiteSettings singleton."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(ModelAdmin):
    list_display = ("__str__", "phone_number", "whatsapp_number", "telegram_username")

    fieldsets = (
        (
            "Contact Channels (Fast Inquiries)",
            {
                "fields": (
                    ("phone_number", "whatsapp_number"),
                    "telegram_username",
                ),
            },
        ),
        (
            "Location & Map Pin",
            {
                "fields": (
                    "google_maps_url",
                    ("latitude", "longitude"),
                ),
            },
        ),
        (
            "Social Media Links",
            {
                "fields": (("instagram", "facebook", "tiktok"),),
            },
        ),
        (
            "Showroom & Hero Images",
            {
                "fields": (("hero_image", "showroom_photo"),),
            },
        ),
        (
            "English Workshop Information",
            {
                "fields": (
                    "address_en",
                    "working_hours_en",
                    "about_text_en",
                    "custom_furniture_text_en",
                ),
            },
        ),
        (
            "Amharic Information (አማርኛ)",
            {
                "fields": (
                    "address_am",
                    "working_hours_am",
                    "about_text_am",
                    "custom_furniture_text_am",
                ),
            },
        ),
        (
            "Afaan Oromoo Information",
            {
                "fields": (
                    "address_om",
                    "working_hours_om",
                    "about_text_om",
                    "custom_furniture_text_om",
                ),
            },
        ),
    )

    def has_add_permission(self, request) -> bool:
        # Singleton: allow adding only if no record exists
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None) -> bool:
        # Prevent deletion of the singleton
        return False
