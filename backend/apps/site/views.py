"""API view for workshop settings and contacts."""
from __future__ import annotations

from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SiteSettings
from .serializers import SiteSettingsSerializer


@extend_schema(
    summary="Retrieve workshop settings and contacts",
    description="Returns phone numbers, WhatsApp, Telegram, working hours, and about text.",
    parameters=[
        OpenApiParameter(name="lang", type=str, description="Language code: en, am, or om", default="en"),
    ],
    responses={200: SiteSettingsSerializer},
)
class SiteSettingsAPIView(APIView):
    serializer_class = SiteSettingsSerializer

    def get(self, request):
        settings_obj = SiteSettings.load()
        serializer = SiteSettingsSerializer(settings_obj, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
