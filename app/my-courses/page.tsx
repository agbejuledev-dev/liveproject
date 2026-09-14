"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  PlayCircle,
  Search,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";

type CourseStatus = "Not Started" | "In Progress" | "Completed";

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  lessons: number;
  description: string;
  progress: number;
  status: CourseStatus;
  premium: boolean;
  skills: string[];
  startedAt?: string;
  completedAt?: string;
};

const courseLibrary: Omit<
  Course,
  "progress" | "status" | "startedAt" | "completedAt"
>[] = [
  {
    id: 1,
    title: "Agile Fundamentals",
    category: "Project Management",
    level: "Beginner",
    duration: "4h 20m",
    lessons: 18,
    description:
      "Learn Agile principles, Scrum foundations, iterative delivery, ceremonies, and practical collaboration.",
    premium: false,
    skills: ["Agile", "Scrum", "Sprint Planning", "Collaboration"],
  },
  {
    id: 2,
    title: "Scrum Master Essentials",
    category: "Project Management",
    level: "Intermediate",
    duration: "6h 10m",
    lessons: 26,
    description:
      "Build practical Scrum Master skills through facilitation, coaching, impediment removal, and delivery support.",
    premium: true,
    skills: ["Scrum", "Facilitation", "Coaching", "Delivery"],
  },
  {
    id: 3,
    title: "Product Management Fundamentals",
    category: "Product",
    level: "Beginner",
    duration: "5h 05m",
    lessons: 22,
    description:
      "Understand product discovery, user needs, roadmaps, prioritisation, metrics, and delivery.",
    premium: false,
    skills: ["Product Strategy", "Discovery", "Roadmaps", "Prioritisation"],
  },
  {
    id: 4,
    title: "Business Analysis in Practice",
    category: "Business Analysis",
    level: "Intermediate",
    duration: "7h 15m",
    lessons: 31,
    description:
      "Develop practical requirements gathering, stakeholder analysis, process mapping, and solution evaluation skills.",
    premium: true,
    skills: ["Requirements", "Process Mapping", "Stakeholders", "Analysis"],
  },
  {
    id: 5,
    title: "Frontend Development with React",
    category: "Technology",
    level: "Intermediate",
    duration: "10h 40m",
    lessons: 44,
    description:
      "Build modern interfaces with React, component architecture, hooks, API integration, and responsive UI.",
    premium: true,
    skills: ["React", "JavaScript", "REST APIs", "Responsive UI"],
  },
  {
    id: 6,
    title: "Quality Assurance Foundations",
    category: "Quality Assurance",
    level: "Beginner",
    duration: "4h 45m",
    lessons: 20,
    description:
      "Learn software testing fundamentals, test cases, bug reporting, regression testing, and QA workflows.",
    premium: false,
    skills: ["Testing", "Test Cases", "Bug Tracking", "QA"],
  },
  {
    id: 7,
    title: "UX Design for Digital Products",
    category: "UX Design",
    level: "Intermediate",
    duration: "8h 30m",
    lessons: 35,
    description:
      "Explore UX research, journeys, wireframes, usability, information architecture, and product design.",
    premium: true,
    skills: ["UX Research", "Wireframes", "Usability", "Product Design"],
  },
  {
    id: 8,
    title: "Data Analytics Starter",
    category: "Data",
    level: "Beginner",
    duration: "6h 50m",
    lessons: 28,
    description:
      "Develop a practical understanding of data analysis, dashboards, insights, and decision support.",
    premium: true,
    skills: ["Data Analysis", "Dashboards", "Insights", "Reporting"],
  },
  {
    id: 9,
    title: "Stakeholder Management",
    category: "Professional Skills",
    level: "Beginner",
    duration: "3h 30m",
    lessons: 14,
    description:
      "Build confidence in stakeholder communication, expectation management, influence, and professional reporting.",
    premium: false,
    skills: ["Communication", "Influence", "Reporting", "Negotiation"],
  },
  {
    id: 10,
    title: "Project Delivery Masterclass",
    category: "Project Management",
    level: "Advanced",
    duration: "11h 20m",
    lessons: 49,
    description:
      "Go deeper into planning, delivery governance, risk, dependencies, communication, and project recovery.",
    premium: true,
    skills: ["Delivery", "Risk", "Governance", "Leadership"],
  },
  {
    id: 11,
    title: "API Integration with Next.js",
    category: "Technology",
    level: "Advanced",
    duration: "8h 10m",
    lessons: 33,
    description:
      "Create production-style API integrations, loading states, errors, authentication flows, and data-driven interfaces.",
    premium: true,
    skills: ["Next.js", "TypeScript", "APIs", "Authentication"],
  },
  {
    id: 12,
    title: "Career Readiness Fundamentals",
    category: "Career",
    level: "Beginner",
    duration: "3h 55m",
    lessons: 16,
    description:
      "Prepare for the workplace with CV strategy, portfolio presentation, communication, interviews, and professional behaviour.",
    premium: false,
    skills: ["CV", "Portfolio", "Interviews", "Professional Skills"],
  },
];

