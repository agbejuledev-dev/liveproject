// @ts-nocheck
"use client";
import { X } from "lucide-react";


import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  FileText,
  Globe2,
  GraduationCap,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

type Guide = {
  id: number;
  title: string;
  category: string;
  readTime: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  topics: string[];
  featured?: boolean;
  icon: React.ElementType;
};

const guides: Guide[] = [
  {
    id: 1,
    title: "How to Build Experience When You Don't Have a Job Yet",
    category: "Career Strategy",
    readTime: "7 min read",
    level: "Beginner",
    description:
      "A practical framework for turning projects, volunteering, freelance work and structured practice into credible professional evidence.",
    topics: ["Experience", "Portfolio", "Projects"],
    featured: true,
    icon: BriefcaseBusiness,
  },
  {
    id: 2,
    title: "How to Build a Portfolio That Gets You Taken Seriously",
    category: "Portfolio",
    readTime: "8 min read",
    level: "Beginner",
    description:
      "Learn what makes a professional portfolio useful, credible and easy for hiring teams to understand.",
    topics: ["Portfolio", "Evidence", "Hiring"],
    featured: true,
    icon: FileText,
  },
  {
    id: 3,
    title: "How to Prepare for a UK Job Search",
    category: "UK Careers",
    readTime: "10 min read",
    level: "Intermediate",
    description:
      "Understand the major steps involved in preparing your profile, CV, applications and interview strategy for UK opportunities.",
    topics: ["UK Jobs", "CV", "Applications"],
    featured: true,
    icon: Globe2,
  },
  {
    id: 4,
    title: "How to Write Better Achievement Statements",
    category: "CV & Applications",
    readTime: "6 min read",
    level: "Beginner",
    description:
      "Move beyond responsibilities and write stronger CV statements that communicate contribution, ownership and outcomes.",
    topics: ["CV", "Achievements", "Impact"],
    icon: FileText,
  },
  {
    id: 5,
    title: "The STAR Method: A Practical Interview Guide",
    category: "Interviews",
    readTime: "7 min read",
    level: "Beginner",
    description:
      "Learn how to structure behavioural interview answers with clear situations, actions and measurable results.",
    topics: ["Interviews", "STAR", "Communication"],
    icon: Target,
  },
  {
    id: 6,
    title: "How to Talk About Projects in an Interview",
    category: "Interviews",
    readTime: "8 min read",
    level: "Intermediate",
    description:
      "Turn your project experience into compelling interview stories that demonstrate ownership, judgement and impact.",
    topics: ["Projects", "Interviews", "Storytelling"],
    icon: Sparkles,
  },
  {
    id: 7,
    title: "How to Choose the Right Career Track",
    category: "Career Strategy",
    readTime: "9 min read",
    level: "Beginner",
    description:
      "A practical way to compare career paths using your interests, strengths, evidence and the type of work you actually enjoy.",
    topics: ["Career Planning", "Skills", "Direction"],
    icon: Compass,
  },
  {
    id: 8,
    title: "From Course Completion to Real Experience",
    category: "Professional Growth",
    readTime: "6 min read",
    level: "Intermediate",
    description:
      "Learn why finishing courses is only one part of career development and how to turn learning into demonstrable capability.",
    topics: ["Learning", "Experience", "Projects"],
    icon: GraduationCap,
  },
  {
    id: 9,
    title: "How to Work With Stakeholders Professionally",
    category: "Professional Skills",
    readTime: "8 min read",
    level: "Intermediate",
    description:
      "Improve communication, expectation management, meeting preparation and follow-through when working with stakeholders.",
    topics: ["Stakeholders", "Communication", "Delivery"],
    icon: Users,
  },
  {
    id: 10,
    title: "How to Build a Career Development Plan",
    category: "Career Strategy",
    readTime: "9 min read",
    level: "Advanced",
    description:
      "Create a practical career plan that connects your target role to skills, projects, learning and measurable milestones.",
    topics: ["Roadmap", "Skills", "Goals"],
    icon: TrendingUp,
  },
];

