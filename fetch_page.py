from playwright.sync_api import sync_playwright


def fetch_page(url):

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page()

        def block_resources(route):

            resource_type = route.request.resource_type

            if resource_type in [
                "image",
                "media",
                "font"
            ]:
                route.abort()

            else:
                route.continue_()

        page.route("**/*", block_resources)

        page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=30000
        )

        html = page.content()

        browser.close()

        return html