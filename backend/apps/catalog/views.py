"""API views for Category, Product, Gallery, and Sitemap data."""

from __future__ import annotations

from django.db.models import Q
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import generics, status
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Category, GalleryItem, Product
from .serializers import (
    CategorySerializer,
    GalleryItemSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


@extend_schema(
    summary="List active furniture categories",
    description="Returns all active categories ordered by workshop display sequence.",
    parameters=[
        OpenApiParameter(
            name="lang", type=str, description="Language code: en, am, or om", default="en"
        ),
    ],
)
class CategoryListAPIView(generics.ListAPIView):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by("sort_order", "id")


@extend_schema(
    summary="Browse published furniture products",
    description="Search, filter, and paginate published workshop furniture items.",
    parameters=[
        OpenApiParameter(
            name="lang", type=str, description="Language code: en, am, om", default="en"
        ),
        OpenApiParameter(name="category", type=str, description="Category slug"),
        OpenApiParameter(
            name="q", type=str, description="Search query across title (all languages) and code"
        ),
        OpenApiParameter(
            name="availability", type=str, description="READY, MADE_TO_ORDER, or SOLD"
        ),
        OpenApiParameter(name="featured", type=bool, description="Filter only featured items"),
        OpenApiParameter(
            name="sort", type=str, description="Sort order: newest or featured", default="newest"
        ),
        OpenApiParameter(name="page", type=int, description="Page number", default=1),
    ],
)
class ProductListAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # Only PUBLISHED items are visible to the public
        qs = (
            Product.objects.filter(status=Product.Status.PUBLISHED)
            .select_related("category")
            .prefetch_related("images")
        )

        # Category filter
        cat_slug = self.request.query_params.get("category")
        if cat_slug:
            qs = qs.filter(category__slug=cat_slug)

        # Availability filter
        avail = self.request.query_params.get("availability")
        if avail:
            qs = qs.filter(availability=avail.upper())

        # Featured filter
        featured = self.request.query_params.get("featured")
        if featured is not None:
            if featured.lower() in ("true", "1"):
                qs = qs.filter(featured=True)
            elif featured.lower() in ("false", "0"):
                qs = qs.filter(featured=False)

        # Search query (crosses English, Amharic, Oromo, and Product Code)
        query = self.request.query_params.get("q")
        if query:
            q_clean = query.strip()
            qs = qs.filter(
                Q(code__icontains=q_clean)
                | Q(name_en__icontains=q_clean)
                | Q(name_am__icontains=q_clean)
                | Q(name_om__icontains=q_clean)
                | Q(material_en__icontains=q_clean)
            )

        # Sorting
        sort = self.request.query_params.get("sort", "newest")
        if sort == "featured":
            qs = qs.order_by("-featured", "-created_at")
        else:
            qs = qs.order_by("-created_at")

        return qs


@extend_schema(
    summary="Retrieve single furniture item by slug",
    description="Returns detailed specs, responsive image variants, and related products.",
    parameters=[
        OpenApiParameter(
            name="lang", type=str, description="Language code: en, am, om", default="en"
        ),
    ],
)
class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Product.objects.filter(status=Product.Status.PUBLISHED)
            .select_related("category")
            .prefetch_related("images")
        )


@extend_schema(
    summary="List portfolio gallery items",
    description="Workshop photography and finished bespoke projects.",
    parameters=[
        OpenApiParameter(
            name="lang", type=str, description="Language code: en, am, om", default="en"
        ),
        OpenApiParameter(name="category", type=str, description="Optional category slug"),
    ],
)
class GalleryListAPIView(generics.ListAPIView):
    serializer_class = GalleryItemSerializer
    pagination_class = None

    def get_queryset(self):
        qs = (
            GalleryItem.objects.filter(is_active=True)
            .select_related("category")
            .order_by("sort_order", "-id")
        )
        cat_slug = self.request.query_params.get("category")
        if cat_slug:
            qs = qs.filter(category__slug=cat_slug)
        return qs


@extend_schema(
    summary="Sitemap and SEO indexing data",
    description="Returns all public slugs and timestamps for search engine sitemaps.",
    responses={
        200: {
            "type": "object",
            "properties": {
                "locales": {"type": "array", "items": {"type": "string"}},
                "products": {"type": "array", "items": {"type": "object"}},
                "categories": {"type": "array", "items": {"type": "object"}},
                "static_pages": {"type": "array", "items": {"type": "string"}},
            },
        }
    },
)
class SitemapDataAPIView(APIView):
    def get(self, request):
        products = Product.objects.filter(status=Product.Status.PUBLISHED).values(
            "slug", "updated_at"
        )
        categories = Category.objects.filter(is_active=True).values("slug")

        data = {
            "locales": ["en", "am", "om"],
            "products": [
                {
                    "slug": p["slug"],
                    "updated_at": p["updated_at"].isoformat() if p["updated_at"] else None,
                }
                for p in products
            ],
            "categories": [{"slug": c["slug"]} for c in categories],
            "static_pages": [
                "",
                "products",
                "categories",
                "custom-furniture",
                "gallery",
                "about",
                "contact",
            ],
        }
        return Response(data, status=status.HTTP_200_OK)
