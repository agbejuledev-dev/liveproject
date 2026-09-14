// app/business/projects/[projectId]/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Edit3,
  FolderKanban,
  Mail,
  Send,
  Users,
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
  status?: "Draft" | "Open" | "In Review" | "Completed";
  applicants?: number;
  createdAt?: string;
  track?: string;
  level?: string;
  format?: "Solo" | "Team";
  duration?: string;
  skills?: string[];
  deliverables?: string[];
  access?: "free" | "premium";
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

function getProjects(): BusinessProject[] {
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
      // Continue.
    }
  }

  return [];
}

function saveProjects(projects: BusinessProject[]) {
  try {
    const serialized = JSON.stringify(projects);

    sessionStorage.setItem(
      "liveproject_business_projects",
      serialized
    );

    sessionStorage.setItem(
      "liveproject_client_projects",
      serialized
    );

    sessionStorage.setItem(
      "liveproject_projects",
      serialized
    );
  } catch {
    // Prototype storage.
  }
}

function statusConfig(status?: string) {
  switch (status) {
    case "Completed":
      return {
        icon: CheckCircle2,
        text: "Completed",
        className:
          "border-emerald-100 bg-emerald-50 text-emerald-700",
      };

    case "In Review":
      return {
        icon: Clock3,
        text: "In Review",
        className:
          "border-amber-100 bg-amber-50 text-amber-700",
      };

    case "Draft":
      return {
        icon: Clock3,
        text: "Draft",
        className:
          "border-slate-200 bg-slate-50 text-slate-600",
      };

    default:
      return {
        icon: CheckCircle2,
        text: "Open",
        className:
          "border-teal-100 bg-teal-50 text-teal-700",
      };
  }
}

