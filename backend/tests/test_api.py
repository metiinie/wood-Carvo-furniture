"""Comprehensive API tests for all WOOD CARVO public endpoints and resolution logic."""

import pytest
from django.test import Client

from apps.catalog.models import Category, GalleryItem, Product, ProductImage
from apps.site.models import SiteSettings
from apps.tracking.models import ContactClick


@pytest.fixture
def setup_api_data(db):
    """Seed test data for API testing."""
    cat_living = Category.objects.create(
        name_en="Living Room",
        name_am="የሳሎን እቃዎች",
        name_om="Meeshaa Mana Jireenyaa",
        slug="living-room",
        sort_order=1,
        is_active=True,
    )
    cat_dining = Category.objects.create(
        name_en="Dining Room",
        name_am="የመመገቢያ እቃዎች",
        name_om="Meeshaa Mana Nyaataa",
        slug="dining-room",
        sort_order=2,
        is_active=True,
    )

    # 1. Published ready product with full translations
    p1 = Product.objects.create(
        code="WC-001",
        category=cat_living,
        name_en="Bespoke Walnut Coffee Table",
        name_am="ልዩ የዎልናት ሳሎን ጠረጴዛ",
        name_om="Minjii Bunaa Walnatii",
        description_en="Solid walnut table.",
        description_am="የዎልናት ጠረጴዛ።",
        material_en="Walnut",
        material_am="ዎልናት",
        availability=Product.Availability.READY,
        lead_time_en="Ready in showroom",
        lead_time_am="በሾውሩም ዝግጁ",
        price_mode=Product.PriceMode.FIXED,
        price_etb=35000,
        featured=True,
        status=Product.Status.PUBLISHED,
    )
    ProductImage.objects.create(
        product=p1,
        sort_order=0,
        is_primary=True,
        alt_text_en="Main view",
        alt_text_am="ዋና እይታ",
    )

    # 2. Made to order product with only English (tests fallback)
    p2 = Product.objects.create(
        code="WC-002",
        category=cat_dining,
        name_en="Teak Dining Set",
        name_am="",  # Empty Amharic to test fallback to English
        name_om="",  # Empty Oromo to test fallback to English
        description_en="8-seater teak dining set.",
        availability=Product.Availability.MADE_TO_ORDER,
        lead_time_en="2-3 weeks",
        price_mode=Product.PriceMode.FROM,
        price_etb=75000,
        featured=False,
        status=Product.Status.PUBLISHED,
    )

    # 3. Draft product (should be hidden)
    Product.objects.create(
        code="WC-003",
        category=cat_living,
        name_en="Secret Prototype Sofa",
        status=Product.Status.DRAFT,
    )

    # 4. Gallery item
    GalleryItem.objects.create(
        title_en="Master Joinery Work",
        title_am="የተዋጣለት የእጅ ጥበብ",
        title_om="Hojii Aartii Muka",
        category=cat_living,
        sort_order=1,
        is_active=True,
    )

    # 5. Site Settings
    settings = SiteSettings.load()
    settings.phone_number = "+251911223344"
    settings.whatsapp_number = "+251911223344"
    settings.telegram_username = "woodcarvo"
    settings.address_en = "Atlas, Bole, Addis Ababa"
    settings.address_am = "አትላስ፣ ቦሌ፣ አዲስ አበባ"
    settings.working_hours_en = "Mon-Sat 8:30am - 6pm"
    settings.working_hours_am = "ከሰኞ እስከ ቅዳሜ ከጠዋቱ 2:30 - 12:00"
    settings.save()

    return {
        "cat_living": cat_living,
        "cat_dining": cat_dining,
        "p1": p1,
        "p2": p2,
    }


@pytest.mark.django_db
def test_categories_api(setup_api_data):
    """Test GET /api/v1/categories with language resolution."""
    client = Client()

    # English
    res_en = client.get("/api/v1/categories?lang=en")
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert len(data_en) == 2
    assert data_en[0]["name"] == "Living Room"

    # Amharic
    res_am = client.get("/api/v1/categories?lang=am")
    assert res_am.status_code == 200
    data_am = res_am.json()
    assert data_am[0]["name"] == "የሳሎን እቃዎች"

    # Afaan Oromo
    res_om = client.get("/api/v1/categories?lang=om")
    assert res_om.status_code == 200
    data_om = res_om.json()
    assert data_om[0]["name"] == "Meeshaa Mana Jireenyaa"


