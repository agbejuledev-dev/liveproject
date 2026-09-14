"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Filter,
  Globe2,
  Lock,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Target,
  X,
  Zap,
} from "lucide-react";

type MatchReason =
  | "Strong skills match"
  | "Career-track match"
  | "Experience match"
  | "Location match"
  | "Project evidence";

type MatchedJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  type: "Full-time" | "Contract";
  category: string;
  level: "Junior" | "Mid-level" | "Senior";
  salary: string;
  score: number;
  posted: string;
  description: string;
  skills: string[];
  reasons: MatchReason[];
  recommended: boolean;
};

const matchedJobs: MatchedJob[] = [
  {
    id: 101,
    title: "Frontend Engineer",
    company: "TechScale UK",
    location: "London, UK",
    workplace: "Hybrid",
    type: "Full-time",
    category: "Technology",
    level: "Mid-level",
    salary: "£45,000 – £58,000",
    score: 96,
    posted: "2 days ago",
    description:
      "Build scalable customer-facing products alongside a multidisciplinary engineering team.",
    skills: ["React", "TypeScript", "Next.js", "REST APIs"],
    reasons: [
      "Strong skills match",
      "Career-track match",
      "Project evidence",
      "Location match",
    ],
    recommended: true,
  },
  {
    id: 102,
    title: "React Developer",
    company: "PixelFoundry",
    location: "Bristol, UK",
    workplace: "Remote",
    type: "Contract",
    category: "Technology",
    level: "Mid-level",
    salary: "£350 – £450/day",
    score: 94,
    posted: "3 days ago",
    description:
      "Work with a distributed product team building reusable React components and polished digital experiences.",
    skills: ["React", "TypeScript", "CSS", "Git"],
    reasons: [
      "Strong skills match",
      "Experience match",
      "Project evidence",
    ],
    recommended: true,
  },
  {
    id: 103,
    title: "Associate Product Manager",
    company: "BrightPath Systems",
    location: "Birmingham, UK",
    workplace: "Hybrid",
    type: "Full-time",
    category: "Product",
    level: "Junior",
    salary: "£34,000 – £42,000",
    score: 91,
    posted: "4 days ago",
    description:
      "Support product discovery, prioritisation and roadmap execution with a growing product team.",
    skills: ["Product", "Discovery", "Agile", "Roadmaps"],
    reasons: [
      "Career-track match",
      "Strong skills match",
      "Project evidence",
    ],
    recommended: true,
  },
  {
    id: 104,
    title: "Junior Business Analyst",
    company: "Northbridge Digital",
    location: "Manchester, UK",
    workplace: "Hybrid",
    type: "Full-time",
    category: "Business Analysis",
    level: "Junior",
    salary: "£30,000 – £36,000",
    score: 89,
    posted: "5 days ago",
    description:
      "Support stakeholder workshops, requirements analysis, process mapping and digital delivery.",
    skills: ["Requirements", "Stakeholders", "Agile", "Process Mapping"],
    reasons: [
      "Career-track match",
      "Strong skills match",
      "Experience match",
    ],
    recommended: false,
  },
  {
    id: 105,
    title: "QA Engineer",
    company: "CloudForge",
    location: "United Kingdom",
    workplace: "Remote",
    type: "Full-time",
    category: "Quality Assurance",
    level: "Mid-level",
    salary: "£40,000 – £52,000",
    score: 87,
    posted: "6 days ago",
    description:
      "Help engineering teams release reliable products through practical testing and quality processes.",
    skills: ["Testing", "Automation", "API Testing", "CI/CD"],
    reasons: [
      "Project evidence",
      "Experience match",
      "Location match",
    ],
    recommended: false,
  },
  {
    id: 106,
    title: "Product Analyst",
    company: "Greenline Technologies",
    location: "Cambridge, UK",
    workplace: "On-site",
    type: "Full-time",
    category: "Product",
    level: "Junior",
    salary: "£31,000 – £38,000",
    score: 84,
    posted: "1 week ago",
    description:
      "Support product decisions with customer research, product metrics and experimentation.",
    skills: ["Analytics", "Product", "Research", "SQL"],
    reasons: [
      "Career-track match",
      "Strong skills match",
    ],
    recommended: false,
  },
];

const categories = [
  "All",
  "Technology",
  "Product",
  "Business Analysis",
  "Quality Assurance",
];

const levels = ["All Levels", "Junior", "Mid-level", "Senior"];

