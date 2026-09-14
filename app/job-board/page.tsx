"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Filter,
  Globe2,
  Lock,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract";
  workplace: "Remote" | "Hybrid" | "On-site";
  category: string;
  level: "Junior" | "Mid-level" | "Senior";
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  featured?: boolean;
};

const jobs: Job[] = [
  {
    id: 1,
    title: "Frontend Engineer",
    company: "TechScale UK",
    location: "London, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "Technology",
    level: "Mid-level",
    salary: "£45,000 – £58,000",
    posted: "2 days ago",
    description:
      "Join a product engineering team building accessible, scalable web experiences used by customers across the UK.",
    skills: ["React", "TypeScript", "Next.js", "REST APIs"],
    featured: true,
  },
  {
    id: 2,
    title: "Junior Business Analyst",
    company: "Northbridge Digital",
    location: "Manchester, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "Business Analysis",
    level: "Junior",
    salary: "£30,000 – £36,000",
    posted: "3 days ago",
    description:
      "Support discovery, requirements gathering, process analysis, stakeholder workshops, and delivery teams.",
    skills: ["Requirements", "Stakeholders", "Process Mapping", "Agile"],
    featured: true,
  },
  {
    id: 3,
    title: "Product Owner",
    company: "BrightPath Systems",
    location: "Birmingham, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "Product",
    level: "Senior",
    salary: "£58,000 – £72,000",
    posted: "4 days ago",
    description:
      "Own product direction, prioritisation, discovery and delivery across a growing digital platform.",
    skills: ["Product Strategy", "Roadmaps", "Scrum", "Discovery"],
  },
  {
    id: 4,
    title: "QA Engineer",
    company: "CloudForge",
    location: "United Kingdom",
    type: "Full-time",
    workplace: "Remote",
    category: "Quality Assurance",
    level: "Mid-level",
    salary: "£40,000 – £52,000",
    posted: "5 days ago",
    description:
      "Help engineering teams ship reliable software through automated and exploratory testing.",
    skills: ["Testing", "Automation", "CI/CD", "API Testing"],
    featured: true,
  },
  {
    id: 5,
    title: "Associate Project Manager",
    company: "Westminster Digital",
    location: "London, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "Project Management",
    level: "Junior",
    salary: "£32,000 – £40,000",
    posted: "6 days ago",
    description:
      "Coordinate projects, stakeholders, risks, timelines, actions and delivery reporting.",
    skills: ["Project Management", "Agile", "Reporting", "Stakeholders"],
  },
  {
    id: 6,
    title: "UX Designer",
    company: "Northstar Labs",
    location: "Leeds, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "UX Design",
    level: "Mid-level",
    salary: "£38,000 – £50,000",
    posted: "1 week ago",
    description:
      "Design intuitive digital products through research, journeys, wireframes, prototyping and usability testing.",
    skills: ["Figma", "UX Research", "Wireframing", "Prototyping"],
  },
  {
    id: 7,
    title: "Data Analyst",
    company: "Axiom Insights",
    location: "Edinburgh, UK",
    type: "Full-time",
    workplace: "Remote",
    category: "Data",
    level: "Mid-level",
    salary: "£42,000 – £55,000",
    posted: "1 week ago",
    description:
      "Turn operational data into meaningful insights that support strategic and commercial decisions.",
    skills: ["SQL", "Excel", "Power BI", "Data Analysis"],
  },
  {
    id: 8,
    title: "Senior Scrum Master",
    company: "Orbit Financial",
    location: "London, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "Project Management",
    level: "Senior",
    salary: "£65,000 – £78,000",
    posted: "1 week ago",
    description:
      "Lead Agile transformation and enable high-performing product delivery teams across a financial services environment.",
    skills: ["Scrum", "Agile Coaching", "Leadership", "Delivery"],
  },
  {
    id: 9,
    title: "React Developer",
    company: "PixelFoundry",
    location: "Bristol, UK",
    type: "Contract",
    workplace: "Remote",
    category: "Technology",
    level: "Mid-level",
    salary: "£350 – £450/day",
    posted: "8 days ago",
    description:
      "Work with a distributed product team to deliver polished React interfaces and reusable components.",
    skills: ["React", "TypeScript", "CSS", "Git"],
  },
  {
    id: 10,
    title: "Delivery Manager",
    company: "Crown Digital",
    location: "Manchester, UK",
    type: "Full-time",
    workplace: "Hybrid",
    category: "Project Management",
    level: "Senior",
    salary: "£60,000 – £74,000",
    posted: "9 days ago",
    description:
      "Drive successful digital delivery while managing dependencies, risks, governance and senior stakeholders.",
    skills: ["Delivery", "Governance", "Risk", "Leadership"],
  },
  {
    id: 11,
    title: "Product Analyst",
    company: "Greenline Technologies",
    location: "Cambridge, UK",
    type: "Full-time",
    workplace: "On-site",
    category: "Product",
    level: "Junior",
    salary: "£31,000 – £38,000",
    posted: "10 days ago",
    description:
      "Support product teams with customer research, metrics, experimentation and product insight.",
    skills: ["Analytics", "Product", "Research", "SQL"],
  },
  {
    id: 12,
    title: "Frontend Developer",
    company: "Harbour Digital",
    location: "United Kingdom",
    type: "Full-time",
    workplace: "Remote",
    category: "Technology",
    level: "Junior",
    salary: "£34,000 – £42,000",
    posted: "11 days ago",
    description:
      "Build responsive customer-facing products alongside experienced designers and engineers.",
    skills: ["JavaScript", "React", "HTML", "CSS"],
  },
];