const categories = [
  "All",
  "Career Strategy",
  "Portfolio",
  "UK Careers",
  "CV & Applications",
  "Interviews",
  "Professional Growth",
  "Professional Skills",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CareerGuidesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const filteredGuides = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return guides.filter((guide) => {
      const matchesQuery =
        !normalized ||
        guide.title.toLowerCase().includes(normalized) ||
        guide.description.toLowerCase().includes(normalized) ||
        guide.category.toLowerCase().includes(normalized) ||
        guide.topics.some((topic) =>
          topic.toLowerCase().includes(normalized)
        );

      const matchesCategory =
        category === "All" || guide.category === category;

      const matchesLevel =
        level === "All Levels" || guide.level === level;

      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [query, category, level]);

  const featuredGuides = guides.filter((guide) => guide.featured);

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes guideGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes guideGlow {
          0%,
          100% {
            opacity: 0.25;
          }

          50% {
            opacity: 0.6;
          }
        }

        @keyframes guideFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .guide-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: guideGrid 18s linear infinite;
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
              <h1 className="text-lg font-black">Career Guides</h1>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
            >
              <BookOpen size={14} />
              Courses
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-slate-800"
            >
              Projects
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="guide-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "guideGlow 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-140px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "guideGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 py-14 lg:grid-cols-[1fr_410px] lg:px-8 lg:py-18">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
              <Compass size={14} />
              CAREER RESOURCES
            </div>

            <h2 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              Practical guidance for your{" "}
              <span className="text-teal-300">next career move.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Straightforward career guides covering experience, portfolios,
              interviews, UK job searches, professional skills and long-term
              career development.
            </p>

            <div className="mt-7 max-w-2xl">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search career guides..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-11 pr-4 text-sm font-medium text-white outline-none backdrop-blur placeholder:text-slate-500 focus:border-teal-300"
                />
              </div>
            </div>
          </div>

          <div
            className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
            style={{ animation: "guideFloat 6s ease-in-out infinite" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
              <GraduationCap size={22} />
            </div>

            <h3 className="mt-5 text-xl font-black">
              Learn. Apply. Build evidence.
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Use the guides alongside your courses and LiveProject projects
              so your learning translates into practical progress.
            </p>

            <div className="mt-6 space-y-2">
              {[
                "Improve your CV",
                "Prepare for interviews",
                "Build stronger evidence",
                "Plan your next move",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-black/20 px-3 py-2.5 text-xs font-bold text-slate-300"
                >
                  <CheckCircle2 size={14} className="text-teal-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-9 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                  category === item
                    ? "bg-teal-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-black/6 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {levels.map((item) => (
              <button
                key={item}
                onClick={() => setLevel(item)}
                className={`rounded-full px-3.5 py-2 text-[11px] font-bold transition ${
                  level === item
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {item}
              </button>
            ))}

            {(query || category !== "All" || level !== "All Levels") && (
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                  setLevel("All Levels");
                }}
                className="ml-1 rounded-full px-3.5 py-2 text-[11px] font-black text-teal-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-14 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
              Featured Guides
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-tight">
              Start with the essentials.
            </h3>
          </div>

          <span className="text-sm font-semibold text-slate-400">
            {featuredGuides.length} featured
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredGuides.map((guide) => {
            const Icon = guide.icon;

            return (
              <button
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                className="group rounded-[1.8rem] border border-black/6 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={21} />
                  </div>

                  <span className="rounded-full bg-teal-50 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wide text-teal-700">
                    Featured
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
                  <span>{guide.category}</span>
                  <span>â€¢</span>
                  <span>{guide.readTime}</span>
                </div>

                <h4 className="mt-3 text-xl font-black tracking-tight">
                  {guide.title}
                </h4>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {guide.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {guide.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs font-black text-teal-700">
                  Read guide
                  <ArrowRight
                    size={14}
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Full Library
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight">
              Browse all career guides.
            </h3>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="mt-7 rounded-[2rem] border border-dashed border-black/10 bg-[#f8fbfb] px-6 py-16 text-center">
              <BookOpen className="mx-auto text-slate-300" size={40} />

              <h4 className="mt-4 text-xl font-black">
                No guides found.
              </h4>

              <p className="mt-2 text-sm text-slate-500">
                Try another search or reset your filters.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {filteredGuides.map((guide) => {
                const Icon = guide.icon;

                return (
                  <button
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className="group flex gap-4 rounded-[1.5rem] border border-black/6 bg-[#f8fbfb] p-5 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide text-slate-400">
                        <span>{guide.category}</span>
                        <span>â€¢</span>
                        <span>{guide.readTime}</span>
                        <span>â€¢</span>
                        <span>{guide.level}</span>
                      </div>

                      <h4 className="mt-2 text-base font-black">
                        {guide.title}
                      </h4>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {guide.description}
                      </p>

                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-black text-teal-700">
                        Open guide
                        <ChevronRight
                          size={14}
                          className="transition group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
        <div className="rounded-[2rem] bg-slate-950 p-7 text-white">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <Target size={21} />
              </div>

              <h3 className="mt-5 max-w-xl text-2xl font-black sm:text-3xl">
                Put the advice into practice.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                Career advice becomes more valuable when it leads to action.
                Explore courses, real-world projects and Premium career tools
                alongside the guides.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/courses"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                Courses
                <ArrowRight size={15} className="text-teal-300" />
              </Link>

              <Link
                href="/projects"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                Projects
                <ArrowRight size={15} className="text-teal-300" />
              </Link>

              <Link
                href="/ai-interview"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                AI Interview
                <ArrowRight size={15} className="text-teal-300" />
              </Link>

              <Link
                href="/career-roadmap"
                className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-4 text-sm font-bold transition hover:bg-white/10"
              >
                Career Roadmap
                <ArrowRight size={15} className="text-teal-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>Â© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
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

      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-black/5 p-5 sm:p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide text-teal-700">
                  <span>{selectedGuide.category}</span>
                  <span>â€¢</span>
                  <span>{selectedGuide.readTime}</span>
                  <span>â€¢</span>
                  <span>{selectedGuide.level}</span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight">
                  {selectedGuide.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedGuide(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
              <p className="text-sm leading-7 text-slate-600">
                {selectedGuide.description}
              </p>

              <div className="mt-7">
                <h4 className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  What you will learn
                </h4>

                <div className="mt-4 space-y-2">
                  {selectedGuide.topics.map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-3 text-sm font-bold text-teal-800"
                    >
                      <CheckCircle2 size={15} />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-7 rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-black">
                  <Sparkles size={16} className="text-teal-600" />
                  LiveProject approach
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Read the guide, apply the advice to your profile, and then
                  use your courses or projects to turn the learning into
                  evidence.
                </p>
              </div>
            </div>

            <div className="border-t border-black/5 p-5">
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
