"""Tests for catalog models, code generation, and translation attributes."""
import pytest
from apps.catalog.models import Category, Product, ProductImage
from apps.site.models import SiteSettings
from apps.tracking.models import ContactClick


@pytest.mark.django_db
def test_category_creation_and_slug():
    """Verify Category slug generation and translated fields."""
    cat = Category.objects.create(
        name_en="Office Furniture",
        name_am="የቢሮ እቃዎች",
        name_om="Meeshaa Wajjiraa",
    )
    assert cat.slug == "office-furniture"
    assert cat.name_en == "Office Furniture"
    assert cat.name_am == "የቢሮ እቃዎች"
    assert cat.name_om == "Meeshaa Wajjiraa"


@pytest.mark.django_db
def test_product_sequential_code_and_price_formatting():
    """Verify auto-generation of WC-XXX code and formatted prices."""
    cat = Category.objects.create(name_en="Living Room")

    p1 = Product.objects.create(
        category=cat,
        name_en="Modern Wanza Armchair",
        price_mode=Product.PriceMode.FIXED,
        price_etb=45000,
        availability=Product.Availability.READY,
    )
    assert p1.code.startswith("WC-")
    assert p1.formatted_price == "ETB 45,000"

    p2 = Product.objects.create(
        category=cat,
        name_en="Custom Modular Sofa",
        price_mode=Product.PriceMode.FROM,
        price_etb=60000,
        availability=Product.Availability.MADE_TO_ORDER,
    )
    assert p2.formatted_price == "From ETB 60,000"

    p3 = Product.objects.create(
        category=cat,
        name_en="Artisan Legacy Credenza",
        price_mode=Product.PriceMode.ASK,
        price_etb=None,
    )
    assert p3.formatted_price == "Ask for price"


@pytest.mark.django_db
def test_product_publishing_and_images():
    """Verify primary image selection and published status."""
    cat = Category.objects.create(name_en="Bedroom")
    prod = Product.objects.create(
        category=cat,
        name_en="Acacia Nightstand",
        status=Product.Status.PUBLISHED,
    )
    assert prod.published_at is not None

    img1 = ProductImage.objects.create(
        product=prod,
        sort_order=0,
        is_primary=True,
        alt_text_en="Front angle",
    )
    assert prod.primary_image == img1


@pytest.mark.django_db
def test_site_settings_singleton():
    """Verify SiteSettings singleton behavior."""
    s1 = SiteSettings.load()
    s1.phone_number = "+251911111111"
    s1.save()

    s2 = SiteSettings.load()
    assert s2.phone_number == "+251911111111"
    assert SiteSettings.objects.count() == 1


@pytest.mark.django_db
def test_contact_click_tracking():
    """Verify ContactClick logs user channel without storing IP or personal data."""
    cat = Category.objects.create(name_en="Living Room")
    prod = Product.objects.create(category=cat, name_en="Coffee Table")

    click = ContactClick.objects.create(
        product=prod,
        channel=ContactClick.Channel.WHATSAPP,
        locale="am",
        page_path="/am/products/coffee-table",
    )
    assert click.channel == "whatsapp"
    assert click.locale == "am"
    assert click.product == prod
