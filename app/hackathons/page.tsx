"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Code2,
  Globe2,
  Lightbulb,
  Rocket,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

export default function HackathonsPage() {
  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes hackGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes hackGlow {
          0%,
          100% {
            opacity: 0.24;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.65;
            transform: scale(1.05);
          }
        }

        @keyframes hackFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-9px);
          }
        }

        .hack-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: hackGrid 18s linear infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-slate-700 transition hover:-translate-x-0.5 hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                Resources
              </p>
              <h1 className="text-lg font-black">Hackathons</h1>
            </div>
          </div>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Explore Projects
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="hack-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "hackGlow 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-140px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "hackGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-[1fr_430px] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
              <Trophy size={14} />
              LIVEPROJECT HACKATHONS
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
              Build under pressure.{" "}
              <span className="text-teal-300">
                Create something meaningful.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300 sm:text-lg">
              LiveProject Hackathons are being designed to give professionals
              a structured way to collaborate, solve real problems and create
              evidence they can carry into their careers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                Explore Projects
                <Rocket size={16} />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Build Your Skills
                <Code2 size={16} />
              </Link>
            </div>
          </div>

          <div
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur"
            style={{ animation: "hackFloat 6s ease-in-out infinite" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
              <Lightbulb size={25} />
            </div>

            <h3 className="mt-6 text-2xl font-black">
              Something competitive is coming.
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              We&apos;re preparing challenges that bring professionals together
              around practical problems, collaboration and measurable outcomes.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  icon: Users,
                  title: "Collaborative",
                  text: "Work with professionals across disciplines.",
                },
                {
                  icon: Globe2,
                  title: "Global",
                  text: "Participation designed for professionals worldwide.",
                },
                {
                  icon: Trophy,
                  title: "Evidence-driven",
                  text: "Create work you can take into your portfolio.",
                },
                {
                  icon: CalendarDays,
                  title: "Structured",
                  text: "Clear challenge windows and deliverables.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                      <Icon size={16} />
                    </div>

                    <div>
                      <div className="text-xs font-black text-white">
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-5 text-slate-500">
                        {item.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 py-16 text-center lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-teal-50 text-teal-700">
          <Trophy size={34} />
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-teal-700">
          Coming Soon
        </p>

        <h3 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          LiveProject Hackathons are coming soon.
        </h3>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          We&apos;re building a better way for professionals to demonstrate
          creativity, teamwork, problem-solving and delivery under realistic
          conditions.
        </p>

        <div className="mt-9 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Real Problems",
              text: "Challenges will focus on practical problems rather than artificial exercises.",
            },
            {
              title: "Cross-functional Teams",
              text: "Bring product, project, engineering, QA, UX, data and business skills together.",
            },
            {
              title: "Portfolio Evidence",
              text: "Create tangible work that can strengthen your professional story.",
            },
            {
              title: "Global Community",
              text: "Participate alongside professionals from different countries and backgrounds.",
            },
            {
              title: "Clear Outcomes",
              text: "Structured deliverables, reviews and meaningful completion records.",
            },
            {
              title: "Career Growth",
              text: "Use challenge experience to sharpen skills and build confidence.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-black/6 bg-white p-5 shadow-sm"
            >
              <h4 className="text-base font-black">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-9 rounded-[1.7rem] border border-teal-100 bg-teal-50 p-6">
          <div className="flex items-center justify-center gap-2 text-sm font-black text-teal-800">
            <Sparkles size={16} />
            Build while you wait
          </div>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-teal-900/70">
            You can already build evidence through LiveProject&apos;s
            real-world projects and strengthen your skills through the course
            library.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
            >
              Explore Projects
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
            >
              Explore Courses
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/career-guides" className="hover:text-slate-900">
            Career Guides
          </Link>
          <Link href="/blog" className="hover:text-slate-900">
            Blog
          </Link>
          <Link href="/templates" className="hover:text-slate-900">
            Templates
          </Link>
        </div>
      </footer>
    </main>
  );
}