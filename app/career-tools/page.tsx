"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Mic2,
  Route,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

const tools = [
  {
    title: "AI Job Matches",
    description:
      "Discover opportunities ranked against your skills, profile and verified experience.",
    href: "/ai-job-matches",
    icon: BriefcaseBusiness,
    accent: "bg-teal-50 text-teal-700",
    tag: "Discover",
  },
  {
    title: "AI Interview",
    description:
      "Practise realistic role-specific interviews and receive structured performance feedback.",
    href: "/ai-interview",
    icon: Mic2,
    accent: "bg-violet-50 text-violet-700",
    tag: "Prepare",
  },
  {
    title: "Job Readiness",
    description:
      "See how ready you are for your target role and identify the highest-impact gaps.",
    href: "/job-readiness",
    icon: Target,
    accent: "bg-amber-50 text-amber-700",
    tag: "Assess",
  },
  {
    title: "CV Review",
    description:
      "Analyse your CV for ATS compatibility, keywords, impact and target-role alignment.",
    href: "/cv-review",
    icon: FileText,
    accent: "bg-blue-50 text-blue-700",
    tag: "Improve",
  },
  {
    title: "Career Roadmap",
    description:
      "Turn your current profile into a practical sequence of skills, projects and milestones.",
    href: "/career-roadmap",
    icon: Route,
    accent: "bg-emerald-50 text-emerald-700",
    tag: "Plan",
  },
];

const journey = [
  {
    number: "01",
    title: "Discover",
    text: "Use AI Job Matches to find roles that fit your direction.",
  },
  {
    number: "02",
    title: "Assess",
    text: "Use Job Readiness to understand your current strengths and gaps.",
  },
  {
    number: "03",
    title: "Improve",
    text: "Strengthen your CV and close skill gaps through learning and projects.",
  },
  {
    number: "04",
    title: "Practise",
    text: "Use AI Interview to prepare for realistic interview conversations.",
  },
  {
    number: "05",
    title: "Execute",
    text: "Apply, track your applications and follow your Career Roadmap.",
  },
];

export default function CareerToolsPage() {
  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes careerToolsGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes careerToolsGlow {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.65;
            transform: scale(1.05);
          }
        }

        @keyframes careerToolsFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .career-tools-grid {
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: careerToolsGrid 18s linear infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/premium-dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-slate-700 transition hover:-translate-x-0.5 hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                Premium
              </p>
              <h1 className="text-lg font-black">
                AI Career Tools
              </h1>
            </div>
          </div>

          <Link
            href="/application-tracker"
            className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800 sm:inline-flex"
          >
            Application Tracker
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="career-tools-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "careerToolsGlow 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-140px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "careerToolsGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-14 lg:px-8 lg:py-18">
          <div className="grid gap-10 lg:grid-cols-[1fr_430px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
                <Sparkles size={14} />
                LIVEPROJECT AI CAREER SYSTEM
              </div>

              <h2 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
                Your career tools should work{" "}
                <span className="text-teal-300">together.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 sm:text-lg">
                LiveProject connects discovery, preparation, assessment,
                evidence and planning into one Premium career workflow.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/ai-job-matches"
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
                >
                  Start with AI Matches
                  <Sparkles size={16} />
                </Link>

                <Link
                  href="/premium-dashboard"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Premium Dashboard
                </Link>
              </div>
            </div>

            <div
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
              style={{ animation: "careerToolsFloat 6s ease-in-out infinite" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Career System
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    5 connected tools
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Zap size={22} />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {journey.slice(0, 4).map((step, index) => (
                  <div
                    key={step.number}
                    className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-400/10 text-[10px] font-black text-teal-300">
                      {step.number}
                    </div>

                    <div>
                      <div className="text-xs font-black">
                        {step.title}
                      </div>
                      <div className="mt-0.5 text-[10px] text-slate-500">
                        {index === 0
                          ? "Discover your opportunities"
                          : index === 1
                            ? "Measure your readiness"
                            : index === 2
                              ? "Strengthen your application"
                              : "Practise your interview"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-12 lg:px-8">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
            Your toolkit
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-tight">
            Everything you need to move with confidence.
          </h3>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.accent}`}
                  >
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-teal-50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-teal-700">
                    Premium
                  </span>
                </div>

                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  {tool.tag}
                </p>

                <h4 className="mt-2 text-xl font-black tracking-tight">
                  {tool.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {tool.description}
                </p>

                <div className="mt-6 flex items-center gap-2 text-xs font-black text-teal-700">
                  Open tool
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
          <div className="grid gap-4 md:grid-cols-5">
            {journey.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="rounded-[1.6rem] bg-[#f8fbfb] p-5">
                  <span className="text-xs font-black text-teal-700">
                    {step.number}
                  </span>

                  <h4 className="mt-4 text-base font-black">
                    {step.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>

                {index < journey.length - 1 && (
                  <ArrowRight
                    size={15}
                    className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 text-teal-400 md:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-7 text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <Trophy size={21} />
              </div>

              <h3 className="mt-5 max-w-2xl text-2xl font-black sm:text-3xl">
                Premium works best when your whole career workflow is connected.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Discover a role, assess your readiness, strengthen your CV,
                practise the interview, build evidence and track the
                application.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/uk-job-board"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                UK Jobs
                <ArrowRight size={15} className="text-teal-300" />
              </Link>

              <Link
                href="/job-readiness"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                Readiness
                <ArrowRight size={15} className="text-teal-300" />
              </Link>

              <Link
                href="/cv-review"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                CV Review
                <ArrowRight size={15} className="text-teal-300" />
              </Link>

              <Link
                href="/application-tracker"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                Tracker
                <ArrowRight size={15} className="text-teal-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/premium-dashboard" className="hover:text-slate-900">
            Premium Dashboard
          </Link>
          <Link href="/career-guides" className="hover:text-slate-900">
            Career Guides
          </Link>
          <Link href="/projects" className="hover:text-slate-900">
            Projects
          </Link>
        </div>
      </footer>
    </main>
  );
}