// @ts-nocheck
"use client";

import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FolderOpen,
  LayoutDashboard,
  LockKeyhole,
  Search,
  Sparkles,
  Upload,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ProjectStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved"
  | "completed";

type Project = {
  id: number | string;
  title: string;
  company?: string;
  track?: string;
  level?: string;
  access?: "free" | "premium";
  duration?: string;
  format?: string;
  description?: string;
  skills?: string[];
  deliverables?: string[];
  startedAt?: string;
  status?: ProjectStatus;
  progress?: number;
};

type Submission = {
  submittedAt?: string;
  status?:
    | "submitted"
    | "under_review"
    | "changes_requested"
    | "approved";
  note?: string;
};

type Session = {
  loggedIn?: boolean;
  plan?: "free" | "premium";
  role?: string;
};

type Filter =
  | "all"
  | "in_progress"
  | "submitted"
  | "changes_requested"
  | "completed";

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
  if (!value) return "Recently started";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently started";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatus(project: Project, submission?: Submission): ProjectStatus {
  if (project.status) {
    return project.status;
  }

  if (submission?.status === "approved") {
    return "approved";
  }

  if (submission?.status === "changes_requested") {
    return "changes_requested";
  }

  if (submission?.status === "under_review") {
    return "under_review";
  }

  if (submission?.status === "submitted") {
    return "submitted";
  }

  return "in_progress";
}

function getProgress(project: Project) {
  if (typeof project.progress === "number") {
    return Math.min(100, Math.max(0, project.progress));
  }

  const workspace = readJson<{
    tasks?: Array<{ status?: string }>;
  } | null>(`liveproject_workspace_${project.id}`, null);

  if (workspace?.tasks?.length) {
    const completed = workspace.tasks.filter(
      (task) => task.status === "done"
    ).length;

    return Math.round((completed / workspace.tasks.length) * 100);
  }

  return 0;
}

function statusLabel(status: ProjectStatus) {
  switch (status) {
    case "in_progress":
      return "In progress";
    case "submitted":
      return "Submitted";
    case "under_review":
      return "Under review";
    case "changes_requested":
      return "Changes requested";
    case "approved":
      return "Approved";
    case "completed":
      return "Completed";
    default:
      return "Not started";
  }
}

