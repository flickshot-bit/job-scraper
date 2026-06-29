import json

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

JSON_SCHEMA = '''{  "career": {    "title": "",    "tagline": ""  },  "summary": {    "demand": "",    "difficulty": "",    "growth": "",    "remote": "",    "salary": {      "fresher": "",      "mid": "",      "senior": ""    }  },  "snapshot": [    "",    "",    "",    ""  ],  "skills": {    "core": [],    "languages": [],    "frameworks": [],    "tools": [],    "soft": [],    "advanced": []  },  "learning_roadmap": [    {      "step": 1,      "title": "",      "description": "",      "duration": ""    }  ],  "projects": {    "beginner": [      {        "title": "",        "description": "",        "skills": []      }    ],    "intermediate": [      {        "title": "",        "description": "",        "skills": []      }    ],    "advanced": [      {        "title": "",        "description": "",        "skills": []      }    ]  },  "resources": {    "youtube": [      {        "name": "",        "reason": ""      }    ],    "documentation": [      {        "name": "",        "url": ""      }    ],    "platforms": [      {        "name": "",        "reason": ""      }    ],    "books": [      {        "name": "",        "reason": ""      }    ]  },  "recruiter_insights": {    "what_recruiters_look_for": [],    "portfolio_tips": [],    "resume_tips": [],    "interview_tips": []  },  "career_opportunities": {    "job_roles": [],    "industries": []  },  "certifications": [    {      "name": "",      "provider": "",      "level": "",      "recommended": true,      "reason": ""    }  ],  "beginner_mistakes": [    {      "mistake": "",      "impact": "",      "solution": ""    }  ],  "job_ready_timeline": {    "internship_ready": {      "duration": "",      "requirements": []    },    "freelance_ready": {      "duration": "",      "requirements": []    },    "job_ready": {      "duration": "",      "requirements": []    }  },  "action_plan": {    "month1": {      "title": "",      "goals": []    },    "month2": {      "title": "",      "goals": []    },    "month3": {      "title": "",      "goals": []    }  }}'''

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

    prompt = """You are an expert Career Coach.Career:""" + data.role + """Return ONLY valid JSON.Do not return markdown.Do not return explanations.Do not wrap the response inside ```json```.Return exactly in this format:""" + JSON_SCHEMA + """Rules:- title should be the career name.- tagline should be one short sentence.- Demand must be Low, Medium or High.- Difficulty must be Easy, Medium or Hard.- Growth must be Low, Medium or High.- Remote must be Low, Medium or High.- Salary should be realistic for India.- snapshot must contain exactly FOUR concise bullet points.The snapshot should explain:1. What professionals do.2. Where they work.3. Why companies hire them.4. Why this career is valuable today.- skills.core should contain 5–8 fundamental concepts.- skills.languages should contain the primary programming languages.- skills.frameworks should contain the most commonly used frameworks and libraries.- skills.tools should contain important development tools, cloud platforms and version control systems.- skills.soft should contain 4–6 important soft skills.- skills.advanced should contain advanced topics required for experienced professionals.- learning_roadmap must contain exactly 6 learning steps.Each step must include:- step- title- description- durationRequirements:- Follow the correct beginner-to-job-ready learning order.- Each title should be short.- Description should be one concise sentence.- Duration should be realistic.- Do not skip important fundamentals.- Generate exactly 2 beginner projects.- Generate exactly 2 intermediate projects.- Generate exactly 2 advanced projects.Each project must include:- title- description- skillsDescription should be concise (maximum 1 sentence).skills should be an array.Projects should be realistic and portfolio-worthy.Prefer projects that recruiters actually appreciate over tutorial projects.Include a mix of web applications, real-world systems, AI applications, automation, APIs, dashboards or full-stack projects depending on the career.- Recommend exactly 3 YouTube channels.- Recommend exactly 3 official documentation websites.- Recommend exactly 3 learning platforms.- Recommend exactly 2 books.YouTube:- name- reasonDocumentation:- name- urlPlatforms:- name- reasonBooks:- name- reasonRecommend only trusted and industry-standard resources.Do not recommend outdated resources.- recruiter_insights must contain exactly four sections.what_recruiters_look_for- Exactly 5 concise bullet points.portfolio_tips- Exactly 5 concise bullet points.resume_tips- Exactly 5 concise bullet points.interview_tips- Exactly 5 concise bullet points.Recommendations should reflect real hiring practices used by top technology companies.Avoid generic advice.Focus on practical and actionable guidance for freshers.- career_opportunities must contain exactly two sections.job_roles- Generate exactly 10 job roles.industries- Generate exactly 8 industries.Job roles should be realistic, modern and currently in demand.Industries should represent where professionals in this career commonly work.Return arrays only.Do not include descriptions.- Recommend between 0 and 5 certifications.If certifications are NOT important for this career,return an empty array.Each certification must contain:- name- provider- level- recommended- reasonlevel should be one of:- Beginner- Intermediate- Advancedrecommended should be:true or falseOnly recommend certifications that are respected in the industry.Do not recommend certifications simply to fill the list.- Generate exactly 6 beginner mistakes.Each mistake must contain:- mistake- impact- solutionRequirements:- Mistakes should be realistic and commonly seen among beginners.- Impact should explain why it is harmful.- Solution should provide practical advice.- Keep each field concise.- Focus on actionable guidance rather than generic tips.- job_ready_timeline must contain three milestones.1. internship_ready2. freelance_ready3. job_readyEach milestone must contain:- duration- requirementsRequirements should contain 4-6 concise bullet points.Assume the learner studies 2–3 hours daily.The timeline should be realistic based on current industry expectations.- action_plan must contain exactly three months.Month 1Month 2Month 3Each month must contain:- title- goalsRequirements:- goals should contain exactly 5 actionable tasks.- Tasks should follow the correct learning order.- Keep every task concise.- Assume the learner studies 2–3 hours daily.- The action plan should be practical and achievable.Return ONLY JSON."""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    parsed = json.loads(response.text)
    return parsed

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