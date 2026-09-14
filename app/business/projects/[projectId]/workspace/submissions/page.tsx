// @ts-nocheck
// app/business/projects/[projectId]/workspace/submissions/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  Send,
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
};

type SubmissionStatus =
  | "Pending"
  | "Approved"
  | "Changes Requested";

type Submission = {
  id: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: SubmissionStatus;
  description?: string;
  link?: string;
  files?: string[];
  feedback?: string;
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) return fallback;

    return JSON.parse(raw) as T;
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

    const found = Array.isArray(projects)
      ? projects.find(
          (project) =>
            String(project.id) === String(projectId)
        )
      : undefined;

    if (found) {
      return found;
    }
  }

  return null;
}

function saveSubmissions(
  projectId: string,
  submissions: Submission[]
) {
  try {
    sessionStorage.setItem(
      `liveproject_business_submissions_${projectId}`,
      JSON.stringify(submissions)
    );
  } catch {
    // Prototype storage.
  }
}

function statusConfig(status: SubmissionStatus) {
  if (status === "Approved") {
    return {
      icon: CheckCircle2,
      className:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
  }

  if (status === "Changes Requested") {
    return {
      icon: XCircle,
      className:
        "border-amber-100 bg-amber-50 text-amber-700",
    };
  }

  return {
    icon: Clock3,
    className:
      "border-slate-200 bg-slate-50 text-slate-600",
  };
}

export default function BusinessProjectSubmissionsPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [submissions, setSubmissions] = useState<
    Submission[]
  >([]);
  const [selected, setSelected] =
    useState<Submission | null>(null);
  const [feedback, setFeedback] = useState("");

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

    const storedSubmissions = readStorage<Submission[]>(
      `liveproject_business_submissions_${projectId}`,
      []
    );

    setProject(foundProject);
    setSubmissions(
      Array.isArray(storedSubmissions)
        ? storedSubmissions
        : []
    );
    setReady(true);
  }, [projectId, router]);

  const counts = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter(
        (submission) => submission.status === "Pending"
      ).length,
      approved: submissions.filter(
        (submission) => submission.status === "Approved"
      ).length,
      changes: submissions.filter(
        (submission) =>
          submission.status === "Changes Requested"
      ).length,
    };
  }, [submissions]);

  const updateSubmission = (
    id: string,
    status: SubmissionStatus,
    customFeedback?: string
  ) => {
    const next = submissions.map((submission) =>
      submission.id === id
        ? {
            ...submission,
            status,
            feedback:
              customFeedback !== undefined
                ? customFeedback
                : submission.feedback,
          }
        : submission
    );

    setSubmissions(next);
    saveSubmissions(projectId, next);

    const updated = next.find(
      (submission) => submission.id === id
    );

    setSelected(updated || null);
    setFeedback("");
  };

  const requestChanges = () => {
    if (!selected) return;

    updateSubmission(
      selected.id,
      "Changes Requested",
      feedback.trim() ||
        "Please review the submission and make the requested changes."
    );
  };

  if (!ready || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading submissions...
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
                    `/business/projects/${project.id}/workspace`
                  )
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Submission review
                </div>

                <h1 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  {project.title || "Project"}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/business/projects/${project.id}/applicants`
                )
              }
              className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:inline-flex"
            >
              <Users size={15} />
              Applicants
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <FileText size={13} />
                  Deliverable review
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Review work submitted by your project team.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Approve strong deliverables or request specific changes
                  before the project is marked complete.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Total", counts.total],
                  ["Pending", counts.pending],
                  ["Approved", counts.approved],
                  ["Changes", counts.changes],
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

          <section className="mt-6">
            {submissions.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <FileText size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  No submissions yet.
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Once the selected team starts delivering work,
                  submitted outputs will appear here for review.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/business/projects/${project.id}/workspace`
                    )
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  Back to workspace
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((submission) => {
                  const config = statusConfig(
                    submission.status
                  );

                  const StatusIcon = config.icon;

                  return (
                    <article
                      key={submission.id}
                      className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-teal-200 hover:shadow-lg sm:p-6"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                            <FileText size={19} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-black text-slate-950">
                                {submission.title}
                              </h3>

                              <span
                                className={[
                                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em]",
                                  config.className,
                                ].join(" ")}
                              >
                                <StatusIcon size={11} />
                                {submission.status}
                              </span>
                            </div>

                            <p className="mt-1 text-xs font-semibold text-teal-700">
                              {submission.submittedBy}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>
                                Submitted {submission.submittedAt}
                              </span>

                              {submission.link && (
                                <span className="text-teal-700">
                                  External link attached
                                </span>
                              )}
                            </div>

                            {submission.description && (
                              <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-slate-500">
                                {submission.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelected(submission)
                          }
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                        >
                          Review submission
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-300">
                  <CheckCircle2 size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Project completion
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Review thoroughly before approving final work.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Clear approval and feedback create the evidence trail that
                  makes completed LiveProject work valuable.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    `/business/projects/${project.id}/workspace`
                  )
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Project workspace
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>

      {selected && (
        <SubmissionReview
          submission={selected}
          feedback={feedback}
          setFeedback={setFeedback}
          onClose={() => {
            setSelected(null);
            setFeedback("");
          }}
          onApprove={() => {
            updateSubmission(selected.id, "Approved");
          }}
          onRequestChanges={requestChanges}
        />
      )}
    </main>
  );
}

function SubmissionReview({
  submission,
  feedback,
  setFeedback,
  onClose,
  onApprove,
  onRequestChanges,
}: {
  submission: Submission;
  feedback: string;
  setFeedback: (value: string) => void;
  onClose: () => void;
  onApprove: () => void;
  onRequestChanges: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close submission review"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
              Submission review
            </div>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
              {submission.title}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Submitted by {submission.submittedBy} •{" "}
              {submission.submittedAt}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
          >
            <X size={17} />
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Submission
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            {submission.description ||
              "No additional submission description was provided."}
          </p>

          {submission.link && (
            <a
              href={submission.link}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-teal-700 shadow-sm"
            >
              Open submitted link
              <ArrowRight size={14} />
            </a>
          )}
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
            Feedback
          </label>

          <textarea
            value={feedback}
            onChange={(event) =>
              setFeedback(event.target.value)
            }
            rows={5}
            placeholder="Tell the team what is strong, what needs improvement, or what should be changed."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
          />
        </div>

        {submission.feedback && (
          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">
              Previous feedback
            </div>

            <p className="mt-2 text-sm leading-6 text-amber-900/80">
              {submission.feedback}
            </p>
          </div>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onApprove}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
          >
            <CheckCircle2 size={16} />
            Approve submission
          </button>

          <button
            type="button"
            onClick={onRequestChanges}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
          >
            <Clock3 size={16} />
            Request changes
          </button>
        </div>
      </div>
    </div>
  );
}