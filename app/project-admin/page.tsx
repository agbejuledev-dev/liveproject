"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Flag,
  KanbanSquare,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings2,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";

type ProjectStatus = "Planning" | "Active" | "Review" | "Completed";

type Project = {
  id: string;
  name: string;
  company: string;
  track: string;
  status: ProjectStatus;
  progress: number;
  members: number;
  tasks: number;
  completedTasks: number;
  deadline: string;
  health: "On Track" | "At Risk" | "Delayed";
};

const initialProjects: Project[] = [
  {
    id: "lp-admin-001",
    name: "Customer Support Workflow Redesign",
    company: "Northbridge Digital",
    track: "Business Analysis",
    status: "Active",
    progress: 68,
    members: 5,
    tasks: 24,
    completedTasks: 16,
    deadline: "2026-09-24",
    health: "On Track",
  },
  {
    id: "lp-admin-002",
    name: "Retail Mobile Experience",
    company: "TechScale UK",
    track: "Product",
    status: "Review",
    progress: 84,
    members: 6,
    tasks: 31,
    completedTasks: 27,
    deadline: "2026-09-19",
    health: "On Track",
  },
  {
    id: "lp-admin-003",
    name: "Healthcare Appointment Platform",
    company: "BrightPath Systems",
    track: "Technology",
    status: "Active",
    progress: 51,
    members: 7,
    tasks: 38,
    completedTasks: 19,
    deadline: "2026-09-29",
    health: "At Risk",
  },
  {
    id: "lp-admin-004",
    name: "Operational Reporting Framework",
    company: "Orbit Financial",
    track: "Project Management",
    status: "Planning",
    progress: 18,
    members: 4,
    tasks: 18,
    completedTasks: 3,
    deadline: "2026-10-04",
    health: "On Track",
  },
  {
    id: "lp-admin-005",
    name: "Website Conversion Improvement",
    company: "Greenline Technologies",
    track: "UX Design",
    status: "Completed",
    progress: 100,
    members: 5,
    tasks: 21,
    completedTasks: 21,
    deadline: "2026-09-10",
    health: "On Track",
  },
];

