"""Tests for health check endpoints and admin panel accessibility."""
import pytest
from django.contrib.auth import get_user_model
from django.test import Client

User = get_user_model()


@pytest.mark.django_db
def test_healthz_endpoint():
    """Verify /healthz and /api/v1/healthz return 200 OK for uptime monitoring."""
    client = Client()
    for endpoint in ["/healthz", "/api/v1/healthz"]:
        response = client.get(endpoint)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["app"] == "WOOD CARVO"


@pytest.mark.django_db
def test_admin_manage_path_and_login():
    """Verify admin is hosted at /manage/ and accessible to staff."""
    client = Client()
    # Unauthenticated redirect to login
    response = client.get("/manage/")
    assert response.status_code == 302
    assert "/manage/login/" in response.url

    # Authenticated superuser access
    User.objects.create_superuser("adminuser", "admin@woodcarvo.com", "pass1234")
    logged_in = client.login(username="adminuser", password="pass1234")
    assert logged_in is True

    admin_home = client.get("/manage/")
    assert admin_home.status_code == 200
    assert b"WOOD CARVO" in admin_home.content
