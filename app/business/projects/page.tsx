// app/business/projects/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  ChevronRight,
  CircleCheck,
  Clock3,
  Eye,
  FolderKanban,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type BusinessProject = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  applicants?: number;
  createdAt?: string;
  track?: string;
  level?: string;
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadProjects(): BusinessProject[] {
  if (typeof window === "undefined") return [];

  const keys = [
    "liveproject_business_projects",
    "liveproject_client_projects",
    "liveproject_projects",
  ];

  for (const key of keys) {
    try {
      const raw = sessionStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue checking the remaining supported keys.
    }
  }

  return [];
}

function getStatusStyles(status?: string) {
  const value = (status || "Draft").toLowerCase();

  if (value.includes("active") || value.includes("open")) {
    return {
      icon: CircleCheck,
      badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    };
  }

  if (value.includes("complete") || value.includes("completed")) {
    return {
      icon: CircleCheck,
      badge: "bg-blue-50 text-blue-700 border-blue-100",
    };
  }

  if (value.includes("review")) {
    return {
      icon: Clock3,
      badge: "bg-amber-50 text-amber-700 border-amber-100",
    };
  }

  if (value.includes("cancel")) {
    return {
      icon: XCircle,
      badge: "bg-red-50 text-red-700 border-red-100",
    };
  }

  return {
    icon: Clock3,
    badge: "bg-slate-100 text-slate-600 border-slate-200",
  };
}

export default function BusinessProjectsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const session = readStorage<Session | null>("liveproject_session", null);

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role = session.role ?? session.accountType;

    if (role === "professional") {
      router.replace("/workspace");
      return;
    }

    const onboarding = readStorage(
      "liveproject_client_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/business-onboarding");
      return;
    }

    setProjects(loadProjects());
    setReady(true);
  }, [router]);

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();

    return projects.filter((project) => {
      const status = (project.status || "Draft").toLowerCase();

      const matchesFilter =
        filter === "all" ||
        (filter === "draft" && status.includes("draft")) ||
        (filter === "active" &&
          (status.includes("active") || status.includes("open"))) ||
        (filter === "review" && status.includes("review")) ||
        (filter === "completed" &&
          (status.includes("completed") || status.includes("complete")));

      const searchable = [
        project.title,
        project.description,
        project.track,
        project.level,
        project.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && (!search || searchable.includes(search));
    });
  }, [projects, query, filter]);

  const counts = useMemo(() => {
    let active = 0;
    let draft = 0;
    let review = 0;
    let completed = 0;

    projects.forEach((project) => {
      const status = (project.status || "Draft").toLowerCase();

      if (status.includes("draft")) {
        draft++;
      } else if (status.includes("review")) {
        review++;
      } else if (status.includes("complete")) {
        completed++;
      } else {
        active++;
      }
    });

    return {
      all: projects.length,
      active,
      draft,
      review,
      completed,
    };
  }, [projects]);

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f7fbfa] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading your projects...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbfa] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
                aria-label="Back to business dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>
                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  My Projects
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/projects/new")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Post a project</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Hero */}
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <BriefcaseBusiness size={13} />
                  Project pipeline
                </div>

                <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Manage the work your organisation is bringing to life.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Create meaningful project opportunities, track applicants
                  and keep every project moving from brief to completion.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/projects/new")}
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-[#0b625c]"
              >
                Create new project
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {[
              {
                label: "All projects",
                value: counts.all,
                key: "all",
                icon: FolderKanban,
              },
              {
                label: "Active",
                value: counts.active,
                key: "active",
                icon: CircleCheck,
              },
              {
                label: "Drafts",
                value: counts.draft,
                key: "draft",
                icon: Clock3,
              },
              {
                label: "In review",
                value: counts.review,
                key: "review",
                icon: Eye,
              },
              {
                label: "Completed",
                value: counts.completed,
                key: "completed",
                icon: CircleCheck,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              const active = filter === stat.key;

              return (
                <button
                  type="button"
                  key={stat.key}
                  onClick={() => setFilter(stat.key)}
                  className={[
                    "rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5",
                    active
                      ? "border-teal-200 bg-teal-50/80"
                      : "border-slate-200/80 bg-white hover:border-slate-300",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-xl",
                        active
                          ? "bg-white text-teal-700"
                          : "bg-slate-50 text-slate-500",
                      ].join(" ")}
                    >
                      <Icon size={17} />
                    </div>

                    <ChevronRight
                      size={15}
                      className={
                        active ? "text-teal-500" : "text-slate-300"
                      }
                    />
                  </div>

                  <div className="mt-4 text-2xl font-black text-slate-950">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {stat.label}
                  </div>
                </button>
              );
            })}
          </section>

          {/* Search / filters */}
          <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search your projects..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "All"],
                  ["active", "Active"],
                  ["draft", "Drafts"],
                  ["review", "In review"],
                  ["completed", "Completed"],
                ].map(([value, label]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => setFilter(value)}
                    className={[
                      "rounded-xl px-3.5 py-2.5 text-xs font-bold transition",
                      filter === value
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="mt-6">
            {filteredProjects.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <FolderKanban size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  {projects.length === 0
                    ? "Your project pipeline is empty."
                    : "No projects match your search."}
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {projects.length === 0
                    ? "Once you create a project, it will appear here with its status, applicants and progress."
                    : "Try another search term or clear the current filter to see your other projects."}
                </p>

                {projects.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => router.push("/projects/new")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <Plus size={16} />
                    Post your first project
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const styles = getStatusStyles(project.status);
                  const StatusIcon = styles.icon;

                  return (
                    <article
                      key={project.id}
                      className="group rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={[
                                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]",
                                styles.badge,
                              ].join(" ")}
                            >
                              <StatusIcon size={12} />
                              {project.status || "Draft"}
                            </span>

                            {project.track && (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                {project.track}
                              </span>
                            )}

                            {project.level && (
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                                {project.level}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                            {project.title || "Untitled project"}
                          </h3>

                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                            {project.description ||
                              "No project description has been added yet."}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                              <Users size={14} />
                              {project.applicants || 0} applicants
                            </span>

                            {project.createdAt && (
                              <span>
                                Created {project.createdAt}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/business/projects/${project.id}`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                          >
                            View project
                            <ArrowRight size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/business/projects/${project.id}/applicants`
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                          >
                            Applicants
                            <Users size={14} />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Bottom CTA */}
          <section className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-300">
                  <BriefcaseBusiness size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Build with evidence
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Give professionals meaningful work to prove what they can do.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Create projects with clear outcomes and discover people who
                  want to build verified experience through real work.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/projects/new")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Post a project
                <Plus size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}