@pytest.mark.django_db
def test_products_list_api_resolved_text_amharic(setup_api_data):
    """
    CRITICAL ACCEPTANCE CRITERION:
    GET /api/v1/products?lang=am returns resolved Amharic text.
    """
    client = Client()
    res = client.get("/api/v1/products?lang=am")
    assert res.status_code == 200
    data = res.json()

    assert "results" in data
    assert data["count"] == 2  # Only 2 published products (draft is excluded)

    # First item has full Amharic translation
    item1 = next(item for item in data["results"] if item["code"] == "WC-001")
    assert item1["name"] == "ልዩ የዎልናት ሳሎን ጠረጴዛ"
    assert item1["category"]["name"] == "የሳሎን እቃዎች"
    assert item1["lead_time"] == "በሾውሩም ዝግጁ"
    assert item1["formatted_price"] == "ETB 35,000"

    # Second item has empty Amharic, tests fallback to English
    item2 = next(item for item in data["results"] if item["code"] == "WC-002")
    assert item2["name"] == "Teak Dining Set"  # Clean fallback!
    assert item2["lead_time"] == "2-3 weeks"


@pytest.mark.django_db
def test_products_list_filters_and_search(setup_api_data):
    """Test filtering by category, search query, availability, featured, and sort."""
    client = Client()

    # Filter by category
    res_cat = client.get("/api/v1/products?category=dining-room")
    assert res_cat.status_code == 200
    data_cat = res_cat.json()
    assert data_cat["count"] == 1
    assert data_cat["results"][0]["code"] == "WC-002"

    # Search by code
    res_code = client.get("/api/v1/products?q=WC-001")
    assert res_code.status_code == 200
    assert res_code.json()["count"] == 1

    # Search by Amharic term
    res_search_am = client.get("/api/v1/products?q=ዎልናት")
    assert res_search_am.status_code == 200
    assert res_search_am.json()["count"] == 1
    assert res_search_am.json()["results"][0]["code"] == "WC-001"

    # Filter by availability
    res_avail = client.get("/api/v1/products?availability=READY")
    assert res_avail.status_code == 200
    assert res_avail.json()["count"] == 1

    # Filter by featured
    res_feat = client.get("/api/v1/products?featured=true")
    assert res_feat.status_code == 200
    assert res_feat.json()["count"] == 1
    assert res_feat.json()["results"][0]["code"] == "WC-001"


@pytest.mark.django_db
def test_product_detail_api(setup_api_data):
    """Test GET /api/v1/products/{slug} detail endpoint."""
    client = Client()
    p1 = setup_api_data["p1"]

    res = client.get(f"/api/v1/products/{p1.slug}?lang=am")
    assert res.status_code == 200
    data = res.json()

    assert data["code"] == "WC-001"
    assert data["name"] == "ልዩ የዎልናት ሳሎን ጠረጴዛ"
    assert data["description"] == "የዎልናት ጠረጴዛ።"
    assert data["material"] == "ዎልናት"
    assert "images" in data
    assert len(data["images"]) == 1
    assert "variants" in data["images"][0]

    # Non-existent slug returns 404
    res_404 = client.get("/api/v1/products/does-not-exist")
    assert res_404.status_code == 404


@pytest.mark.django_db
def test_gallery_api(setup_api_data):
    """Test GET /api/v1/gallery endpoint."""
    client = Client()
    res = client.get("/api/v1/gallery?lang=am")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 1
    assert data[0]["title"] == "የተዋጣለት የእጅ ጥበብ"


@pytest.mark.django_db
def test_settings_api(setup_api_data):
    """Test GET /api/v1/settings endpoint."""
    client = Client()
    res = client.get("/api/v1/settings?lang=am")
    assert res.status_code == 200
    data = res.json()
    assert data["phone_number"] == "+251911223344"
    assert data["telegram_username"] == "woodcarvo"
    assert data["address"] == "አትላስ፣ ቦሌ፣ አዲስ አበባ"
    assert data["working_hours"] == "ከሰኞ እስከ ቅዳሜ ከጠዋቱ 2:30 - 12:00"


@pytest.mark.django_db
def test_sitemap_data_api(setup_api_data):
    """Test GET /api/v1/sitemap-data endpoint."""
    client = Client()
    res = client.get("/api/v1/sitemap-data")
    assert res.status_code == 200
    data = res.json()
    assert "locales" in data
    assert "products" in data
    assert "categories" in data
    assert len(data["products"]) == 2
    assert len(data["categories"]) == 2


@pytest.mark.django_db
def test_clicks_tracking_api(setup_api_data):
    """Test POST /api/v1/clicks endpoint."""
    client = Client()
    p1 = setup_api_data["p1"]

    # Valid WhatsApp click
    payload = {
        "product_id": p1.pk,
        "channel": "whatsapp",
        "locale": "am",
        "page_path": "/am/products/coffee-table",
    }
    res = client.post("/api/v1/clicks", data=payload, content_type="application/json")
    assert res.status_code == 201
    assert res.json()["status"] == "recorded"

    click = ContactClick.objects.first()
    assert click is not None
    assert click.channel == "whatsapp"
    assert click.locale == "am"
    assert click.product == p1

    # Invalid channel validation failure
    invalid_payload = {
        "channel": "snapchat",  # Not supported
    }
    res_bad = client.post("/api/v1/clicks", data=invalid_payload, content_type="application/json")
    assert res_bad.status_code == 400
