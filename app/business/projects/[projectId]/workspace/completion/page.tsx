// app/business/projects/[projectId]/workspace/completion/page.tsx

"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Star,
  Users,
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
  format?: string;
  duration?: string;
};

type TeamMember = {
  id: string;
  name?: string;
  role?: string;
  email?: string;
};

type Team = {
  id: string;
  name: string;
  projectId?: string;
  projectTitle?: string;
  members: TeamMember[];
};

type Submission = {
  id: string;
  title: string;
  submittedBy: string;
  status: "Pending" | "Approved" | "Changes Requested";
  submittedAt: string;
  description?: string;
};

type Feedback = {
  memberId: string;
  rating: number;
  comment: string;
  submittedAt: string;
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

function getProject(projectId: string): Project | null {
  const keys = [
    "liveproject_business_projects",
    "liveproject_client_projects",
    "liveproject_projects",
  ];

  for (const key of keys) {
    const projects = readStorage<Project[]>(key, []);

    if (Array.isArray(projects)) {
      const project = projects.find(
        (item) => String(item.id) === String(projectId)
      );

      if (project) return project;
    }
  }

  return null;
}

export default function BusinessProjectCompletionPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [comments, setComments] = useState<Record<string, string>>(
    {}
  );
  const [ratings, setRatings] = useState<Record<string, number>>(
    {}
  );
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

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
      router.replace(`/workspace/${projectId}`);
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

    const foundProject = getProject(projectId);

    if (!foundProject) {
      router.replace("/business/projects");
      return;
    }

    const teams = readStorage<Team[]>(
      "liveproject_business_teams",
      []
    );

    const foundTeam = Array.isArray(teams)
      ? teams.find(
          (item) =>
            String(item.projectId) === String(projectId)
        )
      : undefined;

    const storedSubmissions = readStorage<Submission[]>(
      `liveproject_business_submissions_${projectId}`,
      []
    );

    const storedFeedback = readStorage<Feedback[]>(
      `liveproject_business_feedback_${projectId}`,
      []
    );

    setProject(foundProject);
    setTeam(foundTeam || null);
    setSubmissions(
      Array.isArray(storedSubmissions)
        ? storedSubmissions
        : []
    );
    setFeedback(
      Array.isArray(storedFeedback)
        ? storedFeedback
        : []
    );

    setReady(true);
  }, [projectId, router]);

  const allApproved = useMemo(() => {
    if (submissions.length === 0) return false;

    return submissions.every(
      (submission) => submission.status === "Approved"
    );
  }, [submissions]);

  const approvedCount = submissions.filter(
    (submission) => submission.status === "Approved"
  ).length;

  const handleFeedbackSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!team || team.members.length === 0) {
      setError(
        "There is no project team connected to this project yet."
      );
      return;
    }

    const missingRating = team.members.some(
      (member) => !(ratings[member.id] || 0)
    );

    if (missingRating) {
      setError(
        "Please rate every team member before completing the project."
      );
      return;
    }

    setError("");
    setSaving(true);

    const now = new Date().toLocaleDateString();

    const nextFeedback = team.members.map((member) => ({
      memberId: member.id,
      rating: ratings[member.id] || 0,
      comment: comments[member.id]?.trim() || "",
      submittedAt: now,
    }));

    setFeedback(nextFeedback);

    try {
      sessionStorage.setItem(
        `liveproject_business_feedback_${projectId}`,
        JSON.stringify(nextFeedback)
      );

      sessionStorage.setItem(
        `liveproject_project_completed_${projectId}`,
        "true"
      );

      sessionStorage.setItem(
        `liveproject_verified_experience_${projectId}`,
        JSON.stringify({
          projectId,
          projectTitle:
            project?.title || "LiveProject project",
          track: project?.track || "",
          completedAt: now,
          members: nextFeedback,
        })
      );

      const projects = readStorage<Project[]>(
        "liveproject_business_projects",
        []
      );

      const updatedProjects = projects.map((item) =>
        String(item.id) === String(projectId)
          ? {
              ...item,
              status: "Completed",
            }
          : item
      );

      sessionStorage.setItem(
        "liveproject_business_projects",
        JSON.stringify(updatedProjects)
      );

      sessionStorage.setItem(
        "liveproject_client_projects",
        JSON.stringify(updatedProjects)
      );

      sessionStorage.setItem(
        "liveproject_projects",
        JSON.stringify(updatedProjects)
      );

      setCompleted(true);
    } catch {
      setError(
        "The project could not be completed. Please try again."
      );
    } finally {
      setTimeout(() => {
        setSaving(false);
      }, 500);
    }
  };

  if (!ready || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading completion workspace...
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
          <div className="mx-auto flex h-[76px] max-w-[1350px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/business/projects/${project.id}/workspace`
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Project completion
                </div>

                <h1 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  {project.title || "Project"}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/business")
              }
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
            >
              Business dashboard
              <ArrowRight size={14} />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {completed ? (
            <section className="overflow-hidden rounded-[32px] border border-emerald-100 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
              <div className="bg-slate-950 p-8 text-white sm:p-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
                  <Award size={32} />
                </div>

                <div className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  Project completed
                </div>

                <h2 className="mt-2 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                  The work is now part of your LiveProject record.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Your team feedback has been recorded and the project has
                  been marked completed. Verified experience records can now
                  be built from the work completed on this project.
                </p>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
                <SummaryCard
                  icon={CheckCircle2}
                  label="Approved submissions"
                  value={String(approvedCount)}
                />

                <SummaryCard
                  icon={Users}
                  label="Team members reviewed"
                  value={String(team?.members.length || 0)}
                />

                <SummaryCard
                  icon={MessageSquare}
                  label="Feedback records"
                  value={String(feedback.length)}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-end sm:p-8">
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/business/projects/${project.id}/workspace`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  Back to workspace
                  <ArrowLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/business")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Business dashboard
                  <ArrowRight size={16} />
                </button>
              </div>
            </section>
          ) : (
            <>
              <section className="rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.07)] sm:p-10">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Award size={25} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                      Final review
                    </div>

                    <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                      Complete the project.
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                      Review the final work, rate each team member and leave
                      useful feedback. This creates the evidence needed for
                      verified professional experience.
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <SummaryCard
                    icon={FileText}
                    label="Submissions"
                    value={String(submissions.length)}
                  />

                  <SummaryCard
                    icon={CheckCircle2}
                    label="Approved"
                    value={String(approvedCount)}
                  />

                  <SummaryCard
                    icon={Users}
                    label="Team"
                    value={String(team?.members.length || 0)}
                  />
                </div>
              </section>

              {!allApproved && submissions.length > 0 && (
                <section className="mt-6 rounded-[26px] border border-amber-100 bg-amber-50 p-6">
                  <div className="flex gap-3">
                    <Clock3 className="mt-0.5 shrink-0 text-amber-600" size={19} />

                    <div>
                      <p className="text-sm font-black text-amber-900">
                        Some submissions still need approval.
                      </p>

                      <p className="mt-1 text-xs leading-6 text-amber-800/80">
                        All project deliverables should be approved before
                        you complete the project.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/business/projects/${project.id}/workspace/submissions`
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white"
                  >
                    Review submissions
                    <ArrowRight size={14} />
                  </button>
                </section>
              )}

              <form
                onSubmit={handleFeedbackSubmit}
                className="mt-6 space-y-4"
              >
                {team?.members.length ? (
                  team.members.map((member) => (
                    <section
                      key={member.id}
                      className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                            {(member.name?.[0] || "P").toUpperCase()}
                          </div>

                          <div>
                            <h3 className="text-base font-black text-slate-950">
                              {member.name || "Professional"}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-teal-700">
                              {member.role || "Team member"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1.5">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() =>
                                setRatings((current) => ({
                                  ...current,
                                  [member.id]: rating,
                                }))
                              }
                              className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white"
                              aria-label={`Give ${rating} stars`}
                            >
                              <Star
                                size={17}
                                className={
                                  (ratings[member.id] || 0) >=
                                  rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5">
                        <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                          Professional feedback
                        </label>

                        <textarea
                          value={comments[member.id] || ""}
                          onChange={(event) =>
                            setComments((current) => ({
                              ...current,
                              [member.id]: event.target.value,
                            }))
                          }
                          rows={4}
                          placeholder="Describe what they did well and the skills or strengths they demonstrated."
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                        />
                      </div>
                    </section>
                  ))
                ) : (
                  <section className="rounded-[26px] border border-dashed border-slate-300 bg-white p-8 text-center">
                    <Users
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <h3 className="mt-4 text-base font-black">
                      No team is connected to this project.
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      Select professionals from your applicants and build
                      a project team before completing the project.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `/business/projects/${project.id}/applicants`
                        )
                      }
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
                    >
                      Build team
                      <ArrowRight size={15} />
                    </button>
                  </section>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {error}
                  </div>
                )}

                {team?.members.length ? (
                  <div className="sticky bottom-4 rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          Ready to complete the project?
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Every team member needs a rating before completion.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={
                          saving ||
                          !allApproved ||
                          !team.members.every(
                            (member) =>
                              (ratings[member.id] || 0) > 0
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {saving
                          ? "Completing..."
                          : "Complete project"}
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
        <Icon size={18} />
      </div>

      <div className="mt-4 text-2xl font-black text-slate-950">
        {value}
      </div>

      <div className="mt-1 text-xs font-semibold text-slate-500">
        {label}
      </div>
    </div>
  );
}