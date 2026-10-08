"""Local development settings."""

from .base import *  # noqa: F403

DEBUG = True

ALLOWED_HOSTS = ["*"]

# In local dev, use simple static storage to avoid manifest requirement if not collected
STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"

# Relax CORS in development
CORS_ALLOW_ALL_ORIGINS = True
