"use client";

import {
  ArrowLeft,
  Award,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Flag,
  Globe2,
  Lock,
  MapPin,
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
  opportunities?: string[];
  workPreference?: string;
};

type ProjectRecord = {
  projectId?: string;
  id?: string;
  title?: string;
  projectTitle?: string;
  status?: string;
  score?: number;
  verified?: boolean;
  approved?: boolean;
  completed?: boolean;
};

type CourseProgress = {
  completed?: boolean;
  completedAt?: string;
  percentage?: number;
  progress?: number;
  finalAssessmentPassed?: boolean;
  finalAssessment?: {
    passed?: boolean;
  };
};

type JobApplication = {
  status?: string;
};

type RoadmapStage = {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  action: string;
  completed: boolean;
  progress: number;
  tasks: string[];
};

type TrackRoadmap = {
  title: string;
  objective: string;
  targetRoles: string[];
  skills: string[];
};

const TRACK_ROADMAPS: Record<string, TrackRoadmap> = {
  "Frontend Development": {
    title: "Frontend Developer",
    objective:
      "Build enough practical evidence to confidently pursue frontend roles and demonstrate production-ready web development skills.",
    targetRoles: [
      "Frontend Developer",
      "React Developer",
      "Web Developer",
      "UI Engineer",
    ],
    skills: [
      "HTML & CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "Responsive Design",
      "API Integration",
      "Git",
      "Testing",
    ],
  },
  "Product Management": {
    title: "Product Professional",
    objective:
      "Develop strong product thinking through discovery, prioritization, delivery, stakeholder management, and measurable outcomes.",
    targetRoles: [
      "Associate Product Manager",
      "Product Manager",
      "Product Analyst",
      "Product Operations",
    ],
    skills: [
      "Product Discovery",
      "Requirements",
      "Prioritization",
      "Roadmapping",
      "Agile",
      "Stakeholder Management",
      "Analytics",
    ],
  },
  "UI/UX Design": {
    title: "Product / UX Designer",
    objective:
      "Build a portfolio that demonstrates research, interaction design, visual systems, prototyping, and usability.",
    targetRoles: [
      "UI Designer",
      "UX Designer",
      "Product Designer",
      "UX Researcher",
    ],
    skills: [
      "User Research",
      "Wireframing",
      "Prototyping",
      "Interaction Design",
      "Visual Design",
      "Usability",
      "Design Systems",
    ],
  },
  "Business Analysis": {
    title: "Business Analyst",
    objective:
      "Build practical evidence around requirements, process analysis, stakeholder needs, documentation, and business problem solving.",
    targetRoles: [
      "Business Analyst",
      "Junior Business Analyst",
      "Systems Analyst",
      "Process Analyst",
    ],
    skills: [
      "Requirements Analysis",
      "Process Mapping",
      "Documentation",
      "Stakeholder Management",
      "Business Process",
      "Problem Solving",
      "Agile",
    ],
  },
  "Data & Analytics": {
    title: "Data Analyst",
    objective:
      "Build evidence that connects data preparation and analysis to clear business decisions and measurable insights.",
    targetRoles: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Reporting Analyst",
      "Junior Data Analyst",
    ],
    skills: [
      "SQL",
      "Excel",
      "Statistics",
      "Data Visualization",
      "Dashboards",
      "Reporting",
      "Data Analysis",
    ],
  },
  "Digital Marketing": {
    title: "Digital Marketing Professional",
    objective:
      "Build practical evidence across audience research, content, SEO, campaigns, analytics, and conversion.",
    targetRoles: [
      "Digital Marketing Specialist",
      "SEO Specialist",
      "Growth Associate",
      "Marketing Coordinator",
    ],
    skills: [
      "SEO",
      "Content Strategy",
      "Campaigns",
      "Analytics",
      "Social Media",
      "Copywriting",
      "Conversion",
    ],
  },
  "Mobile Development": {
    title: "Mobile Developer",
    objective:
      "Develop enough practical evidence to build, test, and explain mobile applications using a modern development workflow.",
    targetRoles: [
      "Mobile Developer",
      "React Native Developer",
      "Flutter Developer",
      "Junior Mobile Developer",
    ],
    skills: [
      "Mobile UI",
      "App Architecture",
      "APIs",
      "State Management",
      "Testing",
      "Performance",
      "Deployment",
    ],
  },
  Cybersecurity: {
    title: "Cybersecurity Professional",
    objective:
      "Build practical evidence around security fundamentals, monitoring, risk, secure systems, and incident response.",
    targetRoles: [
      "Security Analyst",
      "SOC Analyst",
      "Cybersecurity Analyst",
      "Junior Security Analyst",
    ],
    skills: [
      "Security Fundamentals",
      "Networking",
      "Risk Analysis",
      "Monitoring",
      "Incident Response",
      "Linux",
      "Secure Systems",
    ],
  },
};

