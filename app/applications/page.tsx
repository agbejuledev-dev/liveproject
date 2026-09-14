"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  LayoutDashboard,
  Search,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

type Application = {
  id: string;
  projectId: string | number;
  projectTitle: string;
  company?: string;
  track?: string;
  level?: string;
  description?: string;
  appliedAt: string;
  status: ApplicationStatus;
  access?: "free" | "premium";
  note?: string;
};

type Session = {
  loggedIn?: boolean;
  plan?: "free" | "premium";
  role?: string;
};

type Filter = "all" | ApplicationStatus;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatDate(value?: string) {
  if (!value) return "Recently";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusLabel(status: ApplicationStatus) {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Not selected";
    case "withdrawn":
      return "Withdrawn";
    default:
      return "Pending";
  }
}

function statusClasses(status: ApplicationStatus) {
  switch (status) {
    case "accepted":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "rejected":
      return "border-red-100 bg-red-50 text-red-700";
    case "withdrawn":
      return "border-slate-200 bg-slate-50 text-slate-600";
    default:
      return "border-amber-100 bg-amber-50 text-amber-700";
  }
}

function normalizeApplications(raw: unknown): Application[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(Boolean)
    .map((item, index) => {
      const application = item as Partial<Application>;

      return {
        id:
          application.id?.toString() ||
          `application-${index}-${application.projectId || "project"}`,
        projectId: application.projectId || "",
        projectTitle:
          application.projectTitle || application.projectTitle || "Project",
        company: application.company,
        track: application.track,
        level: application.level,
        description: application.description,
        appliedAt: application.appliedAt || new Date().toISOString(),
        status: application.status || "pending",
        access: application.access,
        note: application.note,
      };
    });
}

