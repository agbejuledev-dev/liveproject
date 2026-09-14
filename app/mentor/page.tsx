"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings2,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

type MenteeStatus = "On Track" | "Needs Attention" | "Completed";

type Mentee = {
  id: string;
  name: string;
  role: string;
  track: string;
  progress: number;
  projects: number;
  nextSession: string;
  status: MenteeStatus;
  goal: string;
  lastFeedback: string;
};

const initialMentees: Mentee[] = [
  {
    id: "mentee-001",
    name: "Amara Okafor",
    role: "Frontend Developer",
    track: "Technology",
    progress: 82,
    projects: 3,
    nextSession: "18 Sep 2026",
    status: "On Track",
    goal: "Strengthen React and project delivery evidence.",
    lastFeedback: "Strong technical progress. Needs stronger outcome statements.",
  },
  {
    id: "mentee-002",
    name: "Daniel Williams",
    role: "Business Analyst",
    track: "Business Analysis",
    progress: 67,
    projects: 2,
    nextSession: "19 Sep 2026",
    status: "Needs Attention",
    goal: "Improve stakeholder communication and requirements analysis.",
    lastFeedback: "Good analytical thinking. Needs more confidence in stakeholder scenarios.",
  },
  {
    id: "mentee-003",
    name: "Sarah Mensah",
    role: "Product Manager",
    track: "Product",
    progress: 91,
    projects: 4,
    nextSession: "21 Sep 2026",
    status: "On Track",
    goal: "Prepare for product leadership opportunities.",
    lastFeedback: "Excellent product thinking and strong project evidence.",
  },
  {
    id: "mentee-004",
    name: "David Carter",
    role: "Project Manager",
    track: "Project Management",
    progress: 100,
    projects: 5,
    nextSession: "Completed",
    status: "Completed",
    goal: "Build a portfolio for delivery leadership roles.",
    lastFeedback: "Programme completed successfully with strong verified evidence.",
  },
  {
    id: "mentee-005",
    name: "Grace Adeyemi",
    role: "UX Designer",
    track: "UX Design",
    progress: 74,
    projects: 2,
    nextSession: "23 Sep 2026",
    status: "On Track",
    goal: "Strengthen UX research and case-study storytelling.",
    lastFeedback: "Strong visual thinking. Needs deeper research documentation.",
  },
];

const statusStyles: Record<MenteeStatus, string> = {
  "On Track": "bg-emerald-50 text-emerald-700",
  "Needs Attention": "bg-amber-50 text-amber-700",
  Completed: "bg-slate-100 text-slate-600",
};

