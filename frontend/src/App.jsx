import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [role, setRole] = useState("");
  const [roadmap, setRoadmap] = useState("");
  const [showFullRoadmap, setShowFullRoadmap] = useState(false);

  const [url, setUrl] = useState("");
  const [jobData, setJobData] = useState(null);
  const [jobRoadmap, setJobRoadmap] = useState("");
  const [showFullJobRoadmap, setShowFullJobRoadmap] = useState(false);

  const [careerLoading, setCareerLoading] = useState(false);
  const [jobLoading, setJobLoading] = useState(false);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const generateRoadmap = async () => {
    if (!role.trim()) return;

    setCareerLoading(true);
    setRoadmap("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/career-roadmap",
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

      setRoadmap(data.roadmap);
    } catch (error) {
      console.error(error);
    }

    setCareerLoading(false);
  };

  const extractJob = async () => {
    if (!url.trim()) return;

    setJobLoading(true);
    setJobData(null);
    setJobRoadmap("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/extract",
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
        "http://127.0.0.1:8000/job-roadmap",
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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-5xl mx-auto">

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
            placeholder="AI Engineer, UI UX Designer, CA, Digital Marketer..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none"
          />

          <button
            onClick={generateRoadmap}
            disabled={careerLoading}
            className="mt-4 bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            {careerLoading
              ? "Creating your personalized roadmap..."
              : "Generate Roadmap"}
          </button>

          {careerLoading && (
            <div className="mt-4 text-gray-600">
              🧠 Creating your personalized roadmap...
              <br />
              This may take a few seconds.
            </div>
          )}
        </div>

        {roadmap && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Career Roadmap
            </h2>

            <div className="leading-8 text-gray-700">

              {!showFullRoadmap ? (
                <>
                  <div className="max-h-96 overflow-hidden">
                    <ReactMarkdown>{roadmap}</ReactMarkdown>
                  </div>

                  <button
                    onClick={() => setShowFullRoadmap(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    Show Full Roadmap
                  </button>
                </>
              ) : (
                <>
                  <ReactMarkdown>{roadmap}</ReactMarkdown>

                  <button
                    onClick={() => setShowFullRoadmap(false)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white font-medium hover:bg-gray-50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    Hide Full Roadmap
                  </button>
                </>
              )}

            </div>
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
            className="mt-4 bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            {jobLoading
              ? "Analyzing job requirements..."
              : "Analyze Job"}
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
                className="bg-black text-white px-6 py-3 rounded-2xl font-medium hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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

      </div>
    </div>
  );
}