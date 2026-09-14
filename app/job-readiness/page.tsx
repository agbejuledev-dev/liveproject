"use client";

function getStoredLocalStorage(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Globe2,
  Lock,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Plan = "free" | "premium";

type OnboardingData = {
  firstName?: string;
  lastName?: string;
  country?: string;
  bio?: string;
  careerTrack?: string;
  experienceLevel?: string;
  currentStatus?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  cvName?: string;
  opportunities?: string[];
  workPreference?: string;
};

type ProjectRecord = {
  id?: string;
  projectId?: string;
  title?: string;
  projectTitle?: string;
  name?: string;
  status?: string;
  score?: number;
  verified?: boolean;
  approved?: boolean;
  completed?: boolean;
  completedAt?: string;
  approvedAt?: string;
};

type JobApplication = {
  status?: string;
};

type SavedJob = {
  title?: string;
  company?: string;
};

type CourseProgress = {
  percentage?: number;
  progress?: number;
  completed?: boolean;
  completedAt?: string;
  finalAssessmentPassed?: boolean;
  finalAssessment?: {
    passed?: boolean;
  };
};

type ReadinessItem = {
  id: string;
  title: string;
  description: string;
  category:
    | "Profile"
    | "Experience"
    | "Learning"
    | "Job Search";
  score: number;
  completed: boolean;
  href: string;
  action: string;
};

const STORAGE = {
  applications: "liveproject_job_applications",
  savedJobs: "liveproject_saved_jobs",
  verifiedExperience: "liveproject_verified_experience",
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSession() {
  if (typeof window === "undefined") return null;

  return safeParse<{
    loggedIn?: boolean;
    plan?: Plan;
  }>(sessionStorage.getItem("liveproject_session"));
}

function isVerifiedProject(project: ProjectRecord) {
  const status = clean(project.status).toLowerCase();

  return (
    Boolean(project.verified) ||
    Boolean(project.approved) ||
    Boolean(project.completed) ||
    ["approved", "completed", "complete", "verified"].includes(status)
  );
}

function collectProjects() {
  if (typeof window === "undefined") return [];

  const results: ProjectRecord[] = [];
  const seen = new Set<string>();

  const add = (value: unknown) => {
    if (!value || typeof value !== "object") return;

    const project = value as ProjectRecord;

    if (!isVerifiedProject(project)) return;

    const id =
      clean(project.projectId) ||
      clean(project.id) ||
      clean(project.projectTitle) ||
      clean(project.title);

    if (!id || seen.has(id)) return;

    seen.add(id);
    results.push(project);
  };

  const verified = safeParse<
    ProjectRecord[] | { experiences?: ProjectRecord[] }
  >(
    getStoredLocalStorage(STORAGE.verifiedExperience)
  );

  const verifiedList = Array.isArray(verified)
    ? verified
    : Array.isArray(verified?.experiences)
      ? verified.experiences
      : [];

  verifiedList.forEach(add);

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (!key) continue;

    if (
      key.startsWith("liveproject_submission_") ||
      key.startsWith("liveproject_project_")
    ) {
      add(
        safeParse<ProjectRecord>(
          getStoredLocalStorage(key)
        )
      );
    }
  }

  return results;
}

function collectCompletedCourses() {
  if (typeof window === "undefined") return 0;

  let total = 0;

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (!key?.startsWith("liveproject_course_progress_")) {
      continue;
    }

    const progress = safeParse<CourseProgress>(
      getStoredLocalStorage(key)
    );

    if (!progress) continue;

    const percentage =
      typeof progress.percentage === "number"
        ? progress.percentage
        : typeof progress.progress === "number"
          ? progress.progress
          : 0;

    const completed =
      progress.completed === true ||
      Boolean(progress.completedAt) ||
      percentage >= 100;

    const assessmentPassed =
      progress.finalAssessmentPassed === true ||
      progress.finalAssessment?.passed === true;

    if (completed && assessmentPassed) {
      total += 1;
    }
  }

  return total;
}

function collectApplications() {
  if (typeof window === "undefined") return [];

  const stored = safeParse<unknown[]>(
    getStoredLocalStorage(STORAGE.applications)
  );

  if (!Array.isArray(stored)) return [];

  return stored.filter(
    (item): item is JobApplication =>
      Boolean(item) &&
      typeof item === "object"
  );
}

