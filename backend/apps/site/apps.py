from django.apps import AppConfig


class SiteConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.site"
    verbose_name = "Workshop & Site Settings"

    def ready(self) -> None:
        import apps.site.signals  # noqa: F401
