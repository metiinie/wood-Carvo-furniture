"""Phase 6: Integration tests for Contact & Tracking actions."""

import pytest
from django.test import Client
from apps.catalog.models import Category, Product
from apps.tracking.models import ContactClick


@pytest.fixture
def tracking_setup(db):
    cat = Category.objects.create(name_en="Dining Room", slug="dining-room")
    prod = Product.objects.create(
        code="WC-042",
        category=cat,
        name_en="Teakwood 6-Seater",
        status=Product.Status.PUBLISHED,
        availability=Product.Availability.READY,
    )
    return {"category": cat, "product": prod}


@pytest.mark.django_db
def test_all_inquiry_channels_recorded(tracking_setup):
    """Verify WhatsApp, Telegram, and Phone clicks are accurately logged with full metadata."""
    client = Client()
    prod = tracking_setup["product"]

    # 1. WhatsApp click on product detail page
    wa_res = client.post(
        "/api/v1/clicks",
        data={
            "channel": "whatsapp",
            "product_id": prod.pk,
            "locale": "en",
            "page_path": f"/en/products/{prod.slug}",
        },
        content_type="application/json",
    )
    assert wa_res.status_code == 201
    assert wa_res.json()["status"] == "recorded"

    # 2. Telegram click on custom furniture page (no specific product)
    tg_res = client.post(
        "/api/v1/clicks",
        data={
            "channel": "telegram",
            "locale": "am",
            "page_path": "/am/custom-furniture",
        },
        content_type="application/json",
    )
    assert tg_res.status_code == 201

    # 3. Phone click on sticky contact bar
    phone_res = client.post(
        "/api/v1/clicks",
        data={
            "channel": "phone",
            "locale": "om",
            "page_path": "/om/contact",
        },
        content_type="application/json",
    )
    assert phone_res.status_code == 201

    # 4. By product code (WC-042)
    code_res = client.post(
        "/api/v1/clicks",
        data={
            "channel": "whatsapp",
            "product_code": "WC-042",
            "locale": "en",
            "page_path": "/en/products",
        },
        content_type="application/json",
    )
    assert code_res.status_code == 201

    # Verify counts and associations in database
    clicks = ContactClick.objects.all().order_by("created_at")
    assert clicks.count() == 4

    assert clicks[0].channel == "whatsapp"
    assert clicks[0].product == prod
    assert clicks[0].locale == "en"

    assert clicks[1].channel == "telegram"
    assert clicks[1].product is None
    assert clicks[1].locale == "am"

    assert clicks[2].channel == "phone"
    assert clicks[2].locale == "om"

    assert clicks[3].channel == "whatsapp"
    assert clicks[3].product == prod

    # Privacy check: Verify no IP or PII attributes exist on the model
    field_names = [f.name for f in ContactClick._meta.get_fields()]
    assert "ip_address" not in field_names
    assert "user_agent" not in field_names
    assert "email" not in field_names
    assert "phone_number" not in field_names