function statusClasses(status: ProjectStatus) {
  switch (status) {
    case "completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "approved":
      return "bg-blue-50 text-blue-700 border-blue-100";
    case "changes_requested":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "under_review":
      return "bg-violet-50 text-violet-700 border-violet-100";
    case "submitted":
      return "bg-sky-50 text-sky-700 border-sky-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export default function MyProjectsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [submissions, setSubmissions] = useState<
    Record<string, Submission>
  >({});
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(
    null
  );

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

      const started = readJson<Project[]>(
        "liveproject_started_projects",
        []
      );

      const normalizedProjects = Array.isArray(started)
        ? started
            .filter(Boolean)
            .map((project) => ({
              ...project,
              status: project.status || "in_progress",
              startedAt: project.startedAt || new Date().toISOString(),
            }))
        : [];

      const submissionMap: Record<string, Submission> = {};

      normalizedProjects.forEach((project) => {
        const submission = readJson<Submission | null>(
          `liveproject_submission_${project.id}`,
          null
        );

        if (submission) {
          submissionMap[String(project.id)] = submission;
        }
      });

      setProjects(normalizedProjects);
      setSubmissions(submissionMap);
      setReady(true);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  const enrichedProjects = useMemo(() => {
    return projects.map((project) => {
      const submission = submissions[String(project.id)];

      return {
        ...project,
        resolvedStatus: getStatus(project, submission),
        resolvedProgress:
          getStatus(project, submission) === "completed"
            ? 100
            : getProgress(project),
      };
    });
  }, [projects, submissions]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enrichedProjects.filter((project) => {
      const status = project.resolvedStatus;

      const matchesFilter =
        filter === "all" ||
        (filter === "in_progress" &&
          ["in_progress", "not_started"].includes(status)) ||
        (filter === "submitted" &&
          ["submitted", "under_review", "approved"].includes(status)) ||
        (filter === "changes_requested" &&
          status === "changes_requested") ||
        (filter === "completed" && status === "completed");

      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.company?.toLowerCase().includes(query) ||
        project.track?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [enrichedProjects, filter, search]);

  const stats = useMemo(() => {
    const active = enrichedProjects.filter((project) =>
      ["in_progress", "not_started"].includes(project.resolvedStatus)
    ).length;

    const submitted = enrichedProjects.filter((project) =>
      ["submitted", "under_review", "approved"].includes(
        project.resolvedStatus
      )
    ).length;

    const changes = enrichedProjects.filter(
      (project) => project.resolvedStatus === "changes_requested"
    ).length;

    const completed = enrichedProjects.filter(
      (project) => project.resolvedStatus === "completed"
    ).length;

    return {
      total: enrichedProjects.length,
      active,
      submitted,
      changes,
      completed,
    };
  }, [enrichedProjects]);

  function openProject(project: Project) {
    sessionStorage.setItem(
      `liveproject_started_project_${project.id}`,
      JSON.stringify({
        ...project,
        status: project.resolvedStatus,
      })
    );

    sessionStorage.setItem(
      "liveproject_active_project",
      JSON.stringify({
        ...project,
        status: project.resolvedStatus,
      })
    );

    router.push(`/workspace/${project.id}`);
  }

  if (!ready || !session) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            Loading your projects...
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
                My Projects
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session.plan === "premium" ? (
              <span className="hidden rounded-full bg-slate-950 px-3 py-1.5 text-xs font-black text-white sm:inline-flex">
                Premium
              </span>
            ) : (
              <button
                onClick={() => router.push("/premium")}
                className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-700 sm:flex"
              >
                <Sparkles size={14} />
                Upgrade
              </button>
            )}

            <button
              onClick={() => router.push("/projects")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <BriefcaseBusiness size={15} />
              <span className="hidden sm:inline">Discover Projects</span>
              <span className="sm:hidden">Discover</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="overflow-hidden rounded-[30px] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
          <div className="relative">
            <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-blue-300">
                <FolderOpen size={13} />
                Your experience
              </div>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Work you actually started.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Every project you start appears here. Track your work,
                continue from where you stopped, respond to review feedback,
                and build toward verified experience.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: "Total",
              value: stats.total,
              icon: FolderOpen,
            },
            {
              label: "Active",
              value: stats.active,
              icon: Clock3,
            },
            {
              label: "Submitted",
              value: stats.submitted,
              icon: Upload,
            },
            {
              label: "Changes requested",
              value: stats.changes,
              icon: XCircle,
            },
            {
              label: "Completed",
              value: stats.completed,
              icon: CheckCircle2,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {item.label}
                  </span>

                  <Icon size={17} className="text-slate-400" />
                </div>

                <p className="mt-3 text-3xl font-black tracking-tight">
                  {item.value}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Your project work
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Continue your active work or review completed experience.
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
                placeholder="Search your projects..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {[
              ["all", "All"],
              ["in_progress", "Active"],
              ["submitted", "Submitted"],
              ["changes_requested", "Changes requested"],
              ["completed", "Completed"],
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

        {filteredProjects.length === 0 ? (
          <section className="mt-6 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FolderOpen size={27} className="text-slate-400" />
            </div>

            <h3 className="mt-5 text-xl font-black">
              {projects.length === 0
                ? "You haven't started a project yet."
                : "No projects match this view."}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {projects.length === 0
                ? "Choose a project that matches your career track and start building evidence of what you can do."
                : "Try another status filter or search for a different project."}
            </p>

            {projects.length === 0 ? (
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
          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            {filteredProjects.map((project) => {
              const status = project.resolvedStatus;
              const progress = project.resolvedProgress;
              const submission = submissions[String(project.id)];

              return (
                <article
                  key={String(project.id)}
                  className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${statusClasses(
                            status
                          )}`}
                        >
                          {statusLabel(status)}
                        </span>

                        {project.access === "premium" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                            <LockKeyhole size={10} />
                            Premium
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                        aria-label={`View ${project.title}`}
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>

                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                      {project.track || "Professional Project"}
                    </p>

                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                      {project.title}
                    </h3>

                    {project.company && (
                      <p className="mt-2 text-sm font-semibold text-slate-500">
                        {project.company}
                      </p>
                    )}

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                      {project.description ||
                        "Continue working on your professional project and complete the required evidence for review."}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                          Level
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {project.level || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                          Duration
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {project.duration || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                          Format
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {project.format || "—"}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                          Started
                        </p>
                        <p className="mt-1 text-xs font-bold text-slate-700">
                          {formatDate(project.startedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-600">
                          Project progress
                        </span>

                        <span className="text-xs font-black text-slate-900">
                          {progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {submission?.status === "changes_requested" && (
                      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-xs font-black text-amber-800">
                          Changes requested
                        </p>

                        {submission.note && (
                          <p className="mt-1 text-xs leading-5 text-amber-700">
                            {submission.note}
                          </p>
                        )}
                      </div>
                    )}

                    {submission?.status === "approved" && (
                      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <CheckCircle2
                          size={18}
                          className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <div>
                          <p className="text-xs font-black text-emerald-800">
                            Project approved
                          </p>
                          <p className="mt-1 text-xs leading-5 text-emerald-700">
                            Your work has passed review. Complete the project
                            from the workspace to add the verified experience
                            to your professional record.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                      <div className="text-xs text-slate-400">
                        {status === "completed"
                          ? "Completed project"
                          : status === "changes_requested"
                            ? "Action required"
                            : status === "under_review"
                              ? "Waiting for review"
                              : "Continue building"}
                      </div>

                      <button
                        onClick={() => openProject(project)}
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
                      >
                        {status === "completed"
                          ? "View Project"
                          : status === "changes_requested"
                            ? "Review Changes"
                            : "Open Workspace"}
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {session.plan !== "premium" && (
          <section className="mt-8 overflow-hidden rounded-[28px] border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-blue-700">
                  <Sparkles size={14} />
                  Premium
                </div>

                <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                  Unlock deeper project experiences.
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Get access to advanced projects, the full learning library,
                  professional assessments, certificates, recommendations,
                  jobs, and AI career tools.
                </p>
              </div>

              <button
                onClick={() => router.push("/premium")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
              >
                Explore Premium
                <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}
      </div>

      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-6 sm:p-8">
              <div className="pr-5">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600">
                  {selectedProject.track || "Project"}
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  {selectedProject.title}
                </h2>

                {selectedProject.company && (
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {selectedProject.company}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
                aria-label="Close"
              >
                <XCircle size={19} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-800">
                    {statusLabel(
                      getStatus(
                        selectedProject,
                        submissions[String(selectedProject.id)]
                      )
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Level
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-800">
                    {selectedProject.level || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    Started
                  </p>
                  <p className="mt-1 text-sm font-black text-slate-800">
                    {formatDate(selectedProject.startedAt)}
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <h3 className="text-base font-black">Project brief</h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {selectedProject.description ||
                    "Continue working on the project from your workspace and complete the required tasks and deliverables."}
                </p>
              </div>

              {!!selectedProject.skills?.length && (
                <div className="mt-7">
                  <h3 className="text-base font-black">Skills</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedProject.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!!selectedProject.deliverables?.length && (
                <div className="mt-7">
                  <h3 className="text-base font-black">Deliverables</h3>

                  <div className="mt-3 space-y-2">
                    {selectedProject.deliverables.map((deliverable) => (
                      <div
                        key={deliverable}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                      >
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-blue-600"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {deliverable}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => openProject(selectedProject)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Open Project Workspace
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
