"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Mail,
  Search,
  SlidersHorizontal,
  Star,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type Applicant = {
  id: string;
  name?: string;
  role?: string;
  email?: string;
  country?: string;
  track?: string;
  level?: string;
  experience?: string;
  status?: string;
  projectId?: string;
  projectTitle?: string;
  appliedAt?: string;
  skills?: string[];
  portfolio?: string;
  rating?: number;
};

type BusinessProject = {
  id: string;
  title?: string;
  applicants?: number;
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadApplicants(): Applicant[] {
  if (typeof window === "undefined") {
    return [];
  }

  const keys = [
    "liveproject_business_applicants",
    "liveproject_client_applicants",
    "liveproject_applicants",
  ];

  for (const key of keys) {
    try {
      const raw = sessionStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue.
    }
  }

  return [];
}

function loadProjects(): BusinessProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  const keys = [
    "liveproject_business_projects",
    "liveproject_client_projects",
    "liveproject_projects",
  ];

  for (const key of keys) {
    try {
      const raw = sessionStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Continue.
    }
  }

  return [];
}

function statusStyles(status?: string) {
  const value = (status || "Pending").toLowerCase();

  if (
    value.includes("approved") ||
    value.includes("shortlisted") ||
    value.includes("accepted")
  ) {
    return {
      label: status || "Shortlisted",
      className:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      icon: CheckCircle2,
    };
  }

  if (
    value.includes("rejected") ||
    value.includes("declined")
  ) {
    return {
      label: status || "Rejected",
      className: "border-red-100 bg-red-50 text-red-700",
      icon: XCircle,
    };
  }

  if (value.includes("review") || value.includes("pending")) {
    return {
      label: status || "Pending",
      className:
        "border-amber-100 bg-amber-50 text-amber-700",
      icon: Clock3,
    };
  }

  return {
    label: status || "New",
    className: "border-slate-200 bg-slate-50 text-slate-600",
    icon: UserRound,
  };
}

