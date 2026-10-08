"""Views for admin custom features, including mobile-optimized Quick Add."""

from __future__ import annotations

import logging

from django.contrib.admin.views.decorators import staff_member_required
from django.db import transaction
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render

from apps.catalog.models import Category, Product, ProductImage
from apps.integrations.revalidate import trigger_revalidation
from apps.integrations.telegram import post_product_to_telegram

logger = logging.getLogger(__name__)


@staff_member_required
def quick_add_view(request):
    """
    Mobile-first Quick Add interface for workshop owner.
    Enables publishing new furniture designs from phone in under 60 seconds.
    """
    if request.method == "POST":
        name = request.POST.get("name", "").strip()
        name_am = request.POST.get("name_am", "").strip()
        category_id = request.POST.get("category_id")
        availability = request.POST.get("availability", Product.Availability.READY)
        price_mode = request.POST.get("price_mode", Product.PriceMode.ASK)
        price_etb_raw = request.POST.get("price_etb", "").strip()
        lead_time = request.POST.get("lead_time", "").strip()
        action_btn = request.POST.get("action", "publish")  # 'publish' or 'draft'
        post_to_tg = request.POST.get("post_to_telegram", "true").lower() in ("true", "on", "1")

        # Basic validation
        if not name:
            return JsonResponse(
                {"success": False, "error": "Product name is required."}, status=400
            )
        if not category_id:
            return JsonResponse({"success": False, "error": "Category is required."}, status=400)

        category = get_object_or_404(Category, pk=category_id)

        # Parse price
        price_etb = None
        if price_etb_raw and price_mode != Product.PriceMode.ASK:
            try:
                price_etb = int(price_etb_raw.replace(",", ""))
            except ValueError:
                price_etb = None

        target_status = (
            Product.Status.PUBLISHED if action_btn == "publish" else Product.Status.DRAFT
        )

        # Handle photos
        photos = request.FILES.getlist("photos")
        if target_status == Product.Status.PUBLISHED and not photos:
            return JsonResponse(
                {"success": False, "error": "At least one photo is required to publish a product."},
                status=400,
            )

        with transaction.atomic():
            product = Product.objects.create(
                category=category,
                name_en=name,
                name_am=name_am or name,  # Sensible default so Amharic never empty
                availability=availability,
                price_mode=price_mode,
                price_etb=price_etb,
                lead_time_en=lead_time,
                lead_time_am=lead_time,
                status=target_status,
                post_to_telegram=post_to_tg,
            )

            # Create ProductImage records
            for idx, photo in enumerate(photos):
                ProductImage.objects.create(
                    product=product,
                    image=photo,
                    sort_order=idx,
                    is_primary=(idx == 0),
                    alt_text_en=f"{product.name} photo {idx + 1}",
                )

            # Revalidate Next.js edge tags
            transaction.on_commit(lambda: trigger_revalidation(["products", "categories"]))

            # Trigger Telegram channel auto-post if published
            if target_status == Product.Status.PUBLISHED and post_to_tg:
                p_id = product.pk
                transaction.on_commit(lambda: post_product_to_telegram(p_id))

        logger.info(
            "Quick Add created product #%s [%s] with %d photos. Status: %s",
            product.pk,
            product.code,
            len(photos),
            product.status,
        )

        return JsonResponse(
            {
                "success": True,
                "product_id": product.pk,
                "code": product.code,
                "name": product.name,
                "slug": product.slug,
                "status": product.status,
                "formatted_price": product.formatted_price,
                "photos_count": len(photos),
            }
        )

    # GET request: render the form
    categories = Category.objects.filter(is_active=True).order_by("sort_order")
    context = {
        "title": "⚡ Quick Add Product",
        "categories": categories,
        "availabilities": Product.Availability.choices,
        "price_modes": Product.PriceMode.choices,
    }
    return render(request, "adminpanel/quick_add.html", context)
