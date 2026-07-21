import httpx
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse
import json
import re
import html

DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;"
        "q=0.9,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


def clean_html(text):

    text = html.unescape(text)

    text = re.sub(r'<br\s*/?>', '\n', text)
    text = re.sub(r'</li>', '\n', text)
    text = re.sub(r'<li>', '- ', text)

    text = re.sub(r'<.*?>', '', text)

    text = re.sub(r'\n+', '\n', text)

    return text.strip()


def detect_site(url):
    domain = urlparse(url).netloc.lower()

    if "indeed" in domain:
        return "indeed"

    elif "naukri" in domain:
        return "naukri"

    elif "linkedin" in domain:
        return "linkedin"

    elif "wellfound" in domain:
        return "wellfound"

    return "generic"


def get_selectors(site):

    if site == "indeed":
        return ['#jobDescriptionText']

    elif site == "naukri":
        return ['.dang-inner-html']

    elif site == "linkedin":
        return ['.show-more-less-html__markup']

    elif site == "wellfound":
        return ['[data-test="JobDescription"]']

    return [
        '.job-description',
        'article',
        'section',
        '[class*="description"]'
    ]


def extract_json_ld_data(soup):

    try:
        scripts = soup.find_all(
            "script", attrs={"type": "application/ld+json"}
        )
    except Exception:
        return None

    for script in scripts:

        try:
            raw = script.string

            if not raw:
                raw = script.get_text()

            if not raw:
                continue

            data = json.loads(raw)

            if isinstance(data, list):

                for item in data:

                    if isinstance(item, dict) and item.get("@type") == "JobPosting":
                        return item

            elif isinstance(data, dict):

                if data.get("@type") == "JobPosting":
                    return data

                # Some sites nest the JobPosting under @graph
                graph = data.get("@graph")

                if isinstance(graph, list):

                    for item in graph:

                        if isinstance(item, dict) and item.get("@type") == "JobPosting":
                            return item

        except Exception:
            continue

    return None


def extract_structured_data(job_json):

    if not job_json:
        return None

    description = job_json.get("description")

    if description:
        description = clean_html(description)

    title = job_json.get("title")

    skills = job_json.get("skills")

    if isinstance(skills, str):
        skills = [skills]

    salary = None

    base_salary = job_json.get("baseSalary")

    if base_salary:

        try:
            salary = base_salary.get(
                "value", {}
            ).get("value")

        except Exception:
            salary = None

    location = None

    job_location = job_json.get("jobLocation")

    if isinstance(job_location, list) and len(job_location) > 0:

        try:
            location = (
                job_location[0]
                .get("address", {})
                .get("addressLocality")
            )

        except Exception:
            location = None

    elif isinstance(job_location, dict):

        try:
            location = (
                job_location
                .get("address", {})
                .get("addressLocality")
            )

        except Exception:
            location = None

    return {
        "title": title,
        "description": description,
        "skills": skills,
        "salary": salary,
        "location": location
    }


def extract_title(soup):

    try:
        h1 = soup.find("h1")

        if h1:
            text = h1.get_text(strip=True)

            if text:
                return text

    except Exception:
        pass

    return None


def normalize_output(data):

    if not data:
        return data

    try:

        if data.get("salary"):

            if isinstance(data["salary"], str):
                data["salary"] = data["salary"].strip()

        skills = data.get("skills")

        if skills:

            clean = []
            seen = set()

            for s in skills:

                if not s:
                    continue

                s_clean = s.strip()

                key = s_clean.lower()

                if key and key not in seen:
                    seen.add(key)
                    clean.append(s_clean)

            data["skills"] = clean

    except Exception:
        pass

    return data


def extract_description(soup, selectors):

    for sel in selectors:

        try:
            elements = soup.select(sel)
        except Exception:
            elements = []

        if elements:

            clean_text = []

            for el in elements:

                text = el.get_text(separator="\n", strip=True)

                for line in text.split("\n"):

                    line = line.strip()

                    if line:
                        clean_text.append(line)

            if clean_text:
                return "\n".join(clean_text)

    return None


