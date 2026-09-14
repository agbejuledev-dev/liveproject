"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BellRing,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Flame,
  Lightbulb,
  LockKeyhole,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getLiveProjectSession,
  isPremiumUser,
  saveAfterAuthDestination,
  saveAfterUpgradeDestination,
} from "@/lib/access";

const insights = [
  {
    title: "Frontend Development",
    trend: "+18%",
    label: "Hiring demand",
    description:
      "Frontend opportunities continue to favour React, TypeScript, modern frameworks and strong practical project evidence.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Product Management",
    trend: "+14%",
    label: "Role activity",
    description:
      "Employers increasingly value people who can connect product strategy with delivery, analytics and Agile execution.",
    icon: Target,
  },
  {
    title: "Agile Delivery",
    trend: "+21%",
    label: "Skill relevance",
    description:
      "Scrum, stakeholder management, delivery planning and evidence of cross-functional collaboration remain highly valuable.",
    icon: TrendingUp,
  },
];

const actions = [
  {
    title: "Strengthen your project evidence",
    description:
      "Complete another relevant LiveProject project and add the resulting evidence to your Experience Passport.",
    href: "/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "Review your career readiness",
    description:
      "Use the Job Readiness tool to identify gaps between your current profile and target roles.",
    href: "/job-readiness",
    icon: BarChart3,
  },
  {
    title: "Improve your CV",
    description:
      "Run your CV through LiveProject CV Review before your next UK application.",
    href: "/cv-review",
    icon: Sparkles,
  },
];

