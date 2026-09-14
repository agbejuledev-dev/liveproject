// app/portfolio/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FolderKanban,
  Globe2,
  Github,
  Linkedin,
  Plus,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type Registration = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
};

type Onboarding = {
  bio?: string;
  careerTrack?: string;
  experienceLevel?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

type CompletedProject = {
  projectId: string;
  projectTitle?: string;
  track?: string;
  level?: string;
  completedAt?: string;
  rating?: number;
  verified?: boolean;
  description?: string;
  skills?: string[];
};

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  role: string;
  skills: string[];
  link?: string;
  image?: string;
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getCompletedProjects(): CompletedProject[] {
  const stored = readStorage<CompletedProject[]>(
    "liveproject_verified_projects",
    []
  );

  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const projects: CompletedProject[] = [];

  if (typeof window === "undefined") {
    return projects;
  }

  try {
    for (let i = 1; i <= 400; i++) {
      const completed = sessionStorage.getItem(
        `liveproject_project_completed_${i}`
      );

      if (completed !== "true") continue;

      const project = readStorage<any>(
        `liveproject_project_${i}`,
        null
      );

      projects.push({
        projectId: String(i),
        projectTitle:
          project?.title || `LiveProject Project ${i}`,
        track: project?.track,
        level: project?.level,
        completedAt: new Date().toLocaleDateString(),
        verified: true,
        description: project?.description,
        skills: project?.skills || [],
      });
    }
  } catch {
    // Prototype storage.
  }

  return projects;
}

export default function PortfolioPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [registration, setRegistration] =
    useState<Registration | null>(null);
  const [onboarding, setOnboarding] =
    useState<Onboarding | null>(null);
  const [completedProjects, setCompletedProjects] =
    useState<CompletedProject[]>([]);
  const [customItems, setCustomItems] =
    useState<PortfolioItem[]>([]);
  const [selectedProject, setSelectedProject] =
    useState<CompletedProject | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);

  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] =
    useState("");
  const [itemRole, setItemRole] = useState("");
  const [itemSkills, setItemSkills] = useState("");
  const [itemLink, setItemLink] = useState("");

  useEffect(() => {
    const session = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role =
      session.role ?? session.accountType;

    if (role === "client") {
      router.replace("/business");
      return;
    }

    const storedRegistration =
      readStorage<Registration | null>(
        "liveproject_registration",
        null
      );

    const storedOnboarding =
      readStorage<Onboarding | null>(
        "liveproject_onboarding",
        null
      );

    if (!storedOnboarding) {
      router.replace("/onboarding");
      return;
    }

    setRegistration(storedRegistration);
    setOnboarding(storedOnboarding);
    setCompletedProjects(getCompletedProjects());

    setCustomItems(
      readStorage<PortfolioItem[]>(
        "liveproject_portfolio_items",
        []
      )
    );

    setReady(true);
  }, [router]);

  const fullName =
    [registration?.firstName, registration?.lastName]
      .filter(Boolean)
      .join(" ") || "LiveProject Professional";

  const totalItems =
    completedProjects.length + customItems.length;

  const combinedSkills = useMemo(() => {
    return Array.from(
      new Set([
        ...(onboarding?.skills || []),
        ...completedProjects.flatMap(
          (project) => project.skills || []
        ),
        ...customItems.flatMap(
          (item) => item.skills || []
        ),
      ])
    );
  }, [onboarding?.skills, completedProjects, customItems]);

  const addPortfolioItem = () => {
    if (!itemTitle.trim() || !itemDescription.trim()) {
      return;
    }

    const item: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: itemTitle.trim(),
      description: itemDescription.trim(),
      role: itemRole.trim() || "Contributor",
      skills: itemSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      link: itemLink.trim() || undefined,
    };

    const next = [item, ...customItems];

    setCustomItems(next);

    try {
      sessionStorage.setItem(
        "liveproject_portfolio_items",
        JSON.stringify(next)
      );
    } catch {
      // Prototype storage.
    }

    setItemTitle("");
    setItemDescription("");
    setItemRole("");
    setItemSkills("");
    setItemLink("");
    setShowAddItem(false);
  };

  const removeCustomItem = (id: string) => {
    const next = customItems.filter(
      (item) => item.id !== id
    );

    setCustomItems(next);

    try {
      sessionStorage.setItem(
        "liveproject_portfolio_items",
        JSON.stringify(next)
      );
    } catch {
      // Prototype storage.
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading portfolio...
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
          <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/workspace")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Career profile
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Portfolio
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddItem(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">
                Add project
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Portfolio Hero */}
          <section className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-[0_25px_90px_rgba(15,23,42,0.15)]">
            <div className="relative p-7 sm:p-9 lg:p-11">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-300">
                    <BriefcaseBusiness size={13} />
                    Professional portfolio
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                    {fullName}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    {onboarding?.bio ||
                      "A portfolio built around practical work, demonstrated skills and verified experience."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {onboarding?.careerTrack && (
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                        {onboarding.careerTrack}
                      </span>
                    )}

                    {onboarding?.experienceLevel && (
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                        {onboarding.experienceLevel}
                      </span>
                    )}

                    {registration?.country && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                        <Globe2 size={12} />
                        {registration.country}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-[30px] border border-white/10 bg-white/5 lg:h-36 lg:w-36">
                  <FolderKanban
                    size={62}
                    className="text-teal-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid border-t border-white/10 sm:grid-cols-3">
              <PortfolioMetric
                label="Portfolio projects"
                value={String(totalItems)}
              />

              <PortfolioMetric
                label="Verified projects"
                value={String(
                  completedProjects.filter(
                    (project) => project.verified !== false
                  ).length
                )}
              />

              <PortfolioMetric
                label="Skills demonstrated"
                value={String(combinedSkills.length)}
              />
            </div>
          </section>

          {/* Skills */}
          <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Sparkles size={18} />
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Skills
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  Skills demonstrated through your work
                </h3>
              </div>
            </div>

            {combinedSkills.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {combinedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-teal-100 bg-teal-50 px-3.5 py-2 text-xs font-bold text-teal-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
                <p className="text-sm font-bold text-slate-600">
                  No skills have been added yet.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white"
                >
                  Update profile
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </section>

          {/* Verified projects */}
          <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Verified work
                </div>

                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Project portfolio
                </h3>
              </div>

              <button
                type="button"
                onClick={() => router.push("/experience-passport")}
                className="inline-flex items-center gap-2 text-xs font-black text-teal-700"
              >
                View Experience Passport
                <ArrowRight size={14} />
              </button>
            </div>

            {completedProjects.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center">
                <FolderKanban
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <h4 className="mt-4 text-sm font-black text-slate-950">
                  Your portfolio is waiting for its first project.
                </h4>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                  Complete LiveProject work to automatically build verified
                  portfolio evidence.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/projects")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  Explore projects
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {completedProjects.map((project) => (
                  <article
                    key={project.projectId}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                        <FolderKanban size={18} />
                      </div>

                      {project.verified !== false && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-700">
                          <CheckCircle2 size={10} />
                          Verified
                        </span>
                      )}
                    </div>

                    <h4 className="mt-5 text-lg font-black tracking-tight text-slate-950">
                      {project.projectTitle ||
                        "LiveProject project"}
                    </h4>

                    {project.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.track && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                          {project.track}
                        </span>
                      )}

                      {project.level && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                          {project.level}
                        </span>
                      )}

                      {project.completedAt && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                          <CalendarDays size={11} />
                          {project.completedAt}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      {project.rating ? (
                        <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
                          <Star
                            size={13}
                            className="fill-current"
                          />
                          {project.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400">
                          Verified project evidence
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/projects/${project.projectId}`
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700"
                      >
                        View project
                        <ExternalLink size={13} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Custom portfolio */}
          {customItems.length > 0 && (
            <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Award size={18} />
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Additional work
                  </div>

                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    Personal portfolio projects
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {customItems.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[24px] border border-slate-200 p-5"
                  >
                    <h4 className="text-lg font-black text-slate-950">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <div className="mt-4 text-xs font-bold text-teal-700">
                      {item.role}
                    </div>

                    {item.skills?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.link && (
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            item.link,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="mt-5 inline-flex items-center gap-2 text-xs font-black text-teal-700"
                      >
                        Open project
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-300">
                  <Sparkles size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Career growth
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Keep building evidence that speaks for you.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Every meaningful project can become another piece of
                  professional proof.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/projects")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Explore projects
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}

function PortfolioMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/10 p-5 sm:border-r">
      <div className="text-2xl font-black text-white">
        {value}
      </div>

      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
    </div>
  );
}