const statusStyles: Record<ProjectStatus, string> = {
  Planning: "bg-slate-100 text-slate-600",
  Active: "bg-teal-50 text-teal-700",
  Review: "bg-violet-50 text-violet-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

const healthStyles = {
  "On Track": "bg-emerald-50 text-emerald-700",
  "At Risk": "bg-amber-50 text-amber-700",
  Delayed: "bg-red-50 text-red-700",
};

export default function ProjectAdminPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | ProjectStatus>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const stats = useMemo(() => {
    const active = projects.filter((p) => p.status === "Active").length;
    const review = projects.filter((p) => p.status === "Review").length;
    const completed = projects.filter((p) => p.status === "Completed").length;
    const risks = projects.filter((p) => p.health !== "On Track").length;

    return {
      total: projects.length,
      active,
      review,
      completed,
      risks,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesQuery =
        !normalized ||
        project.name.toLowerCase().includes(normalized) ||
        project.company.toLowerCase().includes(normalized) ||
        project.track.toLowerCase().includes(normalized);

      const matchesStatus = status === "All" || project.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [projects, query, status]);

  function cycleStatus(projectId: string) {
    const flow: ProjectStatus[] = [
      "Planning",
      "Active",
      "Review",
      "Completed",
    ];

    setProjects((current) =>
      current.map((project) => {
        if (project.id !== projectId) return project;

        const index = flow.indexOf(project.status);
        const nextStatus = flow[Math.min(index + 1, flow.length - 1)];

        return {
          ...project,
          status: nextStatus,
          progress:
            nextStatus === "Completed"
              ? 100
              : nextStatus === "Review"
                ? Math.max(project.progress, 80)
                : project.progress,
        };
      })
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes adminGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes adminGlow {
          0%,
          100% {
            opacity: 0.22;
          }

          50% {
            opacity: 0.6;
          }
        }

        .admin-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: adminGrid 18s linear infinite;
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
                Project Operations
              </p>
              <h1 className="text-lg font-black">Project Admin</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-2.5 text-xs font-black text-slate-700 sm:inline-flex">
              <Settings2 size={14} />
              Admin Settings
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-white text-slate-600">
              <Bell size={17} />
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="admin-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "adminGlow 6s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
                <KanbanSquare size={14} />
                OPERATIONS CONTROL CENTER
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Keep projects moving.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Monitor delivery, identify risks, coordinate teams and make
                sure every project reaches a clear outcome.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Activity size={22} />
                </div>

                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                    Operations Health
                  </div>
                  <div className="mt-1 text-2xl font-black">
                    {stats.risks === 0 ? "Excellent" : "Needs Attention"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-9 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {[
            {
              icon: BriefcaseBusiness,
              label: "Projects",
              value: stats.total,
            },
            {
              icon: Activity,
              label: "Active",
              value: stats.active,
            },
            {
              icon: FileCheck2,
              label: "In Review",
              value: stats.review,
            },
            {
              icon: CheckCircle2,
              label: "Completed",
              value: stats.completed,
            },
            {
              icon: AlertTriangle,
              label: "Risks",
              value: stats.risks,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-black/6 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={19} />
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-400">
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
          <div>
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                  Project Portfolio
                </p>
                <h3 className="mt-2 text-2xl font-black">
                  Delivery overview
                </h3>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search projects..."
                    className="w-full rounded-xl border border-black/8 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 sm:w-[250px]"
                  />
                </div>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as "All" | ProjectStatus)
                  }
                  className="rounded-xl border border-black/8 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
                >
                  <option value="All">All Statuses</option>
                  {(["Planning", "Active", "Review", "Completed"] as ProjectStatus[]).map(
                    (item) => (
                      <option key={item}>{item}</option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${statusStyles[project.status]}`}
                          >
                            {project.status}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${healthStyles[project.health]}`}
                          >
                            {project.health}
                          </span>
                        </div>

                        <h4 className="mt-3 text-xl font-black tracking-tight">
                          {project.name}
                        </h4>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {project.company} · {project.track}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-black/8 px-3.5 py-2.5 text-xs font-black text-slate-700"
                      >
                        Manage
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <Users size={14} className="text-teal-600" />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Team
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {project.members} members
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <KanbanSquare size={14} className="text-teal-600" />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Tasks
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {project.completedTasks}/{project.tasks}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <CalendarDays size={14} className="text-teal-600" />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Deadline
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {project.deadline}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <Target size={14} className="text-teal-600" />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Progress
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {project.progress}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">
                          Delivery Progress
                        </span>

                        <span className="font-black text-teal-700">
                          {project.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            project.health === "Delayed"
                              ? "bg-red-500"
                              : project.health === "At Risk"
                                ? "bg-amber-500"
                                : "bg-teal-500"
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center">
                      <p className="text-xs text-slate-400">
                        {project.tasks - project.completedTasks} tasks remaining
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/business/projects/${project.id}/workspace`}
                          className="inline-flex items-center gap-2 rounded-xl border border-black/8 px-4 py-2.5 text-xs font-black text-slate-700"
                        >
                          Workspace
                          <ArrowRight size={13} />
                        </Link>

                        <button
                          onClick={() => cycleStatus(project.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white"
                        >
                          Advance Status
                          <Zap size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.8rem] border border-red-100 bg-red-50 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-red-600 shadow-sm">
                <AlertTriangle size={20} />
              </div>

              <h3 className="mt-5 text-lg font-black text-red-950">
                Attention required
              </h3>

              <div className="mt-4 space-y-2">
                {projects
                  .filter((project) => project.health !== "On Track")
                  .map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="w-full rounded-xl bg-white/80 p-3 text-left"
                    >
                      <p className="text-xs font-black text-red-900">
                        {project.name}
                      </p>
                      <p className="mt-1 text-[11px] text-red-700/70">
                        {project.health} · {project.progress}% progress
                      </p>
                    </button>
                  ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <MessageSquare size={20} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Admin actions
              </h3>

              <div className="mt-4 space-y-2">
                {[
                  "Review outstanding submissions",
                  "Check team progress",
                  "Monitor project deadlines",
                  "Resolve project risks",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600"
                  >
                    <ChevronRight size={14} className="text-teal-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/business" className="hover:text-slate-900">
            Business
          </Link>
          <Link href="/business/projects" className="hover:text-slate-900">
            Projects
          </Link>
          <Link href="/settings" className="hover:text-slate-900">
            Settings
          </Link>
        </div>
      </footer>

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-black/5 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">
                  Project Control
                </p>
                <h3 className="mt-1 text-xl font-black">
                  {selectedProject.name}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {selectedProject.company}
                </p>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Activity size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedProject.progress}%
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Progress
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Users size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedProject.members}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Team members
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Flag size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedProject.deadline}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Deadline
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Status
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(["Planning", "Active", "Review", "Completed"] as ProjectStatus[]).map(
                    (projectStatus) => (
                      <button
                        key={projectStatus}
                        onClick={() => {
                          setProjects((current) =>
                            current.map((project) =>
                              project.id === selectedProject.id
                                ? {
                                    ...project,
                                    status: projectStatus,
                                    progress:
                                      projectStatus === "Completed"
                                        ? 100
                                        : project.progress,
                                  }
                                : project
                            )
                          );

                          setSelectedProject({
                            ...selectedProject,
                            status: projectStatus,
                            progress:
                              projectStatus === "Completed"
                                ? 100
                                : selectedProject.progress,
                          });
                        }}
                        className={`rounded-full px-3 py-2 text-xs font-bold ${
                          selectedProject.status === projectStatus
                            ? "bg-teal-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {projectStatus}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-black">Admin note</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Project administrators monitor progress, review risks,
                  coordinate teams and help projects reach a verified
                  completion state.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-black/5 p-5">
              <button
                onClick={() => setSelectedProject(null)}
                className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Close
              </button>

              <Link
                href={`/business/projects/${selectedProject.id}/workspace`}
                className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white"
              >
                Open Workspace
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}