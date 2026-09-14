"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Filter,
  Globe2,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Target,
  Trash2,
  X,
  ChevronDown,
} from "lucide-react";

type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Interview"
  | "Assessment"
  | "Final Stage"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

type Application = {
  id: string;
  company: string;
  title: string;
  location: string;
  workplace: "Remote" | "Hybrid" | "On-site";
  salary: string;
  type: "Full-time" | "Contract";
  source: string;
  appliedDate?: string;
  interviewDate?: string;
  nextAction?: string;
  notes?: string;
  status: ApplicationStatus;
  matchScore?: number;
  url?: string;
};

const STORAGE_KEY = "liveproject_applications";

const seedApplications: Application[] = [
  {
    id: "app-101",
    company: "TechScale UK",
    title: "Frontend Engineer",
    location: "London, UK",
    workplace: "Hybrid",
    salary: "£45,000 – £58,000",
    type: "Full-time",
    source: "UK Job Board",
    appliedDate: "2026-09-10",
    interviewDate: "2026-09-18",
    nextAction: "Prepare technical interview examples",
    notes: "Strong React and Next.js match.",
    status: "Interview",
    matchScore: 96,
    url: "https://www.indeed.com",
  },
  {
    id: "app-102",
    company: "PixelFoundry",
    title: "React Developer",
    location: "Bristol, UK",
    workplace: "Remote",
    salary: "£350 – £450/day",
    type: "Contract",
    source: "AI Job Matches",
    appliedDate: "2026-09-11",
    nextAction: "Follow up with recruiter",
    notes: "Remote role with strong frontend fit.",
    status: "Applied",
    matchScore: 94,
    url: "https://www.indeed.com",
  },
  {
    id: "app-103",
    company: "Northbridge Digital",
    title: "Junior Business Analyst",
    location: "Manchester, UK",
    workplace: "Hybrid",
    salary: "£30,000 – £36,000",
    type: "Full-time",
    source: "UK Job Board",
    nextAction: "Tailor CV and apply",
    notes: "Good career-track transition opportunity.",
    status: "Saved",
    matchScore: 89,
    url: "https://www.indeed.com",
  },
  {
    id: "app-104",
    company: "CloudForge",
    title: "QA Engineer",
    location: "United Kingdom",
    workplace: "Remote",
    salary: "£40,000 – £52,000",
    type: "Full-time",
    source: "AI Job Matches",
    appliedDate: "2026-09-07",
    nextAction: "Complete take-home assessment",
    notes: "Assessment deadline is approaching.",
    status: "Assessment",
    matchScore: 87,
    url: "https://www.indeed.com",
  },
];

const statuses: ApplicationStatus[] = [
  "Saved",
  "Applied",
  "Interview",
  "Assessment",
  "Final Stage",
  "Offer",
  "Rejected",
  "Withdrawn",
];

const statusStyles: Record<
  ApplicationStatus,
  { bg: string; text: string; dot: string }
