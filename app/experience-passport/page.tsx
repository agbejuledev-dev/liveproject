// app/experience-passport/page.tsx

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
  Download,
  ExternalLink,
  FileCheck2,
  FolderKanban,
  Globe2,
  Sparkles,
  Star,
  Target,
  UserRound,
  Verified,
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

type Project = {
  id: string;
  title?: string;
  track?: string;
  level?: string;
  status?: string;
  duration?: string;
  format?: string;
  description?: string;
};

type CompletedProject = {
  projectId: string;
  projectTitle?: string;
  track?: string;
  level?: string;
  completedAt?: string;
  rating?: number;
  verified?: boolean;
};

type Recommendation = {
  id: string;
  projectTitle?: string;
  author?: string;
  role?: string;
  comment?: string;
  createdAt?: string;
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
  if (typeof window === "undefined") return [];

  const stored = readStorage<CompletedProject[]>(
    "liveproject_verified_projects",
    []
  );

  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const fallback: CompletedProject[] = [];

  try {
    const keys = [
      "liveproject_project_completed_",
    ];

    const projectIds: string[] = [];

    for (let i = 1; i <= 400; i++) {
      const key = `${keys[0]}${i}`;

      if (sessionStorage.getItem(key) === "true") {
        projectIds.push(String(i));
      }
    }

    projectIds.forEach((projectId) => {
      const project = readStorage<Project | null>(
        `liveproject_project_${projectId}`,
        null
      );

      fallback.push({
        projectId,
        projectTitle:
          project?.title || `LiveProject Project ${projectId}`,
        track: project?.track,
        level: project?.level,
        completedAt: new Date().toLocaleDateString(),
        verified: true,
      });
    });
  } catch {
    // Prototype storage.
  }

  return fallback;
}

