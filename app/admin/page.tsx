"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquare,
  Search,
  ShieldCheck,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "withdrawn";

type Application = {
  id: string;
  projectId: string;
  projectTitle: string;
  track: string;
  appliedAt: string;
  status: ApplicationStatus;
  type: "Solo" | "Team";
};

type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved";

type ReviewEntry = {
  id: string;
  reviewedAt: string;
  reviewer: string;
  status: SubmissionStatus;
  feedback: string;
  strengths: string[];
  improvements: string[];
  score?: number;
};

type Submission = {
  submittedAt: string;
  status: SubmissionStatus;
  note: string;
  reviewer?: string;
  reviewedAt?: string;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  score?: number;
  reviewHistory?: ReviewEntry[];
};

type WorkspaceData = {
  tasks?: Array<{
    id: string;
    title: string;
    status: "todo" | "in_progress" | "done";
  }>;
};

type SelectedApplication = {
  application: Application;
  submission: Submission | null;
  workspace: WorkspaceData | null;
};

const APPLICATIONS_KEY = "liveproject_applications";

function getSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem("liveproject_session");

    if (!raw) return null;

    const session = JSON.parse(raw);

    if (!session?.loggedIn) return null;

    return session;
  } catch {
    return null;
  }
}

function readApplications(): Application[] {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveApplications(applications: Application[]) {
  localStorage.setItem(
    APPLICATIONS_KEY,
    JSON.stringify(applications)
  );
}

function readSubmission(projectId: string): Submission | null {
  try {
    const raw = localStorage.getItem(
      `liveproject_submission_${projectId}`
    );

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function readWorkspace(projectId: string): WorkspaceData | null {
  try {
    const raw = localStorage.getItem(
      `liveproject_workspace_${projectId}`
    );

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSubmission(
  projectId: string,
  submission: Submission
) {
  localStorage.setItem(
    `liveproject_submission_${projectId}`,
    JSON.stringify(submission)
  );
}

export default function AdminPage() {
  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const [applications, setApplications] = useState<Application[]>(
    []
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ApplicationStatus | SubmissionStatus
  >("all");
  const [selected, setSelected] =
    useState<SelectedApplication | null>(null);

  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [score, setScore] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace("/register");
      return;
    }

    setApplications(readApplications());
    setLoaded(true);
  }, [router]);

  const applicationsWithSubmission = useMemo(() => {
    return applications.map((application) => ({
      application,
      submission: readSubmission(application.projectId),
    }));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return applicationsWithSubmission.filter(
      ({ application, submission }) => {
        const matchesSearch =
          !query ||
          application.projectTitle
            .toLowerCase()
            .includes(query) ||
          application.track.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        if (statusFilter === "all") return true;

        return (
          application.status === statusFilter ||
          submission?.status === statusFilter
        );
      }
    );
  }, [
    applicationsWithSubmission,
    search,
    statusFilter,
  ]);

  function openApplication(application: Application) {
    const submission = readSubmission(application.projectId);
    const workspace = readWorkspace(application.projectId);

    setSelected({
      application,
      submission,
      workspace,
    });

    setFeedback(submission?.feedback ?? "");
    setStrengths(
      submission?.strengths?.join("\n") ?? ""
    );
    setImprovements(
      submission?.improvements?.join("\n") ?? ""
    );
    setScore(
      submission?.score !== undefined
        ? String(submission.score)
        : ""
    );

    setActionMessage("");
  }

  function acceptApplication(application: Application) {
    const updated = applications.map((item) =>
      item.id === application.id
        ? {
            ...item,
            status: "accepted" as ApplicationStatus,
          }
        : item
    );

    saveApplications(updated);
    setApplications(updated);

    if (selected) {
      setSelected({
        ...selected,
        application: {
          ...selected.application,
          status: "accepted",
        },
      });
    }

    setActionMessage(
      "Application accepted successfully."
    );
  }

  function rejectApplication(application: Application) {
    const updated = applications.map((item) =>
      item.id === application.id
        ? {
            ...item,
            status: "rejected" as ApplicationStatus,
          }
        : item
    );

    saveApplications(updated);
    setApplications(updated);

    if (selected) {
      setSelected({
        ...selected,
        application: {
          ...selected.application,
          status: "rejected",
        },
      });
    }

    setActionMessage(
      "Application rejected."
    );
  }

  function reviewSubmission(
    status: "changes_requested" | "approved"
  ) {
    if (!selected) return;

    if (!selected.submission) {
      setActionMessage(
        "This project has not been submitted yet."
      );
      return;
    }

    if (!feedback.trim()) {
      setActionMessage(
        "Please provide reviewer feedback before submitting the review."
      );
      return;
    }

    const parsedScore = score.trim()
      ? Number(score)
      : undefined;

    if (
      parsedScore !== undefined &&
      (Number.isNaN(parsedScore) ||
        parsedScore < 0 ||
        parsedScore > 100)
    ) {
      setActionMessage(
        "Score must be between 0 and 100."
      );
      return;
    }

    const currentSubmission = selected.submission;

    const review: ReviewEntry = {
      id: `review-${Date.now()}`,
      reviewedAt: new Date().toISOString(),
      reviewer: "LiveProject Reviewer",
      status,
      feedback: feedback.trim(),
      strengths: strengths
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      improvements: improvements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      score: parsedScore,
    };

    const updatedSubmission: Submission = {
      ...currentSubmission,
      status,
      reviewer: review.reviewer,
      reviewedAt: review.reviewedAt,
      feedback: review.feedback,
      strengths: review.strengths,
      improvements: review.improvements,
      score: review.score,
      reviewHistory: [
        ...(currentSubmission.reviewHistory ?? []),
        review,
      ],
    };

    writeSubmission(
      selected.application.projectId,
      updatedSubmission
    );

    setSelected({
      ...selected,
      submission: updatedSubmission,
    });

    setActionMessage(
      status === "approved"
        ? "Project approved successfully."
        : "Changes requested successfully."
    );
  }

  function markSubmissionUnderReview() {
    if (!selected?.submission) return;

    const submission: Submission = {
      ...selected.submission,
      status: "under_review",
    };

    writeSubmission(
      selected.application.projectId,
      submission
    );

    setSelected({
      ...selected,
      submission,
    });

    setActionMessage(
      "Submission marked as under review."
    );
  }

  function closeModal() {
    setSelected(null);
    setFeedback("");
    setStrengths("");
    setImprovements("");
    setScore("");
    setActionMessage("");
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9fc]">
        <p className="text-sm text-slate-500">
          Loading reviewer dashboard...
        </p>
      </main>
    );
  }

  const pendingApplications = applications.filter(
    (application) =>
      application.status === "pending"
  ).length;

  const acceptedApplications = applications.filter(
    (application) =>
      application.status === "accepted"
  ).length;

  const submittedProjects =
    applicationsWithSubmission.filter(
      ({ submission }) =>
        submission &&
        [
          "submitted",
          "under_review",
          "changes_requested",
        ].includes(submission.status)
    ).length;

  const approvedProjects =
    applicationsWithSubmission.filter(
      ({ submission }) =>
        submission?.status === "approved"
    ).length;

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                router.push("/workspace")
              }
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082c5c] font-black text-white">
                L
              </div>

              <div className="text-left">
                <p className="font-black text-[#082c5c]">
                  LiveProject
                </p>

                <p className="text-xs text-slate-500">
                  Reviewer Dashboard
                </p>
              </div>
            </button>
          </div>

          <button
            onClick={() =>
              router.push("/workspace")
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Workspace
          </button>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#082c5c]/5 px-4 py-2 text-xs font-bold text-[#082c5c]">
                <ShieldCheck className="h-4 w-4" />
                Professional Review Centre
              </div>

              <h1 className="text-4xl font-black tracking-tight text-[#082c5c]">
                Review & Manage Work
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Review applications, assess submitted project work,
                provide professional feedback and approve verified
                experience.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={<Clock3 className="h-5 w-5" />}
              label="Pending Applications"
              value={pendingApplications}
            />

            <Stat
              icon={<UserCheck className="h-5 w-5" />}
              label="Accepted Applications"
              value={acceptedApplications}
            />

            <Stat
              icon={<FileText className="h-5 w-5" />}
              label="Submitted Work"
              value={submittedProjects}
            />

            <Stat
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="Approved Projects"
              value={approvedProjects}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search applications or projects..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-[#082c5c]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | "all"
                  | ApplicationStatus
                  | SubmissionStatus
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-[#082c5c]"
          >
            <option value="all">All Work</option>
            <option value="pending">Pending Applications</option>
            <option value="accepted">Accepted</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">
              Under Review
            </option>
            <option value="changes_requested">
              Changes Requested
            </option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-xl font-black text-[#082c5c]">
              Nothing to review
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Applications and project submissions will appear here
              when users interact with LiveProject.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
            <div className="hidden border-b border-slate-100 bg-slate-50 px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 md:grid md:grid-cols-[1.7fr_1fr_1fr_1fr_auto] md:gap-4">
              <span>Project</span>
              <span>Track</span>
              <span>Application</span>
              <span>Submission</span>
              <span />
            </div>

            <div className="divide-y divide-slate-100">
              {filteredApplications.map(
                ({ application, submission }) => (
                  <button
                    key={application.id}
                    onClick={() =>
                      openApplication(application)
                    }
                    className="grid w-full gap-4 px-6 py-5 text-left transition hover:bg-slate-50 md:grid-cols-[1.7fr_1fr_1fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="font-black text-[#082c5c]">
                        {application.projectTitle}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {application.type} ·{" "}
                        {new Date(
                          application.appliedAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-sm text-slate-600">
                      {application.track}
                    </div>

                    <div>
                      <StatusBadge
                        status={application.status}
                      />
                    </div>

                    <div>
                      {submission ? (
                        <StatusBadge
                          status={submission.status}
                        />
                      ) : (
                        <span className="text-xs text-slate-400">
                          No submission
                        </span>
                      )}
                    </div>

                    <div className="text-sm font-bold text-[#082c5c]">
                      Review →
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="mx-auto my-6 w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge
                    status={
                      selected.application.status
                    }
                  />

                  {selected.submission && (
                    <StatusBadge
                      status={
                        selected.submission.status
                      }
                    />
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-black text-[#082c5c]">
                  {selected.application.projectTitle}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {selected.application.track} ·{" "}
                  {selected.application.type}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 p-6 lg:grid-cols-[1fr_1.2fr]">
              <div className="space-y-5">
                <Panel title="Application">
                  <div className="space-y-4">
                    <Info
                      label="Application ID"
                      value={
                        selected.application.id
                      }
                    />

                    <Info
                      label="Applied"
                      value={new Date(
                        selected.application.appliedAt
                      ).toLocaleString()}
                    />

                    <Info
                      label="Project format"
                      value={
                        selected.application.type
                      }
                    />
                  </div>
                </Panel>

                <Panel title="Project Progress">
                  {!selected.workspace?.tasks ||
                  selected.workspace.tasks.length === 0 ? (
                    <p className="text-sm text-slate-500">
                      No workspace task data is available yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selected.workspace.tasks.map(
                        (task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {task.title}
                            </span>

                            <TaskStatus
                              status={task.status}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </Panel>

                {selected.submission && (
                  <Panel title="Submission">
                    <div className="space-y-4">
                      <Info
                        label="Submitted"
                        value={new Date(
                          selected.submission.submittedAt
                        ).toLocaleString()}
                      />

                      <Info
                        label="Status"
                        value={formatStatus(
                          selected.submission.status
                        )}
                      />

                      {selected.submission.note && (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                            Learner note
                          </p>

                          <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            {selected.submission.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </Panel>
                )}
              </div>

              <div className="space-y-5">
                {selected.application.status ===
                  "pending" && (
                  <Panel title="Application Decision">
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          acceptApplication(
                            selected.application
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </button>

                      <button
                        onClick={() =>
                          rejectApplication(
                            selected.application
                          )
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </Panel>
                )}

                {selected.submission && (
                  <Panel title="Professional Review">
                    {selected.submission.status ===
                      "submitted" && (
                      <button
                        onClick={
                          markSubmissionUnderReview
                        }
                        className="mb-5 w-full rounded-xl border border-[#082c5c] px-4 py-3 text-sm font-bold text-[#082c5c] hover:bg-[#082c5c]/5"
                      >
                        Mark Under Review
                      </button>
                    )}

                    <div>
                      <label className="text-sm font-bold text-slate-700">
                        Feedback *
                      </label>

                      <textarea
                        value={feedback}
                        onChange={(event) =>
                          setFeedback(
                            event.target.value
                          )
                        }
                        rows={5}
                        placeholder="Write clear, professional feedback for the learner..."
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#082c5c]"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="text-sm font-bold text-slate-700">
                        Strengths
                      </label>

                      <textarea
                        value={strengths}
                        onChange={(event) =>
                          setStrengths(
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="One strength per line"
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#082c5c]"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="text-sm font-bold text-slate-700">
                        Improvements
                      </label>

                      <textarea
                        value={improvements}
                        onChange={(event) =>
                          setImprovements(
                            event.target.value
                          )
                        }
                        rows={4}
                        placeholder="One improvement per line"
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#082c5c]"
                      />
                    </div>

                    <div className="mt-5">
                      <label className="text-sm font-bold text-slate-700">
                        Score
                      </label>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(event) =>
                          setScore(event.target.value)
                        }
                        placeholder="0–100"
                        className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#082c5c]"
                      />
                    </div>

                    {actionMessage && (
                      <div className="mt-5 flex gap-3 rounded-xl bg-[#082c5c]/5 p-4 text-sm font-medium text-[#082c5c]">
                        <MessageSquare className="h-5 w-5 shrink-0" />
                        <span>{actionMessage}</span>
                      </div>
                    )}

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <button
                        onClick={() =>
                          reviewSubmission(
                            "changes_requested"
                          )
                        }
                        className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 hover:bg-amber-100"
                      >
                        Request Changes
                      </button>

                      <button
                        onClick={() =>
                          reviewSubmission(
                            "approved"
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
                      >
                        Approve Project
                      </button>
                    </div>
                  </Panel>
                )}

                {selected.submission?.reviewHistory &&
                  selected.submission.reviewHistory
                    .length > 0 && (
                    <Panel title="Review History">
                      <div className="space-y-4">
                        {[
                          ...selected.submission
                            .reviewHistory,
                        ]
                          .reverse()
                          .map((review) => (
                            <div
                              key={review.id}
                              className="relative border-l-2 border-slate-200 pl-4"
                            >
                              <div className="flex items-center gap-2">
                                <StatusBadge
                                  status={
                                    review.status
                                  }
                                />

                                <span className="text-xs text-slate-400">
                                  {new Date(
                                    review.reviewedAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-slate-600">
                                {review.feedback}
                              </p>

                              {review.score !==
                                undefined && (
                                <p className="mt-2 text-xs font-bold text-[#082c5c]">
                                  Score:{" "}
                                  {review.score}/100
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </Panel>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082c5c]/5 text-[#082c5c]">
        {icon}
      </div>

      <p className="mt-4 text-3xl font-black text-[#082c5c]">
        {value}
      </p>

      <p className="text-sm text-slate-500">
        {label}
      </p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-black uppercase tracking-wide text-[#082c5c]">
        {title}
      </h3>

      {children}
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}

function formatStatus(
  status: ApplicationStatus | SubmissionStatus
) {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function StatusBadge({
  status,
}: {
  status: ApplicationStatus | SubmissionStatus;
}) {
  const styles: Record<
    ApplicationStatus | SubmissionStatus,
    string
  > = {
    pending: "bg-amber-50 text-amber-700",
    accepted: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    withdrawn: "bg-slate-100 text-slate-600",
    submitted: "bg-blue-50 text-blue-700",
    under_review: "bg-purple-50 text-purple-700",
    changes_requested:
      "bg-amber-50 text-amber-700",
    approved:
      "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${styles[status]}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function TaskStatus({
  status,
}: {
  status: "todo" | "in_progress" | "done";
}) {
  const config = {
    todo: {
      label: "To do",
      className: "bg-slate-100 text-slate-600",
    },
    in_progress: {
      label: "In progress",
      className: "bg-blue-50 text-blue-700",
    },
    done: {
      label: "Done",
      className: "bg-emerald-50 text-emerald-700",
    },
  }[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}