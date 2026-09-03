import logging

import requests

logger = logging.getLogger(__name__)

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_push_notifications(tokens: list[str], title: str, body: str) -> None:
    if not tokens:
        return
    messages = [{"to": token, "title": title, "body": body, "sound": "default"} for token in tokens]
    try:
        resp = requests.post(EXPO_PUSH_URL, json=messages, timeout=10)
        resp.raise_for_status()
    except requests.RequestException:
        logger.exception("Failed to send Expo push notifications")
