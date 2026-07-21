import ActionPlan from "./ActionPlan";
import BeginnerMistakes from "./BeginnerMistakes";
import CareerOpportunities from "./CareerOpportunities";
import CareerSnapshot from "./CareerSnapshot";
import Certifications from "./Certifications";
import JobReadyTimeline from "./JobReadyTimeline";
import LearningRoadmap from "./LearningRoadmap";
import ProjectsSection from "./ProjectsSection";
import RecruiterInsights from "./RecruiterInsights";
import ResourcesSection from "./ResourcesSection";
import SkillsSection from "./SkillsSection";
import SummaryCards from "./SummaryCards";
import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Award,
  TriangleAlert,
  CalendarDays,
  Target,
  Map,
  Code2,
  FolderGit2,
  ChevronDown,
} from "lucide-react";

const sections = [
  { id: "Summary", label: "Summary", description: "Demand • Salary • Growth • Remote", icon: BarChart3 },
  { id: "Career Snapshot", label: "Career Snapshot", description: "Career overview in 4 points", icon: Map },
  { id: "Skills", label: "Skills", description: "Core skills, frameworks & tools", icon: Code2 },
  { id: "Learning Roadmap", label: "Learning Roadmap", description: "Step-by-step roadmap", icon: Map },
  { id: "Portfolio Projects", label: "Portfolio Projects", description: "Projects to showcase your skills", icon: FolderGit2 },
  { id: "Learning Resources", label: "Learning Resources", description: "YouTube, docs, books and platforms", icon: BookOpen },
  { id: "Recruiter Insights", label: "Recruiter Insights", description: "What recruiters look for", icon: Target },
  { id: "Career Opportunities", label: "Career Opportunities", description: "Roles, industries and pathways", icon: BriefcaseBusiness },
  { id: "Certifications", label: "Certifications", description: "Certs that add credibility", icon: Award },
  { id: "Beginner Mistakes", label: "Beginner Mistakes", description: "Common mistakes and solutions", icon: TriangleAlert },
  { id: "Job Ready Timeline", label: "Job Ready Timeline", description: "Timeline to become job-ready", icon: CalendarDays },
  { id: "90-Day Action Plan", label: "90-Day Action Plan", description: "Focused action plan", icon: CalendarDays },
];

export default function CareerDashboard({ careerData }) {
  const [activeSection, setActiveSection] = useState("Summary");

  return (
    <div className="max-w-6xl mx-auto mt-10">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-10 mb-8 shadow-xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="relative">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-sm font-medium mb-5">
            🚀 Career Explorer
          </span>
          <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium mb-5">
            ✨ AI Powered Career Report
          </span>
          <h1 className="text-5xl font-bold">
            {careerData?.career?.title}
          </h1>
          <p className="mt-4 text-slate-300 text-lg max-w-3xl leading-8">
            {careerData?.career?.tagline}
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <span className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30">
              📈 {careerData.summary.demand} Demand
            </span>
            <span className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30">
              🌍 {careerData.summary.remote} Remote
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30">
              🚀 {careerData.summary.growth} Growth
            </span>
            <span className="rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white shadow-lg">
              💰 Fresher: {careerData.summary.salary.fresher}
            </span>
          </div>
        </div>
      </div>

      {/* Accordion */}

      <div className="space-y-4">

        {sections.map((section) => {
          const isOpen = activeSection === section.id;

          return (
            <div
              key={section.id}
              className={`overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 ${isOpen ? "border-blue-300 bg-white shadow-xl" : "border-slate-200 bg-white/80 shadow-sm hover:shadow-lg"}`}
            >
              <button
                onClick={() => setActiveSection(section.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-6 py-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-300 active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 rounded-xl bg-slate-100 p-2 text-slate-700">
                    <section.icon size={18} />
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-semibold text-slate-800">
                      {section.label}
                    </span>
                    <span className="mt-1 text-sm text-slate-500">
                      {section.description}
                    </span>
                  </div>
                </div>

                <ChevronDown
                  size={22}
                  className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-slate-200/80 bg-white/90 p-7 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out">
                  {section.id === "Summary" ? (
                    <SummaryCards summary={careerData.summary} />
                  ) : section.id === "Career Snapshot" ? (
                    <CareerSnapshot snapshot={careerData.snapshot} />
                  ) : section.id === "Skills" ? (
                    <SkillsSection skills={careerData.skills} />
                  ) : section.id === "Learning Roadmap" ? (
                    <LearningRoadmap roadmap={careerData.learning_roadmap} />
                  ) : section.id === "Portfolio Projects" ? (
                    <ProjectsSection projects={careerData.projects} />
                  ) : section.id === "Learning Resources" ? ( 
                    <ResourcesSection resources={careerData.resources} />
                  ) : section.id === "Recruiter Insights" ? (
                    <RecruiterInsights recruiter={careerData.recruiter_insights} />
                  ) : section.id === "Career Opportunities" ? (
                    <CareerOpportunities opportunities={careerData.career_opportunities} />
                  ) : section.id === "Certifications" ? (
                    <Certifications certifications={careerData.certifications} />
                  ) : section.id === "Beginner Mistakes" ? (
                    <BeginnerMistakes mistakes={careerData.beginner_mistakes} />
                  ) : section.id === "Job Ready Timeline" ? (
                    <JobReadyTimeline timeline={careerData.job_ready_timeline} />
                  ) : section.id === "90-Day Action Plan" ? (
                    <ActionPlan plan={careerData.action_plan} />
                  ) : (
                    <p className="text-gray-500">
                      This section will be built next.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

      </div>

    </div>
  );
}