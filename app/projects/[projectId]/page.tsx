"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  Code2,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import { getProjectById, type Project } from "@/lib/projects";
import Toast, { type ToastType } from "@/components/Toast";

type LiveProjectSession = {
  loggedIn?: boolean;
  plan?: "free" | "premium";
};

function getSession(): LiveProjectSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem("liveproject_session");
    if (!raw) return null;

    const session = JSON.parse(raw);

    if (!session?.loggedIn) return null;

    return session;
  } catch {
    return null;
  }
}

function hasCompletedOnboarding() {
  if (typeof window === "undefined") return false;

  try {
    const onboarding = sessionStorage.getItem(
      "liveproject_onboarding"
    );

    if (!onboarding) return false;

    const parsed = JSON.parse(onboarding);

    if (!parsed) return false;

    const requiredFields = [
      parsed.firstName,
      parsed.lastName,
      parsed.country,
      parsed.careerTrack,
      parsed.experienceLevel,
      parsed.currentStatus,
      parsed.workPreference,
    ];

    return requiredFields.every(
      (value) =>
        typeof value === "string" &&
        value.trim().length > 0
    );
  } catch {
    return false;
  }
}

function saveAfterAuth(path: string) {
  sessionStorage.setItem(
    "liveproject_after_auth",
    path
  );
}

function saveAfterUpgrade(path: string) {
  sessionStorage.setItem(
    "liveproject_after_upgrade",
    path
  );
}

