"""Production settings for Render deployment."""
from decouple import Csv, config
from .base import *  # noqa: F403

DEBUG = False

ALLOWED_HOSTS = config("ALLOWED_HOSTS", cast=Csv())

# Strict Security
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", default=True, cast=bool)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Cache control for WhiteNoise
WHITENOISE_MAX_AGE = 31536000
