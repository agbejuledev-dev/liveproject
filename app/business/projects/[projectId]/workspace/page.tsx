// app/business/projects/[projectId]/workspace/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  MessageSquare,
  MoreHorizontal,
  Send,
  Settings,
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
  applicants?: number;
  deliverables?: string[];
  skills?: string[];
};

type Submission = {
  id: string;
  title: string;
  submittedBy: string;
  status: "Pending" | "Approved" | "Changes Requested";
  submittedAt: string;
  description?: string;
};

type ProjectMessage = {
  id: string;
  sender: "business" | "team";
  name: string;
  text: string;
  time: string;
};

const defaultSubmissions: Submission[] = [];

const defaultMessages: ProjectMessage[] = [];

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

function writeStorage(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Prototype storage.
  }
}

function getProjects(): Project[] {
  const keys = [
    "liveproject_business_projects",
    "liveproject_client_projects",
    "liveproject_projects",
  ];

  for (const key of keys) {
    const projects = readStorage<Project[]>(key, []);

    if (Array.isArray(projects) && projects.length > 0) {
      return projects;
    }
  }

  return [];
}

export default function BusinessProjectWorkspacePage() {
  const router = useRouter();
  const params = useParams();

  const projectId = Array.isArray(params.projectId)
    ? params.projectId[0]
    : params.projectId;

  const [ready, setReady] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [submissions, setSubmissions] =
    useState<Submission[]>(defaultSubmissions);
  const [messages, setMessages] =
    useState<ProjectMessage[]>(defaultMessages);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "submissions" | "messages"
  >("overview");
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

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

    const projects = getProjects();

    const found = projects.find(
      (item) => String(item.id) === String(projectId)
    );

    if (!found) {
      router.replace("/business/projects");
      return;
    }

    setProject(found);

    const storedSubmissions = readStorage<Submission[]>(
      `liveproject_business_submissions_${projectId}`,
      defaultSubmissions
    );

    const storedMessages = readStorage<ProjectMessage[]>(
      `liveproject_business_messages_${projectId}`,
      defaultMessages
    );

    setSubmissions(
      Array.isArray(storedSubmissions)
        ? storedSubmissions
        : []
    );

    setMessages(
      Array.isArray(storedMessages)
        ? storedMessages
        : []
    );

    setReady(true);
  }, [projectId, router]);

  const pendingSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) => submission.status === "Pending"
      ).length,
    [submissions]
  );

  const approvedSubmissions = useMemo(
    () =>
      submissions.filter(
        (submission) => submission.status === "Approved"
      ).length,
    [submissions]
  );

  const updateSubmission = (
    id: string,
    status: Submission["status"]
  ) => {
    setSubmissions((current) => {
      const next = current.map((submission) =>
        submission.id === id
          ? {
              ...submission,
              status,
            }
          : submission
      );

      writeStorage(
        `liveproject_business_submissions_${projectId}`,
        next
      );

      const selected = next.find(
        (submission) => submission.id === id
      );

      setSelectedSubmission(selected || null);

      return next;
    });
  };

  const sendMessage = () => {
    const text = message.trim();

    if (!text || !project) return;

    const newMessage: ProjectMessage = {
      id: `message-${Date.now()}`,
      sender: "business",
      name: "Business",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const next = [...messages, newMessage];

    setMessages(next);
    writeStorage(
      `liveproject_business_messages_${project.id}`,
      next
    );

    setMessage("");
  };

  if (!ready || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading project workspace...
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
          <div className="mx-auto flex h-[76px] max-w-[1450px] items-center justify-between px-4 sm:px-6 lg:px-8">
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
                  Project workspace
                </div>

                <h1 className="truncate text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  {project.title || "Untitled project"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
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

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500"
              >
                <Settings size={17} />
              </button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1450px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Project header */}
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-teal-700">
                    {project.status || "Open"}
                  </span>

                  {project.track && (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                      {project.track}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  {project.title || "Untitled project"}
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">
                  {project.description ||
                    "No project description has been added yet."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Metric
                  label="Applicants"
                  value={project.applicants || 0}
                />

                <Metric
                  label="Pending review"
                  value={pendingSubmissions}
                />

                <Metric
                  label="Approved"
                  value={approvedSubmissions}
                />
              </div>
            </div>
          </section>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
            {[
              ["overview", "Overview", FolderKanban],
              ["submissions", "Submissions", FileText],
              ["messages", "Messages", MessageSquare],
            ].map(([value, label, Icon]) => (
              <button
                key={value as string}
                type="button"
                onClick={() =>
                  setActiveTab(
                    value as
                      | "overview"
                      | "submissions"
                      | "messages"
                  )
                }
                className={[
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition",
                  activeTab === value
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950",
                ].join(" ")}
              >
                <Icon size={15} />
                {label as string}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_350px]">
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <FolderKanban size={18} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Delivery
                    </div>

                    <h3 className="text-xl font-black tracking-tight text-slate-950">
                      Project progress
                    </h3>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    [
                      "Project created",
                      true,
                      "The project brief exists.",
                    ],
                    [
                      "Applicants reviewed",
                      project.applicants
                        ? project.applicants > 0
                        : false,
                      "Review professionals who applied.",
                    ],
                    [
                      "Team selected",
                      false,
                      "Select the people who will work on the project.",
                    ],
                    [
                      "Work underway",
                      false,
                      "The selected team starts delivery.",
                    ],
                    [
                      "Work approved",
                      project.status === "Completed",
                      "Approve the final project output.",
                    ],
                  ].map(([label, complete, description]) => (
                    <div
                      key={label as string}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                    >
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          complete
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-white text-slate-300",
                        ].join(" ")}
                      >
                        <CheckCircle2 size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {label}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-5">
                <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Workspace actions
                  </div>

                  <div className="mt-4 space-y-2">
                    <ActionButton
                      icon={Users}
                      label="Review applicants"
                      onClick={() =>
                        router.push(
                          `/business/projects/${project.id}/applicants`
                        )
                      }
                    />

                    <ActionButton
                      icon={MessageSquare}
                      label="Open messages"
                      onClick={() =>
                        setActiveTab("messages")
                      }
                    />

                    <ActionButton
                      icon={FileText}
                      label="Review submissions"
                      onClick={() =>
                        setActiveTab("submissions")
                      }
                    />
                  </div>
                </section>

                <section className="rounded-[26px] border border-teal-100 bg-teal-50/70 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <h3 className="mt-4 text-sm font-black text-teal-950">
                    Business review
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-teal-900/75">
                    Your workspace is where project delivery, feedback,
                    submissions and communication eventually come together.
                  </p>
                </section>
              </aside>
            </div>
          )}

          {activeTab === "submissions" && (
            <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                    Deliverables
                  </div>

                  <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Team submissions
                  </h3>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500">
                  {submissions.length} submissions
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center">
                  <FileText
                    size={28}
                    className="mx-auto text-slate-300"
                  />

                  <h4 className="mt-4 text-sm font-black text-slate-950">
                    No submissions yet
                  </h4>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                    Once the selected team begins work, submitted
                    deliverables will appear here for review.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {submissions.map((submission) => (
                    <button
                      key={submission.id}
                      type="button"
                      onClick={() =>
                        setSelectedSubmission(submission)
                      }
                      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-teal-200 hover:bg-teal-50/30"
                    >
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {submission.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {submission.submittedBy} •{" "}
                          {submission.submittedAt}
                        </p>
                      </div>

                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[9px] font-black uppercase",
                          submission.status === "Approved"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                            : submission.status ===
                                "Changes Requested"
                              ? "border-amber-100 bg-amber-50 text-amber-700"
                              : "border-slate-200 bg-slate-50 text-slate-600",
                        ].join(" ")}
                      >
                        {submission.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === "messages" && (
            <section className="mt-6 overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Project communication
                </div>

                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Team messages
                </h3>
              </div>

              <div className="flex min-h-[420px] flex-col">
                <div className="flex-1 overflow-y-auto bg-[#fbfdfc] p-6">
                  {messages.length === 0 ? (
                    <div className="flex h-full min-h-[320px] items-center justify-center text-center">
                      <div>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                          <MessageSquare size={22} />
                        </div>

                        <h4 className="mt-4 text-sm font-black text-slate-950">
                          No project messages yet
                        </h4>

                        <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                          Project communication will appear here when
                          professionals begin collaborating on the work.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto max-w-3xl space-y-4">
                      {messages.map((item) => (
                        <div
                          key={item.id}
                          className={[
                            "flex",
                            item.sender === "business"
                              ? "justify-end"
                              : "justify-start",
                          ].join(" ")}
                        >
                          <div
                            className={[
                              "max-w-[80%] rounded-2xl px-4 py-3",
                              item.sender === "business"
                                ? "bg-slate-950 text-white"
                                : "border border-slate-200 bg-white text-slate-700",
                            ].join(" ")}
                          >
                            <div className="text-[9px] font-black uppercase tracking-[0.12em] opacity-60">
                              {item.name}
                            </div>

                            <p className="mt-1 text-sm leading-6">
                              {item.text}
                            </p>

                            <p className="mt-2 text-[9px] opacity-50">
                              {item.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200 p-4">
                  <div className="mx-auto flex max-w-3xl gap-2">
                    <input
                      value={message}
                      onChange={(event) =>
                        setMessage(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          !event.shiftKey
                        ) {
                          event.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder="Message the project team..."
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!message.trim()}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="h-10" />
        </div>
      </div>

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close submission"
            onClick={() => setSelectedSubmission(null)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-xl rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
                  Submission review
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  {selectedSubmission.title}
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Submitted by {selectedSubmission.submittedBy} •{" "}
                  {selectedSubmission.submittedAt}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubmission(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm leading-7 text-slate-600">
                {selectedSubmission.description ||
                  "No submission description has been added yet."}
              </p>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  updateSubmission(
                    selectedSubmission.id,
                    "Approved"
                  );
                  setSelectedSubmission(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <CheckCircle2 size={16} />
                Approve
              </button>

              <button
                type="button"
                onClick={() => {
                  updateSubmission(
                    selectedSubmission.id,
                    "Changes Requested"
                  );
                  setSelectedSubmission(null);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100"
              >
                <Clock3 size={16} />
                Request changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showTeamPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close team panel"
            onClick={() => setShowTeamPanel(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
                  Team builder
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Build the project team
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
                ×
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
                        {applicant.name || "Professional"}
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
              onClick={() => {
                const selectedApplicants = applicants.filter(
                  (applicant) =>
                    selectedForTeam.includes(applicant.id)
                );

                try {
                  const existingTeams = readStorage<any[]>(
                    "liveproject_business_teams",
                    []
                  );

                  const team = {
                    id: `team-${Date.now()}`,
                    name: `${project.title || "Project"} Team`,
                    description:
                      "Team created from shortlisted applicants.",
                    projectId: project.id,
                    projectTitle:
                      project.title || "Untitled project",
                    createdAt: new Date().toLocaleDateString(),
                    members: selectedApplicants.map(
                      (applicant) => ({
                        id: applicant.id,
                        name:
                          applicant.name ||
                          "Professional",
                        role:
                          applicant.role ||
                          applicant.track ||
                          "Professional",
                        email: applicant.email,
                        status: "active",
                      })
                    ),
                  };

                  sessionStorage.setItem(
                    "liveproject_business_teams",
                    JSON.stringify([
                      ...existingTeams,
                      team,
                    ])
                  );
                } catch {
                  // Prototype storage.
                }

                router.push("/business/teams");
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Create team
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="text-xl font-black text-slate-950">
        {value}
      </div>

      <div className="mt-1 text-xs font-semibold text-slate-500">
        {label}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
    >
      <span className="flex items-center gap-2">
        <Icon size={15} />
        {label}
      </span>

      <ArrowRight size={14} />
    </button>
  );
}