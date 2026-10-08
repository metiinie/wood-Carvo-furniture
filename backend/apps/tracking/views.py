"""API views for logging customer inquiry clicks with rate limiting."""
from __future__ import annotations

from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView
from .serializers import ContactClickSerializer


class ClicksRateThrottle(AnonRateThrottle):
    scope = "clicks"


@extend_schema(
    summary="Record customer inquiry action",
    description="Logs a click on WhatsApp, Telegram, or Phone Call. Throttled to 30 requests/min per IP. Stores zero personal data.",
    request=ContactClickSerializer,
    responses={201: {"type": "object", "properties": {"status": {"type": "string"}}}},
)
class RecordClickAPIView(APIView):
    throttle_classes = [ClicksRateThrottle]

    def post(self, request):
        serializer = ContactClickSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "recorded"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