export default function ApplicationsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  useEffect(() => {
    try {
      const rawSession = sessionStorage.getItem("liveproject_session");

      if (!rawSession) {
        router.replace("/register");
        return;
      }

      const parsedSession = JSON.parse(rawSession) as Session;

      if (!parsedSession?.loggedIn) {
        router.replace("/register");
        return;
      }

      setSession(parsedSession);

      const storedApplications = normalizeApplications(
        readJson<unknown>("liveproject_applications", [])
      );

      setApplications(storedApplications);
      setReady(true);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((item) => item.status === "pending")
        .length,
      accepted: applications.filter((item) => item.status === "accepted")
        .length,
      rejected: applications.filter((item) => item.status === "rejected")
        .length,
    };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesFilter =
        filter === "all" || application.status === filter;

      const matchesSearch =
        !query ||
        application.projectTitle.toLowerCase().includes(query) ||
        application.company?.toLowerCase().includes(query) ||
        application.track?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [applications, filter, search]);

  function openProject(application: Application) {
    const projectId = application.projectId;

    if (!projectId) return;

    const startedProject = readJson<unknown>(
      `liveproject_started_project_${projectId}`,
      null
    );

    if (startedProject) {
      sessionStorage.setItem(
        "liveproject_active_project",
        JSON.stringify(startedProject)
      );
    }

    router.push(`/workspace/${projectId}`);
  }

  function withdrawApplication(id: string) {
    const updated = applications.map((application) =>
      application.id === id
        ? {
            ...application,
            status: "withdrawn" as ApplicationStatus,
          }
        : application
    );

    setApplications(updated);

    sessionStorage.setItem(
      "liveproject_applications",
      JSON.stringify(updated)
    );

    setSelectedApplication(null);
  }

  if (!ready || !session) {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            Loading your applications...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/workspace")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-950"
              aria-label="Back to dashboard"
            >
              <LayoutDashboard size={18} />
            </button>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-600">
                Experience
              </p>
              <h1 className="text-lg font-black tracking-tight sm:text-xl">
                Applications
              </h1>
            </div>
          </div>

          <button
            onClick={() => router.push("/projects")}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            <BriefcaseBusiness size={15} />
            <span className="hidden sm:inline">Find Projects</span>
            <span className="sm:hidden">Projects</span>
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[30px] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="relative">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-blue-300">
                <FileText size={13} />
                Project applications
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Track every opportunity you pursue.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Keep track of projects you apply for, see their current
                status, and move into your workspace when an application is
                accepted.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total applications", stats.total, FileText],
            ["Pending", stats.pending, Clock3],
            ["Accepted", stats.accepted, CheckCircle2],
            ["Not selected", stats.rejected, XCircle],
          ].map(([label, value, Icon]) => {
            const StatIcon = Icon as typeof FileText;

            return (
              <div
                key={label as string}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {label as string}
                  </span>

                  <StatIcon size={17} className="text-slate-400" />
                </div>

                <p className="mt-3 text-3xl font-black tracking-tight">
                  {value as number}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Your applications
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Applications appear here when you actually submit one.
              </p>
            </div>

            <div className="relative w-full lg:w-[320px]">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applications..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {[
              ["all", "All"],
              ["pending", "Pending"],
              ["accepted", "Accepted"],
              ["rejected", "Not selected"],
              ["withdrawn", "Withdrawn"],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value as Filter)}
                className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-black transition ${
                  filter === value
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {filteredApplications.length === 0 ? (
          <section className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText size={27} className="text-slate-400" />
            </div>

            <h3 className="mt-5 text-xl font-black">
              {applications.length === 0
                ? "No applications yet."
                : "No applications match this view."}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {applications.length === 0
                ? "When you apply for a project, your application will appear here so you can track its progress."
                : "Try another status filter or search for a different application."}
            </p>

            {applications.length === 0 ? (
              <button
                onClick={() => router.push("/projects")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              >
                Explore Projects
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => {
                  setFilter("all");
                  setSearch("");
                }}
                className="mt-6 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:border-slate-300"
              >
                Clear filters
              </button>
            )}
          </section>
        ) : (
          <section className="mt-6 space-y-4">
            {filteredApplications.map((application) => (
              <article
                key={application.id}
                className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${statusClasses(
                          application.status
                        )}`}
                      >
                        {statusLabel(application.status)}
                      </span>

                      {application.access === "premium" && (
                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                          Premium
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-blue-600">
                      {application.track || "Professional Project"}
                    </p>

                    <h3 className="mt-1 text-xl font-black tracking-tight">
                      {application.projectTitle}
                    </h3>

                    {application.company && (
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        {application.company}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                      {application.description ||
                        "Project application submitted through LiveProject."}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-slate-400">
                      <span>Applied {formatDate(application.appliedAt)}</span>

                      {application.level && (
                        <span>Level: {application.level}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() =>
                        setSelectedApplication(application)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      View details
                    </button>

                    {application.status === "accepted" && (
                      <button
                        onClick={() => openProject(application)}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-700"
                      >
                        Open Project
                        <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-100 bg-white p-6 sm:p-8">
              <div className="pr-5">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">
                  {selectedApplication.track || "Project"}
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight">
                  {selectedApplication.projectTitle}
                </h2>

                {selectedApplication.company && (
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {selectedApplication.company}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedApplication(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Application status
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-black ${statusClasses(
                      selectedApplication.status
                    )}`}
                  >
                    {statusLabel(selectedApplication.status)}
                  </span>

                  <span className="text-xs font-semibold text-slate-400">
                    Applied {formatDate(selectedApplication.appliedAt)}
                  </span>
                </div>
              </div>

              {selectedApplication.description && (
                <div className="mt-7">
                  <h3 className="text-base font-black">Project brief</h3>

                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {selectedApplication.description}
                  </p>
                </div>
              )}

              {selectedApplication.note && (
                <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                    Application update
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-800">
                    {selectedApplication.note}
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {selectedApplication.status === "accepted" && (
                  <button
                    onClick={() => openProject(selectedApplication)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-700"
                  >
                    Open Project
                    <ArrowRight size={16} />
                  </button>
                )}

                {selectedApplication.status === "pending" && (
                  <button
                    onClick={() =>
                      withdrawApplication(selectedApplication.id)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3.5 text-sm font-black text-red-600 transition hover:bg-red-50"
                  >
                    <XCircle size={16} />
                    Withdraw Application
                  </button>
                )}

                <button
                  onClick={() => setSelectedApplication(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:border-slate-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}