def fallback_extraction(soup):

    try:

        body = soup.find("body")

        if not body:
            return None

        text = body.get_text(separator="\n", strip=True)

        clean_text = [
            t.strip()
            for t in text.split("\n")
            if t.strip()
        ]

        return "\n".join(clean_text[:2000])

    except Exception:
        return None


def is_blocked(soup):

    try:

        content = soup.get_text(separator=" ", strip=True).lower()

        blocked_keywords = [
            "captcha",
            "cloudflare",
            "challenge-platform",
            "captcha-delivery",
            "access denied",
            "verify you are human",
            "checking your browser",
            "just a moment",
            "cf-browser-verification",
            "security check"
        ]

        return any(
            keyword in content
            for keyword in blocked_keywords
        )

    except Exception:
        return False


def _fetch_static_html(url):

    try:
        with httpx.Client(
            headers=DEFAULT_HEADERS,
            timeout=15.0,
            follow_redirects=True,
            http2=False
        ) as client:

            response = client.get(url)

            if response.status_code >= 400:
                return None

            if not response.text:
                return None

            return response.text

    except Exception:
        return None


def _fetch_dynamic_html(url):

    try:
        with sync_playwright() as p:

            browser = p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                ]
            )

            try:
                context = browser.new_context(
                    user_agent=DEFAULT_HEADERS["User-Agent"],
                    locale="en-US",
                    viewport={"width": 1366, "height": 768}
                )

                page = context.new_page()

                page.set_default_navigation_timeout(30000)
                page.set_default_timeout(30000)

                page.goto(url, wait_until="domcontentloaded")

                try:
                    page.wait_for_load_state("networkidle", timeout=10000)
                except Exception:
                    pass

                page.wait_for_timeout(2000)

                content = page.content()

                return content

            finally:
                browser.close()

    except Exception:
        return None


def _content_is_sufficient(soup, selectors):

    if not soup:
        return False

    if extract_json_ld_data(soup):
        return True

    if extract_description(soup, selectors):
        return True

    return False


def _process_soup(soup, selectors, source_label):

    if is_blocked(soup):
        return {"error": "Blocked by website"}

    job_json = extract_json_ld_data(soup)

    structured = extract_structured_data(job_json)

    if structured:

        if not structured.get("title"):
            structured["title"] = extract_title(soup)

        structured = normalize_output(structured)

        print(f"Extracted structured JSON data ({source_label})")

        return structured

    desc = extract_description(soup, selectors)

    if desc:

        return normalize_output({
            "title": extract_title(soup),
            "description": desc,
            "skills": None,
            "salary": None,
            "location": None
        })

    return None


def get_job_data(url):

    print("\nFetching:", url)

    site = detect_site(url)

    print("Detected site:", site)

    selectors = get_selectors(site)

    try:

        html_content = _fetch_static_html(url)

        soup = None

        if html_content:
            soup = BeautifulSoup(html_content, "html.parser")

        if soup and not is_blocked(soup) and _content_is_sufficient(soup, selectors):

            result = _process_soup(soup, selectors, "static")

            if result:
                return result

        print("Static fetch insufficient, trying Playwright...")

        dynamic_html = _fetch_dynamic_html(url)

        if not dynamic_html:

            if soup:
                fallback = fallback_extraction(soup)

                if fallback:
                    return {
                        "description": fallback
                    }

            return {"error": "No data found"}

        dynamic_soup = BeautifulSoup(dynamic_html, "html.parser")

        if is_blocked(dynamic_soup):
            return {"error": "Blocked by website"}

        result = _process_soup(dynamic_soup, selectors, "dynamic")

        if result:
            return result

        fallback = fallback_extraction(dynamic_soup)

        if fallback:
            return {
                "description": fallback
            }

        return {"error": "No data found"}

    except Exception as e:

        return {
            "error": str(e)
        }


if __name__ == "__main__":

    url = input("Enter job URL: ").strip()

    data = get_job_data(url)

    print("\n================ STRUCTURED OUTPUT ================\n")

    print(json.dumps(data, indent=2))