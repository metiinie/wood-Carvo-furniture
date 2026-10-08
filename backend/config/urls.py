"""URL Configuration for WOOD CARVO."""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def healthz_view(request):
    """Health check endpoint for Render uptime monitoring."""
    return JsonResponse({"status": "ok", "app": "WOOD CARVO", "version": "1.0.0"})


urlpatterns = [
    # Health checks (both root and api/v1 paths supported)
    path("healthz", healthz_view, name="root-healthz"),
    path("api/v1/healthz", healthz_view, name="api-healthz"),
    # Quick Add & Admin custom views
    path("manage/quick-add/", include("apps.adminpanel.urls")),
    # Non-default admin panel path
    path("manage/", admin.site.urls),
    # Versioned Public API
    path("api/v1/", include("config.api_urls")),
    # OpenAPI Documentation
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/v1/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

# Static / Media serving in local development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
