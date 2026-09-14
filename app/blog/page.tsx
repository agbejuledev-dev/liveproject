"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  FileText,
  GraduationCap,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes blogGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes blogGlow {
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

        @keyframes blogFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .blog-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: blogGrid 18s linear infinite;
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
              <h1 className="text-lg font-black">LiveProject Blog</h1>
            </div>
          </div>

          <Link
            href="/career-guides"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
          >
            Career Guides
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="blog-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "blogGlow 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-140px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "blogGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-[1fr_420px] lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
              <Sparkles size={14} />
              LIVEPROJECT BLOG
            </div>

            <h2 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
              Ideas, insights and stories for{" "}
              <span className="text-teal-300">better careers.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-sm leading-8 text-slate-300 sm:text-lg">
              We&apos;re building a dedicated space for practical career
              insights, project stories, hiring guidance, professional growth
              and the future of experience-based careers.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/career-guides"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                Explore Career Guides
                <BookOpen size={16} />
              </Link>

              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Courses
                <GraduationCap size={16} />
              </Link>
            </div>
          </div>

          <div
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur"
            style={{ animation: "blogFloat 6s ease-in-out infinite" }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
              <FileText size={25} />
            </div>

            <h3 className="mt-6 text-2xl font-black">
              Something useful is coming.
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              The LiveProject editorial team is preparing practical content
              designed for people building real careers, not just collecting
              certificates.
            </p>

            <div className="mt-6 space-y-3">
              {[
                {
                  icon: BriefcaseBusiness,
                  text: "Career and hiring insights",
                },
                {
                  icon: Users,
                  text: "Professional stories and lessons",
                },
                {
                  icon: Clock3,
                  text: "Practical workplace guidance",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 rounded-xl bg-black/20 px-4 py-3"
                  >
                    <Icon size={16} className="text-teal-300" />
                    <span className="text-xs font-bold text-slate-300">
                      {item.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-5 py-16 text-center lg:px-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-teal-50 text-teal-700">
          <Sparkles size={34} />
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.22em] text-teal-700">
          Coming Soon
        </p>

        <h3 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          The LiveProject Blog is on its way.
        </h3>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
          We&apos;re preparing a high-quality collection of articles covering
          career development, practical experience, project delivery, hiring,
          technology and professional growth.
        </p>

        <div className="mt-9 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Career Growth",
              text: "Practical strategies for making your next career move.",
            },
            {
              title: "Real-World Work",
              text: "Lessons from projects, teams and professional delivery.",
            },
            {
              title: "Hiring Insights",
              text: "Understand what makes professional evidence valuable.",
            },
            {
              title: "Technology",
              text: "Modern tools, workflows and skills shaping careers.",
            },
            {
              title: "Leadership",
              text: "Better communication, ownership and team contribution.",
            },
            {
              title: "LiveProject Stories",
              text: "Stories from the people building experience with us.",
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
            <Mail size={16} />
            Stay connected
          </div>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-teal-900/70">
            While the blog is being prepared, explore our Career Guides,
            Courses and Projects to keep building your career.
          </p>

          <div className="mt-5 flex flex-col justify-center gap-2 sm:flex-row">
            <Link
              href="/career-guides"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
            >
              Career Guides
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-200 bg-white px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
            >
              Explore Projects
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