const categories = [
  "All",
  "Technology",
  "Project Management",
  "Product",
  "Business Analysis",
  "Quality Assurance",
  "UX Design",
  "Data",
];

const levels = ["All Levels", "Junior", "Mid-level", "Senior"];
const workplaceOptions = ["All", "Remote", "Hybrid", "On-site"];

function isPremiumUser() {
  if (typeof window === "undefined") return false;

  try {
    const session = JSON.parse(
      sessionStorage.getItem("liveproject_session") || "null"
    );

    return session?.loggedIn === true && session?.plan === "premium";
  } catch {
    return false;
  }
}

export default function UKJobBoardPage() {
  const [premium, setPremium] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [workplace, setWorkplace] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  useEffect(() => {
    setPremium(isPremiumUser());

    const saved = sessionStorage.getItem("liveproject_saved_jobs");

    if (saved) {
      try {
        setSavedJobs(JSON.parse(saved));
      } catch {
        sessionStorage.removeItem("liveproject_saved_jobs");
      }
    }
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesQuery =
        !normalizedQuery ||
        job.title.toLowerCase().includes(normalizedQuery) ||
        job.company.toLowerCase().includes(normalizedQuery) ||
        job.location.toLowerCase().includes(normalizedQuery) ||
        job.category.toLowerCase().includes(normalizedQuery) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(normalizedQuery)
        );

      const matchesCategory =
        category === "All" || job.category === category;

      const matchesLevel =
        level === "All Levels" || job.level === level;

      const matchesWorkplace =
        workplace === "All" || job.workplace === workplace;

      return (
        matchesQuery &&
        matchesCategory &&
        matchesLevel &&
        matchesWorkplace
      );
    });
  }, [query, category, level, workplace]);

  function saveJob(jobId: number) {
    const next = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(next);
    sessionStorage.setItem("liveproject_saved_jobs", JSON.stringify(next));
  }

  function requirePremium(destination = "/uk-job-board") {
    sessionStorage.setItem(
      "liveproject_after_upgrade",
      destination
    );

    window.location.href = "/premium";
  }

  if (!premium) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f5f8f8] text-[#10201f]">
        <style jsx global>{`
          @keyframes jobGrid {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 48px 48px;
            }
          }

          @keyframes jobFloat {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            50% {
              transform: translate3d(0, -10px, 0);
            }
          }

          @keyframes jobGlow {
            0%,
            100% {
              opacity: 0.25;
            }
            50% {
              opacity: 0.7;
            }
          }

          .job-grid {
            background-image:
              linear-gradient(rgba(13, 148, 136, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(13, 148, 136, 0.07) 1px, transparent 1px);
            background-size: 48px 48px;
            animation: jobGrid 18s linear infinite;
          }
        `}</style>

        <header className="relative z-20 border-b border-white/10 bg-[#082c2b]">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
            <div className="flex items-center gap-3 text-white">
              <Link
                href="/workspace"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
              </Link>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                  Opportunities
                </div>
                <div className="text-lg font-black">UK Job Board</div>
              </div>
            </div>
          </div>
        </header>

        <section className="relative flex min-h-[calc(100vh-73px)] items-center overflow-hidden bg-[#082c2b] text-white">
          <div className="job-grid absolute inset-0 opacity-40" />

          <div
            className="absolute right-[-80px] top-20 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
            style={{ animation: "jobGlow 5s ease-in-out infinite" }}
          />

          <div
            className="absolute bottom-[-100px] left-[-80px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
            style={{ animation: "jobGlow 7s ease-in-out infinite" }}
          />

          <div className="relative mx-auto grid w-full max-w-[1500px] gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-teal-100 backdrop-blur">
                <Sparkles size={14} />
                PREMIUM OPPORTUNITIES
              </div>

              <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Find your next{" "}
                <span className="text-teal-300">UK opportunity.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Discover UK-focused roles matched to your skills, experience,
                career track and verified LiveProject profile.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => requirePremium("/uk-job-board")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
                >
                  Unlock UK Job Board
                  <Lock size={16} />
                </button>

                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
                >
                  View Premium
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                {[
                  ["UK", "Focused"],
                  ["Remote", "Friendly"],
                  ["Premium", "Career tools"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="text-lg font-black text-white">
                      {value}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden min-h-[470px] lg:block">
              <div
                className="absolute right-0 top-8 w-[470px] rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
                style={{ animation: "jobFloat 6s ease-in-out infinite" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                      UK Opportunities
                    </div>
                    <div className="mt-1 text-2xl font-black">
                      Curated for you
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                    <BriefcaseBusiness size={23} />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {jobs.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-white/8 bg-black/20 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-black">
                            {job.title}
                          </div>
                          <div className="mt-1 text-xs text-slate-500">
                            {job.company}
                          </div>
                        </div>

                        <span className="rounded-full bg-teal-400/10 px-2.5 py-1 text-[10px] font-black text-teal-300">
                          {job.workplace}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.salary}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-teal-400 p-4 text-slate-950">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide">
                    <Sparkles size={14} />
                    Premium advantage
                  </div>
                  <div className="mt-1 text-sm font-bold">
                    Job matching, saved jobs and application tracking.
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-teal-400 text-slate-950 shadow-2xl shadow-teal-400/20">
                <Globe2 size={32} />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes boardGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes boardGlow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.65;
          }
        }

        .board-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: boardGrid 18s linear infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-slate-700 transition hover:-translate-x-0.5 hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                Opportunities
              </p>
              <h1 className="text-lg font-black tracking-tight">
                UK Job Board
              </h1>
            </div>
          </div>

          <Link
            href="/premium"
            className="hidden items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2.5 text-xs font-black text-teal-700 sm:inline-flex"
          >
            <Sparkles size={15} />
            Premium Active
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-white">
        <div className="board-grid absolute inset-0 opacity-70" />

        <div
          className="absolute -right-24 top-4 h-80 w-80 rounded-full bg-teal-100 blur-3xl"
          style={{ animation: "boardGlow 6s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700">
              <Globe2 size={14} />
              UK FOCUSED
            </div>

            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Opportunities worth exploring.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
              Search UK-focused roles and discover opportunities that align
              with your professional profile.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_210px_210px_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search jobs, companies, skills..."
              className="w-full rounded-2xl border border-black/8 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
          >
            {levels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={() => setShowFilters((value) => !value)}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 text-sm font-black transition ${
              showFilters
                ? "border-teal-200 bg-teal-50 text-teal-700"
                : "border-black/8 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 rounded-[1.5rem] border border-black/6 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Workplace
              </span>

              {workplaceOptions.map((item) => (
                <button
                  key={item}
                  onClick={() => setWorkplace(item)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    workplace === item
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-6 px-5 pb-16 lg:grid-cols-[1fr_300px] lg:px-8">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight">
                {filteredJobs.length} opportunities
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Showing UK-focused roles matching your search.
              </p>
            </div>

            <Link
              href="/ai-job-matches"
              onClick={() => {
                sessionStorage.setItem(
                  "liveproject_after_upgrade",
                  "/ai-job-matches"
                );
              }}
              className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800 sm:inline-flex"
            >
              <Sparkles size={14} />
              AI Job Matches
            </Link>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-16 text-center">
              <BriefcaseBusiness
                className="mx-auto text-slate-300"
                size={42}
              />
              <h4 className="mt-4 text-xl font-black">
                No matching opportunities
              </h4>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try a broader search or change your filters.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => {
                const saved = savedJobs.includes(job.id);

                return (
                  <article
                    key={job.id}
                    className="group rounded-[1.7rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <Building2 size={22} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {job.featured && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-700">
                                  <Star size={11} />
                                  Featured
                                </span>
                              )}

                              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-teal-700">
                                {job.level}
                              </span>
                            </div>

                            <h4 className="mt-2 truncate text-lg font-black tracking-tight sm:text-xl">
                              {job.title}
                            </h4>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {job.company}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => saveJob(job.id)}
                          className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition ${
                            saved
                              ? "bg-teal-50 text-teal-700"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {saved ? "Saved" : "Save"}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={14} />
                          {job.location}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Globe2 size={14} />
                          {job.workplace}
                        </span>

                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={14} />
                          {job.type}
                        </span>

                        <span>{job.salary}</span>

                        <span>Posted {job.posted}</span>
                      </div>

                      <p className="max-w-4xl text-sm leading-6 text-slate-600">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-col gap-2 border-t border-black/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-xs font-semibold text-slate-400">
                          Matched to your LiveProject profile
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="rounded-xl border border-black/8 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() =>
                              window.open(
                                `https://www.indeed.com/jobs?q=${encodeURIComponent(
                                  job.title
                                )}&l=${encodeURIComponent(job.location)}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
                          >
                            Find Role
                            <ExternalLink size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.7rem] border border-black/6 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Sparkles size={20} />
            </div>

            <h3 className="mt-5 text-lg font-black">
              Make your search smarter.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your Premium career tools are designed to help you move from
              discovery to application with less guesswork.
            </p>

            <div className="mt-5 space-y-3">
              {[
                "AI Job Matches",
                "Saved Jobs",
                "Application Tracker",
                "Job Readiness",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600"
                >
                  <CheckCircle2 size={14} className="text-teal-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-300">
              Career profile
            </p>

            <h3 className="mt-3 text-xl font-black">
              Strengthen your evidence before applying.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Employers can see stronger evidence when your LiveProject profile
              is backed by practical projects, portfolio work and verified
              experience.
            </p>

            <Link
              href="/experience-passport"
              className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-300"
            >
              View Experience Passport
              <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/workspace" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/ai-job-matches" className="hover:text-slate-900">
            AI Job Matches
          </Link>
          <Link href="/application-tracker" className="hover:text-slate-900">
            Application Tracker
          </Link>
        </div>
      </footer>

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="border-b border-black/5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.featured && (
                      <span className="rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-amber-700">
                        Featured
                      </span>
                    )}

                    <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-700">
                      {selectedJob.level}
                    </span>
                  </div>

                  <h3 className="mt-3 text-2xl font-black tracking-tight">
                    {selectedJob.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {selectedJob.company}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <MapPin size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedJob.location}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Location
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <BriefcaseBusiness size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedJob.workplace}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Workplace
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Clock3 size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedJob.type}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Employment
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Star
                    size={16}
                    className="fill-amber-400 text-amber-400"
                  />
                  <div className="mt-2 text-sm font-black">
                    {selectedJob.salary}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Salary / rate
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Opportunity
                </h4>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {selectedJob.description}
                </p>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Skills
                </h4>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end">
              <button
                onClick={() => saveJob(selectedJob.id)}
                className={`rounded-xl px-4 py-3 text-sm font-bold ${
                  savedJobs.includes(selectedJob.id)
                    ? "bg-teal-50 text-teal-700"
                    : "border border-black/8 text-slate-700"
                }`}
              >
                {savedJobs.includes(selectedJob.id)
                  ? "Saved"
                  : "Save Job"}
              </button>

              <button
                onClick={() =>
                  window.open(
                    `https://www.indeed.com/jobs?q=${encodeURIComponent(
                      selectedJob.title
                    )}&l=${encodeURIComponent(selectedJob.location)}`,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
              >
                Find Role
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}