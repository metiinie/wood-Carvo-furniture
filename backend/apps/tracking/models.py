"""Inquiry click analytics model (privacy friendly - NO IP or personal data)."""

from django.db import models


class ContactClick(models.Model):
    """Logs customer inquiry taps (WhatsApp, Telegram, Phone) without personal data."""

    class Channel(models.TextChoices):
        WHATSAPP = "whatsapp", "WhatsApp"
        TELEGRAM = "telegram", "Telegram"
        PHONE = "phone", "Phone Call"

    product = models.ForeignKey(
        "catalog.Product",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="clicks",
    )
    channel = models.CharField(
        max_length=20,
        choices=Channel.choices,
        db_index=True,
    )
    locale = models.CharField(
        max_length=10,
        default="en",
        db_index=True,
    )
    page_path = models.CharField(
        max_length=255,
        blank=True,
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
    )

    class Meta:
        verbose_name = "Inquiry Click"
        verbose_name_plural = "Inquiry Clicks"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        product_label = f"[{self.product.code}]" if self.product else "General"
        return f"{self.channel.upper()} click from {product_label} ({self.locale})"
