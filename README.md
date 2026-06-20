# 🚀 AI Career Explorer & Job Analyzer

An AI-powered platform that helps students and job seekers explore career paths, analyze real job postings, and generate personalized learning roadmaps.

Built using **React, FastAPI, Gemini AI, Playwright, and Tailwind CSS**.

---

## ✨ Features

### 🎯 Career Explorer

Explore any career and instantly get:

* Career Snapshot
* Demand & Growth Insights
* Salary Range (India)
* Required Skills
* Learning Roadmap
* Project Suggestions
* Career Opportunities
* Learning Resources
* Job Ready Timeline

Example careers:

* AI Engineer
* Software Development Engineer (SDE)
* Data Analyst
* Product Manager
* UI/UX Designer
* Digital Marketer

---

### 🔍 Job Analyzer

Analyze real job postings from popular job portals.

The system extracts:

* Job Title
* Required Skills
* Job Description

Supported platforms:

* LinkedIn
* Naukri
* Indeed
* Other supported job pages

---

### 📚 Personalized Learning Plan

Generate a custom learning roadmap directly from a job posting.

The platform identifies:

* Skills required for the role
* Learning sequence
* Project recommendations
* Resources to learn from
* Estimated preparation timeline

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Markdown

### Backend

* FastAPI
* Gemini AI (Google)
* Playwright
* Scrapling
* SlowAPI (Rate Limiting)

---

## 🔄 How It Works

### Career Explorer Flow

Career Input

↓

Gemini AI Analysis

↓

Personalized Career Report

↓

Learning Roadmap

---

### Job Analyzer Flow

Job URL

↓

Web Scraping (Playwright)

↓

Skill Extraction

↓

AI Analysis

↓

Personalized Learning Plan

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone <repository-url>
cd ai-career-explorer
```

### Backend Setup

```bash
python -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_API_KEY
```

Run backend:

```bash
uvicorn api:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 🔒 Security

* Environment variables protected using `.env`
* API keys excluded from Git tracking
* Rate limiting implemented
* Basic abuse protection enabled

---

## 🎯 Problem Being Solved

Many students struggle with:

* Understanding career paths
* Knowing what skills to learn
* Finding reliable learning resources
* Understanding real job requirements

This platform combines AI-powered career guidance with real job market analysis to provide actionable learning roadmaps.

---

## 📌 Future Improvements

* Career Match Score
* Saved Roadmaps
* User Accounts
* Resume Analysis
* Interview Preparation
* Skill Gap Tracking
* Multi-language Support

---

## 👨‍💻 Author

Aditya Kumar

Built as a practical AI-powered career guidance and job analysis platform to help students make informed career decisions.