const DEFAULT_ROADMAP: TrackRoadmap = {
  title: "Professional Career",
  objective:
    "Build practical evidence, strengthen your skills, and create a professional profile that supports a focused job search.",
  targetRoles: [
    "Junior Professional",
    "Associate",
    "Analyst",
    "Specialist",
  ],
  skills: [
    "Communication",
    "Problem Solving",
    "Collaboration",
    "Documentation",
    "Professional Practice",
  ],
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function isCompletedProject(project: ProjectRecord) {
  const status = clean(project.status).toLowerCase();

  return (
    Boolean(project.verified) ||
    Boolean(project.approved) ||
    Boolean(project.completed) ||
    ["approved", "completed", "complete", "verified"].includes(status)
  );
}

function collectProjects(): ProjectRecord[] {
  if (typeof window === "undefined") return [];

  const results: ProjectRecord[] = [];
  const seen = new Set<string>();

  const add = (value: unknown) => {
    if (!value || typeof value !== "object") return;

    const project = value as ProjectRecord;

    if (!isCompletedProject(project)) return;

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
    localStorage.getItem("liveproject_verified_experience")
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
      key.startsWith("liveproject_project_") ||
      key.startsWith("liveproject_submission_")
    ) {
      add(
        safeParse<ProjectRecord>(
          localStorage.getItem(key)
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
      localStorage.getItem(key)
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

function collectApplications(): JobApplication[] {
  if (typeof window === "undefined") return [];

  const stored = safeParse<unknown[]>(
    localStorage.getItem("liveproject_job_applications")
  );

  if (!Array.isArray(stored)) return [];

  return stored.filter(
    (item): item is JobApplication =>
      Boolean(item) &&
      typeof item === "object"
  );
}

export default function CareerRoadmapPage() {
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

  useEffect(() => {
    const session = safeParse<{
      loggedIn?: boolean;
      plan?: Plan;
    }>(
      sessionStorage.getItem("liveproject_session")
    );

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
    setCompletedCourses(
      collectCompletedCourses()
    );
    setApplications(
      collectApplications()
    );

    setLoading(false);
  }, []);

  const roadmap = useMemo(() => {
    const track = clean(profile?.careerTrack);

    return TRACK_ROADMAPS[track] ?? DEFAULT_ROADMAP;
  }, [profile?.careerTrack]);

  const profileProgress = useMemo(() => {
    if (!profile) return 0;

    const checks = [
      Boolean(clean(profile.firstName)),
      Boolean(clean(profile.lastName)),
      Boolean(clean(profile.country)),
      Boolean(clean(profile.careerTrack)),
      Boolean(clean(profile.experienceLevel)),
      Boolean(clean(profile.bio)),
      stringArray(profile.skills).length > 0,
      Boolean(
        clean(profile.linkedin) ||
          clean(profile.github) ||
          clean(profile.portfolio)
      ),
      Boolean(clean(profile.workPreference)),
    ];

    return Math.round(
      (checks.filter(Boolean).length /
        checks.length) *
        100
    );
  }, [profile]);

  const activeApplications = applications.filter(
    (application) =>
      [
        "saved",
        "applied",
        "screening",
        "interview",
        "assessment",
        "offer",
      ].includes(
        clean(application.status).toLowerCase()
      )
  ).length;

  const roadmapStages: RoadmapStage[] = useMemo(
    () => [
      {
        id: "foundation",
        number: "01",
        title: "Build your foundation",
        subtitle: "Profile & direction",
        description:
          "Make your professional identity clear before you start pushing heavily into applications.",
        href: "/profile",
        action:
          profileProgress >= 80
            ? "Review Profile"
            : "Complete Profile",
        completed: profileProgress >= 80,
        progress: profileProgress,
        tasks: [
          "Complete your professional profile",
          "Select your career direction",
          "Add relevant skills",
          "Add useful professional links",
        ],
      },
      {
        id: "experience",
        number: "02",
        title: "Build practical evidence",
        subtitle: "Projects & experience",
        description:
          "Use real project work to demonstrate that you can apply your skills rather than only describe them.",
        href: "/projects",
        action:
          projects.length > 0
            ? "View Projects"
            : "Explore Projects",
        completed: projects.length >= 2,
        progress: Math.min(
          projects.length * 50,
          100
        ),
        tasks: [
          "Complete practical projects",
          "Submit work for review",
          "Respond to requested changes",
          "Build verified experience",
        ],
      },
      {
        id: "learning",
        number: "03",
        title: "Strengthen your skills",
        subtitle: "Learning & validation",
        description:
          "Close knowledge gaps with focused learning and use assessments to validate what you know.",
        href: "/courses",
        action:
          completedCourses > 0
            ? "Continue Learning"
            : "Start Learning",
        completed: completedCourses >= 2,
        progress: Math.min(
          completedCourses * 50,
          100
        ),
        tasks: [
          "Complete relevant courses",
          "Finish practical exercises",
          "Pass final assessments",
          "Earn eligible certificates",
        ],
      },
      {
        id: "portfolio",
        number: "04",
        title: "Present your evidence",
        subtitle: "Portfolio & recommendations",
        description:
          "Turn your strongest work into a clear professional story that employers can understand quickly.",
        href: "/portfolio",
        action: "Build Portfolio",
        completed:
          projects.length > 0 &&
          profileProgress >= 80,
        progress:
          projects.length > 0 &&
          profileProgress >= 80
            ? 100
            : projects.length > 0
              ? 60
              : 20,
        tasks: [
          "Select your strongest projects",
          "Add project context",
          "Highlight demonstrated skills",
          "Build your Experience Passport",
        ],
      },
      {
        id: "job-search",
        number: "05",
        title: "Start your job search",
        subtitle: "Opportunities & applications",
        description:
          "Find relevant roles, save the strongest opportunities, apply strategically, and track what happens next.",
        href: "/job-board",
        action:
          activeApplications > 0
            ? "Manage Applications"
            : "Find Opportunities",
        completed: activeApplications >= 3,
        progress: Math.min(
          activeApplications * 25,
          100
        ),
        tasks: [
          "Find relevant job opportunities",
          "Save promising roles",
          "Submit targeted applications",
          "Track each application stage",
        ],
      },
      {
        id: "career-growth",
        number: "06",
        title: "Accelerate your career",
        subtitle: "Interview & career tools",
        description:
          "Use your evidence to prepare for interviews, strengthen your CV, and continuously improve your career strategy.",
        href: "/job-readiness",
        action: "Open Career Tools",
        completed:
          activeApplications >= 3 &&
          projects.length >= 2 &&
          profileProgress >= 80,
        progress:
          activeApplications >= 3 &&
          projects.length >= 2 &&
          profileProgress >= 80
            ? 100
            : Math.min(
                [
                  profileProgress,
                  Math.min(
                    projects.length * 50,
                    100
                  ),
                  Math.min(
                    activeApplications * 25,
                    100
                  ),
                ].reduce(
                  (sum, value) => sum + value,
                  0
                ) / 3,
                99
              ),
        tasks: [
          "Prepare for interviews",
          "Review your CV",
          "Use job readiness insights",
          "Keep building evidence",
        ],
      },
    ],
    [
      profileProgress,
      projects.length,
      completedCourses,
      activeApplications,
    ]
  );

  const completedStages =
    roadmapStages.filter(
      (stage) => stage.completed
    ).length;

  const roadmapProgress = Math.round(
    roadmapStages.reduce(
      (sum, stage) => sum + stage.progress,
      0
    ) / roadmapStages.length
  );

  const currentStage =
    roadmapStages.find(
      (stage) => !stage.completed
    ) ?? roadmapStages[roadmapStages.length - 1];

  if (loading || !loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Loading career roadmap...
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
              Career Roadmap
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
              Follow a structured path from professional foundation to
              practical experience, portfolio evidence, targeted applications,
              and career acceleration.
            </p>

            <div className="mt-7 space-y-3 text-left">
              <Feature
                icon={<Flag className="h-5 w-5" />}
                title="Structured career path"
                text="Know what to focus on at each stage instead of trying to do everything at once."
              />

              <Feature
                icon={<Target className="h-5 w-5" />}
                title="Track-specific direction"
                text="Your roadmap follows the career track selected in your LiveProject profile."
              />

              <Feature
                icon={<TrendingUp className="h-5 w-5" />}
                title="Actionable progress"
                text="Each stage connects directly to a practical LiveProject action."
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
              href="/career-insights"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <BarChart3Icon />
              Career Insights
            </Link>

            <Link
              href="/job-readiness"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
            >
              Job Readiness
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold">
                  <Flag className="h-3.5 w-3.5" />
                  Premium Career Advantage
                </div>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  Career Roadmap
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  A practical path for building the experience, skills,
                  portfolio evidence, and job-search activity needed for your
                  career direction.
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

              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:min-w-[270px]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Roadmap Progress
                </p>

                <p className="mt-2 text-5xl font-black">
                  {roadmapProgress}%
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {completedStages} of {roadmapStages.length} stages completed
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
                  Destination
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Your target: {roadmap.title}
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  {roadmap.objective}
                </p>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                    Target roles
                  </p>

                  <div className="mt-4 space-y-2">
                    {roadmap.targetRoles.map((role) => (
                      <div
                        key={role}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-600">
                          {role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                    High-value skills
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {roadmap.skills.slice(0, 8).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Your path
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Build in sequence
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You do not need to complete everything at once. Start with
                  the current stage, then move forward as your evidence grows.
                </p>
              </div>

              <div className="relative mt-8">
                <div className="absolute bottom-5 left-[21px] top-5 hidden w-px bg-slate-200 sm:block" />

                <div className="space-y-5">
                  {roadmapStages.map((stage) => (
                    <div
                      key={stage.id}
                      className="relative flex gap-4"
                    >
                      <div
                        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xs font-black ${
                          stage.completed
                            ? "bg-emerald-600 text-white"
                            : currentStage.id === stage.id
                              ? "bg-slate-950 text-white"
                              : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {stage.completed ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          stage.number
                        )}
                      </div>

                      <div
                        className={`min-w-0 flex-1 rounded-3xl border p-5 ${
                          currentStage.id === stage.id
                            ? "border-slate-300 shadow-sm"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                                {stage.subtitle}
                              </span>

                              {stage.completed && (
                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                                  Completed
                                </span>
                              )}

                              {!stage.completed &&
                                currentStage.id ===
                                  stage.id && (
                                  <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-bold text-white">
                                    Current stage
                                  </span>
                                )}
                            </div>

                            <h3 className="mt-3 text-lg font-black text-slate-950">
                              {stage.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                              {stage.description}
                            </p>
                          </div>

                          <div className="shrink-0 sm:text-right">
                            <p className="text-2xl font-black text-slate-950">
                              {Math.round(stage.progress)}%
                            </p>

                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                              progress
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${
                              stage.completed
                                ? "bg-emerald-600"
                                : "bg-slate-950"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  stage.progress,
                                  100
                                )
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="mt-5 grid gap-2 sm:grid-cols-2">
                          {stage.tasks.map(
                            (task, index) => (
                              <div
                                key={`${stage.id}-${index}`}
                                className="flex items-start gap-2"
                              >
                                {stage.completed ? (
                                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                ) : (
                                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
                                )}

                                <p className="text-xs leading-5 text-slate-600">
                                  {task}
                                </p>
                              </div>
                            )
                          )}
                        </div>

                        <div className="mt-5 flex justify-end border-t border-slate-100 pt-4">
                          <Link
                            href={stage.href}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800"
                          >
                            {stage.action}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Current priority
                  </p>

                  <h2 className="mt-2 text-xl font-black text-slate-950">
                    {currentStage.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {currentStage.description}
                  </p>

                  <Link
                    href={currentStage.href}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white"
                  >
                    {currentStage.action}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-950">
                Roadmap snapshot
              </h2>

              <div className="mt-5 space-y-4">
                <Snapshot
                  label="Profile"
                  value={`${profileProgress}%`}
                />

                <Snapshot
                  label="Verified Projects"
                  value={String(projects.length)}
                />

                <Snapshot
                  label="Completed Courses"
                  value={String(completedCourses)}
                />

                <Snapshot
                  label="Active Applications"
                  value={String(activeApplications)}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Target className="h-5 w-5 text-slate-950" />

                <h2 className="text-base font-black text-slate-950">
                  Career evidence
                </h2>
              </div>

              <div className="mt-5 space-y-2">
                <SideLink
                  href="/experience-passport"
                  label="Experience Passport"
                />

                <SideLink
                  href="/portfolio"
                  label="Portfolio"
                />

                <SideLink
                  href="/certificates"
                  label="Certificates"
                />

                <SideLink
                  href="/recommendations"
                  label="Recommendations"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BriefcaseBusiness className="h-5 w-5 text-slate-950" />

                <h2 className="text-base font-black text-slate-950">
                  Career advantage
                </h2>
              </div>

              <div className="mt-5 space-y-2">
                <SideLink
                  href="/ai-job-matches"
                  label="AI Job Matches"
                />

                <SideLink
                  href="/saved-jobs"
                  label="Saved Jobs"
                />

                <SideLink
                  href="/application-tracker"
                  label="Application Tracker"
                />

                <SideLink
                  href="/job-alerts"
                  label="Job Alerts"
                />

                <SideLink
                  href="/career-insights"
                  label="Career Insights"
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-slate-950" />

                <h2 className="text-base font-black text-slate-950">
                  Learning
                </h2>
              </div>

              <div className="mt-5 space-y-2">
                <SideLink
                  href="/courses"
                  label="Courses"
                />

                <SideLink
                  href="/my-courses"
                  label="My Courses"
                />
              </div>
            </section>

            <section className="rounded-3xl bg-slate-950 p-6 text-white">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5" />

                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Keep moving
                </p>
              </div>

              <h2 className="mt-4 text-lg font-black">
                Build evidence before chasing every opportunity.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Your roadmap is designed around practical progress: profile,
                experience, learning, evidence, applications, then career
                acceleration.
              </p>

              <Link
                href={currentStage.href}
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white"
              >
                Continue current stage
                <ChevronRight className="h-4 w-4" />
              </Link>
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

function Snapshot({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs font-semibold text-slate-600">
        {label}
      </p>

      <p className="text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
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

function BarChart3Icon() {
  return <BarChart3Placeholder />;
}

function BarChart3Placeholder() {
  return (
    <span className="inline-flex h-4 w-4 items-end gap-0.5">
      <span className="h-2 w-1 rounded-sm bg-current" />
      <span className="h-3 w-1 rounded-sm bg-current" />
      <span className="h-4 w-1 rounded-sm bg-current" />
    </span>
  );
}