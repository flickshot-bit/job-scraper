import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import CareerDashboard from "./components/CareerDashboard";

const loadingMessages = [
  "🧠 Analyzing career...",
  "📊 Building roadmap...",
  "🎯 Matching skills...",
  "🚀 Preparing dashboard...",
];

export default function App() {
  const [role, setRole] = useState("");
  const [careerData, setCareerData] = useState(null);
  const [careerError, setCareerError] = useState("");
  const [careerApiError, setCareerApiError] = useState("");
  const [error, setError] = useState("");

  const [url, setUrl] = useState("");
  const [jobData, setJobData] = useState(null);
  const [jobRoadmap, setJobRoadmap] = useState("");
  const [showFullJobRoadmap, setShowFullJobRoadmap] = useState(false);

  const [careerLoading, setCareerLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!careerLoading) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 900);

    return () => clearInterval(interval);
  }, [careerLoading]);

  const generateRoadmap = async () => {
    if (!role.trim()) {
      setCareerError("Please enter a career name.");
      return;
    }

    setCareerError("");
    setCareerApiError("");
    setError("");
    setLoadingMessageIndex(0);
    setCareerLoading(true);
    setCareerData(null);

    try {
      const response = await fetch(
        "https://job-scraper-1ah4.onrender.com/career-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data = await response.json();

      setCareerData(data);
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't generate your career report right now. Please try again in a few moments."
      );
    }

    setCareerLoading(false);
    setLoadingMessageIndex(0);
  };

  const extractJob = async () => {
    if (!url.trim()) return;

    setJobLoading(true);
    setJobData(null);
    setJobRoadmap("");

    try {
      const response = await fetch(
        "https://job-scraper-1ah4.onrender.com/extract",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
          }),
        }
      );

      const data = await response.json();

      setJobData(data);
    } catch (error) {
      console.error(error);

      setJobData({
        error: `
Unable to analyze this job posting.

Possible reasons:
• Website blocked scraping
• Invalid URL
• Job posting removed
• Temporary network issue

Try another job URL.
`,
      });
    }

    setJobLoading(false);
  };

  const generateJobRoadmap = async () => {
    if (!url.trim()) return;

    setRoadmapLoading(true);

    try {
      const response = await fetch(
        "https://job-scraper-1ah4.onrender.com/job-roadmap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url,
          }),
        }
      );

      const data = await response.json();

      setJobRoadmap(data.roadmap);
    } catch (error) {
      console.error(error);
    }

    setRoadmapLoading(false);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            AI Career Explorer
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore any career path, analyze real job postings,
            and get a personalized learning roadmap.
          </p>

          <p className="text-gray-500 mt-3">
            No signup required. Start learning in minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">

          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Career Explorer
            </h3>

            <p className="text-gray-600">
              Get a personalized roadmap for any career path.
              Discover skills, projects, resources and a
              clear learning journey.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-6">
            <h3 className="text-xl font-semibold mb-3">
              Job Analyzer
            </h3>

            <p className="text-gray-600">
              Analyze real job postings, identify required
              skills and generate a tailored learning plan.
            </p>
          </div>

        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Career Explorer
          </h2>

          <input
            type="text"
            placeholder="Try 'AI Engineer', 'Frontend Developer', 'Product Manager'..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white/80 px-5 py-4 text-slate-800 shadow-sm backdrop-blur-xl outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />

          <button
            onClick={generateRoadmap}
            disabled={careerLoading}
            className="mt-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {careerLoading ? "Generating..." : "✨ Generate Career Report"}
          </button>

          {careerError && (
            <p className="mt-3 text-red-600 text-sm">
              {careerError}
            </p>
          )}

          {careerLoading && (
            <div className="mt-4 text-gray-600">
              <div className="font-medium">
                {loadingMessages[loadingMessageIndex]}
              </div>
              <div className="text-sm mt-1">
                This may take a few seconds.
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-700">
              ⚠️ Something went wrong
            </h2>
            <p className="mt-2 text-red-600">
              {error}
            </p>
            <button
              onClick={generateRoadmap}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {careerData ? (
          <CareerDashboard careerData={careerData} />
        ) : (
          !careerLoading && !error && (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white/90 p-10 text-center shadow-lg backdrop-blur-xl">
              <div className="text-5xl">🚀</div>
              <h2 className="mt-4 text-3xl font-bold">
                Ready to Explore Your Career?
              </h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-7">
                Generate a complete AI-powered career report with skills,
                projects, roadmap, certifications, recruiter insights,
                opportunities and a personalized 90-day action plan.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  "AI Engineer",
                  "Frontend Developer",
                  "Product Manager",
                  "Data Scientist",
                ].map((career) => (
                  <button
                    key={career}
                    onClick={() => setRole(career)}
                    className="rounded-full border border-slate-300 px-5 py-2 transition-all duration-300 hover:bg-slate-900 hover:text-white hover:shadow-md"
                  >
                    {career}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {careerApiError && (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="text-xl font-bold text-red-700">
              ⚠️ Something went wrong
            </h2>
            <p className="mt-3 text-red-600">
              {careerApiError}
            </p>
            <button
              onClick={generateRoadmap}
              className="mt-5 rounded-xl bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">
            Job Analyzer
          </h2>

          <input
            type="text"
            placeholder="Paste Job URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none"
          />

          <button
            onClick={extractJob}
            disabled={jobLoading}
            className="mt-4 bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-3 rounded-2xl font-medium hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
          >
            {jobLoading
              ? "Analyzing job requirements..."
              : "🔍 Analyze Job Description"}
          </button>

          {jobLoading && (
            <div className="mt-4 text-gray-600">
              🔍 Analyzing job requirements...
              <br />
              This may take a few seconds.
            </div>
          )}
        </div>

        {jobData?.error && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="font-semibold text-red-700 mb-2">
              Unable to Analyze Job
            </h3>

            <div className="text-red-600 whitespace-pre-line">
              {jobData.error}
            </div>
          </div>
        )}

        {jobData && !jobData.error && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6">
              Job Details
            </h2>

            <div className="space-y-5">

              <div>
                <p className="text-gray-500 mb-1">
                  Job Title
                </p>

                <p className="text-xl font-semibold">
                  {jobData.title || "Not Available"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">
                  Salary
                </p>

                <p>
                  {jobData.salary || "Not Available"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">
                  Location
                </p>

                <p>
                  {jobData.location || "Not Available"}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">
                  Skills
                </p>

                <div className="flex flex-wrap gap-2">
                  {jobData.skills?.length > 0 ? (
                    jobData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Skills not detected
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-2">
                  Description
                </p>

                <div className="bg-gray-50 rounded-2xl p-4 max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-7">
                  {jobData.description ||
                    "No description available"}
                </div>
              </div>

              <button
                onClick={generateJobRoadmap}
                disabled={roadmapLoading}
                className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-3 rounded-2xl font-medium hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                {roadmapLoading
                  ? "Generating Learning Plan..."
                  : "Generate Learning Plan"}
              </button>

              {roadmapLoading && (
                <div className="text-gray-600">
                  🧠 Generating Learning Plan...
                  <br />
                  This may take a few seconds.
                </div>
              )}
            </div>
          </div>
        )}

        {jobRoadmap && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Learning Plan
            </h2>

            <div className="leading-8 text-gray-700">

              {!showFullJobRoadmap ? (
                <>
                  <div className="max-h-96 overflow-hidden">
                    <ReactMarkdown>{jobRoadmap}</ReactMarkdown>
                  </div>

                  <button
                    onClick={() => setShowFullJobRoadmap(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    Show Full Learning Plan
                  </button>
                </>
              ) : (
                <>
                  <ReactMarkdown>{jobRoadmap}</ReactMarkdown>

                  <button
                    onClick={() => setShowFullJobRoadmap(false)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    Hide Full Learning Plan
                  </button>
                </>
              )}

            </div>
          </div>
        )}

        <footer className="mt-20 border-t border-slate-200 py-10 text-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Career Explorer Beta v1.0.0
          </h3>
          <p className="mt-2 text-slate-500">
            AI-Powered Career Intelligence Platform
          </p>
          <p className="mt-5 text-sm text-slate-400">
            Made by Aditya Kumar
          </p>
          <a
            href="mailto:adityak58551@gmail.com?subject=Career%20Explorer%20Beta%20Feedback&body=Hi%20Aditya,%0A%0AI%20tested%20Career%20Explorer%20and%20here%20is%20my%20feedback:%0A%0AWhat%20I%20liked:%0A-%20%0A%0AIssues%20I%20found:%0A-%20%0A%0ASuggestions:%0A-%20"
            className="mt-6 inline-flex items-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg"
          >
            Share Feedback
          </a>
        </footer>

      </div>
    </div>
  );
}