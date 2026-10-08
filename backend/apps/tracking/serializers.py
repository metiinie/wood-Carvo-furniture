"""Serializer for inquiry click events."""

from __future__ import annotations

from rest_framework import serializers

from apps.catalog.models import Product

from .models import ContactClick


class ContactClickSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(required=False, allow_null=True)
    product_code = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = ContactClick
        fields = [
            "product_id",
            "product_code",
            "channel",
            "locale",
            "page_path",
        ]

    def validate_channel(self, value: str) -> str:
        valid_channels = [c.value for c in ContactClick.Channel]
        if value.lower() not in valid_channels:
            raise serializers.ValidationError(f"Invalid channel. Must be one of: {valid_channels}")
        return value.lower()

    def create(self, validated_data: dict) -> ContactClick:
        product_id = validated_data.pop("product_id", None)
        product_code = validated_data.pop("product_code", None)

        product = None
        if product_id:
            product = Product.objects.filter(pk=product_id).first()
        elif product_code:
            product = Product.objects.filter(code__iexact=product_code).first()

        return ContactClick.objects.create(product=product, **validated_data)
