"""Django base settings for WOOD CARVO backend."""

from pathlib import Path

import dj_database_url
from decouple import Csv, config

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SECRET_KEY = config(
    "SECRET_KEY",
    default="django-insecure-wood-carvo-workshop-dev-secret-key-1234567890",
)

DEBUG = config("DEBUG", default=False, cast=bool)

ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default="localhost,127.0.0.1,0.0.0.0",
    cast=Csv(),
)

# Application definition
INSTALLED_APPS = [
    # django-modeltranslation must be before django.contrib.admin
    "modeltranslation",
    # django-unfold must be before django.contrib.admin
    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",
    "unfold.contrib.inlines",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    # Local Apps
    "apps.catalog.apps.CatalogConfig",
    "apps.site.apps.SiteConfig",
    "apps.tracking.apps.TrackingConfig",
    "apps.integrations.apps.IntegrationsConfig",
    "apps.adminpanel.apps.AdminpanelConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Database
# Default to SQLite locally if DATABASE_URL is empty
DATABASE_URL = config("DATABASE_URL", default="")
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en"
TIME_ZONE = "Africa/Addis_Ababa"
USE_I18N = True
USE_L10N = True
USE_TZ = True

LANGUAGES = [
    ("en", "English"),
    ("am", "Amharic (አማርኛ)"),
    ("om", "Afaan Oromoo"),
]

MODELTRANSLATION_DEFAULT_LANGUAGE = "en"
MODELTRANSLATION_LANGUAGES = ("en", "am", "om")
MODELTRANSLATION_FALLBACK_LANGUAGES = {
    "default": ("en", "am"),
    "om": ("en", "am"),
    "am": ("en",),
    "en": ("am",),
}
MODELTRANSLATION_PREPOPULATE_LANGUAGE = "en"

# Static files (CSS, JavaScript, Images)
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Media files
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Cloudinary configuration
CLOUDINARY_URL = config("CLOUDINARY_URL", default="")
if CLOUDINARY_URL:
    INSTALLED_APPS += ["cloudinary_storage", "cloudinary"]
    DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# CORS
CORS_ORIGIN_ENV = config(
    "CORS_ORIGIN", default="http://localhost:3000,http://127.0.0.1:3000", cast=Csv()
)
CORS_ALLOWED_ORIGINS = list(CORS_ORIGIN_ENV)
CORS_ALLOW_CREDENTIALS = True

# Frontend Integration
FRONTEND_URL = config("FRONTEND_URL", default="http://localhost:3000")
REVALIDATE_SECRET = config("REVALIDATE_SECRET", default="wood-carvo-revalidate-secret-token")
TELEGRAM_BOT_TOKEN = config("TELEGRAM_BOT_TOKEN", default="")
TELEGRAM_CHANNEL_ID = config("TELEGRAM_CHANNEL_ID", default="")

# Django REST Framework
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/min",
        "user": "240/min",
        "clicks": "30/min",
    },
}

# Spectacular OpenAPI Documentation
SPECTACULAR_SETTINGS = {
    "TITLE": "WOOD CARVO Furniture Showcase API",
    "DESCRIPTION": (
        "Public showcase & inquiry API for WOOD CARVO furniture workshop in Addis Ababa, Ethiopia. "
        "Supports English, Amharic, and Afaan Oromo resolved text."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "SCHEMA_PATH_PREFIX": "/api/v1/",
}

# Unfold Theme Configuration
UNFOLD = {
    "SITE_TITLE": "WOOD CARVO Workshop",
    "SITE_HEADER": "WOOD CARVO Admin",
    "SITE_SUBHEADER": "Addis Ababa • Handcrafted Furniture Management",
    "SITE_URL": "/",
    "THEME": "dark",
    "COLORS": {
        "primary": {
            "50": "254 243 199",
            "100": "253 230 138",
            "200": "245 158 11",
            "300": "217 119 6",
            "400": "180 83 9",
            "500": "146 64 14",
            "600": "107 75 56",  # Walnut #6B4B38
            "700": "74 44 29",
            "800": "58 41 33",  # Dark Wood #3A2921
            "900": "33 24 20",  # Dark Text #211814
            "950": "24 18 15",
        },
    },
    "SIDEBAR": {
        "show_search": True,
        "show_all_applications": True,
        "navigation": [
            {
                "title": "Catalog & Showcase",
                "separator": True,
                "collapsible": False,
                "items": [
                    {
                        "title": "Products",
                        "icon": "chair",
                        "link": "/manage/catalog/product/",
                    },
                    {
                        "title": "Categories",
                        "icon": "category",
                        "link": "/manage/catalog/category/",
                    },
                    {
                        "title": "Gallery Portfolio",
                        "icon": "photo_library",
                        "link": "/manage/catalog/galleryitem/",
                    },
                ],
            },
            {
                "title": "Workshop & Site",
                "separator": True,
                "collapsible": False,
                "items": [
                    {
                        "title": "Site Settings",
                        "icon": "store",
                        "link": "/manage/site/sitesettings/",
                    },
                    {
                        "title": "Inquiry Clicks",
                        "icon": "touch_app",
                        "link": "/manage/tracking/contactclick/",
                    },
                    {
                        "title": "⚡ Quick Add Product",
                        "icon": "add_circle",
                        "link": "/manage/quick-add/",
                    },
                ],
            },
        ],
    },
}
