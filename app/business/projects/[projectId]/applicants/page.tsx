// app/business/projects/[projectId]/applicants/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Mail,
  MessageSquare,
  Search,
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

type Project = {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  track?: string;
  level?: string;
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
  verified?: boolean;
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getApplicants(): Applicant[] {
  const keys = [
    "liveproject_business_applicants",
    "liveproject_client_applicants",
    "liveproject_applicants",
  ];

  for (const key of keys) {
    const value = readStorage<Applicant[]>(key, []);

    if (Array.isArray(value) && value.length > 0) {
      return value;
    }
  }

  return [];
}

function saveApplicants(applicants: Applicant[]) {
  try {
    const serialized = JSON.stringify(applicants);

    sessionStorage.setItem(
      "liveproject_business_applicants",
      serialized
    );

    sessionStorage.setItem(
      "liveproject_client_applicants",
      serialized
    );

    sessionStorage.setItem(
      "liveproject_applicants",
      serialized
    );
  } catch {
    // Prototype storage.
  }
}

function statusConfig(status?: string) {
  const value = (status || "Pending").toLowerCase();

  if (
    value.includes("shortlisted") ||
    value.includes("approved") ||
    value.includes("accepted")
  ) {
    return {
      label: "Shortlisted",
      className:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
  }

  if (
    value.includes("rejected") ||
    value.includes("declined")
  ) {
    return {
      label: "Rejected",
      className: "border-red-100 bg-red-50 text-red-700",
    };
  }

  return {
    label: "Pending",
    className:
      "border-amber-100 bg-amber-50 text-amber-700",
  };
}

export default function BusinessProjectApplicantsPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplicant, setSelectedApplicant] =
    useState<Applicant | null>(null);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [selectedForTeam, setSelectedForTeam] = useState<string[]>(
    []
  );

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
      router.replace(`/projects/${projectId}`);
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

    const projects = readStorage<Project[]>(
      "liveproject_business_projects",
      []
    );

    const found = Array.isArray(projects)
      ? projects.find(
          (item) => String(item.id) === String(projectId)
        )
      : undefined;

    if (!found) {
      router.replace("/business/projects");
      return;
    }

    setProject(found);

    const allApplicants = getApplicants();

    setApplicants(
      allApplicants.filter(
        (applicant) =>
          !applicant.projectId ||
          String(applicant.projectId) === String(projectId)
      )
    );

    setReady(true);
  }, [projectId, router]);

  const filteredApplicants = useMemo(() => {
    const search = query.trim().toLowerCase();

    return applicants.filter((applicant) => {
      const searchable = [
        applicant.name,
        applicant.role,
        applicant.country,
        applicant.track,
        applicant.level,
        applicant.experience,
        applicant.email,
        applicant.projectTitle,
        ...(applicant.skills || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchable.includes(search);

      const status = (applicant.status || "Pending").toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" &&
          !status.includes("shortlisted") &&
          !status.includes("approved") &&
          !status.includes("accepted") &&
          !status.includes("rejected") &&
          !status.includes("declined")) ||
        (statusFilter === "shortlisted" &&
          (status.includes("shortlisted") ||
            status.includes("approved") ||
            status.includes("accepted"))) ||
        (statusFilter === "rejected" &&
          (status.includes("rejected") ||
            status.includes("declined")));

      return matchesSearch && matchesStatus;
    });
  }, [applicants, query, statusFilter]);

  const stats = useMemo(() => {
    let pending = 0;
    let shortlisted = 0;
    let rejected = 0;

    applicants.forEach((applicant) => {
      const status = (applicant.status || "Pending").toLowerCase();

      if (
        status.includes("shortlisted") ||
        status.includes("approved") ||
        status.includes("accepted")
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

  const updateApplicant = (
    applicantId: string,
    status: string
  ) => {
    const next = getApplicants().map((applicant) =>
      applicant.id === applicantId
        ? {
            ...applicant,
            status,
          }
        : applicant
    );

    saveApplicants(next);

    const projectApplicants = next.filter(
      (applicant) =>
        !applicant.projectId ||
        String(applicant.projectId) === String(projectId)
    );

    setApplicants(projectApplicants);

    const updated = projectApplicants.find(
      (applicant) => applicant.id === applicantId
    );

    setSelectedApplicant(updated || null);
  };

  const toggleTeamSelection = (id: string) => {
    setSelectedForTeam((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const createTeam = () => {
    if (!project || selectedForTeam.length === 0) return;

    const selectedApplicants = applicants.filter((applicant) =>
      selectedForTeam.includes(applicant.id)
    );

    const existingTeams = readStorage<any[]>(
      "liveproject_business_teams",
      []
    );

    const newTeam = {
      id: `team-${Date.now()}`,
      name: `${project.title || "Project"} Team`,
      description:
        "Team created from shortlisted project applicants.",
      projectId: project.id,
      projectTitle: project.title || "Untitled project",
      createdAt: new Date().toLocaleDateString(),
      members: selectedApplicants.map((applicant) => ({
        id: applicant.id,
        name: applicant.name || "Professional",
        role: applicant.role || applicant.track || "Professional",
        email: applicant.email,
        status: "active",
      })),
    };

    const nextTeams = [
      ...(Array.isArray(existingTeams) ? existingTeams : []),
      newTeam,
    ];

    try {
      sessionStorage.setItem(
        "liveproject_business_teams",
        JSON.stringify(nextTeams)
      );
    } catch {
      // Prototype storage.
    }

    router.push("/business/teams");
  };

  if (!ready || !project) {
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
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/business/projects/${project.id}`
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Applicant review
                </div>

                <h1 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  {project.title || "Untitled project"}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/business/talent")
              }
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
            >
              <Search size={16} />
              Discover talent
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Header */}
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <Users size={13} />
                  Project applicants
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Review the people who applied.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Compare applicants, shortlist strong candidates and
                  build the team that will work on this project.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_auto]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search applicants, skills, roles..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
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
                  <option value="shortlisted">
                    Shortlisted
                  </option>
                  <option value="rejected">Rejected</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {selectedForTeam.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowTeamPanel(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  <Users size={15} />
                  Build team ({selectedForTeam.length})
                </button>
              )}
            </div>
          </section>

          {/* Applicant list */}
          <section className="mt-6">
            {filteredApplicants.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  No applicants found.
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Applications for this project will appear here as
                  professionals apply.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/business/projects/${project.id}`
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <ArrowLeft size={15} />
                  Back to project
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplicants.map((applicant) => {
                  const config = statusConfig(
                    applicant.status
                  );

                  const selected = selectedForTeam.includes(
                    applicant.id
                  );

                  return (
                    <article
                      key={applicant.id}
                      className={[
                        "rounded-[24px] border bg-white p-5 shadow-sm transition sm:p-6",
                        selected
                          ? "border-teal-300 ring-2 ring-teal-100"
                          : "border-slate-200/80 hover:border-teal-200 hover:shadow-lg",
                      ].join(" ")}
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <button
                            type="button"
                            onClick={() =>
                              toggleTeamSelection(applicant.id)
                            }
                            className={[
                              "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition",
                              selected
                                ? "border-teal-600 bg-teal-600 text-white"
                                : "border-slate-300 bg-white text-transparent hover:border-teal-400",
                            ].join(" ")}
                            aria-label={
                              selected
                                ? "Remove from team selection"
                                : "Select for team"
                            }
                          >
                            <CheckCircle2 size={14} />
                          </button>

                          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                            {(applicant.name?.[0] || "P").toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-black text-slate-950">
                                {applicant.name ||
                                  "Professional applicant"}
                              </h3>

                              {applicant.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-teal-700">
                                  <CheckCircle2 size={10} />
                                  Verified
                                </span>
                              )}

                              <span
                                className={[
                                  "rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em]",
                                  config.className,
                                ].join(" ")}
                              >
                                {config.label}
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-semibold text-teal-700">
                              {applicant.role ||
                                applicant.track ||
                                "Professional"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              {applicant.country && (
                                <span>{applicant.country}</span>
                              )}

                              {applicant.level && (
                                <span>{applicant.level}</span>
                              )}

                              {applicant.experience && (
                                <span>{applicant.experience}</span>
                              )}

                              {applicant.appliedAt && (
                                <span>
                                  Applied {applicant.appliedAt}
                                </span>
                              )}
                            </div>

                            {applicant.skills &&
                              applicant.skills.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-1.5">
                                  {applicant.skills
                                    .slice(0, 6)
                                    .map((skill) => (
                                      <span
                                        key={skill}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600"
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
                            <span className="mr-2 inline-flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                              <Star
                                size={13}
                                className="fill-current"
                              />
                              {applicant.rating.toFixed(1)}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setSelectedApplicant(
                                applicant
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                          >
                            Review
                            <ArrowRight size={14} />
                          </button>

                          {applicant.status !==
                            "Shortlisted" && (
                            <button
                              type="button"
                              onClick={() =>
                                updateApplicant(
                                  applicant.id,
                                  "Shortlisted"
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                            >
                              <CheckCircle2 size={14} />
                              Shortlist
                            </button>
                          )}
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

      {/* Applicant drawer */}
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
                    "Professional"}
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                    {(
                      selectedApplicant.name?.[0] || "P"
                    ).toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      {selectedApplicant.name ||
                        "Professional"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-teal-700">
                      {selectedApplicant.role ||
                        selectedApplicant.track ||
                        "Professional"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedApplicant.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black text-teal-700">
                      <CheckCircle2 size={11} />
                      Verified
                    </span>
                  )}

                  {selectedApplicant.country && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                      {selectedApplicant.country}
                    </span>
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
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  View portfolio
                  <ArrowRight size={15} />
                </button>
              )}

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Decision
                </div>

                <div className="mt-3 grid gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateApplicant(
                        selectedApplicant.id,
                        "Shortlisted"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} />
                    Shortlist applicant
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateApplicant(
                        selectedApplicant.id,
                        "Rejected"
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
                  >
                    <XCircle size={16} />
                    Reject applicant
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
                    Email
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (selectedApplicant.email) {
                      window.location.href = `mailto:${selectedApplicant.email}`;
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <MessageSquare size={16} />
                  Start conversation
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Team panel */}
      {showTeamPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close team panel"
            onClick={() => setShowTeamPanel(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Team builder
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Build a team from shortlisted people.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  You have selected {selectedForTeam.length}{" "}
                  {selectedForTeam.length === 1
                    ? "professional"
                    : "professionals"}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowTeamPanel(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {applicants
                .filter((applicant) =>
                  selectedForTeam.includes(applicant.id)
                )
                .map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                      {(applicant.name?.[0] || "P").toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-black text-slate-950">
                        {applicant.name ||
                          "Professional"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {applicant.role ||
                          applicant.track ||
                          "Professional"}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <button
              type="button"
              onClick={createTeam}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Create project team
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}