"""Tests for Phase 3 Owner Tools: Dashboard metrics, Quick Add flow, and Telegram broadcast."""

from unittest.mock import patch

import pytest
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client

from apps.adminpanel.dashboard import get_dashboard_data
from apps.catalog.models import Category, Product
from apps.tracking.models import ContactClick

User = get_user_model()


@pytest.fixture
def owner_client(db):
    user = User.objects.create_superuser("owner_user", "rushdseid@gmail.com", "Rushd6685")
    client = Client()
    client.login(username="owner_user", password="Rushd6685")
    return client, user


@pytest.mark.django_db
def test_dashboard_metrics(owner_client):
    """Test dashboard metrics calculation for counts, 30d inquiries, and top products."""
    client, user = owner_client
    cat = Category.objects.create(name_en="Living Room", slug="living-room")

    p1 = Product.objects.create(
        category=cat,
        name_en="Walnut Table",
        availability=Product.Availability.READY,
        status=Product.Status.PUBLISHED,
    )
    p2 = Product.objects.create(
        category=cat,
        name_en="Custom Sofa",
        availability=Product.Availability.MADE_TO_ORDER,
        status=Product.Status.PUBLISHED,
    )
    Product.objects.create(
        category=cat,
        name_en="Archived Desk",
        availability=Product.Availability.SOLD,
        status=Product.Status.ARCHIVED,
    )

    # Add clicks
    ContactClick.objects.create(product=p1, channel=ContactClick.Channel.WHATSAPP)
    ContactClick.objects.create(product=p1, channel=ContactClick.Channel.WHATSAPP)
    ContactClick.objects.create(product=p2, channel=ContactClick.Channel.TELEGRAM)

    data = get_dashboard_data()

    assert data["status_counts"]["published"] == 2
    assert data["status_counts"]["ready"] == 1
    assert data["status_counts"]["made_to_order"] == 1
    assert data["status_counts"]["sold"] == 1
    assert data["status_counts"]["archived"] == 1

    assert data["clicks_30d"]["whatsapp"] == 2
    assert data["clicks_30d"]["telegram"] == 1
    assert data["clicks_30d"]["phone"] == 0
    assert data["clicks_30d"]["total"] == 3

    # Top product should be p1 with 2 clicks
    assert len(data["top_products"]) >= 1
    assert data["top_products"][0]["id"] == p1.pk
    assert data["top_products"][0]["clicks"] == 2

    # Verify admin index page renders with dashboard metrics
    res = client.get("/manage/")
    assert res.status_code == 200
    assert "dashboard_metrics" in res.context
    assert b"Workshop Quick Add" in res.content


@pytest.mark.django_db(transaction=True)
def test_quick_add_product_with_3_photos_and_telegram(owner_client):
    """
    CRITICAL ACCEPTANCE CRITERION:
    A product with 3 photos goes live via Quick Add in under a minute
    and triggers Telegram channel broadcast.
    """
    client, user = owner_client
    cat = Category.objects.create(name_en="Dining Room", slug="dining-room")

    gif_bytes = (
        b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04"
        b"\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b"
    )
    photo1 = SimpleUploadedFile("photo1.gif", gif_bytes, content_type="image/gif")
    photo2 = SimpleUploadedFile("photo2.gif", gif_bytes, content_type="image/gif")
    photo3 = SimpleUploadedFile("photo3.gif", gif_bytes, content_type="image/gif")

    post_data = {
        "name": "Artisan Oak 8-Seater Table",
        "name_am": "ባለ 8 ሰው የተፈጥሮ ኦክ ጠረጴዛ",
        "category_id": cat.pk,
        "availability": "READY",
        "price_mode": "FIXED",
        "price_etb": "85000",
        "lead_time": "Ready in showroom",
        "action": "publish",
        "post_to_telegram": "true",
        "photos": [photo1, photo2, photo3],
    }

    with patch("apps.adminpanel.views.post_product_to_telegram") as mock_tg:
        response = client.post("/manage/quick-add/", data=post_data)
        assert response.status_code == 200
        json_data = response.json()

        assert json_data["success"] is True
        assert json_data["status"] == "PUBLISHED"
        assert json_data["photos_count"] == 3
        assert json_data["code"].startswith("WC-")

        # Verify in database
        product = Product.objects.get(pk=json_data["product_id"])
        assert product.name_en == "Artisan Oak 8-Seater Table"
        assert product.name_am == "ባለ 8 ሰው የተፈጥሮ ኦክ ጠረጴዛ"
        assert product.status == Product.Status.PUBLISHED
        assert product.price_etb == 85000
        assert product.formatted_price == "ETB 85,000"
        assert product.images.count() == 3
        assert product.primary_image is not None

        # Verify telegram auto-post was dispatched
        mock_tg.assert_called_once_with(product.pk)


@pytest.mark.django_db
def test_admin_repost_to_telegram_action(owner_client):
    """Test admin action 'repost_to_telegram' for single/multiple products."""
    client, user = owner_client
    cat = Category.objects.create(name_en="Bedroom")
    prod = Product.objects.create(
        category=cat,
        name_en="Floating Bed",
        status=Product.Status.PUBLISHED,
    )

    with patch("apps.catalog.admin.post_product_to_telegram") as mock_tg:
        # Submit admin changelist action
        change_url = "/manage/catalog/product/"
        action_data = {
            "action": "repost_to_telegram",
            "_selected_action": [prod.pk],
        }
        res = client.post(change_url, data=action_data, follow=True)
        assert res.status_code == 200
        mock_tg.assert_called_once_with(prod.pk)


@pytest.mark.django_db
def test_owner_group_permissions(db):
    """Verify Owner role permissions access catalog and settings."""
    from apps.catalog.utils import setup_owner_group

    setup_owner_group()
    owner_group = Group.objects.get(name="Owner")
    perm_codenames = owner_group.permissions.values_list("codename", flat=True)

    assert "add_product" in perm_codenames
    assert "change_product" in perm_codenames
    assert "add_category" in perm_codenames
    assert "change_sitesettings" in perm_codenames
