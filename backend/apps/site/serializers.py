"""Serializers for site and workshop settings API."""

from __future__ import annotations

from rest_framework import serializers

from apps.catalog.utils import get_image_variants, resolve_translated_field

from .models import SiteSettings


class SiteSettingsSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()
    working_hours = serializers.SerializerMethodField()
    about_text = serializers.SerializerMethodField()
    custom_furniture_text = serializers.SerializerMethodField()
    hero_image = serializers.SerializerMethodField()
    showroom_photo = serializers.SerializerMethodField()
    hero_image_variants = serializers.SerializerMethodField()
    showroom_photo_variants = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "whatsapp_number",
            "telegram_username",
            "phone_number",
            "address",
            "google_maps_url",
            "latitude",
            "longitude",
            "working_hours",
            "instagram",
            "facebook",
            "tiktok",
            "hero_image",
            "hero_image_variants",
            "showroom_photo",
            "showroom_photo_variants",
            "about_text",
            "custom_furniture_text",
        ]

    def _get_lang(self) -> str:
        request = self.context.get("request")
        if request:
            return request.query_params.get("lang", "en")
        return self.context.get("lang", "en")

    def get_address(self, obj: SiteSettings) -> str:
        return resolve_translated_field(obj, "address", self._get_lang())

    def get_working_hours(self, obj: SiteSettings) -> str:
        return resolve_translated_field(obj, "working_hours", self._get_lang())

    def get_about_text(self, obj: SiteSettings) -> str:
        return resolve_translated_field(obj, "about_text", self._get_lang())

    def get_custom_furniture_text(self, obj: SiteSettings) -> str:
        return resolve_translated_field(obj, "custom_furniture_text", self._get_lang())

    def get_hero_image(self, obj: SiteSettings) -> str | None:
        if obj.hero_image:
            request = self.context.get("request")
            variants = get_image_variants(obj.hero_image, request)
            return variants.get("raw")
        return None

    def get_hero_image_variants(self, obj: SiteSettings) -> dict[str, str]:
        request = self.context.get("request")
        return get_image_variants(obj.hero_image, request)

    def get_showroom_photo(self, obj: SiteSettings) -> str | None:
        if obj.showroom_photo:
            request = self.context.get("request")
            variants = get_image_variants(obj.showroom_photo, request)
            return variants.get("raw")
        return None

    def get_showroom_photo_variants(self, obj: SiteSettings) -> dict[str, str]:
        request = self.context.get("request")
        return get_image_variants(obj.showroom_photo, request)