export default function BusinessProjectDetailPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const [ready, setReady] = useState(false);
  const [project, setProject] =
    useState<BusinessProject | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const session = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role = session.role ?? session.accountType;

    if (role === "professional") {
      router.replace(`/projects/${projectId}`);
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

    const projects = getProjects();

    const found = projects.find(
      (item) => String(item.id) === String(projectId)
    );

    if (!found) {
      setNotFound(true);
      setReady(true);
      return;
    }

    setProject(found);
    setReady(true);
  }, [projectId, router]);

  const status = useMemo(
    () => statusConfig(project?.status),
    [project?.status]
  );

  const StatusIcon = status.icon;

  const publishProject = () => {
    if (!project) return;

    const updated: BusinessProject = {
      ...project,
      status: "Open",
    };

    const projects = getProjects();

    const next = projects.map((item) =>
      item.id === project.id ? updated : item
    );

    saveProjects(next);
    setProject(updated);
  };

  const completeProject = () => {
    if (!project) return;

    const updated: BusinessProject = {
      ...project,
      status: "Completed",
    };

    const projects = getProjects();

    const next = projects.map((item) =>
      item.id === project.id ? updated : item
    );

    saveProjects(next);
    setProject(updated);
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading project...
        </div>
      </main>
    );
  }

  if (notFound || !project) {
    return (
      <main className="min-h-screen bg-[#f7fbfa] px-5 py-16 text-slate-900">
        <div className="mx-auto max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FolderKanban size={25} />
          </div>

          <h1 className="mt-5 text-2xl font-black tracking-tight">
            Project not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This project may have been removed or the project link is no
            longer valid.
          </p>

          <button
            type="button"
            onClick={() => router.push("/business/projects")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            Back to projects
          </button>
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
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1350px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business/projects")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business project
                </div>

                <h1 className="max-w-[260px] truncate text-lg font-black tracking-tight text-slate-950 sm:max-w-[500px] sm:text-xl">
                  {project.title || "Untitled project"}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/business/projects/${project.id}/applicants`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Users size={16} />
              <span className="hidden sm:inline">
                Applicants
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1350px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Hero */}
          <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-teal-100/60 blur-3xl" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em]",
                      status.className,
                    ].join(" ")}
                  >
                    <StatusIcon size={12} />
                    {status.text}
                  </span>

                  {project.track && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
                      {project.track}
                    </span>
                  )}

                  {project.level && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
                      {project.level}
                    </span>
                  )}

                  {project.access === "premium" && (
                    <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-violet-700">
                      Premium
                    </span>
                  )}
                </div>

                <h2 className="mt-5 max-w-4xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
                  {project.title || "Untitled project"}
                </h2>

                <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
                  {project.description ||
                    "No project description has been added yet."}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {project.status === "Draft" ? (
                    <button
                      type="button"
                      onClick={publishProject}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-[#0b625c]"
                    >
                      <Send size={16} />
                      Publish project
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/business/projects/${project.id}/applicants`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-[#0b625c]"
                    >
                      <Users size={16} />
                      Review applicants
                    </button>
                  )}

                  {project.status !== "Completed" && (
                    <button
                      type="button"
                      onClick={completeProject}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      <CheckCircle2 size={16} />
                      Mark completed
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/projects/${project.id}`)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Public view
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid border-t border-slate-200 bg-slate-50/70 sm:grid-cols-2 lg:grid-cols-5">
              {[
                ["Status", project.status || "Open"],
                ["Format", project.format || "Solo"],
                ["Duration", project.duration || "Not specified"],
                ["Applicants", project.applicants || 0],
                ["Created", project.createdAt || "Recently"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-slate-200 p-5 last:border-b-0 sm:border-r lg:border-b-0"
                >
                  <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    {label}
                  </div>

                  <div className="mt-2 text-sm font-black text-slate-950">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Main content */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_350px]">
            <div className="space-y-6">
              {/* Skills */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Skills
                    </div>

                    <h3 className="text-xl font-black tracking-tight text-slate-950">
                      What professionals should demonstrate
                    </h3>
                  </div>
                </div>

                {project.skills?.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-teal-100 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    No skills specified.
                  </p>
                )}
              </section>

              {/* Deliverables */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Deliverables
                    </div>

                    <h3 className="text-xl font-black tracking-tight text-slate-950">
                      Expected project outputs
                    </h3>
                  </div>
                </div>

                {project.deliverables?.length ? (
                  <div className="mt-6 space-y-3">
                    {project.deliverables.map(
                      (deliverable, index) => (
                        <div
                          key={`${deliverable}-${index}`}
                          className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-black text-teal-700 shadow-sm">
                            {index + 1}
                          </div>

                          <span className="text-sm font-semibold text-slate-700">
                            {deliverable}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    No deliverables specified.
                  </p>
                )}
              </section>

              {/* Workflow */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <FolderKanban size={18} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      LiveProject workflow
                    </div>

                    <h3 className="text-xl font-black tracking-tight text-slate-950">
                      What happens next
                    </h3>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    [
                      "1",
                      "Professionals discover your project",
                      "Your opportunity becomes available to the right career track.",
                    ],
                    [
                      "2",
                      "Applications come in",
                      "Review applicants and their professional evidence.",
                    ],
                    [
                      "3",
                      "Shortlist and build a team",
                      "Select the professionals that best fit the work.",
                    ],
                    [
                      "4",
                      "Project delivery",
                      "Your selected professionals work through the LiveProject workspace.",
                    ],
                  ].map(([number, title, description]) => (
                    <div
                      key={number}
                      className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {number}
                      </div>

                      <div>
                        <h4 className="text-sm font-black text-slate-950">
                          {title}
                        </h4>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right sidebar */}
            <aside className="space-y-5">
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Applicants
                    </div>

                    <div className="mt-1 text-3xl font-black text-slate-950">
                      {project.applicants || 0}
                    </div>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Users size={20} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/business/projects/${project.id}/applicants`
                    )
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Review applicants
                  <ArrowRight size={15} />
                </button>
              </section>

              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Project information
                </div>

                <div className="mt-5 space-y-4">
                  <InfoRow
                    label="Track"
                    value={project.track || "Not specified"}
                  />

                  <InfoRow
                    label="Level"
                    value={project.level || "Not specified"}
                  />

                  <InfoRow
                    label="Format"
                    value={project.format || "Solo"}
                  />

                  <InfoRow
                    label="Duration"
                    value={project.duration || "Not specified"}
                  />

                  <InfoRow
                    label="Access"
                    value={
                      project.access === "premium"
                        ? "Premium"
                        : "Free"
                    }
                  />
                </div>
              </section>

              <section className="rounded-[26px] border border-teal-100 bg-teal-50/70 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <BriefcaseBusiness size={18} />
                </div>

                <h3 className="mt-4 text-sm font-black text-teal-950">
                  Build around outcomes
                </h3>

                <p className="mt-2 text-xs leading-6 text-teal-900/75">
                  Clear deliverables and meaningful business context help
                  professionals produce stronger work and give your
                  organisation better evidence to evaluate.
                </p>
              </section>
            </aside>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
      <span className="text-xs font-semibold text-slate-400">
        {label}
      </span>

      <span className="text-right text-xs font-black text-slate-700">
        {value}
      </span>
    </div>
  );
}