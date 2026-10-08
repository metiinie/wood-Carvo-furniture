"""Adminpanel URLs."""
from django.urls import path
from .views import quick_add_view

urlpatterns = [
    path("", quick_add_view, name="quick-add"),
]