> = {
  Saved: {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  },
  Applied: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  Interview: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  Assessment: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  "Final Stage": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  Offer: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
  Withdrawn: {
    bg: "bg-zinc-100",
    text: "text-zinc-600",
    dot: "bg-zinc-400",
  },
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicationStatus>(
    "All"
  );
  const [showAdd, setShowAdd] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [newApplication, setNewApplication] = useState<Application>({
    id: "",
    company: "",
    title: "",
    location: "",
    workplace: "Remote",
    salary: "",
    type: "Full-time",
    source: "Manual",
    status: "Saved",
    matchScore: undefined,
    nextAction: "",
    notes: "",
    appliedDate: "",
    interviewDate: "",
    url: "",
  });

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        setApplications(JSON.parse(raw));
        return;
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    setApplications(seedApplications);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seedApplications));
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(
      (item) =>
        !["Rejected", "Withdrawn", "Offer"].includes(item.status)
    ).length;

    const interviews = applications.filter(
      (item) =>
        item.status === "Interview" ||
        item.status === "Final Stage"
    ).length;

    const offers = applications.filter((item) => item.status === "Offer").length;

    return {
      total,
      active,
      interviews,
      offers,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return applications
      .filter((application) => {
        const matchesQuery =
          !normalized ||
          application.title.toLowerCase().includes(normalized) ||
          application.company.toLowerCase().includes(normalized) ||
          application.location.toLowerCase().includes(normalized) ||
          application.source.toLowerCase().includes(normalized);

        const matchesStatus =
          statusFilter === "All" ||
          application.status === statusFilter;

        return matchesQuery && matchesStatus;
      })
      .sort((a, b) => {
        const statusOrder: ApplicationStatus[] = [
          "Interview",
          "Final Stage",
          "Assessment",
          "Applied",
          "Saved",
          "Offer",
          "Rejected",
          "Withdrawn",
        ];

        return (
          statusOrder.indexOf(a.status) -
          statusOrder.indexOf(b.status)
        );
      });
  }, [applications, query, statusFilter]);

  function persist(next: Application[]) {
    setApplications(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function updateStatus(id: string, status: ApplicationStatus) {
    const next = applications.map((application) =>
      application.id === id
        ? {
            ...application,
            status,
            appliedDate:
              status !== "Saved" && !application.appliedDate
                ? new Date().toISOString().slice(0, 10)
                : application.appliedDate,
          }
        : application
    );

    persist(next);

    const updated = next.find((item) => item.id === id);

    if (updated) {
      setSelectedApplication(updated);
    }
  }

  function deleteApplication(id: string) {
    const next = applications.filter((application) => application.id !== id);

    persist(next);
    setSelectedApplication(null);
  }

  function addApplication(event: React.FormEvent) {
    event.preventDefault();

    if (!newApplication.company.trim() || !newApplication.title.trim()) {
      return;
    }

    const application: Application = {
      ...newApplication,
      id: `app-${Date.now()}`,
      appliedDate:
        newApplication.status !== "Saved"
          ? newApplication.appliedDate ||
            new Date().toISOString().slice(0, 10)
          : newApplication.appliedDate,
    };

    const next = [application, ...applications];

    persist(next);
    setShowAdd(false);
    setNewApplication({
      id: "",
      company: "",
      title: "",
      location: "",
      workplace: "Remote",
      salary: "",
      type: "Full-time",
      source: "Manual",
      status: "Saved",
      matchScore: undefined,
      nextAction: "",
      notes: "",
      appliedDate: "",
      interviewDate: "",
      url: "",
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes trackerGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes trackerGlow {
          0%,
          100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.6;
          }
        }

        .tracker-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: trackerGrid 18s linear infinite;
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
              <h1 className="text-lg font-black">
                Application Tracker
              </h1>
            </div>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
          >
            <Plus size={15} />
            Add Application
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-white">
        <div className="tracker-grid absolute inset-0 opacity-70" />

        <div
          className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-100 blur-3xl"
          style={{ animation: "trackerGlow 6s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700">
                <BriefcaseBusiness size={14} />
                CAREER PIPELINE
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Know what happens next.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                Keep every opportunity organised from saved role to offer,
                with your next action always visible.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ["Applications", stats.total],
                ["Active", stats.active],
                ["Interviews", stats.interviews],
                ["Offers", stats.offers],
              ].map(([label, value]) => (
                <div
                  key={String(label)}
                  className="rounded-[1.5rem] border border-black/6 bg-slate-950 p-4 text-white shadow-lg"
                >
                  <div className="text-2xl font-black">{value}</div>
                  <div className="mt-1 text-[11px] font-bold text-slate-500">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search applications, companies or sources..."
              className="w-full rounded-2xl border border-black/8 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as "All" | ApplicationStatus
              )
            }
            className="rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
          >
            <option value="All">All Statuses</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 lg:px-8">
        {filteredApplications.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
              <BriefcaseBusiness size={28} />
            </div>

            <h3 className="mt-5 text-2xl font-black">
              No applications here yet.
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Add an opportunity manually or find a role through the UK Job
              Board.
            </p>

            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-black text-white"
              >
                <Plus size={15} />
                Add Application
              </button>

              <Link
                href="/uk-job-board"
                className="inline-flex items-center gap-2 rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {filteredApplications.map((application) => {
                const style = statusStyles[application.status];

                return (
                  <article
                    key={application.id}
                    className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                  >
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <Building2 size={22} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${style.bg} ${style.text}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                                />
                                {application.status}
                              </span>

                              {application.matchScore && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-700">
                                  <Sparkles size={11} />
                                  {application.matchScore}% match
                                </span>
                              )}
                            </div>

                            <h3 className="mt-2 text-lg font-black tracking-tight sm:text-xl">
                              {application.title}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {application.company}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setSelectedApplication(application)
                          }
                          className="inline-flex items-center gap-2 self-start rounded-xl border border-black/8 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                        >
                          Manage
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <MapPin size={14} className="text-teal-600" />
                          <p className="mt-2 text-[11px] font-bold text-slate-400">
                            Location
                          </p>
                          <p className="mt-0.5 text-xs font-black text-slate-700">
                            {application.location}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <Globe2 size={14} className="text-teal-600" />
                          <p className="mt-2 text-[11px] font-bold text-slate-400">
                            Workplace
                          </p>
                          <p className="mt-0.5 text-xs font-black text-slate-700">
                            {application.workplace}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <CalendarDays size={14} className="text-teal-600" />
                          <p className="mt-2 text-[11px] font-bold text-slate-400">
                            Applied
                          </p>
                          <p className="mt-0.5 text-xs font-black text-slate-700">
                            {formatDate(application.appliedDate)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <Clock3 size={14} className="text-teal-600" />
                          <p className="mt-2 text-[11px] font-bold text-slate-400">
                            Next Action
                          </p>
                          <p className="mt-0.5 truncate text-xs font-black text-slate-700">
                            {application.nextAction || "Nothing scheduled"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-xs font-semibold text-slate-400">
                            {application.source}
                          </p>

                          {application.interviewDate && (
                            <p className="mt-1 text-xs font-bold text-violet-700">
                              Interview: {formatDate(application.interviewDate)}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {application.url && (
                            <button
                              onClick={() =>
                                window.open(
                                  application.url,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-black/8 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                            >
                              Job Link
                              <ExternalLink size={13} />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setSelectedApplication(application)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
                          >
                            Update
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                  <Target size={20} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Keep the pipeline moving.
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The tracker is designed around your next action, not just
                  storing application history.
                </p>

                <div className="mt-5 space-y-2">
                  {[
                    "Review requirements",
                    "Tailor your CV",
                    "Prepare examples",
                    "Follow up",
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
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Sparkles size={20} />
                </div>

                <h3 className="mt-5 text-lg font-black">
                  Need help preparing?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Use LiveProject&apos;s Premium career tools to strengthen your
                  interview and application readiness.
                </p>

                <div className="mt-5 space-y-2">
                  <Link
                    href="/ai-interview"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    AI Interview
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href="/cv-review"
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-3 text-xs font-bold text-white transition hover:bg-white/10"
                  >
                    CV Review
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        )}
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
          <Link href="/saved-jobs" className="hover:text-slate-900">
            Saved Jobs
          </Link>
        </div>
      </footer>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={addApplication}
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-black/5 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                  New Application
                </p>
                <h2 className="mt-1 text-xl font-black">
                  Add an opportunity
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Job Title
                  </span>
                  <input
                    required
                    value={newApplication.title}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="Frontend Engineer"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Company
                  </span>
                  <input
                    required
                    value={newApplication.company}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        company: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="Company name"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Location
                  </span>
                  <input
                    value={newApplication.location}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        location: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="London, UK"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Workplace
                  </span>
                  <select
                    value={newApplication.workplace}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        workplace: event.target.value as Application["workplace"],
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Employment Type
                  </span>
                  <select
                    value={newApplication.type}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        type: event.target.value as Application["type"],
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  >
                    <option>Full-time</option>
                    <option>Contract</option>
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Salary / Rate
                  </span>
                  <input
                    value={newApplication.salary}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        salary: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="£45,000 – £58,000"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Status
                  </span>
                  <select
                    value={newApplication.status}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        status: event.target.value as ApplicationStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  >
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Applied Date
                  </span>
                  <input
                    type="date"
                    value={newApplication.appliedDate}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        appliedDate: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  />
                </label>

                <label>
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Interview Date
                  </span>
                  <input
                    type="date"
                    value={newApplication.interviewDate}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        interviewDate: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Next Action
                  </span>
                  <input
                    value={newApplication.nextAction}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        nextAction: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="Tailor CV and apply"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Job Link
                  </span>
                  <input
                    type="url"
                    value={newApplication.url}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        url: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="https://..."
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-black text-slate-600">
                    Notes
                  </span>
                  <textarea
                    value={newApplication.notes}
                    onChange={(event) =>
                      setNewApplication((current) => ({
                        ...current,
                        notes: event.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full resize-none rounded-xl border border-black/8 px-4 py-3 text-sm outline-none focus:border-teal-500"
                    placeholder="Important notes about this opportunity..."
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
              >
                Save Application
                <CheckCircle2 size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="border-b border-black/5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${
                      statusStyles[selectedApplication.status].bg
                    } ${
                      statusStyles[selectedApplication.status].text
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        statusStyles[selectedApplication.status].dot
                      }`}
                    />
                    {selectedApplication.status}
                  </div>

                  <h3 className="mt-3 text-2xl font-black tracking-tight">
                    {selectedApplication.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {selectedApplication.company}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApplication(null)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <MapPin size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedApplication.location}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Location
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Globe2 size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedApplication.workplace}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Workplace
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <CalendarDays size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {formatDate(selectedApplication.appliedDate)}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Applied
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Clock3 size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedApplication.nextAction || "Nothing scheduled"}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Next Action
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Update Status
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {statuses.map((status) => {
                    const active =
                      selectedApplication.status === status;

                    return (
                      <button
                        key={status}
                        onClick={() =>
                          updateStatus(selectedApplication.id, status)
                        }
                        className={`rounded-full px-3 py-2 text-xs font-bold transition ${
                          active
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {status}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedApplication.interviewDate && (
                <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-violet-800">
                    <CalendarDays size={16} />
                    Interview scheduled
                  </div>
                  <p className="mt-1 text-xs font-semibold text-violet-700">
                    {formatDate(selectedApplication.interviewDate)}
                  </p>
                </div>
              )}

              {selectedApplication.notes && (
                <div className="mt-6">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Notes
                  </p>
                  <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                    {selectedApplication.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-between">
              <button
                onClick={() =>
                  deleteApplication(selectedApplication.id)
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
              >
                <Trash2 size={15} />
                Delete Application
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Close
                </button>

                {selectedApplication.url && (
                  <button
                    onClick={() =>
                      window.open(
                        selectedApplication.url,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white"
                  >
                    Open Job
                    <ExternalLink size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}