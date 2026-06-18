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
You are an expert career mentor.

Career:
{data.role}

Create a SHORT and PROFESSIONAL roadmap.

Use EXACTLY this format:

# Career Name

# Overview
Write 2-3 simple lines.

# Skills Required
Provide 5-10 important skills.

# Learning Path

Step 1 → Topic + Estimated Time

Step 2 → Topic + Estimated Time

Step 3 → Topic + Estimated Time

Step 4 → Topic + Estimated Time

Step 5 → Topic + Estimated Time

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

# Job Ready Timeline

Provide estimated months.

Rules:

- Keep response concise.
- Easy to read on mobile.
- Maximum 150 words.
- Use short bullet points.
- Do not write long paragraphs.
- Focus on action items only.
- No long explanations.
- No JSON.
- Return clean markdown.
"""

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