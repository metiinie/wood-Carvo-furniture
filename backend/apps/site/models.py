"""Site and Workshop settings singleton model."""

from __future__ import annotations

from django.db import models


class SiteSettings(models.Model):
    """Workshop information and global contact details (singleton)."""

    whatsapp_number = models.CharField(
        max_length=50,
        default="+251910842430",
        help_text="Format: +2519XXXXXXXX (international format without dashes or spaces for wa.me)",
    )
    telegram_username = models.CharField(
        max_length=100,
        default="woodcarvo",
        help_text="Telegram username without @ (e.g. woodcarvo)",
    )
    phone_number = models.CharField(
        max_length=50,
        default="+251910842430",
        help_text="Direct phone line for voice calls",
    )
    address = models.CharField(
        max_length=255,
        blank=True,
        default="Bole Sub-city, Addis Ababa, Ethiopia",
    )
    google_maps_url = models.URLField(
        blank=True,
        default="https://maps.google.com/?q=Addis+Ababa",
        help_text="Direct Google Maps pin or search link",
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        default=9.010793,
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
        default=38.761252,
    )
    working_hours = models.CharField(
        max_length=255,
        blank=True,
        default="Mon - Sat: 8:30 AM - 6:00 PM | Sun: Closed",
    )
    instagram = models.URLField(blank=True, default="https://instagram.com/woodcarvo")
    facebook = models.URLField(blank=True, default="https://facebook.com/woodcarvo")
    tiktok = models.URLField(blank=True, default="https://tiktok.com/@woodcarvo")

    hero_image = models.ImageField(upload_to="site/", blank=True, null=True)
    showroom_photo = models.ImageField(upload_to="site/", blank=True, null=True)

    about_text = models.TextField(
        blank=True,
        help_text="Workshop heritage, master craftsperson story, and quality wood philosophy",
    )
    custom_furniture_text = models.TextField(
        blank=True,
        help_text="Guide for clients commissioning bespoke custom furniture",
    )

    class Meta:
        verbose_name = "Site & Workshop Settings"
        verbose_name_plural = "Site & Workshop Settings"

    def __str__(self) -> str:
        return "WOOD CARVO Workshop Settings"

    def save(self, *args, **kwargs) -> None:
        # Enforce singleton pattern
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls) -> SiteSettings:
        """Fetch or create the singleton instance."""
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
