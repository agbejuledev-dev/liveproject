// app/business/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleCheck,
  FolderKanban,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  Users,
  UsersRound,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
  plan?: "free" | "premium";
};

type Registration = {
  accountType?: "professional" | "client";
  organisationName?: string;
  email?: string;
  country?: string;
  website?: string;
};

type ClientOnboarding = {
  organisationName?: string;
  country?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  needs?: string[];
};

type PostedProject = {
  id: string;
  title?: string;
  status?: string;
  applicants?: number;
};

type Talent = {
  id: string;
  name?: string;
};

const menuSections = [
  {
    label: "WORKSPACE",
    items: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/business",
      },
    ],
  },
  {
    label: "PROJECTS",
    items: [
      {
        label: "Post a Project",
        icon: Plus,
        href: "/projects/new",
      },
      {
        label: "My Projects",
        icon: FolderKanban,
        href: "/business/projects",
      },
      {
        label: "Applicants",
        icon: Users,
        href: "/business/applicants",
      },
    ],
  },
  {
    label: "TALENT",
    items: [
      {
        label: "Discover Professionals",
        icon: Search,
        href: "/business/talent",
      },
      {
        label: "Saved Talent",
        icon: Target,
        href: "/business/talent/saved",
      },
    ],
  },
  {
    label: "COLLABORATION",
    items: [
      {
        label: "Teams",
        icon: UsersRound,
        href: "/business/teams",
      },
      {
        label: "Messages",
        icon: MessageSquare,
        href: "/business/messages",
      },
    ],
  },
  {
    label: "ORGANISATION",
    items: [
      {
        label: "Business Profile",
        icon: Building2,
        href: "/business/profile",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
      },
    ],
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function getStoredProjects(): PostedProject[] {
  if (typeof window === "undefined") {
    return [];
  }

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
      // Continue searching other supported keys.
    }
  }

  return [];
}

