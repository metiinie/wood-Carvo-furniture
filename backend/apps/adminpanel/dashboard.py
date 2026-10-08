"""Dashboard metrics calculation for Django Unfold admin."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from django.db.models import Count
from django.utils import timezone

from apps.catalog.models import Product
from apps.tracking.models import ContactClick


def get_dashboard_data() -> dict[str, Any]:
    """Computes all workshop KPI metrics for dashboard view or API."""
    now = timezone.now()
    thirty_days_ago = now - timedelta(days=30)

    # 1. Product Counts by Status & Availability
    published_count = Product.objects.filter(status=Product.Status.PUBLISHED).count()
    ready_count = Product.objects.filter(
        status=Product.Status.PUBLISHED,
        availability=Product.Availability.READY,
    ).count()
    made_to_order_count = Product.objects.filter(
        status=Product.Status.PUBLISHED,
        availability=Product.Availability.MADE_TO_ORDER,
    ).count()
    sold_count = Product.objects.filter(availability=Product.Availability.SOLD).count()
    draft_count = Product.objects.filter(status=Product.Status.DRAFT).count()
    archived_count = Product.objects.filter(status=Product.Status.ARCHIVED).count()

    # 2. Inquiries by Channel in last 30 days
    recent_clicks = ContactClick.objects.filter(created_at__gte=thirty_days_ago)
    whatsapp_clicks = recent_clicks.filter(channel=ContactClick.Channel.WHATSAPP).count()
    telegram_clicks = recent_clicks.filter(channel=ContactClick.Channel.TELEGRAM).count()
    phone_clicks = recent_clicks.filter(channel=ContactClick.Channel.PHONE).count()
    total_clicks = whatsapp_clicks + telegram_clicks + phone_clicks

    # 3. Top 5 Most-Clicked Products
    top_products_qs = (
        Product.objects.annotate(click_count=Count("clicks"))
        .filter(click_count__gt=0)
        .order_by("-click_count")
        .select_related("category")
        .prefetch_related("images")[:5]
    )

    top_products = []
    for prod in top_products_qs:
        top_products.append(
            {
                "id": prod.pk,
                "code": prod.code,
                "name": prod.name_en or prod.name_am or prod.name,
                "category": prod.category.name_en,
                "clicks": prod.click_count,
                "availability": prod.get_availability_display(),
                "formatted_price": prod.formatted_price,
                "thumbnail": prod.primary_image.image.url
                if prod.primary_image and prod.primary_image.image
                else None,
            }
        )

    # If no clicked products exist yet in new database, show newest 5
    if not top_products:
        recent_qs = (
            Product.objects.filter(status=Product.Status.PUBLISHED)
            .select_related("category")
            .prefetch_related("images")[:5]
        )
        for prod in recent_qs:
            top_products.append(
                {
                    "id": prod.pk,
                    "code": prod.code,
                    "name": prod.name_en or prod.name_am or prod.name,
                    "category": prod.category.name_en,
                    "clicks": 0,
                    "availability": prod.get_availability_display(),
                    "formatted_price": prod.formatted_price,
                    "thumbnail": prod.primary_image.image.url
                    if prod.primary_image and prod.primary_image.image
                    else None,
                }
            )

    return {
        "status_counts": {
            "published": published_count,
            "ready": ready_count,
            "made_to_order": made_to_order_count,
            "sold": sold_count,
            "draft": draft_count,
            "archived": archived_count,
            "total": published_count + draft_count + archived_count,
        },
        "clicks_30d": {
            "whatsapp": whatsapp_clicks,
            "telegram": telegram_clicks,
            "phone": phone_clicks,
            "total": total_clicks,
        },
        "top_products": top_products,
    }


def dashboard_callback(request, context: dict[str, Any]) -> dict[str, Any]:
    """Injects metrics into Unfold admin index context."""
    context["dashboard_metrics"] = get_dashboard_data()
    return context
