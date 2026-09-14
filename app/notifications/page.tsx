"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MessageSquare,
  Settings2,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

type NotificationType =
  | "success"
  | "info"
  | "warning"
  | "message"
  | "application"
  | "project";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  href?: string;
};

const initialNotifications: Notification[] = [
  {
    id: "n-001",
    type: "application",
    title: "Application moved to Interview",
    message:
      "Your application for Frontend Engineer at TechScale UK has moved to the interview stage.",
    time: "18 min ago",
    read: false,
    href: "/application-tracker",
  },
  {
    id: "n-002",
    type: "message",
    title: "New mentor feedback",
    message:
      "Your mentor left new feedback on your latest project submission.",
    time: "1 hour ago",
    read: false,
    href: "/mentor",
  },
  {
    id: "n-003",
    type: "project",
    title: "Project submission approved",
    message:
      "Your project deliverable has been approved. Your verified experience record is now updated.",
    time: "3 hours ago",
    read: true,
    href: "/experience-passport",
  },
  {
    id: "n-004",
    type: "success",
    title: "Course milestone completed",
    message:
      "You completed another learning milestone in Agile Fundamentals.",
    time: "Yesterday",
    read: true,
    href: "/my-courses",
  },
  {
    id: "n-005",
    type: "info",
    title: "New AI job matches",
    message:
      "LiveProject AI found 3 new UK opportunities matching your profile.",
    time: "Yesterday",
    read: true,
    href: "/ai-job-matches",
  },
  {
    id: "n-006",
    type: "warning",
    title: "Interview preparation recommended",
    message:
      "Your Job Readiness assessment recommends another AI Interview session before applying to senior roles.",
    time: "2 days ago",
    read: true,
    href: "/job-readiness",
  },
];

const typeStyles: Record<
  NotificationType,
  { bg: string; text: string; icon: React.ElementType }
> = {
  success: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: Sparkles,
  },
  warning: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertCircle,
  },
  message: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    icon: MessageSquare,
  },
  application: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    icon: BriefcaseBusiness,
  },
  project: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    icon: FileCheck2,
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const unread = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  function markAllRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true }))
    );
  }

  function markRead(id: string) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  }

  function remove(id: string) {
    setNotifications((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes notificationsGlow {
          0%,
          100% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.55;
          }
        }

        @keyframes notificationsGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        .notifications-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: notificationsGrid 18s linear infinite;
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
                Account
              </p>

              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black">Notifications</h1>

                {unread > 0 && (
                  <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[9px] font-black text-white">
                    {unread} new
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="hidden rounded-xl border border-black/8 bg-white px-4 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50 sm:inline-flex"
              >
                Mark all read
              </button>
            )}

            <Link
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/8 bg-white text-slate-600"
            >
              <Settings2 size={17} />
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="notifications-grid absolute inset-0 opacity-60" />

        <div
          className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "notificationsGlow 6s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-[1500px] px-5 py-12 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_350px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
                <Bell size={14} />
                LIVEPROJECT UPDATES
              </div>

              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                Stay on top of what matters.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Keep track of applications, projects, mentor feedback, learning
                milestones and AI career recommendations.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                    Notification centre
                  </p>

                  <p className="mt-1 text-3xl font-black">{unread}</p>

                  <p className="mt-1 text-xs text-slate-500">
                    unread updates
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Bell size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-10 lg:px-8">
        {notifications.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-700">
              <Bell size={28} />
            </div>

            <h3 className="mt-5 text-2xl font-black">
              You&apos;re all caught up.
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              New activity will appear here as your LiveProject account
              progresses.
            </p>

            <Link
              href="/workspace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
            >
              Return to Dashboard
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const style = typeStyles[notification.type];
              const Icon = style.icon;

              return (
                <article
                  key={notification.id}
                  className={`group rounded-[1.5rem] border border-black/6 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-5 ${
                    !notification.read
                      ? "ring-1 ring-teal-100"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.bg} ${style.text}`}
                    >
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:gap-4">
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-teal-500" />
                          )}

                          <h3 className="text-sm font-black">
                            {notification.title}
                          </h3>
                        </div>

                        <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                          {notification.time}
                        </span>
                      </div>

                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                        {notification.message}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {notification.href && (
                          <Link
                            href={notification.href}
                            onClick={() => markRead(notification.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-3.5 py-2.5 text-xs font-black text-white transition hover:bg-teal-700"
                          >
                            View
                            <ArrowRight size={13} />
                          </Link>
                        )}

                        {!notification.read && (
                          <button
                            onClick={() => markRead(notification.id)}
                            className="rounded-xl border border-black/8 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => remove(notification.id)}
                      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-red-50 hover:text-red-600 sm:flex"
                    >
                      <X size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 border-t border-black/5 px-5 py-8 text-sm text-slate-500 sm:flex-row lg:px-8">
        <span>© 2026 LiveProject.</span>

        <div className="flex flex-wrap gap-5">
          <Link href="/workspace" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/settings" className="hover:text-slate-900">
            Settings
          </Link>
          <Link href="/premium" className="hover:text-slate-900">
            Premium
          </Link>
        </div>
      </footer>
    </main>
  );
}