from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from google import genai
from dotenv import load_dotenv
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
import os

from test import get_job_data

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

app = FastAPI()

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class JobRequest(BaseModel):
    url: str


class CareerRequest(BaseModel):
    role: str


@app.get("/")
def home():
    return {
        "message": "AI Career Explorer API Running"
    }


@app.post("/extract")
@limiter.limit("10/minute")
def extract_job(request: Request, data: JobRequest):

    result = get_job_data(data.url)

    return result


@app.post("/career-roadmap")
@limiter.limit("10/minute")
def career_roadmap(request: Request, data: CareerRequest):

    prompt = f"""
You are an experienced Career Coach, Senior Hiring Manager, Technical Lead, Industry Mentor, Recruiter, and Learning Advisor with deep knowledge of today's global technology job market.

Your responsibility is NOT to generate a generic career roadmap.

Your responsibility is to generate a premium Career Intelligence Report that helps a beginner:

* Understand the career
* Decide whether the career is right for them
* Understand current industry expectations
* Learn the right skills in the correct order
* Build a strong portfolio
* Become job-ready

Career:
{data.role}

Before generating the report, think like an experienced hiring manager.

Base all recommendations on current industry hiring trends, commonly required skills in job descriptions, and practical industry expectations.

Prioritize practical skills over theoretical knowledge.

Return the report using EXACTLY the following structure.

# 🚀 Career Name

Write only the career name.

---

# 📌 Career Snapshot

Explain in 3-5 concise bullet points:

* What professionals in this role do.
* What business problems they solve.
* Where they typically work.
* Why companies hire them.
* Why this career is valuable today.

---

# 📈 Market Demand & Future

Create the following markdown table.

| Metric               | Status               |
| -------------------- | -------------------- |
| Demand               | Low / Medium / High  |
| Difficulty           | Easy / Medium / Hard |
| Future Growth        | Low / Medium / High  |
| Remote Opportunities | Low / Medium / High  |
| AI Impact            | Low / Medium / High  |

Below the table, explain every metric in one short sentence.

---

# 🌍 Industry Trends

Explain:

* Current industry trends.
* Emerging technologies.
* Future opportunities.
* How this career is evolving.

Keep it concise.

---

# 💰 Salary Range (India)

Create the following markdown table.

| Experience | Expected Salary |
| ---------- | --------------- |
| Fresher    | ₹X-Y LPA        |
| Mid-Level  | ₹X-Y LPA        |
| Senior     | ₹X+ LPA         |

Mention that salary depends on company, city, experience and skills.

---

# 🎯 Is This Career Right For You?

Mention:

### Best suited for people who:

* ...
* ...
* ...

### Not ideal for people who:

* ...
* ...
* ...

---

# 🛠 Skills Required

Group all skills into categories.

## Core Skills

Fundamental concepts.

## Programming Languages

Mention relevant languages.

## Frameworks & Libraries

Mention industry-standard frameworks.

## Tools & Platforms

Mention IDEs, Git, Docker, Cloud platforms, CI/CD tools and other commonly used tools.

## Soft Skills

Communication, teamwork, problem solving etc.

## Advanced Skills

Skills expected from experienced professionals.

---

# 🎯 Learning Order

Create a numbered list showing the ideal order for learning.

For every step explain WHY it comes before the next step.

---

# 🗺 Step-by-Step Learning Roadmap

Create a logical roadmap.

For every step include:

* What to learn
* Why it matters
* Estimated learning time

Use 6-8 steps.

---

# 🚀 Portfolio Projects

Organize projects into three levels.

## Beginner

Provide 2 beginner-friendly projects.

Explain each in one sentence.

## Intermediate

Provide 2 intermediate projects.

Explain each.

## Advanced

Provide 2 impressive portfolio projects that recruiters appreciate.

Explain each.

---

# 👨‍💼 Recruiter's Advice

Explain:

* What recruiters expect from freshers.
* What makes a candidate stand out.
* What should be included in a portfolio.
* What common resume mistakes should be avoided.

Keep it practical.

---

# 📚 Best Learning Resources

## YouTube Channels

Recommend the best channels and explain why.

## Official Documentation

Mention official documentation.

## Free Learning Platforms

Recommend trusted websites.

## GitHub Repositories

Mention useful open-source repositories if applicable.

## Communities

Mention useful communities such as Reddit, Discord, LinkedIn Groups or Stack Overflow.

---

# 🏆 Career Opportunities

Mention 8-10 related job roles.

---

# 📜 Certifications

Recommend certifications ONLY if they genuinely improve employability.

If certifications are unnecessary, clearly mention that practical projects are more valuable.

---

# ⚠ Common Beginner Mistakes

Mention the biggest mistakes beginners make.

Explain how to avoid each mistake.

---

# 📅 Job Ready Timeline

Assume the learner studies 2-3 hours daily.

Estimate:

* Internship Ready
* Freelance Ready
* Job Ready

---

# 🔄 Related Careers

Mention five closely related careers.

---

# 🚀 90-Day Action Plan

Create a practical 90-day action plan.

Month 1

* ...

Month 2

* ...

Month 3

* ...

Keep it realistic.

---

# 💡 Final Advice

Write a short mentor-style message.

Include:

* One productivity tip.
* One learning strategy.
* One portfolio advice.
* One interview advice.

End with an encouraging message.

---

# Rules

* Return clean Markdown only.
* Never return JSON.
* Use headings, bullet points and markdown tables.
* Keep the report visually well-structured.
* Make the report easy to scan on mobile.
* Use short paragraphs.
* Avoid unnecessary repetition.
* Use practical recommendations instead of generic advice.
* Recommend industry-standard technologies only.
* Salary estimates should be realistic for India.
* Base recommendations on current hiring trends.
* Portfolio projects should reflect real-world applications.
* Prioritize quality over quantity.
* Do not invent unrealistic technologies or certifications.
* Ensure consistency across all sections.
* The final report should feel like it was written by an experienced career consultant, hiring manager and mentor—not by an AI.
* The user should finish reading the report with a clear understanding of the career and a concrete action plan to become job-ready.

"""

    print("=" * 60)
    print("NEW PROMPT IS RUNNING")
    print(prompt[:1000])
    print("=" * 60)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "role": data.role,
        "roadmap": response.text
    }


@app.post("/job-roadmap")
@limiter.limit("10/minute")
def job_roadmap(request: Request, data: JobRequest):

    job = get_job_data(data.url)

    title = job.get("title", "")
    skills = job.get("skills", [])
    description = job.get("description", "")

    prompt = f"""
You are an expert career mentor.

Job Title:
{title}

Skills:
{skills}

Description:
{description}

Create a SHORT learning plan.

Use EXACTLY this format:

# Job Overview
2-3 lines.

# Required Skills
Bullet points.

# Learning Path

Step 1 → Topic

Step 2 → Topic

Step 3 → Topic

Step 4 → Topic

# Projects

Beginner:
- 2 projects

Intermediate:
- 2 projects

Advanced:
- 2 projects

# Best YouTube Channels

- Channel Name
- Channel Name
- Channel Name

# Preparation Timeline

Estimated months.

Rules:

- Maximum 150 words.
- Use short bullet points.
- No long paragraphs.
- Focus only on practical learning steps.
- No JSON.
- Return clean markdown.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "job_title": title,
        "skills": skills,
        "roadmap": response.text
    }