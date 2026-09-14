
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Clock3,
  Code2,
  Filter,
  GraduationCap,
  Lock,
  PlayCircle,
  Search,
  Sparkles,
  Star,
  Target,
  Users,
  X,
} from "lucide-react";
import CourseIntroVideo from "@/components/CourseIntroVideo";

type Course = {
  id: number;
  title: string;
  provider: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  rating: number;
  students: string;
  description: string;
  skills: string[];
  premium: boolean;
  featured?: boolean;
  color: string;

  // Course introduction video
  introVideoUrl?: string;
  introVideoPoster?: string;
  introVideoDescription?: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Agile Fundamentals",
    provider: "LiveProject Academy",
    category: "Project Management",
    level: "Beginner",
    duration: "4h 20m",
    lessons: 18,
    rating: 4.9,
    students: "2.4k",
    description:
      "Learn the foundations of Agile, Scrum, iterative delivery, ceremonies, roles, and practical team collaboration.",
    skills: ["Agile", "Scrum", "Sprint Planning", "Team Collaboration"],
    premium: false,
    featured: true,
    color: "from-teal-500 to-cyan-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Get a quick introduction to Agile Fundamentals, what you will learn throughout the course, and how the knowledge can help you contribute confidently to modern delivery teams.",
  },
  {
    id: 2,
    title: "Scrum Master Essentials",
    provider: "LiveProject Academy",
    category: "Project Management",
    level: "Intermediate",
    duration: "6h 10m",
    lessons: 26,
    rating: 4.8,
    students: "1.8k",
    description:
      "Build practical Scrum Master skills through ceremonies, facilitation, impediment removal, and team coaching.",
    skills: ["Scrum", "Facilitation", "Coaching", "Delivery"],
    premium: true,
    featured: true,
    color: "from-violet-500 to-fuchsia-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Discover what Scrum Masters actually do, what this course will teach you, and how the skills can translate into practical delivery experience.",
  },
  {
    id: 3,
    title: "Product Management Fundamentals",
    provider: "LiveProject Academy",
    category: "Product",
    level: "Beginner",
    duration: "5h 05m",
    lessons: 22,
    rating: 4.9,
    students: "3.1k",
    description:
      "Understand product discovery, user needs, roadmaps, prioritisation, metrics, and product delivery.",
    skills: ["Product Strategy", "Discovery", "Roadmaps", "Prioritisation"],
    premium: false,
    featured: true,
    color: "from-blue-500 to-indigo-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Understand what product management involves, what you will practise, and how the skills from this course can prepare you for real product work.",
  },
  {
    id: 4,
    title: "Business Analysis in Practice",
    provider: "LiveProject Academy",
    category: "Business Analysis",
    level: "Intermediate",
    duration: "7h 15m",
    lessons: 31,
    rating: 4.8,
    students: "1.6k",
    description:
      "Learn requirements gathering, stakeholder analysis, process mapping, documentation, and solution evaluation.",
    skills: ["Requirements", "Process Mapping", "Stakeholders", "Analysis"],
    premium: true,
    color: "from-orange-500 to-amber-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "See how business analysts turn business problems into clear requirements and practical solutions, and why these skills are valuable across industries.",
  },
  {
    id: 5,
    title: "Frontend Development with React",
    provider: "LiveProject Academy",
    category: "Technology",
    level: "Intermediate",
    duration: "10h 40m",
    lessons: 44,
    rating: 4.9,
    students: "4.7k",
    description:
      "Build modern interfaces with React, component architecture, hooks, API integration, and responsive UI.",
    skills: ["React", "JavaScript", "REST APIs", "Responsive UI"],
    premium: true,
    featured: true,
    color: "from-cyan-500 to-blue-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Learn what modern React development involves, what you will build, and how these skills can strengthen your professional frontend portfolio.",
  },
  {
    id: 6,
    title: "Quality Assurance Foundations",
    provider: "LiveProject Academy",
    category: "Quality Assurance",
    level: "Beginner",
    duration: "4h 45m",
    lessons: 20,
    rating: 4.7,
    students: "1.3k",
    description:
      "Learn software testing fundamentals, test cases, bug reporting, regression testing, and QA workflows.",
    skills: ["Testing", "Test Cases", "Bug Tracking", "QA"],
    premium: false,
    color: "from-emerald-500 to-green-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Get a practical overview of software testing, the skills you will build and how they apply to professional QA workflows.",
  },
  {
    id: 7,
    title: "UX Design for Digital Products",
    provider: "LiveProject Academy",
    category: "UX Design",
    level: "Intermediate",
    duration: "8h 30m",
    lessons: 35,
    rating: 4.8,
    students: "2.1k",
    description:
      "Explore research, user journeys, wireframing, usability, information architecture, and product design.",
    skills: ["UX Research", "Wireframes", "Usability", "Product Design"],
    premium: true,
    color: "from-pink-500 to-rose-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Understand what UX professionals actually solve, what this course will teach you and how the skills can be demonstrated through practical product work.",
  },
  {
    id: 8,
    title: "Data Analytics Starter",
    provider: "LiveProject Academy",
    category: "Data",
    level: "Beginner",
    duration: "6h 50m",
    lessons: 28,
    rating: 4.8,
    students: "2.9k",
    description:
      "Develop a practical understanding of data analysis, dashboards, insights, and decision support.",
    skills: ["Data Analysis", "Dashboards", "Insights", "Reporting"],
    premium: true,
    color: "from-purple-500 to-violet-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "See how data analytics helps organisations make better decisions and what practical capabilities you can build through this course.",
  },
  {
    id: 9,
    title: "Stakeholder Management",
    provider: "LiveProject Academy",
    category: "Professional Skills",
    level: "Beginner",
    duration: "3h 30m",
    lessons: 14,
    rating: 4.8,
    students: "1.1k",
    description:
      "Build confidence in stakeholder communication, expectation management, influence, and professional reporting.",
    skills: ["Communication", "Influence", "Reporting", "Negotiation"],
    premium: false,
    color: "from-slate-600 to-slate-800",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Learn why stakeholder management matters, what communication skills you will develop and how they can improve your effectiveness on professional teams.",
  },
  {
    id: 10,
    title: "Project Delivery Masterclass",
    provider: "LiveProject Academy",
    category: "Project Management",
    level: "Advanced",
    duration: "11h 20m",
    lessons: 49,
    rating: 5,
    students: "920",
    description:
      "Go deeper into planning, delivery governance, risk, dependencies, communication, and project recovery.",
    skills: ["Delivery", "Risk", "Governance", "Leadership"],
    premium: true,
    featured: true,
    color: "from-red-500 to-orange-500",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Explore advanced project delivery, governance and recovery techniques and understand how they apply to complex professional environments.",
  },
  {
    id: 11,
    title: "API Integration with Next.js",
    provider: "LiveProject Academy",
    category: "Technology",
    level: "Advanced",
    duration: "8h 10m",
    lessons: 33,
    rating: 4.9,
    students: "1.4k",
    description:
      "Create production-style API integrations, loading states, errors, authentication flows, and data-driven interfaces.",
    skills: ["Next.js", "TypeScript", "APIs", "Authentication"],
    premium: true,
    color: "from-zinc-700 to-black",
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Understand what you will build with Next.js API integration and how these skills translate into production-ready frontend development.",
  },
  {
    id: 12,
    title: "Career Readiness Fundamentals",
    provider: "LiveProject Academy",
    category: "Career",
    level: "Beginner",
    duration: "3h 55m",
    lessons: 16,
    rating: 4.9,
    students: "5.2k",
    description:
      "Prepare for the workplace with CV strategy, portfolio presentation, communication, interviews, and professional behaviour.",
    skills: ["CV", "Portfolio", "Interviews", "Professional Skills"],
    premium: false,
    color: "from-teal-500 to-emerald-500",
    featured: true,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Get an overview of the career-readiness skills you need to present yourself confidently, apply effectively and transition into professional work.",
  },
];

