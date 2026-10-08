"""Signals for catalog models: Next.js revalidation and Telegram auto-posting."""
from __future__ import annotations

from django.db import transaction
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from apps.integrations.revalidate import trigger_revalidation
from apps.integrations.telegram import post_product_to_telegram
from .models import Category, GalleryItem, Product


@receiver(post_save, sender=Product)
def product_post_save(sender, instance: Product, created: bool, **kwargs) -> None:
    # 1. Edge ISR Cache Invalidation
    transaction.on_commit(lambda: trigger_revalidation(["products"]))

    # 2. Telegram Auto-Post on First Publish
    if instance.status == Product.Status.PUBLISHED and not instance.telegram_posted_at:
        pk = instance.pk
        transaction.on_commit(lambda: post_product_to_telegram(pk))


@receiver(post_delete, sender=Product)
def product_post_delete(sender, instance: Product, **kwargs) -> None:
    transaction.on_commit(lambda: trigger_revalidation(["products"]))


@receiver(post_save, sender=Category)
@receiver(post_delete, sender=Category)
def category_changed(sender, instance: Category, **kwargs) -> None:
    transaction.on_commit(lambda: trigger_revalidation(["categories", "products"]))


@receiver(post_save, sender=GalleryItem)
@receiver(post_delete, sender=GalleryItem)
def gallery_changed(sender, instance: GalleryItem, **kwargs) -> None:
    transaction.on_commit(lambda: trigger_revalidation(["gallery"]))
