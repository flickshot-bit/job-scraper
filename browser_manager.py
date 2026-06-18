from playwright.async_api import async_playwright

playwright_instance = None
browser = None


async def start_browser():
    global playwright_instance, browser

    playwright_instance = await async_playwright().start()

    browser = await playwright_instance.chromium.launch(
        headless=True
    )

    return browser


async def get_browser():
    global browser

    if browser is None:
        browser = await start_browser()

    return browser
