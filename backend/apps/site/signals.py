"""Signals for site app: Next.js revalidation on setting updates."""
from __future__ import annotations

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.integrations.revalidate import trigger_revalidation
from .models import SiteSettings


@receiver(post_save, sender=SiteSettings)
def site_settings_changed(sender, instance: SiteSettings, **kwargs) -> None:
    transaction.on_commit(lambda: trigger_revalidation(["settings"]))
