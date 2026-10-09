"""Seed database with categories, products, gallery items, site settings, and Owner group."""

import io

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw

from apps.catalog.models import Category, GalleryItem, Product, ProductImage
from apps.site.models import SiteSettings


def create_placeholder_image(
    text: str, bg_color=(58, 41, 33), text_color=(217, 183, 122), width=800, height=600
) -> ContentFile:
    """Generates an in-memory JPEG placeholder image with warm wood branding."""
    img = Image.new("RGB", (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    # Draw border
    draw.rectangle([20, 20, width - 20, height - 20], outline=text_color, width=3)
    # Simple label in center
    draw.text((width // 4, height // 2 - 20), text, fill=text_color)
    draw.text((width // 4, height // 2 + 20), "WOOD CARVO • Addis Ababa", fill=(246, 241, 231))

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=85)
    return ContentFile(buffer.getvalue())


class Command(BaseCommand):
    help = "Seeds categories, products, images, and permissions for WOOD CARVO."

    def handle(self, *args, **options):
        self.stdout.write("Starting WOOD CARVO seed process...")

        # 1. Setup Owner Group & Permissions
        owner_group, _ = Group.objects.get_or_create(name="Owner")
        app_models = [Category, Product, ProductImage, GalleryItem, SiteSettings]
        content_types = ContentType.objects.get_for_models(*app_models).values()
        permissions = Permission.objects.filter(content_type__in=content_types)
        owner_group.permissions.set(permissions)
        self.stdout.write(self.style.SUCCESS("[OK] Configured 'Owner' user role and permissions."))

        # Setup primary admin user: rushdseid@gmail.com
        from django.contrib.auth import get_user_model

        User = get_user_model()
        admin_user, created = User.objects.get_or_create(
            username="rushdseid@gmail.com",
            defaults={"email": "rushdseid@gmail.com", "is_staff": True, "is_superuser": True},
        )
        admin_user.set_password("Rushd6685")
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()
        self.stdout.write(self.style.SUCCESS("[OK] Admin user rushdseid@gmail.com configured."))

        # 2. Setup Site Settings singleton
        settings_obj = SiteSettings.load()
        settings_obj.phone_number = "+251910842430"
        settings_obj.whatsapp_number = "+251910842430"
        settings_obj.telegram_username = "woodcarvo"
        settings_obj.google_maps_url = "https://maps.google.com/?q=Bole+Addis+Ababa"

        settings_obj.address_en = "Bole Sub-city, Near Atlas Hotel, Addis Ababa, Ethiopia"
        settings_obj.address_am = "ቦሌ ክፍለ ከተማ፣ አትላስ ሆቴል አካባቢ፣ አዲስ አበባ፣ ኢትዮጵያ"
        settings_obj.address_om = (
            "Kutaa Magaalaa Boolee, Naannoo Hoteela Atlaas, Finfinnee, Itoophiyaa"
        )

        settings_obj.working_hours_en = "Monday - Saturday: 8:30 AM - 6:30 PM | Sunday: Closed"
        settings_obj.working_hours_am = "ከሰኞ እስከ ቅዳሜ፡ ከጠዋቱ 2:30 - ከሰዓት 12:30 | እሁድ፡ ዝግ ነው"
        settings_obj.working_hours_om = "Wiixata - Sanbata: 2:30 WL - 12:30 WB | Dilbata: Cufaadha"

        settings_obj.about_text_en = (
            "WOOD CARVO is an artisan furniture workshop in Addis Ababa. We specialize in custom handcrafted "
            "furniture combining indigenous hardwoods (Wanza, Tid, Kosso) with modern architectural aesthetics. "
            "Every piece is precision-built to elevate your living and working spaces."
        )
        settings_obj.about_text_am = (
            "ዉድ ካርቮ በአዲስ አበባ የሚገኝ ልዩ የዕደ-ጥበብ የቤት ዕቃዎች ማምረቻ ነው። ጥንታዊና ጠንካራ የሀገር ውስጥ እንጨቶችን "
            "(ዋንዛ፣ ፅድ፣ ኮሶ) ከዘመናዊ ዲዛይን ጋር በማዋሃድ ውብና ዘላቂ የሆኑ የቤትና የቢሮ እቃዎችን በጥራት እናመርታለን።"
        )
        settings_obj.about_text_om = (
            "WOOD CARVO godambaa oomisha meeshaalee manaa aartii Finfinnee keessatti argamudha. Mukoota biyya keessaa "
            "ciccimoo (Waanzaa, Gaattiraa) dizaayinii ammayyaa waliin madaqsuun meeshaalee qulqullina olaanaa qaban oomisna."
        )

        settings_obj.custom_furniture_text_en = (
            "Have a unique space or specific dimensions? Our master woodworkers craft bespoke dining tables, "
            "sofas, king platform beds, and complete office suites tailored to your design preferences."
        )
        settings_obj.custom_furniture_text_am = (
            "ልዩ ዲዛይን ወይም የተወሰነ ስፋት ያለው ዕቃ ይፈልጋሉ? ባለሙያዎቻችን እንደ ምርጫዎ እና የቤትዎ መጠን "
            "ተስማሚ የሆኑ ልዩ የቤት እቃዎችን በትእዛዝ ያዘጋጁልዎታል።"
        )
        settings_obj.custom_furniture_text_om = (
            "Dizaayinii addaa ykn safartuu murtaa'e barbaadduu? Ogeeyyiin keenya fedhii fi safara keessan irratti "
            "hunda'uun meeshaalee manaa qulqullina qaban ajajaan isiniif qopheessu."
        )

        if not settings_obj.hero_image:
            hero_file = create_placeholder_image(
                "HERO: WOOD CARVO WORKSHOP", bg_color=(45, 30, 22), width=1200, height=800
            )
            settings_obj.hero_image.save("workshop_hero.jpg", hero_file, save=False)
        if not settings_obj.showroom_photo:
            showroom_file = create_placeholder_image(
                "SHOWROOM ADDIS ABABA", bg_color=(60, 42, 30), width=1000, height=700
            )
            settings_obj.showroom_photo.save("showroom.jpg", showroom_file, save=False)

        settings_obj.save()
        self.stdout.write(self.style.SUCCESS("[OK] Seeded SiteSettings."))

        # 3. Setup Categories
        categories_data = [
            {
                "slug": "living-room",
                "name_en": "Living Room",
                "name_am": "የሳሎን እቃዎች",
                "name_om": "Meeshaa Mana Jireenyaa",
                "description_en": "Handcrafted coffee tables, console tables, and luxury armchairs.",
                "description_am": "የተመረጡ የሳሎን ጠረጴዛዎች፣ የቲቪ ማስቀመጫዎች እና ወንበሮች።",
                "description_om": "Minjiiwwan bunaa, barcumoota fi meeshaalee jireenyaa qulqullina qaban.",
                "sort_order": 1,
            },
            {
                "slug": "dining-room",
                "name_en": "Dining Room",
                "name_am": "የመመገቢያ እቃዎች",
                "name_om": "Meeshaa Mana Nyaataa",
                "description_en": "Solid timber dining tables and custom ergonomic benches.",
                "description_am": "ጠንካራና ዘመናዊ የተፈጥሮ እንጨት የመመገቢያ ጠረጴዛዎች እና ወንበሮች።",
                "description_om": "Minjiiwwan nyaataa muka ciccimoo fi barcumoota mijatoo.",
                "sort_order": 2,
            },
            {
                "slug": "bedroom",
                "name_en": "Bedroom",
                "name_am": "የመኝታ ቤት እቃዎች",
                "name_om": "Meeshaa Mana Ciisichaa",
                "description_en": "King platform beds, artisan nightstands, and wardrobes.",
                "description_am": "ዘመናዊ ኪንግ አልጋዎች፣ ኮሞዲኖዎች እና የልብስ ማስቀመጫዎች።",
                "description_om": "Sireewwan gurguddoo, komodiinoo fi saanduqa uffataa.",
                "sort_order": 3,
            },
        ]

        cat_map = {}
        for cat_data in categories_data:
            slug = cat_data.pop("slug")
            cat, created = Category.objects.get_or_create(slug=slug, defaults=cat_data)
            if not created:
                for k, v in cat_data.items():
                    setattr(cat, k, v)
                cat.save()
            if not cat.image:
                cat_img = create_placeholder_image(
                    f"CATEGORY: {cat.name_en.upper()}", width=600, height=400
                )
                cat.image.save(f"{slug}.jpg", cat_img, save=True)
            cat_map[slug] = cat
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(cat_map)} Categories."))

        # 4. Setup 6 Sample Products
        products_data = [
            {
                "code": "WC-001",
                "category": cat_map["living-room"],
                "name_en": "Bespoke Walnut Coffee Table",
                "name_am": "ልዩ የዎልናት ሳሎን ጠረጴዛ",
                "name_om": "Minjii Bunaa Walnatii Addaa",
                "description_en": "Handcrafted organic live-edge walnut coffee table featuring matte black powder-coated steel legs. Finished with natural oil.",
                "description_am": "ከከፍተኛ ጥራት የዎልናት እንጨት እና ጥቁር የብረት እግሮች የተሰራ ዘመናዊ የሳሎን ጠረጴዛ። በተፈጥሮ ዘይት የተወለወለ።",
                "description_om": "Muka walnatii fi sibiila gurraacha irraa kan tolfame minjii bunaa bareedaa.",
                "material_en": "Solid Walnut & Powder-coated Steel",
                "material_am": "የተፈጥሮ ዎልናት እንጨት እና ብረት",
                "material_om": "Muka Walnatii fi Sibiila",
                "color_en": "Deep Walnut Brown",
                "color_am": "ጥቁር ቡናማ",
                "color_om": "Bunaama Dukkanaawaa",
                "dimensions": "120cm L x 65cm W x 45cm H",
                "is_customizable": True,
                "availability": Product.Availability.READY,
                "lead_time_en": "Available in showroom",
                "lead_time_am": "በሾውሩም ዝግጁ ነው",
                "lead_time_om": "Shoowruumii keessatti qophiidha",
                "price_mode": Product.PriceMode.FIXED,
                "price_etb": 35000,
                "featured": True,
                "status": Product.Status.PUBLISHED,
            },
            {
                "code": "WC-002",
                "category": cat_map["dining-room"],
                "name_en": "Handcrafted 8-Seater Teak Dining Table",
                "name_am": "ባለ 8 ሰው የተፈጥሮ ቲክ የመመገቢያ ጠረጴዛ",
                "name_om": "Minjii Nyaataa Teekii Namoota 8",
                "description_en": "Generous dining table built for large family gatherings. Mortise and tenon joinery ensures multigenerational durability.",
                "description_am": "ለቤተሰብ እና ለእንግዳ ተስማሚ የሆነ ጠንካራ ባለ 8 ሰው የመመገቢያ ጠረጴዛ። ለብዙ አመታት የሚቆይ ጥራት።",
                "description_om": "Minjii nyaataa bal'aa namoota 8 tajaajilu, muka teekii cimaa irraa qophaa'e.",
                "material_en": "Solid Teak Timber",
                "material_am": "የተፈጥሮ ቲክ እንጨት",
                "material_om": "Muka Teekii",
                "color_en": "Golden Honey Teak",
                "color_am": "ማርማ ወርቃማ",
                "color_om": "Damma Boorallaa",
                "dimensions": "240cm L x 100cm W x 76cm H",
                "is_customizable": True,
                "availability": Product.Availability.MADE_TO_ORDER,
                "lead_time_en": "2-3 weeks",
                "lead_time_am": "2-3 ሳምንታት",
                "lead_time_om": "Torban 2-3",
                "price_mode": Product.PriceMode.FROM,
                "price_etb": 75000,
                "featured": True,
                "status": Product.Status.PUBLISHED,
            },
            {
                "code": "WC-003",
                "category": cat_map["bedroom"],
                "name_en": "Solid Mahogany King Platform Bed",
                "name_am": "የማሆጋኒ ኪንግ ሳይዝ አልጋ",
                "name_om": "Siree Guddaa Mahooganii",
                "description_en": "Contemporary low-profile king bed with built-in floating headboard and integrated warm LED channel. Squeak-free reinforced slat base.",
                "description_am": "ዘመናዊ የማሆጋኒ ኪንግ አልጋ ከውብ የራስጌ ዲዛይን እና ጠንካራ ድጋፍ ጋር። ለጥልቅ እረፍት የተሰራ።",
                "description_om": "Siree ammayyaa muka mahooganii cimaa irraa tolfame, headboard bareedaa waliin.",
                "material_en": "Kiln-dried Mahogany",
                "material_am": "ደረቅ ማሆጋኒ እንጨት",
                "material_om": "Muka Mahooganii",
                "color_en": "Warm Mahogany Red-Brown",
                "color_am": "ቀይ ቡናማ ማሆጋኒ",
                "color_om": "Diimaa Bunaama",
                "dimensions": "210cm L x 195cm W x 105cm H (Headboard)",
                "is_customizable": True,
                "availability": Product.Availability.MADE_TO_ORDER,
                "lead_time_en": "3-4 weeks",
                "lead_time_am": "3-4 ሳምንታት",
                "lead_time_om": "Torban 3-4",
                "price_mode": Product.PriceMode.FIXED,
                "price_etb": 88000,
                "featured": True,
                "status": Product.Status.PUBLISHED,
            },
            {
                "code": "WC-004",
                "category": cat_map["living-room"],
                "name_en": "Minimalist Credenza & TV Console",
                "name_am": "ሚኒማሊስት የቲቪ ማስቀመጫ እና ካቢኔት",
                "name_om": "Konsolii TV fi Kabineetii Ammayyaa",
                "description_en": "Sleek low-line media console with slatted sliding doors allowing infrared remote pass-through and concealed cable routing.",
                "description_am": "ዘመናዊ ዝቅተኛ የቲቪ ካቢኔት ከተንሸራታች በሮች እና ድብቅ የገመድ ማሳለፊያ ጋር።",
                "description_om": "Meeshaa TV fi meeshaalee elektirooniksii keessa kaahan ammayyaa.",
                "material_en": "White Oak & Matte Lacquer",
                "material_am": "ነጭ ኦክ እንጨት",
                "material_om": "Muka Ookii Adii",
                "color_en": "Natural Blond Oak",
                "color_am": "የተፈጥሮ ኦክ",
                "color_om": "Ookii Uumamaa",
                "dimensions": "180cm L x 45cm W x 50cm H",
                "is_customizable": True,
                "availability": Product.Availability.READY,
                "lead_time_en": "In Stock",
                "lead_time_am": "ዝግጁ ዕቃ",
                "lead_time_om": "Qophii",
                "price_mode": Product.PriceMode.FIXED,
                "price_etb": 42000,
                "featured": False,
                "status": Product.Status.PUBLISHED,
            },
            {
                "code": "WC-005",
                "category": cat_map["living-room"],
                "name_en": "Sculptural Wanza Wood Armchair",
                "name_am": "የዋንዛ እንጨት ጥበባዊ ወንበር",
                "name_om": "Barcuma Waanzaa Addaa",
                "description_en": "Bespoke collector lounge chair hand-carved from rare aged Wanza hardwood. Upholstered in premium textured linen.",
                "description_am": "ከአገር በቀል የዋንዛ እንጨት በእጅ የተጠረበ ብርቅዬ የሳሎን ወንበር። በከፍተኛ ጥራት ጨርቅ የተሸፈነ። (የተሸጠ/የቀደመ ስራ)",
                "description_om": "Barcuma aartii muka waanzaa qaalii irraa harkaan tolfame. (Kanaan dura kan gurgurame)",
                "material_en": "Ethiopian Wanza Wood & Heavy Linen",
                "material_am": "የኢትዮጵያ ዋንዛ እንጨት እና ጥራት ያለው ጨርቅ",
                "material_om": "Muka Waanzaa fi Uffata Qulqulluu",
                "color_en": "Natural Wanza Grain & Cream",
                "color_am": "የዋንዛ የተፈጥሮ መልክ",
                "color_om": "Bifa Waanzaa Uumamaa",
                "dimensions": "78cm W x 82cm D x 74cm H",
                "is_customizable": True,
                "availability": Product.Availability.SOLD,
                "lead_time_en": "Previously made portfolio piece",
                "lead_time_am": "ቀደም ሲል የተሰራ ልዩ ስራ",
                "lead_time_om": "Kanaan dura kan oomishame",
                "price_mode": Product.PriceMode.ASK,
                "price_etb": None,
                "featured": False,
                "status": Product.Status.PUBLISHED,
            },
            {
                "code": "WC-006",
                "category": cat_map["bedroom"],
                "name_en": "Custom Floating Nightstands (Pair)",
                "name_am": "ተንሳፋፊ ጥንድ የመኝታ ኮሞዲኖ",
                "name_om": "Komodiinoo Siree Cinaa Tokkummaa",
                "description_en": "Wall-mounted floating bedside tables with smooth soft-close push drawers and beveled edge details.",
                "description_am": "ከግድግዳ ጋር የሚገጠሙ ጥንድ ዘመናዊ ኮሞዲኖዎች። ድምፅ አልባ መሳቢያዎች ያሉት።",
                "description_om": "Komodiinoo girgiddatti maxxanan kan bifa ammayyaa qaban.",
                "material_en": "Solid Ash Wood",
                "material_am": "የአሽ እንጨት",
                "material_om": "Muka Ash",
                "color_en": "Smoked Grey Ash",
                "color_am": "አመድማ አሽ",
                "color_om": "Daaraa Ash",
                "dimensions": "50cm W x 35cm D x 20cm H each",
                "is_customizable": True,
                "availability": Product.Availability.MADE_TO_ORDER,
                "lead_time_en": "1-2 weeks",
                "lead_time_am": "1-2 ሳምንታት",
                "lead_time_om": "Torban 1-2",
                "price_mode": Product.PriceMode.FIXED,
                "price_etb": 24000,
                "featured": False,
                "status": Product.Status.PUBLISHED,
            },
        ]

        for p_data in products_data:
            code = p_data.pop("code")
            prod, created = Product.objects.get_or_create(code=code, defaults=p_data)
            if not created:
                for k, v in p_data.items():
                    setattr(prod, k, v)
                prod.save()

            # Attach images if none exist
            if not prod.images.exists():
                primary_file = create_placeholder_image(
                    f"{prod.code}: {prod.name_en[:24]}", width=900, height=700
                )
                ProductImage.objects.create(
                    product=prod,
                    is_primary=True,
                    sort_order=0,
                    alt_text_en=f"{prod.name_en} - Main Angle",
                    alt_text_am=f"{prod.name_am} - ዋና እይታ",
                    alt_text_om=f"{prod.name_om} - Agarsiisa Guddaa",
                ).image.save(f"{prod.code.lower()}_primary.jpg", primary_file, save=True)

                detail_file = create_placeholder_image(
                    f"{prod.code} DETAIL CRAFT", width=900, height=700
                )
                ProductImage.objects.create(
                    product=prod,
                    is_primary=False,
                    sort_order=1,
                    alt_text_en=f"{prod.name_en} - Craftsmanship Details",
                    alt_text_am=f"{prod.name_am} - የጥበብ ዝርዝሮች",
                    alt_text_om=f"{prod.name_om} - Baldhina Ogummaa",
                ).image.save(f"{prod.code.lower()}_detail.jpg", detail_file, save=True)

        self.stdout.write(
            self.style.SUCCESS(f"[OK] Seeded {len(products_data)} Sample Products with Photos.")
        )

        # 5. Setup Gallery Items
        if GalleryItem.objects.count() == 0:
            gallery_data = [
                ("Master Joinery & Mortise Details", cat_map["dining-room"]),
                ("Hand Finishing with Natural Beeswax & Oils", cat_map["living-room"]),
                ("Precision Custom Bed Assembly in Workshop", cat_map["bedroom"]),
            ]
            for idx, (title, category) in enumerate(gallery_data):
                g_img = create_placeholder_image(
                    f"WORKSHOP: {title.upper()}", width=800, height=600
                )
                gi = GalleryItem.objects.create(
                    title_en=title,
                    title_am=f"የእጅ ጥበብ ስራ #{idx + 1}",
                    title_om=f"Hojii Ogummaa Harkaa #{idx + 1}",
                    category=category,
                    sort_order=idx + 1,
                    is_active=True,
                )
                gi.image.save(f"gallery_{idx + 1}.jpg", g_img, save=True)
            self.stdout.write(self.style.SUCCESS("[OK] Seeded Gallery Items."))

        self.stdout.write(self.style.SUCCESS("[SUCCESS] WOOD CARVO seed completed successfully!"))