export default function ExperiencePassportPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registration, setRegistration] =
    useState<Registration | null>(null);
  const [completedProjects, setCompletedProjects] =
    useState<CompletedProject[]>([]);
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);

  useEffect(() => {
    const storedSession = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!storedSession?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role =
      storedSession.role ?? storedSession.accountType;

    if (role === "client") {
      router.replace("/business");
      return;
    }

    const storedRegistration =
      readStorage<Registration | null>(
        "liveproject_registration",
        null
      );

    const onboarding = readStorage(
      "liveproject_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/onboarding");
      return;
    }

    setSession(storedSession);
    setRegistration(storedRegistration);
    setCompletedProjects(getCompletedProjects());

    setRecommendations(
      readStorage<Recommendation[]>(
        "liveproject_recommendations",
        []
      )
    );

    setReady(true);
  }, [router]);

  const fullName =
    [registration?.firstName, registration?.lastName]
      .filter(Boolean)
      .join(" ") || "LiveProject Professional";

  const totalProjects = completedProjects.length;

  const verifiedProjects = completedProjects.filter(
    (project) => project.verified !== false
  ).length;

  const uniqueTracks = Array.from(
    new Set(
      completedProjects
        .map((project) => project.track)
        .filter(Boolean)
    )
  );

  const averageRating = useMemo(() => {
    const ratings = completedProjects
      .map((project) => project.rating)
      .filter(
        (rating): rating is number =>
          typeof rating === "number" && rating > 0
      );

    if (!ratings.length) return null;

    return (
      ratings.reduce((sum, rating) => sum + rating, 0) /
      ratings.length
    ).toFixed(1);
  }, [completedProjects]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading Experience Passport...
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
          <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
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
                  Experience Passport
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <Download size={15} />
              <span className="hidden sm:inline">
                Export
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Passport hero */}
          <section className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-[0_25px_90px_rgba(15,23,42,0.15)]">
            <div className="relative p-7 sm:p-9 lg:p-11">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-300">
                    <Verified size={13} />
                    Verified experience record
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                    {fullName}
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    A structured record of practical work completed through
                    the LiveProject ecosystem.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
                    {registration?.country && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
                        <Globe2 size={13} />
                        {registration.country}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2">
                      <BriefcaseBusiness size={13} />
                      Professional
                    </span>

                    {session?.plan === "premium" && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-3 py-2 text-teal-300">
                        <SparklesIcon />
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-[30px] border border-white/10 bg-white/5 lg:h-36 lg:w-36">
                  <Award
                    size={64}
                    className="text-teal-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
              <PassportMetric
                label="Projects completed"
                value={String(totalProjects)}
              />

              <PassportMetric
                label="Verified projects"
                value={String(verifiedProjects)}
              />

              <PassportMetric
                label="Career tracks"
                value={String(uniqueTracks.length)}
              />

              <PassportMetric
                label="Average rating"
                value={averageRating || "—"}
              />
            </div>
          </section>

          {/* Identity + value */}
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <UserRound size={18} />
                </div>

                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Professional evidence
                  </div>

                  <h3 className="text-xl font-black tracking-tight text-slate-950">
                    What this passport represents
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  [
                    "Practical work",
                    "Evidence of projects completed in a structured work environment.",
                    FolderKanban,
                  ],
                  [
                    "Verified outcomes",
                    "Completed project records can carry business feedback and approval.",
                    CheckCircle2,
                  ],
                  [
                    "Skills demonstrated",
                    "Skills are connected to project work rather than only self-declared.",
                    TargetIcon,
                  ],
                  [
                    "Career progression",
                    "Build a stronger professional story as your project record grows.",
                    ArrowGrowthIcon,
                  ],
                ].map(([title, description, Icon]) => {
                  const IconComponent = Icon as typeof CheckCircle2;

                  return (
                    <div
                      key={title as string}
                      className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                        <IconComponent size={17} />
                      </div>

                      <h4 className="mt-4 text-sm font-black text-slate-950">
                        {title as string}
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {description as string}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[26px] border border-teal-100 bg-teal-50/70 p-6 shadow-sm sm:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                <SparklesIcon />
              </div>

              <h3 className="mt-5 text-xl font-black tracking-tight text-teal-950">
                Turn work into opportunity.
              </h3>

              <p className="mt-3 text-sm leading-7 text-teal-900/70">
                Your Experience Passport is designed to make practical
                experience easier to communicate when applying for projects,
                jobs and professional opportunities.
              </p>

              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Manage profile
                <ArrowRight size={15} />
              </button>
            </div>
          </section>

          {/* Completed projects */}
          <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Evidence timeline
                </div>

                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Completed projects
                </h3>
              </div>

              <button
                type="button"
                onClick={() => router.push("/workspace")}
                className="inline-flex items-center gap-2 text-xs font-black text-teal-700"
              >
                Open workspace
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
                  No completed projects yet.
                </h4>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                  Complete your first LiveProject to start building your
                  Experience Passport.
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
              <div className="mt-6 space-y-3">
                {completedProjects.map((project, index) => (
                  <div
                    key={`${project.projectId}-${index}`}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                        <FolderKanban size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-black text-slate-950">
                            {project.projectTitle ||
                              "LiveProject Project"}
                          </h4>

                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-700">
                            <CheckCircle2 size={10} />
                            Verified
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.track && (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                              {project.track}
                            </span>
                          )}

                          {project.level && (
                            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
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
                      </div>

                      <div className="flex items-center gap-2">
                        {project.rating && (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
                            <Star
                              size={13}
                              className="fill-current"
                            />
                            {project.rating.toFixed(1)}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            router.push(
                              `/projects/${project.projectId}`
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-slate-950"
                        >
                          <ExternalLink size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommendations */}
          <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <MessageSquare size={18} />
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Social proof
                </div>

                <h3 className="text-xl font-black tracking-tight text-slate-950">
                  Recommendations
                </h3>
              </div>
            </div>

            {recommendations.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-8 text-center">
                <MessageSquare
                  size={24}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-black text-slate-950">
                  No recommendations yet.
                </p>

                <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                  Recommendations can be added as your completed project
                  relationships develop.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {recommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                        {(recommendation.author?.[0] || "R").toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {recommendation.author ||
                            "Professional"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {recommendation.role ||
                            "Project collaborator"}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-600">
                      {recommendation.comment ||
                        "Recommendation content not available."}
                    </p>

                    {recommendation.projectTitle && (
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-teal-700">
                        {recommendation.projectTitle}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}

function PassportMetric({
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

function SparklesIcon() {
  return <Sparkles size={18} />;
}

function TargetIcon() {
  return <Target size={17} />;
}

function ArrowGrowthIcon() {
  return <ArrowUpRight size={17} />;
}