const STORAGE_KEY = "liveproject_my_courses";

const initialProgress: Record<number, number> = {
  1: 82,
  3: 44,
  12: 21,
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | CourseStatus>("All");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        setCourses(JSON.parse(raw));
        return;
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }

    const seeded: Course[] = courseLibrary
      .filter((course) => initialProgress[course.id] !== undefined)
      .map((course) => {
        const progress = initialProgress[course.id];

        return {
          ...course,
          progress,
          status:
            progress >= 100
              ? "Completed"
              : progress > 0
                ? "In Progress"
                : "Not Started",
        };
      });

    setCourses(seeded);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  }, []);

  const visibleCourses = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesSearch =
        !normalized ||
        course.title.toLowerCase().includes(normalized) ||
        course.category.toLowerCase().includes(normalized) ||
        course.description.toLowerCase().includes(normalized) ||
        course.skills.some((skill) =>
          skill.toLowerCase().includes(normalized)
        );

      const matchesFilter =
        filter === "All" || course.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [courses, query, filter]);

  const stats = useMemo(() => {
    const completed = courses.filter(
      (course) => course.status === "Completed"
    ).length;

    const inProgress = courses.filter(
      (course) => course.status === "In Progress"
    ).length;

    const totalProgress = courses.reduce(
      (sum, course) => sum + course.progress,
      0
    );

    const average =
      courses.length > 0
        ? Math.round(totalProgress / courses.length)
        : 0;

    return {
      total: courses.length,
      completed,
      inProgress,
      average,
    };
  }, [courses]);

  function persist(updated: Course[]) {
    setCourses(updated);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function continueCourse(course: Course) {
    const nextProgress = Math.min(course.progress + 12, 100);

    const updated = courses.map((item) =>
      item.id === course.id
        ? {
            ...item,
            progress: nextProgress,
            status:
              nextProgress >= 100 ? "Completed" : "In Progress",
            completedAt:
              nextProgress >= 100
                ? new Date().toISOString()
                : item.completedAt,
          }
        : item
    );

    persist(updated);

    const nextCourse = updated.find((item) => item.id === course.id);

    if (nextCourse) {
      setSelectedCourse(nextCourse);
    }
  }

  function removeCourse(courseId: number) {
    const updated = courses.filter((course) => course.id !== courseId);
    persist(updated);
    setSelectedCourse(null);
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes myCoursesGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes myCoursesFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -9px, 0);
          }
        }

        @keyframes myCoursesGlow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes myCoursesIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .my-courses-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: myCoursesGrid 18s linear infinite;
        }

        .my-course-card {
          animation: myCoursesIn 0.45s ease both;
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

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white shadow-lg shadow-teal-600/20">
                <GraduationCap size={19} />
              </div>

              <div>
                <h1 className="text-lg font-black tracking-tight">
                  My Courses
                </h1>
                <p className="hidden text-xs text-slate-500 sm:block">
                  Keep learning. Keep building.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <BookOpen size={16} />
            Browse Courses
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="my-courses-grid absolute inset-0 opacity-40" />

        <div
          className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "myCoursesGlow 5s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "myCoursesGlow 7s ease-in-out infinite" }}
        />

        <div className="relative mx-auto grid max-w-[1500px] gap-8 px-5 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-black text-teal-100">
              <Sparkles size={14} />
              YOUR LEARNING SPACE
            </span>

            <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Turn learning into{" "}
              <span className="text-teal-300">career evidence.</span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Track your learning progress, complete courses, and carry the
              skills directly into your LiveProject work.
            </p>

            <div className="mt-7">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                Find Another Course
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative hidden min-h-[250px] lg:block">
            <div
              className="absolute right-0 top-2 w-full max-w-[430px] rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
              style={{ animation: "myCoursesFloat 6s ease-in-out infinite" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Learning Progress
                  </div>
                  <div className="mt-1 text-3xl font-black">
                    {stats.average}%
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Target size={23} />
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-teal-300 transition-all duration-500"
                  style={{ width: `${stats.average}%` }}
                />
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-lg font-black">{stats.total}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Enrolled
                  </div>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-lg font-black">{stats.inProgress}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    In Progress
                  </div>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-lg font-black">{stats.completed}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8">
        <div className="grid gap-3 md:grid-cols-4">
          {[
            {
              icon: BookOpen,
              label: "Enrolled Courses",
              value: stats.total,
            },
            {
              icon: PlayCircle,
              label: "In Progress",
              value: stats.inProgress,
            },
            {
              icon: CheckCircle2,
              label: "Completed",
              value: stats.completed,
            },
            {
              icon: Trophy,
              label: "Average Progress",
              value: `${stats.average}%`,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <Icon size={19} />
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-400">
                      {item.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 pb-16 lg:px-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-teal-700">
              Learning Dashboard
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight">
              Your courses
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search my courses..."
                className="w-full rounded-xl border border-black/8 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 sm:w-[260px]"
              />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value as "All" | CourseStatus)
              }
              className="rounded-xl border border-black/8 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>
        </div>

        {visibleCourses.length === 0 ? (
          <div className="mt-8 rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto text-slate-300" size={42} />

            <h4 className="mt-4 text-xl font-black">
              Nothing matches your search
            </h4>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Clear your search or browse the course library for something new.
            </p>

            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => {
                  setQuery("");
                  setFilter("All");
                }}
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
              >
                Clear Filters
              </button>

              <Link
                href="/courses"
                className="rounded-xl border border-black/8 px-4 py-2.5 text-sm font-bold text-slate-700"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {visibleCourses.map((course, index) => (
              <article
                key={course.id}
                className="my-course-card overflow-hidden rounded-[1.8rem] border border-black/6 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ animationDelay: `${index * 65}ms` }}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        {course.status === "Completed" ? (
                          <CheckCircle2 size={23} />
                        ) : (
                          <BookOpen size={23} />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-500">
                            {course.category}
                          </span>

                          {course.premium && (
                            <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">
                              Premium
                            </span>
                          )}
                        </div>

                        <h4 className="mt-2 text-lg font-black tracking-tight">
                          {course.title}
                        </h4>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {course.level} · {course.duration} · {course.lessons} lessons
                        </p>
                      </div>
                    </div>

                    <span
                      className={`self-start rounded-full px-3 py-1.5 text-[11px] font-black ${
                        course.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : course.status === "In Progress"
                            ? "bg-teal-50 text-teal-700"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    {course.description}
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500">
                        Progress
                      </span>

                      <span className="font-black text-teal-700">
                        {course.progress}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          course.status === "Completed"
                            ? "bg-emerald-500"
                            : "bg-teal-500"
                        }`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {course.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#f4f8f8] px-2.5 py-1 text-[11px] font-bold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-2 border-t border-black/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Clock3 size={14} />
                      {course.status === "Completed"
                        ? `Completed ${
                            course.completedAt
                              ? new Date(course.completedAt).toLocaleDateString()
                              : ""
                          }`
                        : course.progress > 0
                          ? "Continue where you stopped"
                          : "Ready to begin"}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="rounded-xl border border-black/8 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                      >
                        Details
                      </button>

                      <button
                        onClick={() =>
                          course.status === "Completed"
                            ? setSelectedCourse(course)
                            : continueCourse(course)
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
                      >
                        {course.status === "Completed" ? (
                          <>
                            <CheckCircle2 size={14} />
                            Review
                          </>
                        ) : (
                          <>
                            <PlayCircle size={14} />
                            {course.progress > 0 ? "Continue" : "Start"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-14 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
            <div className="rounded-[2rem] bg-slate-950 p-7 text-white">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <Sparkles size={20} />
              </div>

              <h3 className="mt-5 max-w-xl text-2xl font-black tracking-tight sm:text-3xl">
                Your learning should lead somewhere.
              </h3>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Once you build knowledge, use LiveProject&apos;s real-world
                projects to demonstrate it. That is how learning becomes
                evidence.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-4 py-3 text-sm font-black text-slate-950"
                >
                  Explore Projects
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/experience-passport"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white"
                >
                  Experience Passport
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-black/6 bg-[#f7faf9] p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Trophy size={20} />
              </div>

              <h3 className="mt-5 text-xl font-black">
                Ready for your next milestone?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete more courses, work on more projects, and strengthen
                the evidence attached to your career profile.
              </p>

              <Link
                href="/portfolio"
                className="mt-6 inline-flex items-center gap-2 text-sm font-black text-teal-700"
              >
                View my portfolio
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject Academy.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/courses" className="hover:text-slate-900">
            Course Library
          </Link>
          <Link href="/projects" className="hover:text-slate-900">
            Projects
          </Link>
          <Link href="/premium" className="hover:text-slate-900">
            Premium
          </Link>
        </div>
      </footer>

      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                  Course
                </p>
                <h3 className="mt-1 text-xl font-black">
                  {selectedCourse.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedCourse(null)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Target size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedCourse.progress}%
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Current Progress
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <BookOpen size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedCourse.lessons}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Lessons
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <Clock3 size={16} className="text-teal-600" />
                  <div className="mt-2 text-sm font-black">
                    {selectedCourse.duration}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Duration
                  </div>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                {selectedCourse.description}
              </p>

              <div className="mt-6">
                <h4 className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">
                  Skills
                </h4>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCourse.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{ width: `${selectedCourse.progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-end">
              <button
                onClick={() => removeCourse(selectedCourse.id)}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
              >
                Remove from My Courses
              </button>

              <button
                onClick={() => setSelectedCourse(null)}
                className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
              >
                Close
              </button>

              <button
                onClick={() => continueCourse(selectedCourse)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white transition hover:bg-teal-700"
              >
                {selectedCourse.progress >= 100 ? (
                  <>
                    <CheckCircle2 size={16} />
                    Completed
                  </>
                ) : (
                  <>
                    <PlayCircle size={16} />
                    Continue Learning
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