function getApplicationKey(projectId: number) {
  return `liveproject_project_application_${projectId}`;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    type: ToastType;
    title: string;
    message: string;
  }>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const showToast = useCallback(
    (
      type: ToastType,
      title: string,
      message: string
    ) => {
      setToast({
        show: true,
        type,
        title,
        message,
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    setToast((current) => ({
      ...current,
      show: false,
    }));
  }, []);

  useEffect(() => {
    const rawId = params?.projectId;

    const projectId = Number(
      Array.isArray(rawId) ? rawId[0] : rawId
    );

    if (!Number.isFinite(projectId)) {
      router.replace("/projects");
      return;
    }

    const found = getProjectById(projectId);

    if (!found) {
      router.replace("/projects");
      return;
    }

    const session = getSession();

    setProject(found);
    setIsLoggedIn(Boolean(session?.loggedIn));
    setIsOnboardingComplete(
      Boolean(
        session?.loggedIn &&
          hasCompletedOnboarding()
      )
    );

    setHasApplied(
      sessionStorage.getItem(
        getApplicationKey(projectId)
      ) === "true"
    );
  }, [params, router]);

  const handleApply = () => {
    if (!project || isProcessing) return;

    const session = getSession();

    if (!session?.loggedIn) {
      saveAfterAuth(`/projects/${project.id}`);
      router.push("/register");
      return;
    }

    if (!hasCompletedOnboarding()) {
      saveAfterAuth(`/projects/${project.id}`);
      router.push("/onboarding");
      return;
    }

    const plan =
      session.plan === "premium"
        ? "premium"
        : "free";

    if (
      project.access === "premium" &&
      plan !== "premium"
    ) {
      saveAfterUpgrade(
        `/projects/${project.id}`
      );

      router.push("/checkout");
      return;
    }

    if (hasApplied) {
      router.push(`/workspace/${project.id}`);
      return;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      sessionStorage.setItem(
        getApplicationKey(project.id),
        "true"
      );

      setHasApplied(true);
      setIsProcessing(false);

      showToast(
        "success",
        "Application submitted",
        "Your project workspace is being prepared."
      );

      window.setTimeout(() => {
        router.push(
          `/workspace/${project.id}`
        );
      }, 1800);
    }, 450);
  };

  if (!project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

          <p className="text-sm font-semibold text-slate-400">
            Loading project...
          </p>
        </div>
      </main>
    );
  }

  const primaryActionLabel = hasApplied
    ? "Open Workspace"
    : isLoggedIn && isOnboardingComplete
      ? "Apply / Start Project"
      : "Get Started";

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-left text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
              <Rocket className="h-5 w-5" />
            </div>

            <p className="text-lg font-black">
              LiveProject
            </p>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white sm:block"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-blue-50"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>
        </div>
      </div>

      <section className="bg-slate-950 px-5 py-16 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <span
                className={
                  project.access === "free"
                    ? "rounded-full bg-emerald-400 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-950"
                    : "rounded-full bg-amber-300 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-950"
                }
              >
                {project.access === "free"
                  ? "Free Project"
                  : "Premium Project"}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                {project.track}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
                {project.level}
              </span>
            </div>

            <p className="mt-7 text-sm font-bold text-blue-400">
              {project.company}
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              {project.title}
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
              {project.description}
            </p>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleApply}
              className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-7 py-4 text-sm font-black text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing
                ? "Processing..."
                : primaryActionLabel}

              {!isProcessing && (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-slate-200 sm:grid-cols-3">
          <div className="bg-white px-6 py-7">
            <Clock3 className="h-5 w-5 text-blue-600" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Duration
            </p>
            <p className="mt-1 text-lg font-black">
              {project.duration}
            </p>
          </div>

          <div className="bg-white px-6 py-7">
            <Users className="h-5 w-5 text-blue-600" />
            <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Format
            </p>
            <p className="mt-1 text-lg font-black">
              {project.format}
            </p>
          </div>

          <div className="bg-white px-6 py-7">
            {project.access === "premium" ? (
              <Sparkles className="h-5 w-5 text-amber-500" />
            ) : (
              <Code2 className="h-5 w-5 text-blue-600" />
            )}

            <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
              Access
            </p>

            <p className="mt-1 text-lg font-black">
              {project.access === "premium"
                ? "Premium"
                : "Free"}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <div className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <h2 className="mt-7 text-3xl font-black">
                About this project
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                This project is designed to simulate the kind of
                work you may encounter in a professional environment.
                You will analyse the brief, make decisions, create a
                solution and document your work.
              </p>

              <p className="mt-5 text-base leading-8 text-slate-600">
                You are expected to approach the project as a
                professional assignment rather than simply a tutorial.
                Your reasoning, process and final output all matter.
              </p>
            </div>

            <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-3xl font-black">
                Skills you will practise
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-3xl font-black">
                What you will deliver
              </h2>

              <div className="mt-6 space-y-3">
                {project.deliverables.map(
                  (deliverable) => (
                    <div
                      key={deliverable}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Check className="h-4 w-4" />
                      </div>

                      <span className="text-sm font-semibold text-slate-700">
                        {deliverable}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl">
              <div className="bg-slate-950 p-7 text-white">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <Rocket className="h-6 w-6" />
                </div>

                <h2 className="mt-6 text-2xl font-black">
                  Ready to start?
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {hasApplied
                    ? "You already applied to this project."
                    : isLoggedIn && isOnboardingComplete
                      ? "Your account is ready. You can start your project."
                      : "Create your LiveProject account before beginning this project."}
                </p>
              </div>

              <div className="p-7">
                <div className="space-y-4">
                  {[
                    "Create your professional account",
                    "Complete verification",
                    "Complete your onboarding",
                    "Apply and enter your workspace",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <Check className="h-4 w-4 text-emerald-500" />

                      <span className="text-sm font-semibold text-slate-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleApply}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isProcessing
                    ? "Processing..."
                    : primaryActionLabel}

                  {!isProcessing && (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                  Your application is linked to your account
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="bg-[#05070b] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-black">
            LiveProject
          </span>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => router.push("/about")}
              className="hover:text-white"
            >
              About
            </button>

            <button
              type="button"
              onClick={() => router.push("/blog")}
              className="hover:text-white"
            >
              Blog
            </button>

            <button
              type="button"
              onClick={() => router.push("/resources")}
              className="hover:text-white"
            >
              Resources
            </button>
          </div>
        </div>
      </footer>

      <Toast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        duration={2500}
        onClose={hideToast}
      />
    </main>
  );
}