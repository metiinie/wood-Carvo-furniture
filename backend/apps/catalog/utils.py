"""Utilities for internationalization resolution and image variants."""
from __future__ import annotations

from typing import Any
from django.db.models.fields.files import FieldFile
from rest_framework.request import Request


def resolve_translated_field(instance: Any, field_name: str, lang: str = "en") -> str:
    """
    Resolves translated field with fallback hierarchy: requested -> en -> am.
    The website must never show empty text if another translation exists.
    """
    lang = lang.lower() if lang in ("en", "am", "om") else "en"

    if lang == "om":
        fallback_order = ["om", "en", "am"]
    elif lang == "am":
        fallback_order = ["am", "en"]
    else:  # en
        fallback_order = ["en", "am", "om"]

    for code in fallback_order:
        val = getattr(instance, f"{field_name}_{code}", None)
        if val and str(val).strip():
            return str(val).strip()

    # Base field attribute fallback
    base_val = getattr(instance, field_name, None)
    return str(base_val).strip() if base_val else ""


def get_image_variants(image_field: FieldFile | None, request: Request | None = None) -> dict[str, str]:
    """
    Returns transformed image URLs:
    - thumb: 400w
    - medium: 900w
    - large: 1600w
    - og: 1200x630
    Works with both Cloudinary CDN and local media URLs.
    """
    if not image_field:
        return {}

    try:
        url = image_field.url
    except Exception:
        return {}

    if request and not url.startswith("http"):
        url = request.build_absolute_uri(url)

    # Cloudinary transforms
    if "res.cloudinary.com" in url and "/image/upload/" in url:
        return {
            "raw": url,
            "thumb": url.replace("/image/upload/", "/image/upload/c_scale,w_400,f_auto,q_auto/"),
            "medium": url.replace("/image/upload/", "/image/upload/c_scale,w_900,f_auto,q_auto/"),
            "large": url.replace("/image/upload/", "/image/upload/c_scale,w_1600,f_auto,q_auto/"),
            "og": url.replace("/image/upload/", "/image/upload/c_fill,w_1200,h_630,f_auto,q_auto/"),
        }

    # Standard fallback
    return {
        "raw": url,
        "thumb": url,
        "medium": url,
        "large": url,
        "og": url,
    }
