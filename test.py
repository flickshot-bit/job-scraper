from scrapling.fetchers import StealthyFetcher, DynamicFetcher
from urllib.parse import urlparse
import json
import re
import html

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


def extract_json_ld_data(page):

    scripts = page.css(
        'script[type="application/ld+json"]::text'
    ).getall()

    for script in scripts:

        try:
            data = json.loads(script)

            if isinstance(data, list):

                for item in data:

                    if item.get("@type") == "JobPosting":
                        return item

            elif isinstance(data, dict):

                if data.get("@type") == "JobPosting":
                    return data

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


def extract_title(page):

    try:
        title = page.css("h1::text").get()

        if title:
            return title.strip()

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


def extract_description(page, selectors):

    for sel in selectors:

        elements = page.css(sel)

        if elements:

            text_list = elements.css("::text").getall()

            clean_text = [
                t.strip()
                for t in text_list
                if t.strip()
            ]

            if clean_text:
                return "\n".join(clean_text)

    return None


def fallback_extraction(page):

    try:

        texts = page.css("body ::text").getall()

        clean_text = [
            t.strip()
            for t in texts
            if t.strip()
        ]

        return "\n".join(clean_text[:2000])

    except Exception:
        return None


def is_blocked(page):

    try:

        content = page.text.lower()

        blocked_keywords = [
            "captcha",
            "cloudflare",
            "challenge-platform",
            "captcha-delivery",
            "access denied",
            "verify you are human"
        ]

        return any(
            keyword in content
            for keyword in blocked_keywords
        )

    except Exception:
        return False


def get_job_data(url):

    print("\nFetching:", url)

    site = detect_site(url)

    print("Detected site:", site)

    selectors = get_selectors(site)

    try:

        page = StealthyFetcher.fetch(
            url,
            headless=True
        )

        if is_blocked(page):
            return {"error": "Blocked by website"}

        job_json = extract_json_ld_data(page)

        structured = extract_structured_data(job_json)

        if structured:

            if not structured.get("title"):
                structured["title"] = extract_title(page)

            structured = normalize_output(structured)

            print("Extracted structured JSON data")

            return structured

        desc = extract_description(page, selectors)

        if desc:

            return normalize_output({
                "title": extract_title(page),
                "description": desc,
                "skills": None,
                "salary": None,
                "location": None
            })

        print("Trying dynamic fetch...")

        page = DynamicFetcher.fetch(
            url,
            headless=True
        )

        if is_blocked(page):
            return {"error": "Blocked by website"}

        job_json = extract_json_ld_data(page)

        structured = extract_structured_data(job_json)

        if structured:

            if not structured.get("title"):
                structured["title"] = extract_title(page)

            structured = normalize_output(structured)

            print("Extracted structured JSON data (dynamic)")

            return structured

        desc = extract_description(page, selectors)

        if desc:

            return normalize_output({
                "title": extract_title(page),
                "description": desc,
                "skills": None,
                "salary": None,
                "location": None
            })

        fallback = fallback_extraction(page)

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