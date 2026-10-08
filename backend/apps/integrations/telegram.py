"""Telegram channel broadcast integration for new product launches."""

from __future__ import annotations

import logging
import threading

import requests
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


def _do_post_product(product_id: int) -> None:
    """Internal worker function running in background thread."""
    from apps.catalog.models import Product  # Lazy import to avoid circular dependencies

    bot_token = getattr(settings, "TELEGRAM_BOT_TOKEN", "")
    channel_id = getattr(settings, "TELEGRAM_CHANNEL_ID", "")

    if not bot_token or not channel_id:
        logger.info(
            "Telegram post skipped for Product #%s: TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID not set.",
            product_id,
        )
        return

    try:
        product = Product.objects.get(pk=product_id)
    except Product.DoesNotExist:
        logger.warning("Product #%s does not exist, cannot post to Telegram.", product_id)
        return

    # Prepare caption
    frontend_url = getattr(settings, "FRONTEND_URL", "https://woodcarvo.com").rstrip("/")
    product_link = f"{frontend_url}/en/products/{product.slug}"

    caption_lines = [
        f"✨ *{product.name}* ({product.code})",
        "",
        f"🏷 *Status:* {product.get_availability_display()}",
        f"💰 *Price:* {product.formatted_price}",
    ]

    if product.lead_time:
        caption_lines.append(f"⏱ *Lead time:* {product.lead_time}")

    if product.material:
        caption_lines.append(f"🪵 *Material:* {product.material}")

    caption_lines.extend(
        [
            "",
            f"🔗 [View Details on Website]({product_link})",
            "📞 *Order via WhatsApp / Call:* +251 911 22 33 44",
            "#WOODCARVO #AddisAbaba #Furniture #Handcrafted",
        ]
    )
    caption = "\n".join(caption_lines)

    # Collect images (up to 4)
    images = list(product.images.all()[:4])
    image_urls = []
    for img in images:
        if img.image:
            image_urls.append(img.image.url)

    telegram_api_url = f"https://api.telegram.org/bot{bot_token}"

    try:
        if not image_urls:
            # Send text message
            payload = {
                "chat_id": channel_id,
                "text": caption,
                "parse_mode": "Markdown",
                "disable_web_page_preview": False,
            }
            res = requests.post(f"{telegram_api_url}/sendMessage", json=payload, timeout=10)
        elif len(image_urls) == 1:
            # Send single photo
            payload = {
                "chat_id": channel_id,
                "photo": image_urls[0],
                "caption": caption,
                "parse_mode": "Markdown",
            }
            res = requests.post(f"{telegram_api_url}/sendPhoto", json=payload, timeout=15)
        else:
            # Send media group
            media = []
            for idx, url in enumerate(image_urls):
                item = {
                    "type": "photo",
                    "media": url,
                }
                if idx == 0:
                    item["caption"] = caption
                    item["parse_mode"] = "Markdown"
                media.append(item)

            payload = {
                "chat_id": channel_id,
                "media": media,
            }
            res = requests.post(f"{telegram_api_url}/sendMediaGroup", json=payload, timeout=20)

        data = res.json()
        if data.get("ok"):
            msg_id = ""
            result = data.get("result")
            if isinstance(result, list) and len(result) > 0:
                msg_id = str(result[0].get("message_id", ""))
            elif isinstance(result, dict):
                msg_id = str(result.get("message_id", ""))

            Product.objects.filter(pk=product_id).update(
                telegram_posted_at=timezone.now(),
                telegram_message_id=msg_id,
            )
            logger.info(
                "Successfully posted Product #%s (%s) to Telegram channel.",
                product.pk,
                product.code,
            )
        else:
            logger.warning("Telegram API error posting Product #%s: %s", product_id, data)

    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to auto-post product #%s to Telegram: %s", product_id, exc)


def post_product_to_telegram(product_id: int) -> None:
    """Dispatches Telegram channel broadcast asynchronously in a background thread."""
    thread = threading.Thread(
        target=_do_post_product,
        args=(product_id,),
        daemon=True,
    )
    thread.start()
