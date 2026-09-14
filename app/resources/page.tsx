"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

const resources = [
  {
    title: "Career Guides",
    description:
      "Practical guidance for CVs, interviews, career planning, professional growth and UK opportunities.",
    href: "/career-guides",
    icon: BookOpen,
    label: "Learn",
    accent: "bg-teal-50 text-teal-700",
  },
  {
    title: "Templates",
    description:
      "Structured frameworks for CVs, portfolios, projects, Agile delivery, product work and career planning.",
    href: "/templates",
    icon: FileText,
    label: "Build",
    accent: "bg-blue-50 text-blue-700",
  },
  {
    title: "Blog",
    description:
      "Career insights, professional stories, hiring perspectives and lessons from real-world work.",
    href: "/blog",
    icon: Sparkles,
    label: "Coming Soon",
    accent: "bg-violet-50 text-violet-700",
  },
  {
    title: "Hackathons",
    description:
      "Structured challenges designed around collaboration, creativity and practical professional evidence.",
    href: "/hackathons",
    icon: Trophy,
    label: "Coming Soon",
    accent: "bg-amber-50 text-amber-700",
  },
];

const quickLinks = [
  {
    title: "Courses",
    description: "Build practical skills before applying them to real work.",
    href: "/courses",
    icon: GraduationCap,
  },
  {
    title: "Projects",
    description: "Turn your skills into verifiable professional experience.",
    href: "/projects",
    icon: BriefcaseBusiness,
  },
  {
    title: "Experience Passport",
    description: "See the evidence you have built across your LiveProject journey.",
    href: "/experience-passport",
    icon: Users,
  },
];

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes resourcesGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes resourcesGlow {
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

        @keyframes resourcesFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .resources-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: resourcesGrid 18s linear infinite;
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
                LiveProject
              </p>
              <h1 className="text-lg font-black">Resources</h1>
            </div>
          </div>

          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="resources-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "resourcesGlow 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-140px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "resourcesGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
              <Lightbulb size={14} />
              LEARN & BUILD
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
              Everything around LiveProject that helps you{" "}
              <span className="text-teal-300">move forward.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300 sm:text-lg">
              Explore guidance, templates, learning material, professional
              challenges and practical resources that complement your LiveProject
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/career-guides"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                Start with Career Guides
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse Templates
              </Link>
            </div>
          </div>

          <div
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur"
            style={{ animation: "resourcesFloat 6s ease-in-out infinite" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
              <Sparkles size={25} />
            </div>

            <h3 className="mt-6 text-2xl font-black">
              One ecosystem. More ways to grow.
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              Use resources as support around your projects, courses,
              applications and career development.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-black/20 p-4">
                <div className="text-xl font-black">Guides</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Career knowledge
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 p-4">
                <div className="text-xl font-black">Tools</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Practical frameworks
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 p-4">
                <div className="text-xl font-black">Challenges</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Future hackathons
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 p-4">
                <div className="text-xl font-black">Insights</div>
                <div className="mt-1 text-[11px] text-slate-500">
                  Future editorial
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-12 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {resources.map((resource) => {
            const Icon = resource.icon;

            return (
              <Link
                key={resource.title}
                href={resource.href}
                className="group rounded-[1.8rem] border border-black/6 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${resource.accent}`}
                  >
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-slate-500">
                    {resource.label}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black tracking-tight">
                  {resource.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {resource.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-xs font-black text-teal-700">
                  Explore
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
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
              Continue your journey
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight">
              Resources work best alongside action.
            </h3>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-[1.7rem] border border-black/6 bg-[#f8fbfb] p-5 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                    <Icon size={20} />
                  </div>

                  <h4 className="mt-5 text-base font-black">
                    {item.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 text-xs font-black text-teal-700">
                    Open
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

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/career-guides" className="hover:text-slate-900">
            Career Guides
          </Link>
          <Link href="/blog" className="hover:text-slate-900">
            Blog
          </Link>
          <Link href="/hackathons" className="hover:text-slate-900">
            Hackathons
          </Link>
          <Link href="/templates" className="hover:text-slate-900">
            Templates
          </Link>
        </div>
      </footer>
    </main>
  );
}