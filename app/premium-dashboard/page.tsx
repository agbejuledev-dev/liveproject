"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Globe2,
  LockKeyhole,
  MessageSquareText,
  Mic2,
  Route,
  Search,
  Settings2,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Video,
  Zap,
} from "lucide-react";

type PremiumFeature = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
};

const premiumFeatures: PremiumFeature[] = [
  {
    title: "UK Job Board",
    description: "Browse UK-focused opportunities.",
    href: "/uk-job-board",
    icon: BriefcaseBusiness,
  },
  {
    title: "AI Job Matches",
    description: "See roles ranked against your profile.",
    href: "/ai-job-matches",
    icon: Sparkles,
  },
  {
    title: "Application Tracker",
    description: "Manage your entire application pipeline.",
    href: "/application-tracker",
    icon: Activity,
  },
  {
    title: "AI Interview",
    description: "Practice realistic role-specific interviews.",
    href: "/ai-interview",
    icon: Video,
  },
  {
    title: "Job Readiness",
    description: "Understand your current career readiness.",
    href: "/job-readiness",
    icon: Target,
  },
  {
    title: "CV Review",
    description: "Get AI-powered CV and ATS feedback.",
    href: "/cv-review",
    icon: FileText,
  },
  {
    title: "Career Roadmap",
    description: "Build your personalised career path.",
    href: "/career-roadmap",
    icon: Route,
  },
  {
    title: "Certificates",
    description: "Access Premium certificates.",
    href: "/certificates",
    icon: Award,
  },
  {
    title: "Recommendations",
    description: "Manage professional recommendations.",
    href: "/recommendations",
    icon: MessageSquareText,
  },
];

const pipeline = [
  { label: "Saved", value: 8, color: "bg-slate-400" },
  { label: "Applied", value: 5, color: "bg-blue-500" },
  { label: "Interview", value: 2, color: "bg-violet-500" },
  { label: "Final Stage", value: 1, color: "bg-orange-500" },
];

