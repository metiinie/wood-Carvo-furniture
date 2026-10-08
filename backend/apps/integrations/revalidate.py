"""Next.js Edge ISR on-demand revalidation dispatcher."""
from __future__ import annotations

import logging
import threading
from typing import Sequence
from django.conf import settings
import requests

logger = logging.getLogger(__name__)


def _send_revalidate_request(tags: list[str]) -> None:
    """Internal function to call Next.js /api/revalidate endpoint."""
    frontend_url = getattr(settings, "FRONTEND_URL", "").rstrip("/")
    secret = getattr(settings, "REVALIDATE_SECRET", "")

    if not frontend_url or not secret:
        logger.debug("Revalidation skipped: FRONTEND_URL or REVALIDATE_SECRET not set.")
        return

    endpoint = f"{frontend_url}/api/revalidate"
    headers = {
        "x-revalidate-secret": secret,
        "Content-Type": "application/json",
    }
    payload = {"tags": tags}

    try:
        response = requests.post(endpoint, json=payload, headers=headers, timeout=5)
        if response.status_code == 200:
            logger.info("Successfully revalidated Next.js tags: %s", tags)
        else:
            logger.warning(
                "Failed to revalidate Next.js tags %s: %s %s",
                tags,
                response.status_code,
                response.text,
            )
    except Exception as exc:  # noqa: BLE001
        logger.warning("Error triggering Next.js revalidation for tags %s: %s", tags, exc)


def trigger_revalidation(tags: Sequence[str]) -> None:
    """Trigger Next.js revalidation in a background thread."""
    if not tags:
        return
    tag_list = list(tags)
    thread = threading.Thread(
        target=_send_revalidate_request,
        args=(tag_list,),
        daemon=True,
    )
    thread.start()