function hasPremium() {
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

export default function AIJobMatchesPage() {
  const [premium, setPremium] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [sort, setSort] = useState<"match" | "recent">("match");
  const [selectedJob, setSelectedJob] = useState<MatchedJob | null>(null);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setPremium(hasPremium());

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
    const normalized = query.trim().toLowerCase();

    const filtered = matchedJobs.filter((job) => {
      const matchesQuery =
        !normalized ||
        job.title.toLowerCase().includes(normalized) ||
        job.company.toLowerCase().includes(normalized) ||
        job.category.toLowerCase().includes(normalized) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(normalized)
        );

      const matchesCategory =
        category === "All" || job.category === category;

      const matchesLevel =
        level === "All Levels" || job.level === level;

      return matchesQuery && matchesCategory && matchesLevel;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "match") return b.score - a.score;
      return a.id - b.id;
    });
  }, [query, category, level, sort]);

  function upgrade() {
    sessionStorage.setItem(
      "liveproject_after_upgrade",
      "/ai-job-matches"
    );
    window.location.href = "/premium";
  }

  function saveJob(jobId: number) {
    const next = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(next);
    sessionStorage.setItem("liveproject_saved_jobs", JSON.stringify(next));
  }

  function refreshMatches() {
    setRefreshing(true);

    window.setTimeout(() => {
      setRefreshing(false);
    }, 850);
  }

  if (!premium) {
    return (
      <main className="min-h-screen overflow-hidden bg-[#082c2b] text-white">
        <style jsx global>{`
          @keyframes aiGrid {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 48px 48px;
            }
          }

          @keyframes aiOrb {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
              opacity: 0.28;
            }
            50% {
              transform: translate3d(0, -18px, 0) scale(1.05);
              opacity: 0.65;
            }
          }

          @keyframes aiFloat {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }
            50% {
              transform: translate3d(0, -12px, 0);
            }
          }

          .ai-grid {
            background-image:
              linear-gradient(rgba(45, 212, 191, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(45, 212, 191, 0.07) 1px, transparent 1px);
            background-size: 48px 48px;
            animation: aiGrid 18s linear infinite;
          }
        `}</style>

        <header className="relative z-20 border-b border-white/10 bg-black/10">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <Link
                href="/workspace"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
              >
                <ArrowLeft size={18} />
              </Link>

              <div>
                <div className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                  AI Career Tools
                </div>
                <div className="text-lg font-black">AI Job Matches</div>
              </div>
            </div>
          </div>
        </header>

        <section className="relative min-h-[calc(100vh-73px)] overflow-hidden">
          <div className="ai-grid absolute inset-0 opacity-50" />

          <div
            className="absolute -right-20 top-12 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
            style={{ animation: "aiOrb 6s ease-in-out infinite" }}
          />

          <div
            className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
            style={{ animation: "aiOrb 8s ease-in-out infinite" }}
          />

          <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-20 lg:grid-cols-[1fr_0.9fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-teal-100 backdrop-blur">
                <Sparkles size={14} />
                AI CAREER INTELLIGENCE
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Stop searching.{" "}
                <span className="text-teal-300">
                  Start matching.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                LiveProject AI analyses your career track, skills, experience,
                projects and preferences to surface UK opportunities that fit
                you best.
              </p>

              <div className="mt-8">
                <button
                  onClick={upgrade}
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
                >
                  Unlock AI Job Matches
                  <Lock size={16} />
                </button>
              </div>

              <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: Target,
                    title: "Profile-aware",
                    text: "Uses your career evidence.",
                  },
                  {
                    icon: Zap,
                    title: "Smarter matching",
                    text: "Ranks relevant roles first.",
                  },
                  {
                    icon: Globe2,
                    title: "UK focused",
                    text: "Built around UK opportunities.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                    >
                      <Icon size={18} className="text-teal-300" />

                      <div className="mt-3 text-sm font-black">
                        {item.title}
                      </div>

                      <div className="mt-1 text-xs leading-5 text-slate-500">
                        {item.text}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden min-h-[500px] lg:block">
              <div
                className="absolute right-0 top-5 w-[470px] rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
                style={{ animation: "aiFloat 6s ease-in-out infinite" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      AI Match Engine
                    </div>
                    <div className="mt-1 text-2xl font-black">
                      94% match
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                    <Sparkles size={23} />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {matchedJobs.slice(0, 3).map((job, index) => (
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
                          {job.score}%
                        </span>
                      </div>

                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-teal-300"
                          style={{ width: `${job.score}%` }}
                        />
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                        <CheckCircle2 size={13} className="text-teal-300" />
                        {job.reasons[index] || "Strong profile match"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-teal-400 p-4 text-slate-950">
                  <div className="text-xs font-black uppercase tracking-wide">
                    Match explanation
                  </div>
                  <div className="mt-1 text-sm font-bold">
                    Ranked using skills, career track, experience and project
                    evidence.
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-400 text-slate-950 shadow-2xl shadow-teal-400/20">
                <BriefcaseBusiness size={31} />
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
        @keyframes matchGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes matchGlow {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.6;
          }
        }

        .match-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: matchGrid 18s linear infinite;
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
                AI Career Tools
              </p>
              <h1 className="text-lg font-black">AI Job Matches</h1>
            </div>
          </div>

          <button
            onClick={refreshMatches}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Analysing..." : "Refresh Matches"}
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-white">
        <div className="match-grid absolute inset-0 opacity-70" />

        <div
          className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-100 blur-3xl"
          style={{ animation: "matchGlow 6s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_370px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700">
                <Sparkles size={14} />
                PERSONALIZED BY LIVEPROJECT AI
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Jobs that make sense for you.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Your matches are ranked using the professional profile, skills,
                project evidence and preferences attached to your LiveProject
                account.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Frontend Development",
                  "React",
                  "Next.js",
                  "Project Evidence",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-black/6 bg-slate-950 p-5 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Match quality
                  </div>
                  <div className="mt-1 text-3xl font-black">High</div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Zap size={23} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[93%] rounded-full bg-teal-300" />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Profile strength</span>
                <span className="font-black text-teal-300">93%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_210px_210px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your AI matches..."
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
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSort("match")}
            className={`rounded-full px-4 py-2 text-xs font-black transition ${
              sort === "match"
                ? "bg-teal-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-black/6"
            }`}
          >
            Best Match
          </button>

          <button
            onClick={() => setSort("recent")}
            className={`rounded-full px-4 py-2 text-xs font-black transition ${
              sort === "recent"
                ? "bg-teal-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-black/6"
            }`}
          >
            Recent
          </button>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-6 px-5 pb-16 lg:grid-cols-[1fr_310px] lg:px-8">
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tight">
                {filteredJobs.length} AI matches
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Highest-fit opportunities appear first.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const saved = savedJobs.includes(job.id);

              return (
                <article
                  key={job.id}
                  className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <Building2 size={22} />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {job.recommended && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-teal-700">
                                <Sparkles size={11} />
                                Recommended
                              </span>
                            )}

                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
                              {job.level}
                            </span>
                          </div>

                          <h4 className="mt-2 text-lg font-black tracking-tight sm:text-xl">
                            {job.title}
                          </h4>

                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {job.company}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 rounded-2xl bg-teal-50 px-3 py-2 text-center">
                        <div className="text-xl font-black text-teal-700">
                          {job.score}%
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-wide text-teal-500">
                          Match
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <MapPin size={13} />
                          Location
                        </div>
                        <div className="mt-1 text-xs font-black text-slate-700">
                          {job.location}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <Globe2 size={13} />
                          Workplace
                        </div>
                        <div className="mt-1 text-xs font-black text-slate-700">
                          {job.workplace}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-2.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <Clock3 size={13} />
                          Salary
                        </div>
                        <div className="mt-1 text-xs font-black text-slate-700">
                          {job.salary}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
                      {job.description}
                    </p>

                    <div>
                      <div className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Why this matches
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {job.reasons.map((reason) => (
                          <span
                            key={reason}
                            className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[11px] font-bold text-teal-700"
                          >
                            <CheckCircle2 size={12} />
                            {reason}
                          </span>
                        ))}
                      </div>
                    </div>

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
                        AI confidence: {job.score >= 90 ? "Very high" : "High"}
                      </span>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => saveJob(job.id)}
                          className={`rounded-xl px-4 py-2.5 text-xs font-black transition ${
                            saved
                              ? "bg-teal-50 text-teal-700"
                              : "border border-black/8 text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {saved ? "Saved" : "Save Job"}
                        </button>

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
                          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
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
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Target size={20} />
            </div>

            <h3 className="mt-5 text-lg font-black">
              Improve your matches
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Stronger evidence gives the matching engine more useful signals.
            </p>

            <div className="mt-5 space-y-3">
              {[
                ["Complete your profile", "/profile"],
                ["Add portfolio evidence", "/portfolio"],
                ["Complete more projects", "/projects"],
                ["Strengthen your passport", "/experience-passport"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  {label}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
              <BriefcaseBusiness size={20} />
            </div>

            <h3 className="mt-5 text-lg font-black">
              Move from match to application.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Keep your strongest opportunities visible while you prepare your
              CV, evidence and applications.
            </p>

            <Link
              href="/application-tracker"
              className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-300"
            >
              Open Application Tracker
              <ArrowRight size={15} />
            </Link>
          </div>
        </aside>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/uk-job-board" className="hover:text-slate-900">
            UK Job Board
          </Link>
          <Link href="/saved-jobs" className="hover:text-slate-900">
            Saved Jobs
          </Link>
          <Link
            href="/application-tracker"
            className="hover:text-slate-900"
          >
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
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-700">
                    <Sparkles size={11} />
                    {selectedJob.score}% AI Match
                  </span>

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
                  <Globe2 size={16} className="text-teal-600" />
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
                  Why LiveProject AI matched this role
                </h4>

                <div className="mt-3 space-y-2">
                  {selectedJob.reasons.map((reason) => (
                    <div
                      key={reason}
                      className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2.5 text-xs font-bold text-teal-700"
                    >
                      <BadgeCheck size={15} />
                      {reason}
                    </div>
                  ))}
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