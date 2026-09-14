"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  FileBadge2,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Lock,
  Menu,
  Settings,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

type UserPlan = "free" | "premium";

type Session = {
  loggedIn?: boolean;
  plan?: UserPlan;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type Registration = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  role?: string;
  accountType?: "professional" | "client";
};

type Onboarding = {
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

const starterProjects: Record<
  string,
  {
    title: string;
    description: string;
    level: string;
    duration: string;
  }
> = {
  "Web Development": {
    title: "Build a Production Landing Page",
    description:
      "Build a responsive production-style website for a growing digital business.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  "Mobile Development": {
    title: "Build a Mobile Service App",
    description:
      "Design and build a mobile experience around a real-world service problem.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  "UI/UX Design": {
    title: "Design a Complete SaaS Experience",
    description:
      "Research, wireframe and design a polished SaaS product experience.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  "Data & Analytics": {
    title: "Create a Business Analytics Dashboard",
    description:
      "Turn business data into an actionable analytics dashboard and insights.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  "Digital Marketing": {
    title: "Build a Digital Growth Campaign",
    description:
      "Create a practical campaign strategy designed around a real business goal.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  "Business Analysis": {
    title: "Analyse a Business Process",
    description:
      "Analyse a business workflow and produce professional requirements and recommendations.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  "Product Management": {
    title: "Build a Product Strategy",
    description:
      "Take a product idea from problem discovery through roadmap and delivery planning.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
  Cybersecurity: {
    title: "Perform a Security Assessment",
    description:
      "Investigate a realistic security scenario and produce a professional assessment.",
    level: "Beginner",
    duration: "2–3 weeks",
  },
};

const starterCourses: Record<string, string> = {
  "Web Development": "Modern Web Development Foundations",
  "Mobile Development": "Mobile App Development Foundations",
  "UI/UX Design": "UI/UX Design Foundations",
  "Data & Analytics": "Data Analytics Foundations",
  "Digital Marketing": "Digital Marketing Foundations",
  "Business Analysis": "Business Analysis Foundations",
  "Product Management": "Product Management Foundations",
  Cybersecurity: "Cybersecurity Foundations",
};

export default function WorkspacePage() {
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registration, setRegistration] =
    useState<Registration>({});
  const [onboarding, setOnboarding] =
    useState<Onboarding>({});

  useEffect(() => {
    try {
      const rawSession = sessionStorage.getItem(
        "liveproject_session"
      );

      const rawRegistration = sessionStorage.getItem(
        "liveproject_registration"
      );

      const rawOnboarding = sessionStorage.getItem(
        "liveproject_onboarding"
      );

      if (!rawSession) {
        router.replace("/register");
        return;
      }

      const parsedSession = JSON.parse(rawSession);

      if (!parsedSession?.loggedIn) {
        router.replace("/register");
        return;
      }

      const role =
        parsedSession.accountType ||
        parsedSession.role ||
        "";

      if (role === "client") {
        router.replace("/business");
        return;
      }

      setSession(parsedSession);

      if (rawRegistration) {
        setRegistration(JSON.parse(rawRegistration));
      }

      if (rawOnboarding) {
        setOnboarding(JSON.parse(rawOnboarding));
      }

      setLoaded(true);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  const firstName =
    onboarding.firstName ||
    registration.firstName ||
    "there";

  const lastName =
    onboarding.lastName ||
    registration.lastName ||
    "";

  const country =
    onboarding.country ||
    registration.country ||
    "";

  const careerTrack = onboarding.careerTrack || "";

  const experienceLevel =
    onboarding.experienceLevel || "";

  const skills = onboarding.skills || [];

  const opportunities =
    onboarding.opportunities || [];

  const profileCompletion = useMemo(() => {
    if (!onboarding || Object.keys(onboarding).length === 0) {
      return 0;
    }

    const fields = [
      onboarding.firstName,
      onboarding.lastName,
      onboarding.country,
      onboarding.bio,
      onboarding.careerTrack,
      onboarding.experienceLevel,
      onboarding.currentStatus,
      onboarding.skills?.length,
      onboarding.linkedin,
      onboarding.github,
      onboarding.portfolio,
      onboarding.cvName,
      onboarding.opportunities?.length,
      onboarding.workPreference,
    ];

    const completed = fields.filter(Boolean).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [onboarding]);

  const recommendedProject =
    starterProjects[careerTrack] ||
    starterProjects["Web Development"];

  const recommendedCourse =
    starterCourses[careerTrack] ||
    "Career Foundations";

  const isPremium = session?.plan === "premium";

  function openPremiumFeature(path: string) {
    sessionStorage.setItem(
      "liveproject_after_upgrade",
      path
    );

    router.push("/premium");
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm text-slate-500">
            Loading your workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-[#172033]">
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[88px] items-center border-b border-slate-100 px-7">
          <button
            onClick={() => router.push("/")}
            className="text-left"
          >
            <div className="text-[22px] font-black tracking-[0.22em] text-[#11788a]">
              LIVEPROJECT
            </div>

            <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Experience that gets you hired
            </div>
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-xl p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-7">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Workspace
            </p>

            <SidebarItem
              active
              icon={<LayoutDashboard size={19} />}
              label="Overview"
              onClick={() => {
                setMobileOpen(false);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            />
          </div>

          <SidebarSection title="Experience">
            <SidebarItem
              icon={<FolderKanban size={19} />}
              label="Real-World Projects"
              onClick={() => router.push("/projects")}
            />

            <SidebarItem
              icon={<ClipboardList size={19} />}
              label="My Projects"
              onClick={() => router.push("/applications")}
            />

            <SidebarItem
              icon={<ClipboardList size={19} />}
              label="Applications"
              onClick={() => router.push("/applications")}
            />
          </SidebarSection>

          <SidebarSection title="Career Profile">
            <SidebarItem
              icon={<Zap size={19} />}
              label="Experience Passport"
              onClick={() =>
                router.push("/experience-passport")
              }
            />

            <SidebarItem
              icon={<BriefcaseBusiness size={19} />}
              label="Portfolio"
              onClick={() => router.push("/portfolio")}
            />

            <SidebarItem
              icon={<FileBadge2 size={19} />}
              label="Certificates"
              locked={!isPremium}
              onClick={() =>
                isPremium
                  ? router.push("/certificates")
                  : openPremiumFeature("/certificates")
              }
            />

            <SidebarItem
              icon={<CircleUserRound size={19} />}
              label="Recommendations"
              locked={!isPremium}
              onClick={() =>
                isPremium
                  ? router.push("/recommendations")
                  : openPremiumFeature("/recommendations")
              }
            />

            <SidebarItem
              icon={<UserRound size={19} />}
              label="Profile"
              onClick={() => router.push("/profile")}
            />
          </SidebarSection>

          <SidebarSection title="Learning">
            <SidebarItem
              icon={<GraduationCap size={19} />}
              label="Courses"
              onClick={() => router.push("/courses")}
            />

            <SidebarItem
              icon={<BookOpen size={19} />}
              label="My Courses"
              onClick={() => router.push("/my-courses")}
            />
          </SidebarSection>

          <SidebarSection title="Opportunities">
            <SidebarItem
              icon={<BriefcaseBusiness size={19} />}
              label="UK Job Board"
              locked={!isPremium}
              onClick={() =>
                isPremium
                  ? router.push("/job-board")
                  : openPremiumFeature("/job-board")
              }
            />

            <SidebarItem
              icon={<Sparkles size={19} />}
              label="AI Job Matches"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/job-board?mode=matches")
              }
            />

            <SidebarItem
              icon={<FolderKanban size={19} />}
              label="Saved Jobs"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/job-board?mode=saved")
              }
            />

            <SidebarItem
              icon={<ClipboardList size={19} />}
              label="Application Tracker"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/job-board?mode=applications")
              }
            />
          </SidebarSection>

          <SidebarSection title="AI Career Tools">
            <SidebarItem
              icon={<Sparkles size={19} />}
              label="AI Interview"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/ai-interview")
              }
            />

            <SidebarItem
              icon={<CheckCircle2 size={19} />}
              label="Job Readiness"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/job-readiness")
              }
            />

            <SidebarItem
              icon={<FileBadge2 size={19} />}
              label="CV Review"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/cv-review")
              }
            />

            <SidebarItem
              icon={<Zap size={19} />}
              label="Career Roadmap"
              locked={!isPremium}
              onClick={() =>
                openPremiumFeature("/career-roadmap")
              }
            />
          </SidebarSection>
        </div>

        <div className="border-t border-slate-100 p-4">
          <SidebarItem
            icon={<Settings size={19} />}
            label="Settings"
            onClick={() => router.push("/settings")}
          />
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 h-[88px] border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div>
                <p className="hidden text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                  LiveProject / Professional Workspace
                </p>

                <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">
                  Your Career Workspace
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition hover:bg-slate-50"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#11788a] text-sm font-bold text-white">
                  {getInitials(firstName, lastName)}
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-[130px] truncate text-sm font-semibold text-slate-800">
                    {firstName} {lastName}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    {isPremium ? "Premium" : "Free"}
                  </p>
                </div>

                <ChevronRight
                  size={17}
                  className="text-slate-400"
                />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">
          {/* Welcome */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#11788a]">
                  Welcome back 👋
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  {firstName}, let&apos;s build your experience.
                </h2>

                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-500">
                  Your LiveProject workspace is ready. Start a
                  real-world project or begin learning to build
                  experience you can prove.
                </p>
              </div>

              <div
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold ${
                  isPremium
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-slate-200 bg-white text-slate-600"
                }`}
              >
                {isPremium ? (
                  <>
                    <Sparkles size={14} />
                    Premium Member
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                    Free Member
                  </>
                )}
              </div>
            </div>
          </section>

          {/* Profile */}
          <section className="mb-8 grid gap-5 xl:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-6 sm:flex-row">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                      Your career profile
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <h3 className="text-2xl font-bold text-slate-950">
                        {careerTrack ||
                          "Choose your career track"}
                      </h3>

                      {experienceLevel && (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {experienceLevel}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      {country && <span>{country}</span>}

                      {onboarding.currentStatus && (
                        <span>
                          {onboarding.currentStatus}
                        </span>
                      )}

                      {onboarding.workPreference && (
                        <span>
                          {onboarding.workPreference}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/profile")}
                    className="inline-flex h-fit items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Edit profile
                    <ArrowRight size={16} />
                  </button>
                </div>

                <div className="mt-7">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      Profile completion
                    </span>

                    <span className="text-xs font-bold text-slate-800">
                      {profileCompletion}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-[#11788a] transition-all"
                      style={{
                        width: `${profileCompletion}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] bg-[#11788a] p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">
                Your goal
              </p>

              <h3 className="mt-3 text-xl font-bold leading-snug">
                Turn your skills into verified experience.
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/75">
                Complete projects, learn new skills and build a
                portfolio that shows what you can actually do.
              </p>

              <button
                onClick={() => router.push("/projects")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#11788a] transition hover:bg-slate-50"
              >
                Explore projects
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={<FolderKanban size={20} />}
              label="Projects"
              value="0"
              description="No project started"
            />

            <StatCard
              icon={<BookOpen size={20} />}
              label="Courses"
              value="0"
              description="No course started"
            />

            <StatCard
              icon={<CheckCircle2 size={20} />}
              label="Verified Work"
              value="0"
              description="Complete your first project"
            />

            <StatCard
              icon={<Zap size={20} />}
              label="Experience"
              value="0 hrs"
              description="Earn verified hours"
            />
          </section>

          {/* Next step */}
          <section className="mb-8">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Your next step
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-950">
                Start building your experience
              </h2>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f5f7] text-[#11788a]">
                    <FolderKanban size={23} />
                  </div>

                  <span className="rounded-full bg-[#e8f5f7] px-3 py-1 text-[11px] font-bold text-[#11788a]">
                    Recommended
                  </span>
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Project for you
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {recommendedProject.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {recommendedProject.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <InfoPill text={recommendedProject.level} />
                  <InfoPill text={recommendedProject.duration} />
                  <InfoPill
                    text={careerTrack || "Career track"}
                  />
                </div>

                <button
                  onClick={() => router.push("/projects")}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#11788a]"
                >
                  Explore project
                  <ArrowRight size={17} />
                </button>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/50 sm:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <GraduationCap size={23} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
                    Learn
                  </span>
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Course for you
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {recommendedCourse}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Build the knowledge you need to perform better on
                  real-world projects in your chosen career track.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <InfoPill
                    text={
                      careerTrack || "Career foundations"
                    }
                  />

                  <InfoPill text="Self-paced" />

                  {!isPremium && (
                    <InfoPill text="Free access available" />
                  )}
                </div>

                <button
                  onClick={() => router.push("/courses")}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Browse courses
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>

          {/* Career snapshot */}
          <section className="mb-8 grid gap-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                    Your skills
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-slate-950">
                    Skills you&apos;re bringing
                  </h3>
                </div>

                <button
                  onClick={() => router.push("/profile")}
                  className="text-sm font-bold text-[#11788a]"
                >
                  Edit
                </button>
              </div>

              {skills.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <EmptyInline
                  title="No skills added yet"
                  text="Add your skills to make your career profile more useful."
                  action="Complete profile"
                  onClick={() => router.push("/profile")}
                />
              )}
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-6 sm:p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                  What you&apos;re looking for
                </p>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  Your opportunities
                </h3>
              </div>

              {opportunities.length > 0 ? (
                <div className="mt-6 space-y-3">
                  {opportunities.map((opportunity) => (
                    <div
                      key={opportunity}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-[#11788a]"
                      />

                      {opportunity}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyInline
                  title="No opportunities selected"
                  text="Tell us what you're looking for so we can personalize your experience."
                  action="Update profile"
                  onClick={() => router.push("/profile")}
                />
              )}
            </div>
          </section>

          {/* Empty experience */}
          <section className="mb-8 rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <FolderKanban size={25} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-950">
              Your experience starts here
            </h3>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
              You haven&apos;t completed any projects yet. Once you
              start working, your projects, verified work, portfolio
              and Experience Passport will appear here automatically.
            </p>

            <button
              onClick={() => router.push("/projects")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#11788a] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#0f6877]"
            >
              Find your first project
              <ArrowRight size={17} />
            </button>
          </section>

          {/* Premium */}
          {!isPremium && (
            <section className="overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white sm:p-9">
              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80">
                    <Sparkles size={14} />
                    LiveProject Premium
                  </div>

                  <h3 className="mt-4 text-2xl font-bold sm:text-3xl">
                    Unlock the full career advantage.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Get deeper projects, full learning access,
                    certificates, recommendations, premium jobs and
                    AI-powered career tools.
                  </p>
                </div>

                <button
                  onClick={() => router.push("/premium")}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Explore Premium
                  <ArrowRight size={17} />
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-7">
      <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </p>

      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({
  icon,
  label,
  active = false,
  locked = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  locked?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
        active
          ? "bg-[#11788a] text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      <span
        className={
          active
            ? "text-white"
            : "text-slate-400 group-hover:text-slate-700"
        }
      >
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {locked && (
        <Lock
          size={13}
          className={
            active ? "text-white/70" : "text-slate-300"
          }
        />
      )}
    </button>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

function InfoPill({ text }: { text: string }) {
  return (
    <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
      {text}
    </span>
  );
}

function EmptyInline({
  title,
  text,
  action,
  onClick,
}: {
  title: string;
  text: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="mt-6 rounded-xl bg-slate-50 p-5">
      <p className="text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {text}
      </p>

      <button
        onClick={onClick}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#11788a]"
      >
        {action}
        <ArrowRight size={15} />
      </button>
    </div>
  );
}

function getInitials(
  firstName: string,
  lastName: string
) {
  const first =
    firstName?.trim()?.charAt(0) || "";

  const last =
    lastName?.trim()?.charAt(0) || "";

  return `${first}${last}`.toUpperCase() || "LP";
}