export default function BusinessApplicantsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [query, setQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Applicant | null>(null);

  useEffect(() => {
    const session = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role = session.role ?? session.accountType;

    if (role === "professional") {
      router.replace("/workspace");
      return;
    }

    const onboarding = readStorage(
      "liveproject_client_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/business-onboarding");
      return;
    }

    setApplicants(loadApplicants());
    setProjects(loadProjects());
    setReady(true);
  }, [router]);

  const projectOptions = useMemo(() => {
    const unique = new Map<string, string>();

    projects.forEach((project) => {
      if (project.id) {
        unique.set(
          project.id,
          project.title || "Untitled project"
        );
      }
    });

    applicants.forEach((applicant) => {
      if (applicant.projectId) {
        unique.set(
          applicant.projectId,
          applicant.projectTitle || "Untitled project"
        );
      }
    });

    return Array.from(unique.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [projects, applicants]);

  const filteredApplicants = useMemo(() => {
    const search = query.trim().toLowerCase();

    return applicants.filter((applicant) => {
      const name = applicant.name || "";
      const role = applicant.role || "";
      const track = applicant.track || "";
      const projectTitle = applicant.projectTitle || "";
      const country = applicant.country || "";
      const skills = (applicant.skills || []).join(" ");

      const searchable = [
        name,
        role,
        track,
        projectTitle,
        country,
        skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchable.includes(search);

      const matchesProject =
        projectFilter === "all" ||
        applicant.projectId === projectFilter;

      const status = (applicant.status || "Pending").toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" &&
          (status.includes("pending") ||
            status.includes("review") ||
            status === "new")) ||
        (statusFilter === "shortlisted" &&
          (status.includes("shortlisted") ||
            status.includes("accepted") ||
            status.includes("approved"))) ||
        (statusFilter === "rejected" &&
          (status.includes("rejected") ||
            status.includes("declined")));

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [applicants, query, projectFilter, statusFilter]);

  const stats = useMemo(() => {
    let pending = 0;
    let shortlisted = 0;
    let rejected = 0;

    applicants.forEach((applicant) => {
      const status = (applicant.status || "Pending").toLowerCase();

      if (
        status.includes("shortlisted") ||
        status.includes("accepted") ||
        status.includes("approved")
      ) {
        shortlisted++;
      } else if (
        status.includes("rejected") ||
        status.includes("declined")
      ) {
        rejected++;
      } else {
        pending++;
      }
    });

    return {
      total: applicants.length,
      pending,
      shortlisted,
      rejected,
    };
  }, [applicants]);

  const updateApplicantStatus = (
    applicantId: string,
    status: string
  ) => {
    setApplicants((current) => {
      const updated = current.map((applicant) =>
        applicant.id === applicantId
          ? {
              ...applicant,
              status,
            }
          : applicant
      );

      try {
        sessionStorage.setItem(
          "liveproject_business_applicants",
          JSON.stringify(updated)
        );
      } catch {
        // Prototype storage can fail silently.
      }

      const selected = updated.find(
        (applicant) => applicant.id === applicantId
      );

      if (selected) {
        setSelectedApplicant(selected);
      }

      return updated;
    });
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading applicants...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbfa] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
                aria-label="Back to business dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Applicants
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/business/talent")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Search size={16} />
              <span className="hidden sm:inline">
                Discover professionals
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Intro */}
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <Users size={13} />
                  Talent pipeline
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Review people who want to work on your projects.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Review applications, inspect professional evidence,
                  shortlist strong candidates and move promising people
                  into your project workflow.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[500px]">
                {[
                  ["Total", stats.total],
                  ["Pending", stats.pending],
                  ["Shortlisted", stats.shortlisted],
                  ["Rejected", stats.rejected],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="text-xl font-black text-slate-950">
                      {value}
                    </div>

                    <div className="mt-1 text-xs font-semibold text-slate-500">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <SlidersHorizontal size={16} />
                Filters
              </div>

              <button
                type="button"
                onClick={() => setMobileFilters((value) => !value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
              >
                {mobileFilters ? "Hide" : "Show"}
              </button>
            </div>

            <div
              className={[
                "mt-4 grid gap-4 lg:mt-0 lg:grid-cols-[1fr_240px_180px]",
                mobileFilters ? "grid" : "hidden lg:grid",
              ].join(" ")}
            >
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search applicants, roles, skills..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div className="relative">
                <select
                  value={projectFilter}
                  onChange={(event) =>
                    setProjectFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                >
                  <option value="all">All projects</option>

                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                >
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Applicant list */}
          <section className="mt-6">
            {filteredApplicants.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Users size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  {applicants.length === 0
                    ? "No applications yet."
                    : "No applicants match your filters."}
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {applicants.length === 0
                    ? "Applicants will appear here when professionals apply to your projects."
                    : "Try changing your search, project or status filters."}
                </p>

                {applicants.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => router.push("/business/projects")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    View my projects
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setProjectFilter("all");
                      setStatusFilter("all");
                    }}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplicants.map((applicant) => {
                  const status = statusStyles(applicant.status);
                  const StatusIcon = status.icon;

                  return (
                    <article
                      key={applicant.id}
                      className="group rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                            {(applicant.name?.[0] || "P").toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-black text-slate-950">
                                {applicant.name || "Professional applicant"}
                              </h3>

                              <span
                                className={[
                                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em]",
                                  status.className,
                                ].join(" ")}
                              >
                                <StatusIcon size={11} />
                                {status.label}
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-semibold text-teal-700">
                              {applicant.role ||
                                applicant.track ||
                                "Professional"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              {applicant.projectTitle && (
                                <span>
                                  Applied for{" "}
                                  <strong className="font-bold text-slate-700">
                                    {applicant.projectTitle}
                                  </strong>
                                </span>
                              )}

                              {applicant.country && (
                                <span>{applicant.country}</span>
                              )}

                              {applicant.experience && (
                                <span>{applicant.experience}</span>
                              )}
                            </div>

                            {applicant.skills &&
                              applicant.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {applicant.skills
                                    .slice(0, 5)
                                    .map((skill) => (
                                      <span
                                        key={skill}
                                        className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                </div>
                              )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 xl:shrink-0">
                          {applicant.rating !== undefined && (
                            <div className="mr-2 inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                              <Star size={13} className="fill-current" />
                              {applicant.rating.toFixed(1)}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedApplicant(applicant)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                          >
                            Review
                            <ArrowRight size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (applicant.email) {
                                window.location.href = `mailto:${applicant.email}`;
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                          >
                            <Mail size={14} />
                            Contact
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="h-10" />
        </div>
      </div>

      {/* Applicant review drawer */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close applicant review"
            onClick={() => setSelectedApplicant(null)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <aside className="relative h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Applicant review
                </div>
                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  {selectedApplicant.name ||
                    "Professional applicant"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">
                  {(selectedApplicant.name?.[0] || "P").toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-black text-slate-950">
                    {selectedApplicant.name ||
                      "Professional applicant"}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-teal-700">
                    {selectedApplicant.role ||
                      selectedApplicant.track ||
                      "Professional"}
                  </p>

                  {selectedApplicant.country && (
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedApplicant.country}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Project
                </div>

                <div className="mt-2 rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-black text-slate-950">
                    {selectedApplicant.projectTitle ||
                      "Project not specified"}
                  </p>

                  {selectedApplicant.appliedAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Applied {selectedApplicant.appliedAt}
                    </p>
                  )}
                </div>
              </div>

              {selectedApplicant.skills &&
                selectedApplicant.skills.length > 0 && (
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Skills
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedApplicant.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Current status
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateApplicantStatus(
                        selectedApplicant.id,
                        "Pending"
                      )
                    }
                    className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-700"
                  >
                    Pending
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateApplicantStatus(
                        selectedApplicant.id,
                        "Shortlisted"
                      )
                    }
                    className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700"
                  >
                    Shortlist
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateApplicantStatus(
                        selectedApplicant.id,
                        "Rejected"
                      )
                    }
                    className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selectedApplicant.email && (
                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = `mailto:${selectedApplicant.email}`;
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <Mail size={16} />
                    Email applicant
                  </button>
                )}

                {selectedApplicant.portfolio && (
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        selectedApplicant.portfolio,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    View portfolio
                    <ArrowRight size={15} />
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <BriefcaseBusiness size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-teal-900">
                      Review with evidence in mind
                    </p>

                    <p className="mt-1 text-xs leading-6 text-teal-800/80">
                      Look beyond titles. Consider the applicant&apos;s
                      demonstrated skills, project evidence, communication
                      and fit for the specific business problem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}