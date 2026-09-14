"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BellRing,
  BriefcaseBusiness,
  Check,
  Clock3,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  getLiveProjectSession,
  isPremiumUser,
  saveAfterAuthDestination,
  saveAfterUpgradeDestination,
} from "@/lib/access";
import { useRouter } from "next/navigation";

type Alert = {
  id: string;
  title: string;
  keywords: string;
  location: string;
  frequency: "Daily" | "Weekly";
  remote: boolean;
  active: boolean;
  createdAt: string;
};

const seedAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "Frontend Developer",
    keywords: "React, Next.js, TypeScript",
    location: "London, UK",
    frequency: "Daily",
    remote: true,
    active: true,
    createdAt: "2026-09-12",
  },
  {
    id: "alert-2",
    title: "Product Manager",
    keywords: "Product, Agile, SaaS",
    location: "United Kingdom",
    frequency: "Weekly",
    remote: false,
    active: true,
    createdAt: "2026-09-10",
  },
];

const frequencies: Alert["frequency"][] = ["Daily", "Weekly"];

export default function JobAlertsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [premium, setPremium] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    title: "",
    keywords: "",
    location: "United Kingdom",
    frequency: "Daily" as Alert["frequency"],
    remote: true,
  });

  useEffect(() => {
    const session = getLiveProjectSession();

    const logged =
      session?.loggedIn === true ||
      sessionStorage.getItem("liveproject_session") !== null;

    const premiumUser = isPremiumUser();

    setLoggedIn(logged);
    setPremium(premiumUser);

    const stored = sessionStorage.getItem("liveproject_job_alerts");

    if (stored) {
      try {
        setAlerts(JSON.parse(stored));
      } catch {
        setAlerts(seedAlerts);
      }
    } else {
      setAlerts(seedAlerts);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    sessionStorage.setItem(
      "liveproject_job_alerts",
      JSON.stringify(alerts)
    );
  }, [alerts, ready]);

  const filteredAlerts = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return alerts;

    return alerts.filter((alert) =>
      [
        alert.title,
        alert.keywords,
        alert.location,
        alert.frequency,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [alerts, search]);

  const handleAccess = () => {
    const destination = "/job-alerts";

    if (!loggedIn) {
      saveAfterAuthDestination(destination);
      router.push("/login");
      return;
    }

    saveAfterUpgradeDestination(destination);
    router.push("/premium");
  };

  const createAlert = () => {
    if (!form.title.trim() || !form.keywords.trim()) return;

    const alert: Alert = {
      id: `alert-${Date.now()}`,
      title: form.title.trim(),
      keywords: form.keywords.trim(),
      location: form.location.trim() || "United Kingdom",
      frequency: form.frequency,
      remote: form.remote,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setAlerts((current) => [alert, ...current]);
    setForm({
      title: "",
      keywords: "",
      location: "United Kingdom",
      frequency: "Daily",
      remote: true,
    });
    setShowCreate(false);
  };

  const toggleAlert = (id: string) => {
    setAlerts((current) =>
      current.map((alert) =>
        alert.id === id
          ? { ...alert, active: !alert.active }
          : alert
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((current) =>
      current.filter((alert) => alert.id !== id)
    );
  };

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#f6f9f9] p-6">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-40 rounded-lg bg-slate-200" />
          <div className="mt-6 h-32 rounded-[2rem] bg-slate-200" />
          <div className="mt-5 h-64 rounded-[2rem] bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!premium) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#071f1f] text-white">
        <style jsx global>{`
          @keyframes alertGrid {
            0% {
              background-position: 0 0;
            }

            100% {
              background-position: 42px 42px;
            }
          }

          @keyframes alertGlow {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(0.95);
            }

            50% {
              opacity: 0.55;
              transform: scale(1.05);
            }
          }
        `}</style>

        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,212,191,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            animation: "alertGrid 16s linear infinite",
          }}
        />

        <div
          className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
          style={{ animation: "alertGlow 7s ease-in-out infinite" }}
        />

        <div
          className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
          style={{ animation: "alertGlow 9s ease-in-out infinite" }}
        />

        <div className="relative mx-auto flex min-h-screen max-w-5xl items-center px-5 py-14">
          <div className="w-full rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-7 shadow-2xl backdrop-blur-xl sm:p-10">
            <Link
              href={loggedIn ? "/workspace" : "/"}
              className="inline-flex items-center gap-2 text-xs font-black text-slate-300 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              Back
            </Link>

            <div className="mt-12 max-w-3xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-300 text-slate-950">
                <BellRing size={25} />
              </div>

              <div className="mt-6 inline-flex rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-200">
                Premium Career Tool
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
                Let the right UK jobs
                <span className="text-teal-300"> come to you.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Create personalised job alerts and let LiveProject surface
                relevant UK opportunities based on the roles, skills and
                locations you care about.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Role alerts", "Target specific job titles."],
                  ["Skill alerts", "Track React, Agile, Product and more."],
                  ["Remote alerts", "Prioritise remote opportunities."],
                ].map(([title, text]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-black/15 p-4"
                  >
                    <div className="text-sm font-black">{title}</div>
                    <div className="mt-1 text-xs leading-5 text-slate-400">
                      {text}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAccess}
                className="mt-9 inline-flex items-center gap-2 rounded-2xl bg-teal-300 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-200"
              >
                {!loggedIn ? "Create Account" : "Unlock Premium"}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f9f9] text-slate-950">
      <style jsx global>{`
        @keyframes jobAlertGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 45px 45px;
          }
        }

        @keyframes jobAlertPulse {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.42;
            transform: scale(1.04);
          }
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 text-xs font-black text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>

          <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
            <Bell size={12} />
            Premium
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-black/5 bg-[#eaf5f4]">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(13,148,136,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(13,148,136,.06) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
            animation: "jobAlertGrid 18s linear infinite",
          }}
        />

        <div
          className="absolute -right-10 -top-24 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl"
          style={{ animation: "jobAlertPulse 8s ease-in-out infinite" }}
        />

        <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-700">
              Opportunities
            </p>

            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                <BellRing size={22} />
              </div>

              <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
                Job Alerts
              </h1>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Tell LiveProject what you are looking for and receive
              personalised UK opportunities without repeatedly searching from
              scratch.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <BriefcaseBusiness className="text-teal-700" size={19} />
              <div className="mt-4 text-2xl font-black">
                {alerts.filter((alert) => alert.active).length}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Active alerts
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <Bell className="text-blue-700" size={19} />
              <div className="mt-4 text-2xl font-black">
                {alerts.length}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Total alerts
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <Clock3 className="text-violet-700" size={19} />
              <div className="mt-4 text-2xl font-black">
                {alerts.filter((alert) => alert.frequency === "Daily").length}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Daily alerts
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-xl flex-1">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your alerts..."
              className="w-full rounded-2xl border border-black/6 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            <Plus size={17} />
            Create Alert
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center">
              <Bell
                size={26}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-xl font-black">
                No job alerts found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create an alert for the kind of UK role you want and LiveProject
                will keep the search focused.
              </p>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-xs font-black text-white transition hover:bg-teal-800"
              >
                Create your first alert
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <article
                key={alert.id}
                className="rounded-[2rem] border border-black/6 bg-white p-5 shadow-sm transition hover:shadow-lg sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-black">
                        {alert.title}
                      </h2>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wide ${
                          alert.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {alert.active ? "Active" : "Paused"}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Search size={13} />
                        {alert.keywords}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={13} />
                        {alert.location}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {alert.frequency}
                      </span>

                      {alert.remote && (
                        <span className="rounded-full bg-teal-50 px-2 py-1 font-bold text-teal-700">
                          Remote
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/uk-job-board"
                      className="inline-flex items-center gap-2 rounded-xl border border-black/7 px-3.5 py-2.5 text-xs font-black text-slate-700 transition hover:bg-slate-50"
                    >
                      Browse Jobs
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleAlert(alert.id)}
                      className={`rounded-xl px-3.5 py-2.5 text-xs font-black transition ${
                        alert.active
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {alert.active ? "Pause" : "Activate"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAlert(alert.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/7 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${alert.title} alert`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  New alert
                </p>
                <h2 className="mt-1 text-xl font-black">
                  Create a Job Alert
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="text-xs font-black text-slate-700">
                  Job title
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Frontend Developer"
                  className="mt-2 w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700">
                  Keywords / skills
                </label>

                <input
                  value={form.keywords}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      keywords: event.target.value,
                    }))
                  }
                  placeholder="React, TypeScript, Agile..."
                  className="mt-2 w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700">
                  Location
                </label>

                <input
                  value={form.location}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                  placeholder="United Kingdom"
                  className="mt-2 w-full rounded-xl border border-black/8 px-4 py-3 text-sm outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="text-xs font-black text-slate-700">
                  Frequency
                </label>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  {frequencies.map((frequency) => (
                    <button
                      key={frequency}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          frequency,
                        }))
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-black transition ${
                        form.frequency === frequency
                          ? "border-teal-500 bg-teal-50 text-teal-800"
                          : "border-black/8 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {frequency}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    remote: !current.remote,
                  }))
                }
                className="flex w-full items-center justify-between rounded-2xl border border-black/7 bg-slate-50 px-4 py-4 text-left"
              >
                <div>
                  <div className="text-sm font-black">
                    Include remote roles
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Prioritise remote UK opportunities matching your alert.
                  </div>
                </div>

                <div
                  className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
                    form.remote ? "bg-teal-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full bg-white transition ${
                      form.remote ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>

              <div className="flex items-center justify-end gap-3 border-t border-black/5 pt-5">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="rounded-xl px-4 py-3 text-xs font-black text-slate-500 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={createAlert}
                  disabled={!form.title.trim() || !form.keywords.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Check size={14} />
                  Save Alert
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}