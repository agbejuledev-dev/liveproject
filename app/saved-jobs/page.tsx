"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  MapPin,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";

type SavedJob = {
  id: number;
  title: string;
  company: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  type: "Full-time" | "Contract";
  category: string;
  level: "Junior" | "Mid-level" | "Senior";
  salary: string;
  posted: string;
  description: string;
  skills: string[];
  matchScore?: number;
};

const jobLibrary: SavedJob[] = [
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
    posted: "2 days ago",
    description:
      "Build scalable customer-facing products alongside a multidisciplinary engineering team.",
    skills: ["React", "TypeScript", "Next.js", "REST APIs"],
    matchScore: 96,
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
    posted: "3 days ago",
    description:
      "Work with a distributed product team building reusable React components and polished digital experiences.",
    skills: ["React", "TypeScript", "CSS", "Git"],
    matchScore: 94,
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
    posted: "4 days ago",
    description:
      "Support product discovery, prioritisation and roadmap execution with a growing product team.",
    skills: ["Product", "Discovery", "Agile", "Roadmaps"],
    matchScore: 91,
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
    posted: "5 days ago",
    description:
      "Support stakeholder workshops, requirements analysis, process mapping and digital delivery.",
    skills: ["Requirements", "Stakeholders", "Agile", "Process Mapping"],
    matchScore: 89,
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
    posted: "6 days ago",
    description:
      "Help engineering teams release reliable products through practical testing and quality processes.",
    skills: ["Testing", "Automation", "API Testing", "CI/CD"],
    matchScore: 87,
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
    posted: "1 week ago",
    description:
      "Support product decisions with customer research, product metrics and experimentation.",
    skills: ["Analytics", "Product", "Research", "SQL"],
    matchScore: 84,
  },
  {
    id: 6,
    title: "UX Designer",
    company: "Northstar Labs",
    location: "Leeds, UK",
    workplace: "Hybrid",
    type: "Full-time",
    category: "UX Design",
    level: "Mid-level",
    salary: "£38,000 – £50,000",
    posted: "1 week ago",
    description:
      "Design intuitive digital products through research, journeys, wireframes, prototyping and usability testing.",
    skills: ["Figma", "UX Research", "Wireframing", "Prototyping"],
    matchScore: 81,
  },
];

const SAVED_KEY = "liveproject_saved_jobs";

export default function SavedJobsPage() {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [query, setQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(SAVED_KEY);

    if (!raw) {
      setSavedIds([101, 102, 104]);
      sessionStorage.setItem(
        SAVED_KEY,
        JSON.stringify([101, 102, 104])
      );
      return;
    }

    try {
      setSavedIds(JSON.parse(raw));
    } catch {
      sessionStorage.removeItem(SAVED_KEY);
      setSavedIds([]);
    }
  }, []);

  const savedJobs = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return jobLibrary
      .filter((job) => savedIds.includes(job.id))
      .filter((job) => {
        if (!normalized) return true;

        return (
          job.title.toLowerCase().includes(normalized) ||
          job.company.toLowerCase().includes(normalized) ||
          job.location.toLowerCase().includes(normalized) ||
          job.category.toLowerCase().includes(normalized) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(normalized)
          )
        );
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [savedIds, query]);

  function removeJob(id: number) {
    const next = savedIds.filter((jobId) => jobId !== id);

    setSavedIds(next);
    sessionStorage.setItem(SAVED_KEY, JSON.stringify(next));

    if (selectedJob?.id === id) {
      setSelectedJob(null);
    }
  }

  function saveAgain(id: number) {
    if (savedIds.includes(id)) return;

    const next = [...savedIds, id];
    setSavedIds(next);
    sessionStorage.setItem(SAVED_KEY, JSON.stringify(next));
  }

  function clearAll() {
    setSavedIds([]);
    sessionStorage.setItem(SAVED_KEY, JSON.stringify([]));
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes savedGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes savedGlow {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.6;
          }
        }

        .saved-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: savedGrid 18s linear infinite;
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
              <h1 className="text-lg font-black">Saved Jobs</h1>
            </div>
          </div>

          <Link
            href="/uk-job-board"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            <BriefcaseBusiness size={14} />
            Browse Jobs
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-white">
        <div className="saved-grid absolute inset-0 opacity-70" />

        <div
          className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-100 blur-3xl"
          style={{ animation: "savedGlow 6s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700">
                <BookmarkCheck size={14} />
                YOUR OPPORTUNITIES
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Keep the roles worth coming back to.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Save strong opportunities while you prepare your evidence,
                CV and applications. Your shortlist stays connected to your
                career workflow.
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-black/6 bg-slate-950 p-5 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Saved opportunities
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {savedIds.length}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Bookmark size={22} />
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-teal-300 transition-all duration-500"
                  style={{
                    width: `${Math.min(savedIds.length * 16, 100)}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                Keep your shortlist focused enough to actually follow through.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="relative max-w-xl flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search saved jobs..."
              className="w-full rounded-2xl border border-black/8 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          {savedIds.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-black text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-6 px-5 pb-16 lg:grid-cols-[1fr_300px] lg:px-8">
        <div>
          {savedJobs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
                <Bookmark size={28} />
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Your saved jobs are empty.
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Browse the UK Job Board and save roles you want to revisit.
              </p>

              <Link
                href="/uk-job-board"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
              >
                Browse UK Jobs
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <h3 className="text-2xl font-black tracking-tight">
                  {savedJobs.length} saved role
                  {savedJobs.length === 1 ? "" : "s"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Highest profile matches appear first.
                </p>
              </div>

              <div className="space-y-4">
                {savedJobs.map((job) => (
                  <article
                    key={job.id}
                    className="group rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <Building2 size={22} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              {job.matchScore && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-teal-700">
                                  <Sparkles size={11} />
                                  {job.matchScore}% match
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

                        <button
                          onClick={() => removeJob(job.id)}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          title="Remove saved job"
                        >
                          <X size={16} />
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

                      <p className="text-sm leading-6 text-slate-600">
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
                          Saved for later
                        </span>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedJob(job)}
                            className="rounded-xl border border-black/8 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                          >
                            View Details
                          </button>

                          <Link
                            href="/application-tracker"
                            className="inline-flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-4 py-2.5 text-xs font-black text-teal-700 transition hover:bg-teal-100"
                          >
                            Track Application
                            <ArrowRight size={13} />
                          </Link>

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
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <CheckCircle2 size={20} />
            </div>

            <h3 className="mt-5 text-lg font-black">
              Save with intention.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep roles you genuinely plan to investigate. Then move them into
              your application workflow when you are ready.
            </p>

            <div className="mt-5 space-y-2">
              {[
                "Review the requirements",
                "Tailor your CV",
                "Prepare your evidence",
                "Track your application",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600"
                >
                  <CheckCircle2 size={13} className="text-teal-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-300">
              Next step
            </p>

            <h3 className="mt-3 text-xl font-black">
              Ready to start applying?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Keep all your applications, statuses and next actions in one
              place.
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
          <Link href="/ai-job-matches" className="hover:text-slate-900">
            AI Job Matches
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
                  {selectedJob.matchScore && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-700">
                      <Sparkles size={11} />
                      {selectedJob.matchScore}% match
                    </span>
                  )}

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
                onClick={() => removeJob(selectedJob.id)}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
              >
                Remove Saved Job
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