export default function MentorPage() {
  const [mentees, setMentees] = useState(initialMentees);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<
    "All" | MenteeStatus
  >("All");
  const [selectedMentee, setSelectedMentee] =
    useState<Mentee | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");

  const stats = useMemo(() => {
    const active = mentees.filter(
      (mentee) => mentee.status !== "Completed"
    ).length;

    const attention = mentees.filter(
      (mentee) => mentee.status === "Needs Attention"
    ).length;

    const completed = mentees.filter(
      (mentee) => mentee.status === "Completed"
    ).length;

    const average =
      mentees.length > 0
        ? Math.round(
            mentees.reduce(
              (sum, mentee) => sum + mentee.progress,
              0
            ) / mentees.length
          )
        : 0;

    return {
      total: mentees.length,
      active,
      attention,
      completed,
      average,
    };
  }, [mentees]);

  const filteredMentees = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return mentees.filter((mentee) => {
      const matchesQuery =
        !normalized ||
        mentee.name.toLowerCase().includes(normalized) ||
        mentee.role.toLowerCase().includes(normalized) ||
        mentee.track.toLowerCase().includes(normalized) ||
        mentee.goal.toLowerCase().includes(normalized);

      const matchesStatus =
        status === "All" || mentee.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [mentees, query, status]);

  function saveFeedback() {
    if (!selectedMentee || !feedback.trim()) return;

    setMentees((current) =>
      current.map((mentee) =>
        mentee.id === selectedMentee.id
          ? {
              ...mentee,
              lastFeedback: feedback.trim(),
            }
          : mentee
      )
    );

    setSelectedMentee({
      ...selectedMentee,
      lastFeedback: feedback.trim(),
    });

    setFeedback("");
    setShowFeedback(false);
  }

  function updateStatus(nextStatus: MenteeStatus) {
    if (!selectedMentee) return;

    setMentees((current) =>
      current.map((mentee) =>
        mentee.id === selectedMentee.id
          ? {
              ...mentee,
              status: nextStatus,
              progress:
                nextStatus === "Completed"
                  ? 100
                  : mentee.progress,
            }
          : mentee
      )
    );

    setSelectedMentee({
      ...selectedMentee,
      status: nextStatus,
      progress:
        nextStatus === "Completed"
          ? 100
          : selectedMentee.progress,
    });
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes mentorGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes mentorGlow {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.62;
            transform: scale(1.04);
          }
        }

        @keyframes mentorFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        .mentor-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: mentorGrid 18s linear infinite;
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
                Mentor Workspace
              </p>
              <h1 className="text-lg font-black">
                Mentor Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden items-center gap-2 rounded-xl border border-black/8 bg-white px-4 py-2.5 text-xs font-black text-slate-700 sm:inline-flex">
              <Settings2 size={14} />
              Mentor Settings
            </button>

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-white text-slate-600">
              <Bell size={17} />
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="mentor-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "mentorGlow 6s ease-in-out infinite" }}
        />

        <div
          className="absolute -left-24 bottom-[-130px] h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "mentorGlow 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
                <Sparkles size={14} />
                MENTOR WORKSPACE
              </div>

              <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Help professionals turn potential into{" "}
                <span className="text-teal-300">evidence.</span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Guide mentees, review their progress, provide actionable
                feedback and help them build stronger professional outcomes.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    document
                      .getElementById("mentees")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950"
                >
                  View Mentees
                  <Users size={16} />
                </button>

                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white"
                >
                  Explore Projects
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div
              className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur"
              style={{ animation: "mentorFloat 6s ease-in-out infinite" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Mentee Progress
                  </p>

                  <div className="mt-1 text-4xl font-black text-teal-300">
                    {stats.average}%
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <TrendingUp size={22} />
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-teal-300"
                  style={{ width: `${stats.average}%` }}
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-lg font-black">{stats.active}</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Active
                  </div>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-lg font-black">{stats.attention}</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Attention
                  </div>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <div className="text-lg font-black">{stats.completed}</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-10 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: Users,
              label: "Mentees",
              value: stats.total,
              color: "bg-teal-50 text-teal-700",
            },
            {
              icon: Target,
              label: "Avg Progress",
              value: `${stats.average}%`,
              color: "bg-violet-50 text-violet-700",
            },
            {
              icon: MessageSquare,
              label: "Feedback Due",
              value: 3,
              color: "bg-amber-50 text-amber-700",
            },
            {
              icon: Award,
              label: "Completions",
              value: stats.completed,
              color: "bg-emerald-50 text-emerald-700",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-[1.6rem] border border-black/6 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}
                  >
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

      <section
        id="mentees"
        className="mx-auto max-w-[1500px] px-5 pb-16 lg:px-8"
      >
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-700">
                  Mentee Portfolio
                </p>

                <h3 className="mt-2 text-2xl font-black">
                  People you are supporting
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
                    placeholder="Search mentees..."
                    className="w-full rounded-xl border border-black/8 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-teal-500 sm:w-[240px]"
                  />
                </div>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as "All" | MenteeStatus)
                  }
                  className="rounded-xl border border-black/8 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-teal-500"
                >
                  <option value="All">All Statuses</option>
                  <option>On Track</option>
                  <option>Needs Attention</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredMentees.map((mentee) => (
                <article
                  key={mentee.id}
                  className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl sm:p-6"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                          <UserRound size={22} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${statusStyles[mentee.status]}`}
                            >
                              {mentee.status}
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
                              {mentee.track}
                            </span>
                          </div>

                          <h4 className="mt-3 text-xl font-black tracking-tight">
                            {mentee.name}
                          </h4>

                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {mentee.role}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedMentee(mentee)}
                        className="inline-flex items-center gap-2 self-start rounded-xl border border-black/8 px-3.5 py-2.5 text-xs font-black text-slate-700"
                      >
                        Open Profile
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-4">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <Target size={14} className="text-teal-600" />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Progress
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {mentee.progress}%
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <BriefcaseBusiness
                          size={14}
                          className="text-teal-600"
                        />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Projects
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {mentee.projects}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <CalendarDays
                          size={14}
                          className="text-teal-600"
                        />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Next Session
                        </p>
                        <p className="mt-0.5 text-xs font-black">
                          {mentee.nextSession}
                        </p>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <MessageSquare
                          size={14}
                          className="text-teal-600"
                        />
                        <p className="mt-2 text-[11px] font-bold text-slate-400">
                          Feedback
                        </p>
                        <p className="mt-0.5 truncate text-xs font-black">
                          Available
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">
                          Career Progress
                        </span>

                        <span className="font-black text-teal-700">
                          {mentee.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${
                            mentee.status === "Needs Attention"
                              ? "bg-amber-500"
                              : "bg-teal-500"
                          }`}
                          style={{ width: `${mentee.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-black/5 bg-[#f8fbfb] p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Current Goal
                      </p>

                      <p className="mt-2 text-sm font-bold text-slate-700">
                        {mentee.goal}
                      </p>
                    </div>

                    <div className="flex flex-col justify-between gap-3 border-t border-black/5 pt-4 sm:flex-row sm:items-center">
                      <p className="max-w-xl text-xs leading-5 text-slate-400">
                        Latest feedback: {mentee.lastFeedback}
                      </p>

                      <button
                        onClick={() => {
                          setSelectedMentee(mentee);
                          setShowFeedback(true);
                          setFeedback(mentee.lastFeedback);
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs font-black text-white"
                      >
                        Give Feedback
                        <MessageSquare size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <Clock3 size={20} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Upcoming mentoring
              </h3>

              <div className="mt-4 space-y-3">
                {mentees
                  .filter((mentee) => mentee.status !== "Completed")
                  .slice(0, 3)
                  .map((mentee) => (
                    <div
                      key={mentee.id}
                      className="rounded-xl bg-slate-50 p-3"
                    >
                      <p className="text-xs font-black">{mentee.name}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {mentee.nextSession}
                      </p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-black/6 bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                <FileCheck2 size={20} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Reviews waiting
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Three mentee feedback items are currently ready for review.
              </p>

              <button
                onClick={() => {
                  const mentee = mentees.find(
                    (item) => item.status === "Needs Attention"
                  );

                  if (mentee) {
                    setSelectedMentee(mentee);
                    setShowFeedback(true);
                    setFeedback(mentee.lastFeedback);
                  }
                }}
                className="mt-5 inline-flex items-center gap-2 text-xs font-black text-violet-700"
              >
                Review now
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="rounded-[1.8rem] bg-slate-950 p-5 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                <Sparkles size={20} />
              </div>

              <h3 className="mt-5 text-lg font-black">
                Mentor impact
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your feedback becomes part of a mentee&apos;s professional
                development record and can support stronger career evidence.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-lg font-black">17</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Feedback given
                  </div>
                </div>

                <div className="rounded-xl bg-white/5 p-3">
                  <div className="text-lg font-black">4</div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Completed
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/projects" className="hover:text-slate-900">
            Projects
          </Link>
          <Link href="/courses" className="hover:text-slate-900">
            Courses
          </Link>
          <Link href="/settings" className="hover:text-slate-900">
            Settings
          </Link>
        </div>
      </footer>

      {selectedMentee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-black/5 p-5">
              <div className="flex gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <UserRound size={22} />
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-teal-700">
                    Mentee Profile
                  </p>

                  <h3 className="mt-1 text-xl font-black">
                    {selectedMentee.name}
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    {selectedMentee.role} · {selectedMentee.track}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedMentee(null);
                  setShowFeedback(false);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              {!showFeedback ? (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <Target size={16} className="text-teal-600" />
                      <div className="mt-2 text-lg font-black">
                        {selectedMentee.progress}%
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Progress
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <BriefcaseBusiness
                        size={16}
                        className="text-teal-600"
                      />
                      <div className="mt-2 text-lg font-black">
                        {selectedMentee.projects}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Projects
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <CalendarDays
                        size={16}
                        className="text-teal-600"
                      />
                      <div className="mt-2 text-sm font-black">
                        {selectedMentee.nextSession}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        Next Session
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-teal-50 p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-teal-700">
                      Current Goal
                    </p>

                    <p className="mt-2 text-sm font-bold leading-6 text-teal-900">
                      {selectedMentee.goal}
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Status
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(
                        [
                          "On Track",
                          "Needs Attention",
                          "Completed",
                        ] as MenteeStatus[]
                      ).map((item) => (
                        <button
                          key={item}
                          onClick={() => updateStatus(item)}
                          className={`rounded-full px-3 py-2 text-xs font-bold ${
                            selectedMentee.status === item
                              ? "bg-teal-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Latest Feedback
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {selectedMentee.lastFeedback}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <div className="rounded-2xl bg-teal-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-black text-teal-800">
                      <MessageSquare size={16} />
                      Mentor Feedback
                    </div>

                    <p className="mt-1 text-xs leading-5 text-teal-900/60">
                      Give the mentee clear, specific and actionable guidance.
                    </p>
                  </div>

                  <textarea
                    value={feedback}
                    onChange={(event) => setFeedback(event.target.value)}
                    rows={8}
                    placeholder="Write your feedback..."
                    className="mt-5 w-full resize-none rounded-2xl border border-black/8 px-4 py-3 text-sm leading-6 outline-none focus:border-teal-500"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 border-t border-black/5 p-5 sm:flex-row sm:justify-between">
              {showFeedback ? (
                <>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    Back
                  </button>

                  <button
                    onClick={saveFeedback}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white"
                  >
                    Save Feedback
                    <CheckCircle2 size={15} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowFeedback(true);
                      setFeedback(selectedMentee.lastFeedback);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-black text-white"
                  >
                    Give Feedback
                    <MessageSquare size={15} />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMentee(null);
                      setShowFeedback(false);
                    }}
                    className="rounded-xl border border-black/8 px-4 py-3 text-sm font-bold text-slate-700"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}