function collectSavedJobs() {
  if (typeof window === "undefined") return [];

  const stored = safeParse<unknown[]>(
    getStoredLocalStorage(STORAGE.savedJobs)
  );

  if (!Array.isArray(stored)) return [];

  return stored.filter(
    (item): item is SavedJob =>
      Boolean(item) &&
      typeof item === "object"
  );
}

export default function JobReadinessPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");

  const [profile, setProfile] =
    useState<OnboardingData | null>(null);
  const [projects, setProjects] =
    useState<ProjectRecord[]>([]);
  const [completedCourses, setCompletedCourses] =
    useState(0);
  const [applications, setApplications] =
    useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] =
    useState<SavedJob[]>([]);

  useEffect(() => {
    const session = getSession();

    if (!session?.loggedIn) {
      window.location.replace("/register");
      return;
    }

    setLoggedIn(true);
    setPlan(
      session.plan === "premium"
        ? "premium"
        : "free"
    );

    setProfile(
      safeParse<OnboardingData>(
        sessionStorage.getItem(
          "liveproject_onboarding"
        )
      )
    );

    setProjects(collectProjects());
    setCompletedCourses(collectCompletedCourses());
    setApplications(collectApplications());
    setSavedJobs(collectSavedJobs());

    setLoading(false);
  }, []);

  const profileScore = useMemo(() => {
    if (!profile) return 0;

    const checks = [
      Boolean(clean(profile.firstName)),
      Boolean(clean(profile.lastName)),
      Boolean(clean(profile.country)),
      Boolean(clean(profile.careerTrack)),
      Boolean(clean(profile.experienceLevel)),
      Boolean(clean(profile.bio)),
      stringArray(profile.skills).length > 0,
      Boolean(clean(profile.workPreference)),
      stringArray(profile.opportunities).length > 0,
      Boolean(
        clean(profile.linkedin) ||
          clean(profile.github) ||
          clean(profile.portfolio)
      ),
    ];

    return Math.round(
      (checks.filter(Boolean).length /
        checks.length) *
        100
    );
  }, [profile]);

  const hasApplicationExperience = applications.some(
    (application) => {
      const status = clean(
        application.status
      ).toLowerCase();

      return [
        "applied",
        "screening",
        "interview",
        "assessment",
        "offer",
        "rejected",
        "withdrawn",
      ].includes(status);
    }
  );

  const hasInterviewExperience = applications.some(
    (application) =>
      clean(application.status).toLowerCase() ===
      "interview"
  );

  const experienceScore = useMemo(() => {
    let score = 0;

    if (projects.length >= 1) score += 60;
    if (projects.length >= 2) score += 20;
    if (projects.length >= 3) score += 20;

    return Math.min(score, 100);
  }, [projects.length]);

  const learningScore = useMemo(() => {
    if (completedCourses >= 4) return 100;
    if (completedCourses >= 3) return 85;
    if (completedCourses >= 2) return 70;
    if (completedCourses >= 1) return 50;

    return 0;
  }, [completedCourses]);

  const jobSearchScore = useMemo(() => {
    let score = 0;

    if (savedJobs.length > 0) score += 25;
    if (savedJobs.length >= 3) score += 15;
    if (hasApplicationExperience) score += 35;
    if (hasInterviewExperience) score += 15;

    const hasActiveAlert =
      Boolean(
        safeParse<unknown[]>(
          getStoredLocalStorage(
            "liveproject_job_alerts"
          )
        ) &&
          (
            safeParse<unknown[]>(
              getStoredLocalStorage(
                "liveproject_job_alerts"
              )
            ) ?? []
          ).some(
            (item) =>
              Boolean(
                item &&
                  typeof item === "object" &&
                  (item as { enabled?: boolean })
                    .enabled
              )
          )
      );

    if (hasActiveAlert) score += 10;

    return Math.min(score, 100);
  }, [
    savedJobs.length,
    hasApplicationExperience,
    hasInterviewExperience,
  ]);

  const readiness = useMemo(() => {
    const scores = [
      profileScore,
      experienceScore,
      learningScore,
      jobSearchScore,
    ];

    return Math.round(
      scores.reduce(
        (sum, value) => sum + value,
        0
      ) / scores.length
    );
  }, [
    profileScore,
    experienceScore,
    learningScore,
    jobSearchScore,
  ]);

  const readinessItems: ReadinessItem[] = useMemo(
    () => [
      {
        id: "profile",
        title: "Professional profile",
        description:
          "Your profile should clearly communicate your identity, career direction, skills, and professional links.",
        category: "Profile",
        score: profileScore,
        completed: profileScore >= 80,
        href: "/profile",
        action:
          profileScore >= 80
            ? "Review Profile"
            : "Complete Profile",
      },
      {
        id: "experience",
        title: "Practical experience",
        description:
          "Build evidence through completed and approved LiveProject work.",
        category: "Experience",
        score: experienceScore,
        completed: experienceScore >= 60,
        href: "/projects",
        action:
          experienceScore >= 60
            ? "View Projects"
            : "Build Experience",
      },
      {
        id: "learning",
        title: "Verified learning",
        description:
          "Complete relevant courses and pass final assessments to strengthen your knowledge evidence.",
        category: "Learning",
        score: learningScore,
        completed: learningScore >= 50,
        href: "/courses",
        action:
          learningScore >= 50
            ? "View Courses"
            : "Start Learning",
      },
      {
        id: "job-search",
        title: "Job-search activity",
        description:
          "Build a focused shortlist, apply strategically, and track your hiring pipeline.",
        category: "Job Search",
        score: jobSearchScore,
        completed: jobSearchScore >= 60,
        href: "/job-board",
        action:
          jobSearchScore >= 60
            ? "Manage Search"
            : "Find Opportunities",
      },
    ],
    [
      profileScore,
      experienceScore,
      learningScore,
      jobSearchScore,
    ]
  );

  const completedItems = readinessItems.filter(
    (item) => item.completed
  ).length;

  const priorityItem =
    readinessItems.find(
      (item) => !item.completed
    ) ?? readinessItems[0];

  const readinessLabel =
    readiness >= 85
      ? "Strongly prepared"
      : readiness >= 70
        ? "Job-search ready"
        : readiness >= 50
          ? "Building readiness"
          : "Early stage";

  const readinessDescription =
    readiness >= 85
      ? "You have built a strong base of profile, experience, learning, and job-search evidence."
      : readiness >= 70
        ? "You have enough foundation to begin a focused job search while strengthening weaker areas."
        : readiness >= 50
          ? "Your foundation is developing. Focus on the gaps below before relying heavily on applications."
          : "Your strongest move right now is to build more career evidence before pushing hard on applications.";

  if (loading || !loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Assessing job readiness...
        </div>
      </main>
    );
  }

  if (plan !== "premium") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Lock className="h-7 w-7" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Premium Career Advantage
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              Job Readiness
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
              Get a structured view of how prepared your profile is for an
              active job search and see exactly where your biggest gaps are.
            </p>

            <div className="mt-7 space-y-3 text-left">
              <Feature
                icon={<BarChart3 className="h-5 w-5" />}
                title="Readiness score"
                text="Understand the strength of your current career foundation."
              />

              <Feature
                icon={<Target className="h-5 w-5" />}
                title="Gap analysis"
                text="See which areas of your profile need more evidence."
              />

              <Feature
                icon={<TrendingUp className="h-5 w-5" />}
                title="Action plan"
                text="Get a practical next step based on what you have actually completed."
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/workspace"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/premium"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800"
              >
                Unlock Premium
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/workspace"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/ai-job-matches"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Sparkles className="h-4 w-4" />
              AI Job Matches
            </Link>

            <Link
              href="/application-tracker"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Application Tracker
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Career Advantage
                </div>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Job Readiness
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  A practical readiness assessment built from the professional
                  evidence you have actually created inside LiveProject.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {profile?.careerTrack && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.careerTrack}
                    </span>
                  )}

                  {profile?.experienceLevel && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.experienceLevel}
                    </span>
                  )}

                  {profile?.country && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      <Globe2 className="h-3.5 w-3.5" />
                      {profile.country}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex h-48 w-48 shrink-0 flex-col items-center justify-center rounded-full border-8 border-white/10 bg-white/5">
                <span className="text-5xl font-black">
                  {readiness}
                </span>
                <span className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  readiness
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-6 sm:px-10">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-black text-slate-950">
                  {readinessLabel}
                </p>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                  {readinessDescription}
                </p>
              </div>

              <div className="shrink-0 rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Areas ready
                </p>

                <p className="mt-1 text-2xl font-black text-slate-950">
                  {completedItems}/4
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_330px]">
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Readiness breakdown
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  What is helping or holding you back?
                </h2>
              </div>

              <div className="mt-7 space-y-4">
                {readinessItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            item.completed
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                              {item.category}
                            </span>

                            {item.completed && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                Ready
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-base font-black text-slate-950">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 sm:text-right">
                        <p className="text-3xl font-black text-slate-950">
                          {item.score}
                        </p>

                        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                          out of 100
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-950 transition-all"
                        style={{
                          width: `${item.score}%`,
                        }}
                      />
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        {item.action}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Your next priority
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {priorityItem.title}
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                  {priorityItem.description}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={priorityItem.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800"
                >
                  {priorityItem.action}
                  <ChevronRight className="h-4 w-4" />
                </Link>

                {priorityItem.score > 0 && (
                  <p className="text-xs font-semibold text-slate-400">
                    Current score: {priorityItem.score}/100
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Evidence snapshot
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  What your profile currently contains
                </h2>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <EvidenceCard
                  icon={<BriefcaseBusiness className="h-5 w-5" />}
                  title="Verified projects"
                  value={projects.length}
                  description="Completed project records"
                  href="/experience-passport"
                />

                <EvidenceCard
                  icon={<Award className="h-5 w-5" />}
                  title="Completed learning"
                  value={completedCourses}
                  description="Passed course milestones"
                  href="/courses"
                />

                <EvidenceCard
                  icon={<Target className="h-5 w-5" />}
                  title="Saved opportunities"
                  value={savedJobs.length}
                  description="Roles in your shortlist"
                  href="/saved-jobs"
                />

                <EvidenceCard
                  icon={<ClipboardCheck className="h-5 w-5" />}
                  title="Tracked applications"
                  value={applications.length}
                  description="Hiring pipeline records"
                  href="/application-tracker"
                />
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Target className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-950">
                Readiness checklist
              </h2>

              <div className="mt-5 space-y-4">
                {readinessItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-700">
                        {item.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        {item.completed
                          ? "Current requirement is in a good state."
                          : `Current score: ${item.score}/100`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-slate-950" />

                <h2 className="text-base font-black text-slate-950">
                  Improve readiness
                </h2>
              </div>

              <div className="mt-5 space-y-2">
                <SideLink
                  href="/projects"
                  label="Build Project Experience"
                />

                <SideLink
                  href="/courses"
                  label="Strengthen Learning"
                />

                <SideLink
                  href="/profile"
                  label="Improve Profile"
                />

                <SideLink
                  href="/job-board"
                  label="Find Opportunities"
                />

                <SideLink
                  href="/application-tracker"
                  label="Track Applications"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-slate-950" />

                <h2 className="text-base font-black text-slate-950">
                  Professional profile
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <Info
                  label="Career track"
                  value={
                    profile?.careerTrack ||
                    "Not selected"
                  }
                />

                <Info
                  label="Experience level"
                  value={
                    profile?.experienceLevel ||
                    "Not specified"
                  }
                />

                <Info
                  label="Country"
                  value={
                    profile?.country ||
                    "Not specified"
                  }
                />

                <Info
                  label="Work preference"
                  value={
                    profile?.workPreference ||
                    "Not specified"
                  }
                />
              </div>
            </section>

            <section className="rounded-3xl bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5" />

                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Important
                </p>
              </div>

              <h2 className="mt-4 text-lg font-black">
                Readiness is not a hiring guarantee.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                This score describes the strength of your current recorded
                career foundation. It cannot predict an employer's final
                decision.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950">
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function EvidenceCard({
  icon,
  title,
  value,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 p-5 transition hover:bg-slate-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>

        <div>
          <p className="text-xs font-black text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-2xl font-black text-slate-950">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {description}
      </p>
    </Link>
  );
}

function SideLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
    >
      {label}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}