function getStoredSavedTalent(): Talent[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem("liveproject_saved_talent");

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BusinessDashboard() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [onboarding, setOnboarding] = useState<ClientOnboarding | null>(null);
  const [projects, setProjects] = useState<PostedProject[]>([]);
  const [savedTalent, setSavedTalent] = useState<Talent[]>([]);

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
      storedSession.role ?? storedSession.accountType ?? undefined;

    if (role === "professional") {
      router.replace("/workspace");
      return;
    }

    const storedRegistration = readStorage<Registration | null>(
      "liveproject_registration",
      null
    );

    const storedOnboarding = readStorage<ClientOnboarding | null>(
      "liveproject_client_onboarding",
      null
    );

    if (!storedOnboarding) {
      router.replace("/business-onboarding");
      return;
    }

    setSession(storedSession);
    setRegistration(storedRegistration);
    setOnboarding(storedOnboarding);
    setProjects(getStoredProjects());
    setSavedTalent(getStoredSavedTalent());
    setReady(true);
  }, [router]);

  const organisationName =
    onboarding?.organisationName ||
    registration?.organisationName ||
    "Your organisation";

  const country =
    onboarding?.country ||
    registration?.country ||
    "Global";

  const industry = onboarding?.industry || "Industry not added";
  const companySize = onboarding?.companySize || "Company size not added";
  const needs = onboarding?.needs ?? [];

  const profileCompletion = useMemo(() => {
    const checks = [
      Boolean(organisationName),
      Boolean(country),
      Boolean(industry && industry !== "Industry not added"),
      Boolean(companySize && companySize !== "Company size not added"),
      Boolean(onboarding?.description),
      Boolean(onboarding?.contactName),
      Boolean(onboarding?.contactEmail),
      Boolean(onboarding?.website),
    ];

    return Math.round(
      (checks.filter(Boolean).length / checks.length) * 100
    );
  }, [
    organisationName,
    country,
    industry,
    companySize,
    onboarding?.description,
    onboarding?.contactName,
    onboarding?.contactEmail,
    onboarding?.website,
  ]);

  const totalApplicants = projects.reduce(
    (total, project) => total + Number(project.applicants || 0),
    0
  );

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f7fbfa] text-slate-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 rounded-full border-2 border-slate-300 border-t-[#0d9488] animate-spin" />
          Loading your business workspace...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7fbfa] text-slate-900 overflow-hidden">
      {/* Continuous background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative min-h-screen">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200/80 bg-white/95 backdrop-blur-xl",
            "transform transition-transform duration-300 lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          <div className="flex h-full flex-col">
            <div className="flex h-[78px] items-center justify-between border-b border-slate-200 px-6">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f766e] text-white shadow-lg shadow-teal-700/20">
                  <span className="text-lg font-black">L</span>
                </div>

                <div className="text-left">
                  <div className="text-sm font-black tracking-tight text-slate-950">
                    LIVEPROJECT
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-700">
                    Business Workspace
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="mb-6 rounded-2xl border border-teal-100 bg-teal-50/80 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <BriefcaseBusiness
                    size={16}
                    className="text-teal-700"
                  />
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-teal-800">
                    Client workspace
                  </span>
                </div>

                <p className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                  {organisationName}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Build teams. Launch projects. Find proven talent.
                </p>
              </div>

              <nav className="space-y-6">
                {menuSections.map((section) => (
                  <div key={section.label}>
                    <div className="px-3 pb-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      {section.label}
                    </div>

                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = item.href === "/business";

                        return (
                          <button
                            key={item.href}
                            type="button"
                            onClick={() => {
                              setMobileOpen(false);
                              router.push(item.href);
                            }}
                            className={[
                              "group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition",
                              active
                                ? "bg-teal-50 text-teal-800"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                            ].join(" ")}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <Icon
                                size={17}
                                className={
                                  active
                                    ? "text-teal-700"
                                    : "text-slate-400 group-hover:text-slate-700"
                                }
                              />
                              <span className="truncate text-sm font-medium">
                                {item.label}
                              </span>
                            </span>

                            {active && (
                              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <ArrowRight size={17} className="rotate-180" />
                Back to LiveProject
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="lg:pl-[280px]">
          <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
            <div className="flex h-[78px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm lg:hidden"
                >
                  <LayoutDashboard size={18} />
                </button>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                    Business dashboard
                  </p>
                  <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                    Welcome back, {onboarding?.contactName || "there"}.
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-slate-600">
                    Business account
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/business/profile")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-900/10"
                >
                  {(organisationName[0] || "B").toUpperCase()}
                </button>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)] sm:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-teal-100/70 blur-3xl" />
              <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-cyan-100/60 blur-2xl" />

              <div className="relative grid gap-8 xl:grid-cols-[1fr_auto] xl:items-center">
                <div>
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                    <Sparkles size={13} />
                    Your business workspace
                  </div>

                  <h2 className="max-w-3xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                    Turn business needs into real projects and strong teams.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                    Manage your projects, discover professionals, review
                    applicants and build an organisation profile that helps
                    the right people understand what you need.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => router.push("/projects/new")}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-[#0b625c]"
                    >
                      Post a project
                      <ArrowRight size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => router.push("/business/talent")}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950"
                    >
                      Discover professionals
                      <Search size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2">
                  {[
                    {
                      label: "Projects",
                      value: projects.length,
                      icon: FolderKanban,
                    },
                    {
                      label: "Applicants",
                      value: totalApplicants,
                      icon: Users,
                    },
                    {
                      label: "Saved talent",
                      value: savedTalent.length,
                      icon: Target,
                    },
                    {
                      label: "Profile",
                      value: `${profileCompletion}%`,
                      icon: CircleCheck,
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="min-w-[120px] rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                      >
                        <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                          <Icon size={17} />
                        </div>

                        <div className="text-xl font-black text-slate-950">
                          {item.value}
                        </div>

                        <div className="mt-1 text-xs font-medium text-slate-500">
                          {item.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Organisation + actions */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Organisation profile
                    </p>

                    <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                      {organisationName}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/business/profile")}
                    className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-950 sm:flex"
                  >
                    Manage profile
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Country
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      {country}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Industry
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      {industry}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Company size
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      {companySize}
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Completion
                    </div>
                    <div className="mt-2 text-sm font-bold text-slate-900">
                      {profileCompletion}%
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500">
                      Profile completeness
                    </span>
                    <span className="text-teal-700">
                      {profileCompletion}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-600 transition-all duration-700"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>

                {needs.length > 0 && (
                  <div className="mt-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Current business needs
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {needs.map((need) => (
                        <span
                          key={need}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {need}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[24px] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Sparkles size={20} />
                </div>

                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-300">
                  Recommended next move
                </p>

                <h3 className="mt-2 text-xl font-black tracking-tight">
                  {projects.length === 0
                    ? "Launch your first real-world project."
                    : "Keep your project pipeline moving."}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {projects.length === 0
                    ? "Create a clear project brief, define what you need and let professionals apply with evidence of their skills."
                    : "Review applicants, discover more talent and keep your best project opportunities moving forward."}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      projects.length === 0
                        ? "/projects/new"
                        : "/business/projects"
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
                >
                  {projects.length === 0
                    ? "Post your first project"
                    : "View my projects"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>

            {/* Quick actions */}
            <section className="mt-6">
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Quick actions
                </p>
                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Move work forward
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  {
                    title: "Post a project",
                    text: "Create a project brief and start building your talent pipeline.",
                    icon: Plus,
                    href: "/projects/new",
                  },
                  {
                    title: "Discover professionals",
                    text: "Find people with relevant skills, experience and project evidence.",
                    icon: Search,
                    href: "/business/talent",
                  },
                  {
                    title: "Review applicants",
                    text: "See who applied to your projects and move the strongest candidates forward.",
                    icon: Users,
                    href: "/business/applicants",
                  },
                  {
                    title: "Manage organisation",
                    text: "Keep your business profile complete and ready for professionals.",
                    icon: Building2,
                    href: "/business/profile",
                  },
                ].map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.href}
                      type="button"
                      onClick={() => router.push(action.href)}
                      className="group rounded-[22px] border border-slate-200/80 bg-white p-5 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition group-hover:bg-teal-100">
                          <Icon size={18} />
                        </div>

                        <ArrowRight
                          size={17}
                          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-teal-600"
                        />
                      </div>

                      <h4 className="mt-5 text-sm font-black text-slate-950">
                        {action.title}
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {action.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Projects */}
            <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Project pipeline
                  </p>

                  <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Your projects
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/business/projects")}
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                >
                  View all
                  <ArrowRight size={15} />
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                    <FolderKanban size={20} />
                  </div>

                  <h4 className="mt-4 text-sm font-black text-slate-950">
                    No projects yet
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Your project pipeline will appear here once you create a
                    project.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/projects/new")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Create project
                    <Plus size={15} />
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() =>
                        router.push(`/business/projects/${project.id}`)
                      }
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 text-left transition hover:border-teal-100 hover:bg-teal-50/40"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-black text-slate-950">
                          {project.title || "Untitled project"}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          {project.status || "Draft"}{" "}
                          {project.applicants
                            ? `• ${project.applicants} applicant${
                                project.applicants === 1 ? "" : "s"
                              }`
                            : ""}
                        </div>
                      </div>

                      <ChevronRight
                        size={17}
                        className="shrink-0 text-slate-300"
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}