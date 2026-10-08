"""API v1 URL routing for WOOD CARVO."""

from django.urls import path

from apps.catalog.views import (
    CategoryListAPIView,
    GalleryListAPIView,
    ProductDetailAPIView,
    ProductListAPIView,
    SitemapDataAPIView,
)
from apps.site.views import SiteSettingsAPIView
from apps.tracking.views import RecordClickAPIView
from config.urls import healthz_view

urlpatterns = [
    # Catalog endpoints
    path("categories", CategoryListAPIView.as_view(), name="category-list"),
    path("products", ProductListAPIView.as_view(), name="product-list"),
    path("products/<slug:slug>", ProductDetailAPIView.as_view(), name="product-detail"),
    path("gallery", GalleryListAPIView.as_view(), name="gallery-list"),
    # Site settings
    path("settings", SiteSettingsAPIView.as_view(), name="site-settings"),
    # Sitemap indexing
    path("sitemap-data", SitemapDataAPIView.as_view(), name="sitemap-data"),
    # Inquiry tracking (throttled)
    path("clicks", RecordClickAPIView.as_view(), name="record-click"),
    # Health check
    path("healthz", healthz_view, name="api-v1-healthz"),
]
