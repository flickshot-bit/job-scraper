import json
import html
import re
from urllib.parse import urlparse

import httpx
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/138.0.0.0 Safari/537.36"
    )
}


def fetch_html_http(url: str):
    try:
        response = httpx.get(
            url,
            headers=HEADERS,
            timeout=20,
            follow_redirects=True,
        )

        if response.status_code == 200:
            return response.text

    except Exception:
        pass

    return None
def fetch_html_playwright(url: str):

    try:

        with sync_playwright() as p:

            browser = p.chromium.launch(
                headless=True
            )

            page = browser.new_page(
                user_agent=HEADERS["User-Agent"]
            )

            page.goto(
                url,
                wait_until="networkidle",
                timeout=30000
            )

            html = page.content()

            browser.close()

            return html

    except Exception:
        return None