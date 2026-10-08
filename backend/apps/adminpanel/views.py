"""Custom adminpanel views."""

from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render


@staff_member_required
def quick_add_view(request):
    """Mobile-first Quick Add product form."""
    return render(request, "adminpanel/quick_add.html", {})