export default function CareerInsightsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const session = getLiveProjectSession();

    const logged =
      session?.loggedIn === true ||
      sessionStorage.getItem("liveproject_session") !== null;

    setLoggedIn(logged);
    setPremium(isPremiumUser());
    setReady(true);
  }, []);

  const handleAccess = () => {
    const destination = "/career-insights";

    if (!loggedIn) {
      saveAfterAuthDestination(destination);
      router.push("/login");
      return;
    }

    saveAfterUpgradeDestination(destination);
    router.push("/premium");
  };

  const score = useMemo(() => {
    if (!ready) return 0;

    const onboarding = sessionStorage.getItem("liveproject_onboarding");
    const profile = sessionStorage.getItem("liveproject_profile_complete");
    const passport = sessionStorage.getItem("liveproject_experience_passport");

    let value = 42;

    if (onboarding) value += 18;
    if (profile) value += 12;
    if (passport) value += 16;

    return Math.min(value, 98);
  }, [ready]);

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f6f9f9] p-6">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-9 w-48 rounded-lg bg-slate-200" />
          <div className="mt-6 h-48 rounded-[2rem] bg-slate-200" />
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="h-48 rounded-[2rem] bg-slate-200" />
            <div className="h-48 rounded-[2rem] bg-slate-200" />
            <div className="h-48 rounded-[2rem] bg-slate-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!premium) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#071f1f] text-white">
        <style jsx global>{`
          @keyframes insightGrid {
            0% {
              background-position: 0 0;
            }

            100% {
              background-position: 46px 46px;
            }
          }

          @keyframes insightPulse {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(0.96);
            }

            50% {
              opacity: 0.55;
              transform: scale(1.04);
            }
          }

          @keyframes insightFloat {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-8px);
            }
          }
        `}</style>

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,212,191,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.08) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            animation: "insightGrid 18s linear infinite",
          }}
        />

        <div
          className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "insightPulse 7s ease-in-out infinite" }}
        />

        <div
          className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "insightPulse 9s ease-in-out infinite" }}
        />

        <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-5 py-14">
          <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
            <Link
              href={loggedIn ? "/workspace" : "/"}
              className="inline-flex items-center gap-2 text-xs font-black text-slate-300 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <div
              className="mt-12 max-w-3xl"
              style={{ animation: "insightFloat 7s ease-in-out infinite" }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-300 text-slate-950">
                <BarChart3 size={25} />
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-200">
                <LockKeyhole size={12} />
                Premium Career Intelligence
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                Understand where the market is moving.
                <span className="text-teal-300"> Then move with it.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                LiveProject Career Insights turns career-market signals into
                practical actions around the roles, skills and opportunities
                that matter to you.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Market trends", "Track changing role demand."],
                  ["Skill signals", "See which capabilities matter."],
                  ["Career actions", "Turn insight into your next move."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <div className="text-sm font-black">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-400">
                      {text}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAccess}
                className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-teal-300 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-200"
              >
                {!loggedIn ? "Create Account" : "Unlock Premium"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f9f9] text-slate-950">
      <style jsx global>{`
        @keyframes dashboardGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 42px 42px;
          }
        }

        @keyframes dashboardGlow {
          0%,
          100% {
            opacity: 0.14;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.35;
            transform: scale(1.05);
          }
        }

        @keyframes scorePulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(13, 148, 136, 0);
          }

          50% {
            box-shadow: 0 0 0 10px rgba(13, 148, 136, 0.05);
          }
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
            <Sparkles size={12} />
            Premium Intelligence
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-[#eaf5f4]">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(rgba(13,148,136,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,.055) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            animation: "dashboardGrid 18s linear infinite",
          }}
        />

        <div
          className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl"
          style={{ animation: "dashboardGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
              Career Intelligence
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
              Career Insights
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              A Premium view of the market, your profile and the actions that
              can improve your next career move.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Career Readiness
                  </div>

                  <div className="mt-2 text-4xl font-black tracking-tight">
                    {score}%
                  </div>
                </div>

                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-teal-100"
                  style={{ animation: "scorePulse 3s ease-in-out infinite" }}
                >
                  <div
                    className="absolute inset-0 rounded-full border-[8px] border-transparent"
                    style={{
                      borderTopColor: "#0f766e",
                      borderRightColor: "#0f766e",
                      transform: "rotate(25deg)",
                    }}
                  />
                  <span className="relative text-lg font-black text-teal-700">
                    {score}
                  </span>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-500">
                Your score reflects the evidence currently available in your
                LiveProject profile. Completing projects, strengthening your
                profile and building verified evidence can improve it.
              </p>

              <Link
                href="/job-readiness"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white transition hover:bg-slate-800"
              >
                Open Job Readiness
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-300 text-slate-950">
                <Flame size={20} />
              </div>

              <h2 className="mt-5 text-xl font-black">
                Your next career move
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Don't just consume market information. Use it to decide what
                to learn, what to build and which roles to target next.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-teal-300"
                  />
                  <span className="text-xs leading-5 text-slate-300">
                    Build evidence around your target role.
                  </span>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-teal-300"
                  />
                  <span className="text-xs leading-5 text-slate-300">
                    Track UK opportunities that match your direction.
                  </span>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2
                    size={17}
                    className="mt-0.5 shrink-0 text-teal-300"
                  />
                  <span className="text-xs leading-5 text-slate-300">
                    Close the highest-impact skill gaps first.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
              Market signals
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              What matters right now
            </h2>
          </div>

          <span className="hidden text-xs text-slate-400 sm:block">
            Illustrative market signals for product experience
          </span>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {insights.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={20} />
                  </div>

                  <div className="rounded-xl bg-emerald-50 px-3 py-2 text-right">
                    <div className="text-lg font-black text-emerald-700">
                      {item.trend}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-wide text-emerald-600/70">
                      {item.label}
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-black">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-black text-teal-700">
                  <TrendingUp size={14} />
                  Focus area
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
              Recommended actions
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Turn insight into progress.
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The strongest career insight is the action you take after
              learning something new.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="group rounded-[1.8rem] border border-black/6 bg-[#f8fbfb] p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-5 text-base font-black">
                    {action.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {action.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-black text-teal-700">
                    Continue
                    <ArrowRight
                      size={14}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-7 text-white sm:p-9">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-teal-300">
                <BellRing size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                  Stay proactive
                </span>
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                Don't miss the opportunity that fits your direction.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Create a Premium job alert and let LiveProject keep the search
                active while you focus on building your experience.
              </p>
            </div>

            <Link
              href="/job-alerts"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-teal-300 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-teal-200"
            >
              Manage Job Alerts
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}