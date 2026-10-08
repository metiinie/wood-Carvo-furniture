"""Django Unfold admin configuration for ContactClick."""
from django.contrib import admin
from unfold.admin import ModelAdmin
from unfold.decorators import display

from .models import ContactClick


@admin.register(ContactClick)
class ContactClickAdmin(ModelAdmin):
    list_display = ("channel_badge", "product", "locale", "page_path", "created_at")
    list_filter = ("channel", "locale", "created_at")
    search_fields = ("product__code", "product__name_en", "page_path")
    readonly_fields = ("product", "channel", "locale", "page_path", "created_at")
    date_hierarchy = "created_at"

    @display(description="Channel", label=True)
    def channel_badge(self, instance: ContactClick):
        styles = {
            ContactClick.Channel.WHATSAPP: "success",
            ContactClick.Channel.TELEGRAM: "info",
            ContactClick.Channel.PHONE: "warning",
        }
        return instance.get_channel_display(), styles.get(instance.channel, "info")

    def has_add_permission(self, request) -> bool:
        return False

    def has_change_permission(self, request, obj=None) -> bool:
        return False