const categories = [
  "All",
  "Project Management",
  "Product",
  "Business Analysis",
  "Technology",
  "Quality Assurance",
  "UX Design",
  "Data",
  "Professional Skills",
  "Career",
];

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All Levels");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    const q = query.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q) ||
        course.skills.some((skill) => skill.toLowerCase().includes(q));

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesLevel =
        level === "All Levels" || course.level === level;

      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [query, category, level]);

  const featuredCourses = courses.filter((course) => course.featured);

  function startCourse(course: Course) {
    if (course.premium) {
      sessionStorage.setItem(
        "liveproject_after_upgrade",
        `/courses/${course.id}`
      );

      window.location.href = "/premium";
      return;
    }

    sessionStorage.setItem(
      "liveproject_course_started",
      JSON.stringify({
        id: course.id,
        title: course.title,
        startedAt: new Date().toISOString(),
      })
    );

    window.location.href = `/courses/${course.id}`;
  }

  return (
    <main className="min-h-screen bg-[#f6f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes lpFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -10px, 0);
          }
        }

        @keyframes lpPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.95);
          }

          50% {
            opacity: 0.7;
            transform: scale(1.04);
          }
        }

        @keyframes lpGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes lpCardIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .lp-grid-bg {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: lpGrid 18s linear infinite;
        }

        .lp-card {
          animation: lpCardIn 0.45s ease both;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/workspace"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white text-slate-700 transition hover:-translate-x-0.5 hover:bg-slate-50"
              title="Back to dashboard"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
                  <GraduationCap size={18} />
                </div>

                <h1 className="text-lg font-black tracking-tight">
                  LiveProject Academy
                </h1>
              </div>

              <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
                Learn skills. Build capability. Move your career forward.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/my-courses"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              My Courses
            </Link>

            <Link
              href="/workspace"
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-[#082c2b] text-white">
        <div className="lp-grid-bg absolute inset-0 opacity-40" />

        <div
          className="absolute -right-24 top-8 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "lpPulse 5s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "lpPulse 7s ease-in-out infinite" }}
        />

        <div className="relative mx-auto grid max-w-[1500px] gap-10 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-teal-100 backdrop-blur">
              <Sparkles size={14} />
              LIVEPROJECT LEARNING
            </div>

            <h2 className="max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Learn the skills that move you closer to{" "}
              <span className="text-teal-300">real work.</span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Build practical knowledge across project management, product,
              technology, business analysis, QA, UX, data and career readiness.
              Then put those skills into action through LiveProject experiences.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#course-library"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                Explore Courses
                <ArrowRight size={17} />
              </a>

              <Link
                href="/my-courses"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                View My Courses
              </Link>
            </div>

            <div className="mt-9 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["12", "Courses"],
                ["8", "Career Tracks"],
                ["Beginner", "Friendly"],
                ["Practical", "Learning"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <div className="text-lg font-black text-white">{value}</div>
                  <div className="mt-1 text-xs text-slate-400">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden min-h-[320px] lg:block">
            <div
              className="absolute right-3 top-8 h-64 w-[390px] rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl backdrop-blur"
              style={{ animation: "lpFloat 6s ease-in-out infinite" }}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400">
                  YOUR LEARNING PATH
                </div>

                <BookOpen size={16} className="text-teal-300" />
              </div>

              <div className="space-y-3">
                {[
                  ["Agile Fundamentals", "82%"],
                  ["Product Management", "44%"],
                  ["Career Readiness", "21%"],
                ].map(([name, progress], index) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-white/8 bg-black/20 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-bold">{name}</div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          Module {index + 1} of {index === 0 ? 4 : 6}
                        </div>
                      </div>

                      <span className="text-xs font-black text-teal-300">
                        {progress}
                      </span>
                    </div>

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-teal-300"
                        style={{ width: progress }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-6 left-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-400 text-slate-950 shadow-xl shadow-teal-400/20">
              <Brain size={27} />
            </div>
          </div>
        </div>
      </section>

      <section
        id="course-library"
        className="mx-auto max-w-[1500px] px-5 py-12 lg:px-8"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
              Course Library
            </p>

            <h3 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Find your next skill.
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Search the library or browse by career area and experience level.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters((value) => !value)}
              className="inline-flex items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <Filter size={16} />
              Filters
            </button>

            <Link
              href="/my-courses"
              className="hidden rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-600/10 transition hover:bg-teal-700 sm:inline-flex"
            >
              My Courses
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_240px_220px]">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, skills or topics..."
              className="w-full rounded-2xl border border-black/8 bg-white py-3.5 pl-11 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
            className="rounded-2xl border border-black/8 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
          >
            {levels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        {showFilters && (
          <div className="mt-4 rounded-2xl border border-black/8 bg-white p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    category === item
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-14 lg:px-8">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
              Featured
            </p>

            <h3 className="mt-1 text-2xl font-black tracking-tight">
              Recommended for professionals
            </h3>
          </div>

          <span className="text-sm font-semibold text-slate-400">
            {filteredCourses.length} course
            {filteredCourses.length === 1 ? "" : "s"}
          </span>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto text-slate-300" size={42} />

            <h4 className="mt-4 text-xl font-black">No courses found</h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Try another keyword, category, or experience level.
            </p>

            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
                setLevel("All Levels");
              }}
              className="mt-5 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCourses.map((course, index) => (
              <article
                key={course.id}
                className="lp-card group overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/20"
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <div
                  className={`relative h-40 bg-gradient-to-br ${course.color} p-5 text-white`}
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute -right-16 -top-20 h-44 w-44 rounded-full bg-white/15 blur-2xl"
                      style={{ animation: "lpPulse 5s ease-in-out infinite" }}
                    />
                  </div>

                  <div className="relative flex items-start justify-between gap-3">
                    <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black backdrop-blur">
                      {course.category}
                    </span>

                    {course.premium ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/30 px-3 py-1.5 text-[11px] font-black backdrop-blur">
                        <Lock size={12} />
                        Premium
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black backdrop-blur">
                        Free
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <h4 className="max-w-sm text-xl font-black tracking-tight">
                      {course.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Target size={13} />
                      {course.level}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="inline-flex items-center gap-1">
                      <Clock3 size={13} />
                      {course.duration}
                    </span>

                    <span className="text-slate-300">•</span>

                    <span className="inline-flex items-center gap-1">
                      <BookOpen size={13} />
                      {course.lessons} lessons
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {course.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                    <div>
                      <div className="flex items-center gap-1 text-sm font-black">
                        <Star
                          size={14}
                          className="fill-amber-400 text-amber-400"
                        />
                        {course.rating}
                      </div>

                      <div className="mt-0.5 text-[11px] text-slate-400">
                        {course.students} learners
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="inline-flex items-center gap-2 rounded-xl border border-black/8 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      View Course
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: BriefcaseBusiness,
                title: "Learn for real work",
                text: "Courses are designed around practical workplace capabilities rather than theory alone.",
              },
              {
                icon: Target,
                title: "Connect learning to projects",
                text: "Use what you learn inside real-world project experiences and build stronger evidence.",
              },
              {
                icon: Users,
                title: "Build career confidence",
                text: "Develop skills, professional language, and the confidence to contribute to real teams.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-[1.7rem] border border-black/6 bg-[#f8fbfb] p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <Icon size={22} />
                  </div>

                  <h4 className="mt-5 text-lg font-black">{item.title}</h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <p>© 2026 LiveProject Academy.</p>

        <div className="flex flex-wrap gap-5">
          <Link href="/workspace" className="hover:text-slate-900">
            Dashboard
          </Link>

          <Link href="/my-courses" className="hover:text-slate-900">
            My Courses
          </Link>

          <Link href="/premium" className="hover:text-slate-900">
            Premium
          </Link>
        </div>
      </footer>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-[#f6f9f9] shadow-2xl">
            <div
              className={`relative h-44 bg-gradient-to-br ${selectedCourse.color} p-6 text-white`}
            >
              <button
                onClick={() => setSelectedCourse(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/15 backdrop-blur transition hover:bg-black/25"
                aria-label="Close course preview"
              >
                <X size={18} />
              </button>

              <div className="mt-8 max-w-xl">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black backdrop-blur">
                    {selectedCourse.category}
                  </span>

                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-black backdrop-blur">
                    {selectedCourse.level}
                  </span>
                </div>

                <h3 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {selectedCourse.title}
                </h3>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <CourseIntroVideo
                title={selectedCourse.title}
                description={
                  selectedCourse.introVideoDescription ||
                  `This short introduction explains what ${selectedCourse.title} covers, what you will learn, and how it can benefit your career.`
                }
                videoUrl={selectedCourse.introVideoUrl}
                posterUrl={selectedCourse.introVideoPoster}
              />

              <div className="rounded-2xl border border-black/6 bg-white p-5">
                <p className="text-sm leading-7 text-slate-600">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                  <Clock3 size={17} className="text-teal-600" />

                  <div className="mt-2 text-sm font-black">
                    {selectedCourse.duration}
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Duration
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <BookOpen size={17} className="text-teal-600" />

                  <div className="mt-2 text-sm font-black">
                    {selectedCourse.lessons} lessons
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Learning units
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <Star
                    size={17}
                    className="fill-amber-400 text-amber-400"
                  />

                  <div className="mt-2 text-sm font-black">
                    {selectedCourse.rating}/5
                  </div>

                  <div className="mt-1 text-xs text-slate-400">
                    Average rating
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">
                  Skills you will build
                </h4>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCourse.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-black/6 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                    <Code2 size={18} />
                  </div>

                  <div>
                    <h4 className="text-sm font-black">
                      Learn → Apply → Build Evidence
                    </h4>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      After learning, use your knowledge in LiveProject projects
                      to turn skills into practical experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-black/5 bg-white p-5 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>

              <button
                onClick={() => startCourse(selectedCourse)}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black transition ${
                  selectedCourse.premium
                    ? "bg-slate-950 text-white hover:bg-slate-800"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                {selectedCourse.premium ? (
                  <>
                    <Lock size={16} />
                    Unlock with Premium
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} />
                    Start Course
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}