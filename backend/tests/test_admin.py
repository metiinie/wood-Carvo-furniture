"""Test creating, translating, and publishing a product in Django admin."""

import pytest
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client

from apps.catalog.models import Category, Product

User = get_user_model()


@pytest.mark.django_db
def test_admin_create_translate_publish_product():
    """Verify acceptance criterion: can create, translate, and publish a product in admin."""
    User.objects.create_superuser("craftsman", "craft@woodcarvo.com", "pass1234")
    client = Client()
    client.login(username="craftsman", password="pass1234")

    # Ensure a category exists
    category = Category.objects.create(
        name_en="Living Room",
        name_am="የሳሎን እቃዎች",
        name_om="Meeshaa Mana Jireenyaa",
    )

    # 1x1 GIF for image upload
    gif_data = (
        b"\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\x05\x04\x04"
        b"\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b"
    )
    test_image = SimpleUploadedFile("table.gif", gif_data, content_type="image/gif")

    add_url = "/manage/catalog/product/add/"
    post_data = {
        "category": category.pk,
        "name_en": "Artisan Tid Coffee Table",
        "name_am": "የፅድ እንጨት የቡና ጠረጴዛ",
        "name_om": "Minjii Bunaa Gaattiraa",
        "description_en": "Custom sculpted Tid wood table.",
        "description_am": "በጥበብ የተሰራ የፅድ ጠረጴዛ።",
        "description_om": "Muka gaattiraa irraa kan tolfame.",
        "material_en": "Juniper / Tid Hardwood",
        "material_am": "የፅድ እንጨት",
        "material_om": "Muka Gaattiraa",
        "color_en": "Natural Amber",
        "color_am": "የተፈጥሮ ወርቃማ",
        "color_om": "Boorallaa Uumamaa",
        "dimensions": "110x60x45cm",
        "is_customizable": True,
        "availability": "READY",
        "price_mode": "FIXED",
        "price_etb": 38000,
        "status": "PUBLISHED",  # Published in admin!
        "lead_time_en": "Ready in showroom",
        "lead_time_am": "በሾውሩም ዝግጁ",
        "lead_time_om": "Qophii",
        # ProductImage inline formset
        "images-TOTAL_FORMS": "1",
        "images-INITIAL_FORMS": "0",
        "images-MIN_NUM_FORMS": "0",
        "images-MAX_NUM_FORMS": "1000",
        "images-0-image": test_image,
        "images-0-sort_order": "0",
        "images-0-is_primary": "on",
        "images-0-alt_text_en": "Table Front View",
        "images-0-alt_text_am": "የጠረጴዛው የፊት እይታ",
    }

    response = client.post(add_url, data=post_data)
    assert response.status_code == 302, (
        f"Failed with response content: {response.content.decode()[:500]}"
    )
    assert response.url == "/manage/catalog/product/"

    # Verify product was created in database
    product = Product.objects.filter(name_en="Artisan Tid Coffee Table").first()
    assert product is not None
    assert product.status == Product.Status.PUBLISHED
    assert product.published_at is not None
    assert product.code.startswith("WC-")
    assert product.name_am == "የፅድ እንጨት የቡና ጠረጴዛ"
    assert product.name_om == "Minjii Bunaa Gaattiraa"
    assert product.material_am == "የፅድ እንጨት"
    assert product.formatted_price == "ETB 38,000"
    assert product.images.count() == 1
    assert product.primary_image is not None