export default function PremiumDashboardPage() {
  const [userName, setUserName] = useState("Professional");
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    try {
      const session = JSON.parse(
        sessionStorage.getItem("liveproject_session") || "null"
      );

      const onboarding = JSON.parse(
        sessionStorage.getItem("liveproject_onboarding") || "null"
      );

      if (session?.loggedIn) {
        setIsPremium(session.plan === "premium");
      }

      if (onboarding?.firstName) {
        setUserName(onboarding.firstName);
      }
    } catch {
      setIsPremium(false);
    }
  }, []);

  function enablePremiumPreview() {
    const current = JSON.parse(
      sessionStorage.getItem("liveproject_session") || "{}"
    );

    sessionStorage.setItem(
      "liveproject_session",
      JSON.stringify({
        ...current,
        loggedIn: true,
        plan: "premium",
        role: "professional",
      })
    );

    setIsPremium(true);
  }

  const profileScore = useMemo(() => {
    const completed = [
      true,
      true,
      true,
      true,
      false,
      true,
    ].filter(Boolean).length;

    return Math.round((completed / 6) * 100);
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes premiumGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes premiumFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -8px, 0);
          }
        }

        @keyframes premiumPulse {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.6;
            transform: scale(1.04);
          }
        }

        @keyframes premiumShine {
          0% {
            transform: translateX(-130%);
          }

          100% {
            transform: translateX(130%);
          }
        }

        .premium-grid {
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.06) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: premiumGrid 18s linear infinite;
        }

        .premium-card {
          position: relative;
          overflow: hidden;
        }

        .premium-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 45%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.12),
            transparent
          );
          transform: skewX(-15deg);
          animation: premiumShine 7s ease-in-out infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#071f1f]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400 text-slate-950 shadow-lg shadow-teal-400/20">
                <Sparkles size={19} />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                  LiveProject
                </p>
                <h1 className="text-lg font-black">
                  Premium Career Dashboard
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-300 sm:inline-flex">
              $99 Premium
            </span>

            <Link
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              <Settings2 size={17} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="premium-grid absolute inset-0 opacity-70" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "premiumPulse 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-120px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "premiumPulse 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
                <Sparkles size={14} />
                Premium Member
              </div>

              <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Welcome back,{" "}
                <span className="text-teal-300">{userName}.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Your complete career acceleration workspace is active. Discover
                opportunities, strengthen your evidence, practise interviews,
                and move every part of your career forward.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/ai-job-matches"
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
                >
                  View AI Matches
                  <Sparkles size={16} />
                </Link>

                <Link
                  href="/uk-job-board"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Browse UK Jobs
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["96%", "Top match"],
                  ["4", "Active tools"],
                  ["3", "Projects"],
                  ["82%", "Learning"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  >
                    <div className="text-xl font-black text-white">
                      {value}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="premium-card rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
              style={{ animation: "premiumFloat 6s ease-in-out infinite" }}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Career readiness
                    </p>
                    <div className="mt-1 text-5xl font-black">
                      78<span className="text-2xl text-teal-300">%</span>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                    <Target size={23} />
                  </div>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-teal-300" />
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["Profile", 92],
                    ["Experience", 84],
                    ["Portfolio", 76],
                    ["Career readiness", 61],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-400">
                          {label}
                        </span>
                        <span className="font-black text-teal-300">
                          {value}%
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full bg-teal-300"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/job-readiness"
                  className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3 transition hover:bg-white/10"
                >
                  <span className="text-xs font-black">
                    Improve readiness
                  </span>
                  <ArrowRight size={15} className="text-teal-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isPremium && (
        <section className="mx-auto max-w-[1500px] px-5 pt-6 lg:px-8">
          <button
            onClick={enablePremiumPreview}
            className="w-full rounded-2xl border border-dashed border-teal-300 bg-teal-50 p-4 text-left transition hover:bg-teal-100"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">
                  Development Preview
                </p>
                <p className="mt-1 text-sm font-bold text-slate-700">
                  Activate Premium preview to test the complete paid-account
                  experience.
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-xs font-black text-teal-700">
                Activate Preview
                <ArrowRight size={14} />
              </span>
            </div>
          </button>
        </section>
      )}

      <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: BriefcaseBusiness,
              label: "Applications",
              value: "8",
              sub: "2 need action",
              href: "/application-tracker",
            },
            {
              icon: Sparkles,
              label: "AI Job Matches",
              value: "6",
              sub: "3 highly matched",
              href: "/ai-job-matches",
            },
            {
              icon: BookOpen,
              label: "Courses",
              value: "3",
              sub: "1 nearing completion",
              href: "/my-courses",
            },
            {
              icon: Award,
              label: "Verified Experience",
              value: "4",
              sub: "Projects completed",
              href: "/experience-passport",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-[1.7rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={20} />
                  </div>

                  <ArrowRight size={16} className="text-slate-300" />
                </div>

                <div className="mt-5 text-3xl font-black">{item.value}</div>

                <div className="mt-1 text-sm font-black">{item.label}</div>

                <div className="mt-1 text-xs text-slate-400">
                  {item.sub}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
            Premium Career Tools
          </p>
          <h3 className="mt-2 text-3xl font-black tracking-tight">
            Everything working together.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Premium is designed as one career system rather than a collection
            of disconnected features.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {premiumFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="premium-card group rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                      <Icon size={20} />
                    </div>

                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-teal-700">
                      Premium
                    </span>
                  </div>

                  <h4 className="mt-5 text-base font-black">
                    {feature.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-black text-teal-700">
                    Open tool
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[2rem] bg-slate-950 p-7 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <Trophy size={21} />
              </div>

              <h3 className="mt-5 max-w-xl text-2xl font-black sm:text-3xl">
                Premium should make your next career move clearer.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Discover opportunities, understand your gaps, prepare better,
                and build evidence that supports your application.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Discover relevant UK roles",
                  "Understand your job readiness",
                  "Practise realistic interviews",
                  "Build a personalised roadmap",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-xs font-bold text-slate-300"
                  >
                    <CheckCircle2 size={14} className="text-teal-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/6 bg-[#f7faf9] p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <UserRound size={21} />
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Your Premium status
              </h3>

              <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Membership
                  </span>

                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-emerald-700">
                    Active
                  </span>
                </div>

                <div className="mt-5 text-3xl font-black">$99</div>

                <div className="mt-1 text-sm text-slate-500">
                  LiveProject Premium
                </div>

                <div className="mt-5 space-y-2 text-xs font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    UK opportunities
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    AI career tools
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Premium career profile
                  </div>
                </div>
              </div>

              <Link
                href="/settings"
                className="mt-5 inline-flex items-center gap-2 text-sm font-black text-teal-700"
              >
                Manage account
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/workspace" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/premium" className="hover:text-slate-900">
            Premium
          </Link>
          <Link href="/settings" className="hover:text-slate-900">
            Settings
          </Link>
        </div>
      </footer>
    </main>
  );
}