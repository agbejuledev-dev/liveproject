"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Lock,
  PlayCircle,
  Sparkles,
  Star,
  Target,
  Users,
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

const courseModules = [
  "Introduction and learning objectives",
  "Core concepts and professional terminology",
  "Practical frameworks and methods",
  "Real-world examples",
  "Guided exercise",
  "Applied workplace scenario",
  "Knowledge check",
  "Final practical activity",
];

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();

  const courseId = Number(params?.courseId);
  const course = courses.find((item) => item.id === courseId);

  if (!course) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f9f9] px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <BookOpen size={25} />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Course not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            The course you're looking for is unavailable or no longer exists.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white"
          >
            <ArrowLeft size={14} />
            Back to Courses
          </Link>
        </div>
      </main>
    );
  }

  const handleStart = () => {
    if (course.premium) {
      sessionStorage.setItem(
        "liveproject_after_upgrade",
        `/courses/${course.id}`
      );

      router.push("/premium");
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

    router.push(`/courses/${course.id}/learn`);
  };

  return (
    <main className="min-h-screen bg-[#f6f9f9] text-slate-950">
      <style jsx global>{`
        @keyframes detailGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 46px 46px;
          }
        }

        @keyframes detailGlow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <Link
            href="/my-courses"
            className="inline-flex items-center gap-2 rounded-xl border border-black/7 px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
          >
            My Courses
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,212,191,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.07) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
            animation: "detailGrid 18s linear infinite",
          }}
        />

        <div
          className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "detailGlow 7s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-200">
                {course.category}
              </span>

              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-300">
                {course.level}
              </span>

              {course.premium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white">
                  <Lock size={11} />
                  Premium
                </span>
              )}
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              {course.title}
            </h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              {course.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-5 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Clock3 size={14} className="text-teal-300" />
                {course.duration}
              </span>

              <span className="inline-flex items-center gap-2">
                <BookOpen size={14} className="text-teal-300" />
                {course.lessons} lessons
              </span>

              <span className="inline-flex items-center gap-2">
                <Star
                  size={14}
                  className="fill-amber-400 text-amber-400"
                />
                {course.rating}
              </span>

              <span className="inline-flex items-center gap-2">
                <Users size={14} className="text-teal-300" />
                {course.students} learners
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-7">
            <CourseIntroVideo
              title={course.title}
              description={
                course.introVideoDescription ||
                `This short introduction explains what ${course.title} covers, what you will learn, and how it can benefit your career.`
              }
              videoUrl={course.introVideoUrl}
              posterUrl={course.introVideoPoster}
            />

            <section className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                <Sparkles size={13} />
                What you will gain
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight">
                Built for practical capability
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                This course is designed to help you understand the subject,
                communicate professionally about it, and apply the knowledge
                inside practical work.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Understand the core concepts",
                  "Learn professional terminology",
                  "Practise practical frameworks",
                  "Apply knowledge to real scenarios",
                  "Build confidence discussing the skill",
                  "Create stronger professional evidence",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-[#f8fbfb] p-4"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-teal-700"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                <BookOpen size={13} />
                Course Structure
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight">
                What you will work through
              </h2>

              <div className="mt-6 space-y-3">
                {courseModules
                  .slice(0, Math.min(courseModules.length, 8))
                  .map((module, index) => (
                    <div
                      key={module}
                      className="flex items-center gap-4 rounded-2xl border border-black/5 bg-[#fafcfc] p-4"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xs font-black text-teal-700">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <span className="text-sm font-bold text-slate-700">
                        {module}
                      </span>
                    </div>
                  ))}
              </div>
            </section>

            <section className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                <Target size={13} />
                Skills
              </div>

              <h2 className="mt-3 text-2xl font-black tracking-tight">
                Skills you will build
              </h2>

              <div className="mt-5 flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-white shadow-lg">
              <div
                className={`h-3 bg-gradient-to-r ${course.color}`}
              />

              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                    Your next step
                  </span>

                  {course.premium && (
                    <span className="rounded-full bg-slate-950 px-2.5 py-1.5 text-[9px] font-black uppercase text-white">
                      Premium
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-black tracking-tight">
                  {course.premium
                    ? "Unlock this course"
                    : "Start learning today"}
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {course.premium
                    ? "Premium gives you access to this course and the wider LiveProject career acceleration system."
                    : "Start this course and build practical knowledge you can apply to LiveProject projects."}
                </p>

                <button
                  type="button"
                  onClick={handleStart}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-black transition ${
                    course.premium
                      ? "bg-slate-950 text-white hover:bg-slate-800"
                      : "bg-teal-700 text-white hover:bg-teal-800"
                  }`}
                >
                  {course.premium ? (
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

                  <ArrowRight size={15} />
                </button>

                <div className="mt-5 space-y-3 border-t border-black/5 pt-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Provider</span>
                    <span className="font-bold text-slate-800">
                      {course.provider}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Level</span>
                    <span className="font-bold text-slate-800">
                      {course.level}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Lessons</span>
                    <span className="font-bold text-slate-800">
                      {course.lessons}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Rating</span>
                    <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                      <Star
                        size={12}
                        className="fill-amber-400 text-amber-400"
                      />
                      {course.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <p>© 2026 LiveProject Academy.</p>

        <div className="flex flex-wrap gap-5">
          <Link href="/courses" className="hover:text-slate-900">
            Courses
          </Link>

          <Link href="/my-courses" className="hover:text-slate-900">
            My Courses
          </Link>

          <Link href="/premium" className="hover:text-slate-900">
            Premium
          </Link>
        </div>
      </footer>
    </main>
  );
}