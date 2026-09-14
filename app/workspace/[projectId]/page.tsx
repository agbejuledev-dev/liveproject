"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  FileText,
  Flag,
  FolderOpen,
  KanbanSquare,
  LayoutDashboard,
  MessageSquareText,
  MoreHorizontal,
  Paperclip,
  Plus,
  RefreshCw,
  Send,
  Sparkles,
  Target,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type TaskStatus = "todo" | "in_progress" | "done";

type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: "low" | "medium" | "high";
};

type Deliverable = {
  id: string;
  name: string;
  description: string;
  status: "pending" | "uploaded";
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadedAt?: string;
};

type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "approved";

type ReviewEntry = {
  id: string;
  createdAt: string;
  type:
    | "submission"
    | "changes_requested"
    | "approved"
    | "resubmitted";
  status: SubmissionStatus;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  score?: number;
  reviewerName?: string;
};

type Submission = {
  submittedAt: string;
  status: SubmissionStatus;
  note: string;
  reviewerFeedback?: string;
  score?: number;
  strengths?: string[];
  improvements?: string[];
  reviewedAt?: string;
  reviewerName?: string;
  reviewHistory?: ReviewEntry[];
};

type Project = {
  id: string;
  title: string;
  description?: string;
  track?: string;
  careerTrack?: string;
  level?: string;
  difficulty?: string;
  access?: "free" | "premium";
  estimatedTime?: string;
  duration?: string;
  format?: string;
  skills?: string[];
  status?: string;
  startedAt?: string;
  company?: string;
};

const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Understand the project brief",
    description: "Review the challenge, requirements and expected outcome.",
    status: "todo",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Research the problem",
    description: "Gather relevant information and understand the target users.",
    status: "todo",
    priority: "high",
  },
  {
    id: "task-3",
    title: "Define the solution",
    description: "Turn your research into a clear solution approach.",
    status: "todo",
    priority: "medium",
  },
  {
    id: "task-4",
    title: "Build the solution",
    description: "Create the main project deliverable.",
    status: "todo",
    priority: "high",
  },
  {
    id: "task-5",
    title: "Prepare documentation",
    description: "Document your approach, decisions and results.",
    status: "todo",
    priority: "medium",
  },
  {
    id: "task-6",
    title: "Prepare final presentation",
    description: "Package your work for professional review.",
    status: "todo",
    priority: "medium",
  },
];

const DEFAULT_DELIVERABLES: Deliverable[] = [
  {
    id: "deliverable-1",
    name: "Project Solution",
    description: "Your completed project or primary solution.",
    status: "pending",
  },
  {
    id: "deliverable-2",
    name: "Project Documentation",
    description: "Documentation explaining your approach and decisions.",
    status: "pending",
  },
  {
    id: "deliverable-3",
    name: "Final Presentation",
    description: "A concise presentation of the completed work.",
    status: "pending",
  },
];

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "backlog", label: "Backlog", icon: CheckCircle2 },
  { id: "kanban", label: "Kanban Board", icon: KanbanSquare },
  { id: "sprint", label: "Sprint", icon: Target },
  { id: "team", label: "Team", icon: Users },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "deliverables", label: "Deliverables", icon: Paperclip },
  { id: "roadmap", label: "Roadmap", icon: Flag },
  { id: "reports", label: "Reports", icon: FileText },
];

const statusLabels: Record<SubmissionStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  changes_requested: "Changes requested",
  approved: "Approved",
};

const statusDescriptions: Record<SubmissionStatus, string> = {
  submitted: "Your work has been submitted.",
  under_review: "Your work is currently waiting for professional review.",
  changes_requested:
    "The reviewer has requested changes before the project can be approved.",
  approved: "Your project has been approved.",
};

function getApplicationKey(projectId: string) {
  return `liveproject_project_application_${projectId}`;
}

function getStartedProjectKey(projectId: string) {
  return `liveproject_started_project_${projectId}`;
}

function getProjectKey(projectId: string) {
  return `liveproject_project_${projectId}`;
}

function getWorkspaceTasksKey(projectId: string) {
  return `liveproject_workspace_${projectId}`;
}

function getDeliverablesKey(projectId: string) {
  return `liveproject_deliverables_${projectId}`;
}

function getSubmissionKey(projectId: string) {
  return `liveproject_submission_${projectId}`;
}

function normalizeProject(value: unknown, projectId: string): Project | null {
  if (!value || typeof value !== "object") return null;

  const source = value as Record<string, unknown>;

  const id = String(source.id ?? "");

  if (!id || id !== projectId) {
    return null;
  }

  const title =
    typeof source.title === "string" && source.title.trim()
      ? source.title.trim()
      : "Project Workspace";

  return {
    id,
    title,
    description:
      typeof source.description === "string"
        ? source.description
        : undefined,
    track:
      typeof source.track === "string" ? source.track : undefined,
    careerTrack:
      typeof source.careerTrack === "string"
        ? source.careerTrack
        : undefined,
    level:
      typeof source.level === "string" ? source.level : undefined,
    difficulty:
      typeof source.difficulty === "string"
        ? source.difficulty
        : undefined,
    access:
      source.access === "premium" || source.access === "free"
        ? source.access
        : undefined,
    estimatedTime:
      typeof source.estimatedTime === "string"
        ? source.estimatedTime
        : undefined,
    duration:
      typeof source.duration === "string"
        ? source.duration
        : undefined,
    format:
      typeof source.format === "string" ? source.format : undefined,
    skills: Array.isArray(source.skills)
      ? source.skills.filter(
          (item): item is string => typeof item === "string",
        )
      : undefined,
    status:
      typeof source.status === "string" ? source.status : undefined,
    startedAt:
      typeof source.startedAt === "string"
        ? source.startedAt
        : undefined,
    company:
      typeof source.company === "string"
        ? source.company
        : undefined,
  };
}

function formatDate(value?: string) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";

  if (bytes < 1024) return `${bytes} B`;

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusClasses(status: SubmissionStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "changes_requested":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "under_review":
      return "bg-blue-50 text-blue-700 border-blue-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function taskStatusClasses(status: TaskStatus) {
  switch (status) {
    case "done":
      return "bg-emerald-50 text-emerald-700";
    case "in_progress":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    const parsed = JSON.parse(value);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const projectId = String(params?.projectId || "");

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewHistory, setShowReviewHistory] = useState(false);

  const [newTask, setNewTask] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  const [saving, setSaving] = useState(false);

  const fileInputRefs = useRef<
    Record<string, HTMLInputElement | null>
  >({});

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    function redirect(path: string) {
      if (!cancelled) {
        router.replace(path);
      }
    }

    const session = sessionStorage.getItem("liveproject_session");

    if (!session) {
      redirect("/register");
      return;
    }

    const parsedSession = safeParse<{
      loggedIn?: boolean;
      plan?: "free" | "premium";
    } | null>(session, null);

    if (!parsedSession?.loggedIn) {
      redirect("/register");
      return;
    }

    const applicationKey = getApplicationKey(projectId);

    const hasApplication =
      sessionStorage.getItem(applicationKey) === "true";

    if (!hasApplication) {
      const existingApplicationRecord = sessionStorage.getItem(
        getProjectKey(projectId),
      );

      if (existingApplicationRecord) {
        sessionStorage.setItem(applicationKey, "true");
      } else {
        sessionStorage.setItem(
          "liveproject_after_auth",
          `/workspace/${projectId}`,
        );

        redirect(`/projects/${projectId}`);
        return;
      }
    }

    const startedKey = getStartedProjectKey(projectId);

    const startedProject =
      sessionStorage.getItem(startedKey);

    const activeProject =
      sessionStorage.getItem("liveproject_active_project");

    const projectRecord =
      startedProject ||
      (activeProject
        ? safeParse<Project | null>(activeProject, null)?.id ===
            projectId
          ? activeProject
          : null
        : null) ||
      sessionStorage.getItem(getProjectKey(projectId));

    if (!projectRecord) {
      sessionStorage.setItem(
        "liveproject_after_auth",
        `/projects/${projectId}`,
      );

      redirect(`/projects/${projectId}`);
      return;
    }

    const parsedProject = normalizeProject(
      safeParse<unknown>(projectRecord, null),
      projectId,
    );

    if (!parsedProject) {
      redirect(`/projects/${projectId}`);
      return;
    }

    const normalizedStartedProject = {
      ...parsedProject,
      status:
        parsedProject.status &&
        parsedProject.status !== "pending"
          ? parsedProject.status
          : "active",
      startedAt:
        parsedProject.startedAt ||
        new Date().toISOString(),
    };

    sessionStorage.setItem(
      startedKey,
      JSON.stringify(normalizedStartedProject),
    );

    sessionStorage.setItem(
      "liveproject_active_project",
      JSON.stringify(normalizedStartedProject),
    );

    if (cancelled) return;

    setProject(normalizedStartedProject);

    const storedTasks = sessionStorage.getItem(
      getWorkspaceTasksKey(projectId),
    );

    if (storedTasks) {
      const parsedTasks = safeParse<Task[] | null>(
        storedTasks,
        null,
      );

      if (Array.isArray(parsedTasks)) {
        setTasks(parsedTasks);
      } else {
        setTasks(DEFAULT_TASKS);

        sessionStorage.setItem(
          getWorkspaceTasksKey(projectId),
          JSON.stringify(DEFAULT_TASKS),
        );
      }
    } else {
      setTasks(DEFAULT_TASKS);

      sessionStorage.setItem(
        getWorkspaceTasksKey(projectId),
        JSON.stringify(DEFAULT_TASKS),
      );
    }

    const storedDeliverables = sessionStorage.getItem(
      getDeliverablesKey(projectId),
    );

    if (storedDeliverables) {
      const parsedDeliverables = safeParse<
        Deliverable[] | null
      >(storedDeliverables, null);

      if (Array.isArray(parsedDeliverables)) {
        setDeliverables(parsedDeliverables);
      } else {
        setDeliverables(DEFAULT_DELIVERABLES);

        sessionStorage.setItem(
          getDeliverablesKey(projectId),
          JSON.stringify(DEFAULT_DELIVERABLES),
        );
      }
    } else {
      setDeliverables(DEFAULT_DELIVERABLES);

      sessionStorage.setItem(
        getDeliverablesKey(projectId),
        JSON.stringify(DEFAULT_DELIVERABLES),
      );
    }

    const storedSubmission = sessionStorage.getItem(
      getSubmissionKey(projectId),
    );

    if (storedSubmission) {
      const parsedSubmission =
        safeParse<Submission | null>(
          storedSubmission,
          null,
        );

      if (parsedSubmission) {
        setSubmission(parsedSubmission);
      }
    }

    setLoading(false);

    return () => {
      cancelled = true;
    };
  }, [projectId, router]);

  useEffect(() => {
    if (!projectId || loading) return;

    sessionStorage.setItem(
      getWorkspaceTasksKey(projectId),
      JSON.stringify(tasks),
    );
  }, [tasks, projectId, loading]);

  useEffect(() => {
    if (!projectId || loading) return;

    sessionStorage.setItem(
      getDeliverablesKey(projectId),
      JSON.stringify(deliverables),
    );
  }, [deliverables, projectId, loading]);

  const completedTasks = useMemo(
    () =>
      tasks.filter((task) => task.status === "done").length,
    [tasks],
  );

  const inProgressTasks = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === "in_progress",
      ).length,
    [tasks],
  );

  const uploadedDeliverables = useMemo(
    () =>
      deliverables.filter(
        (item) => item.status === "uploaded",
      ).length,
    [deliverables],
  );

  const progress = useMemo(() => {
    if (!tasks.length) return 0;

    return Math.round(
      (completedTasks / tasks.length) * 100,
    );
  }, [completedTasks, tasks.length]);

  const allWorkComplete =
    tasks.length > 0 &&
    tasks.every((task) => task.status === "done") &&
    deliverables.length > 0 &&
    deliverables.every(
      (item) => item.status === "uploaded",
    );

  const canSubmit =
    allWorkComplete &&
    (!submission ||
      submission.status === "changes_requested");

  const projectSkills =
    project?.skills && project.skills.length > 0
      ? project.skills
      : [];

  function persistSubmission(
    nextSubmission: Submission,
  ) {
    setSubmission(nextSubmission);

    sessionStorage.setItem(
      getSubmissionKey(projectId),
      JSON.stringify(nextSubmission),
    );
  }

  function updateTasks(nextTasks: Task[]) {
    setTasks(nextTasks);

    sessionStorage.setItem(
      getWorkspaceTasksKey(projectId),
      JSON.stringify(nextTasks),
    );
  }

  function updateDeliverables(
    nextDeliverables: Deliverable[],
  ) {
    setDeliverables(nextDeliverables);

    sessionStorage.setItem(
      getDeliverablesKey(projectId),
      JSON.stringify(nextDeliverables),
    );
  }

  function syncProjectStatus(
    nextStatus: string,
    extra: Record<string, unknown> = {},
  ) {
    const startedKey = getStartedProjectKey(projectId);

    const storedStartedProject =
      sessionStorage.getItem(startedKey);

    if (storedStartedProject) {
      const parsed = safeParse<Record<string, unknown> | null>(
        storedStartedProject,
        null,
      );

      if (parsed) {
        sessionStorage.setItem(
          startedKey,
          JSON.stringify({
            ...parsed,
            status: nextStatus,
            ...extra,
          }),
        );
      }
    }

    const activeProject =
      sessionStorage.getItem(
        "liveproject_active_project",
      );

    if (activeProject) {
      const parsed = safeParse<Record<string, unknown> | null>(
        activeProject,
        null,
      );

      if (parsed && String(parsed.id) === projectId) {
        sessionStorage.setItem(
          "liveproject_active_project",
          JSON.stringify({
            ...parsed,
            status: nextStatus,
            ...extra,
          }),
        );
      }
    }

    const projectKey = getProjectKey(projectId);

    const storedProject =
      sessionStorage.getItem(projectKey);

    if (storedProject) {
      const parsed = safeParse<Record<string, unknown> | null>(
        storedProject,
        null,
      );

      if (parsed) {
        sessionStorage.setItem(
          projectKey,
          JSON.stringify({
            ...parsed,
            status: nextStatus,
            ...extra,
          }),
        );
      }
    }

    setProject((current) =>
      current
        ? {
            ...current,
            status: nextStatus,
            ...extra,
          }
        : current,
    );
  }

  function toggleTask(taskId: string) {
    updateTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status:
                task.status === "done"
                  ? "todo"
                  : "done",
            }
          : task,
      ),
    );
  }

  function setTaskStatus(
    taskId: string,
    status: TaskStatus,
  ) {
    updateTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status }
          : task,
      ),
    );
  }

  function addTask() {
    const title = newTask.trim();

    if (!title) return;

    const task: Task = {
      id: `task-${Date.now()}`,
      title,
      description: "",
      status: "todo",
      priority: "medium",
    };

    updateTasks([...tasks, task]);
    setNewTask("");
    setShowTaskModal(false);
  }

  function removeTask(taskId: string) {
    updateTasks(
      tasks.filter((task) => task.id !== taskId),
    );
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
    deliverableId: string,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const nextDeliverables = deliverables.map(
      (item) =>
        item.id === deliverableId
          ? {
              ...item,
              status: "uploaded" as const,
              fileName: file.name,
              fileSize: file.size,
              fileType:
                file.type || "Unknown file type",
              uploadedAt:
                new Date().toISOString(),
            }
          : item,
    );

    updateDeliverables(nextDeliverables);

    event.target.value = "";
  }

  function removeDeliverableFile(
    deliverableId: string,
  ) {
    updateDeliverables(
      deliverables.map((item) =>
        item.id === deliverableId
          ? {
              ...item,
              status: "pending",
              fileName: undefined,
              fileSize: undefined,
              fileType: undefined,
              uploadedAt: undefined,
            }
          : item,
      ),
    );
  }

  function submitProject() {
    if (!allWorkComplete || !canSubmit) return;

    setSaving(true);

    const now = new Date().toISOString();

    const isResubmission =
      submission?.status ===
      "changes_requested";

    const historyEntry: ReviewEntry = {
      id: `review-${Date.now()}`,
      createdAt: now,
      type: isResubmission
        ? "resubmitted"
        : "submission",
      status: "under_review",
    };

    const nextHistory = [
      ...(submission?.reviewHistory || []),
      historyEntry,
    ];

    const nextSubmission: Submission = {
      submittedAt: now,
      status: "under_review",
      note:
        submissionNote.trim() ||
        submission?.note ||
        "Project submitted for professional review.",
      reviewerFeedback:
        submission?.reviewerFeedback,
      score: submission?.score,
      strengths: submission?.strengths,
      improvements: submission?.improvements,
      reviewedAt: submission?.reviewedAt,
      reviewerName: submission?.reviewerName,
      reviewHistory: nextHistory,
    };

    persistSubmission(nextSubmission);

    syncProjectStatus("submitted", {
      submittedAt: now,
    });

    setSubmissionNote("");
    setShowSubmitModal(false);
    setActiveSection("reports");

    window.setTimeout(() => {
      setSaving(false);
    }, 300);
  }

  function finishProject() {
    if (
      submission?.status !== "approved" ||
      !project
    ) {
      return;
    }

    const now = new Date().toISOString();

    syncProjectStatus("completed", {
      completedAt: now,
    });

    const experienceKey =
      "liveproject_verified_experience";

    let experiences: Array<Record<string, unknown>> =
      safeParse<
        Array<Record<string, unknown>>
      >(
        sessionStorage.getItem(experienceKey),
        [],
      );

    if (!Array.isArray(experiences)) {
      experiences = [];
    }

    const alreadyExists = experiences.some(
      (item) =>
        String(item.projectId) ===
        projectId,
    );

    if (!alreadyExists) {
      experiences.push({
        id: `experience-${projectId}`,
        projectId,
        projectTitle: project.title,
        careerTrack:
          project.careerTrack ||
          project.track ||
          "Professional Experience",
        level:
          project.level ||
          project.difficulty ||
          "Project Experience",
        completedAt: now,
        verified: true,
        status: "completed",
        score: submission.score,
        reviewerName:
          submission.reviewerName,
        skills: projectSkills,
      });

      sessionStorage.setItem(
        experienceKey,
        JSON.stringify(experiences),
      );
    }

    router.push("/workspace");
  }

  function openSubmit() {
    if (!canSubmit) {
      setActiveSection("reports");
      return;
    }

    setShowSubmitModal(true);
  }

  function renderStatusBadge() {
    if (!submission) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          <Circle className="h-3 w-3" />
          Not submitted
        </span>
      );
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${statusClasses(
          submission.status,
        )}`}
      >
        {submission.status === "approved" ? (
          <CheckCircle2 className="h-3.5 w-3.5" />
        ) : submission.status ===
          "changes_requested" ? (
          <RefreshCw className="h-3.5 w-3.5" />
        ) : (
          <Clock3 className="h-3.5 w-3.5" />
        )}

        {statusLabels[submission.status]}
      </span>
    );
  }

  function renderOverview() {
    return (
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="relative overflow-hidden bg-[#0757d5] px-6 py-8 text-white sm:px-8">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative max-w-4xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                  {project?.careerTrack ||
                    project?.track ||
                    "Professional Project"}
                </span>

                {project?.level && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                    {project.level}
                  </span>
                )}

                {project?.access && (
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold capitalize">
                    {project.access}
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-2xl font-bold tracking-tight sm:text-3xl">
                {project?.title ||
                  "Project Workspace"}
              </h1>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100 sm:text-base">
                {project?.description ||
                  "Complete the project, submit your work and receive professional feedback."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {renderStatusBadge()}

                <button
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      "deliverables",
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0757d5] transition hover:bg-blue-50"
                >
                  View deliverables
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid border-t border-slate-200 sm:grid-cols-4">
            <Metric
              label="Progress"
              value={`${progress}%`}
              icon={
                <Target className="h-4 w-4" />
              }
            />

            <Metric
              label="Tasks completed"
              value={`${completedTasks}/${tasks.length}`}
              icon={
                <CheckCircle2 className="h-4 w-4" />
              }
            />

            <Metric
              label="Deliverables"
              value={`${uploadedDeliverables}/${deliverables.length}`}
              icon={
                <Paperclip className="h-4 w-4" />
              }
            />

            <Metric
              label="In progress"
              value={String(
                inProgressTasks,
              )}
              icon={
                <Clock3 className="h-4 w-4" />
              }
            />
          </div>
        </section>

        {submission?.status ===
          "changes_requested" && (
          <ReviewAlert
            submission={submission}
            onViewReview={() =>
              setActiveSection("reports")
            }
            onResubmit={openSubmit}
          />
        )}

        {submission?.status ===
          "approved" && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-bold text-emerald-900">
                  Your project has been approved
                </h3>

                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  Your work has passed professional
                  review. Complete the project to add
                  this experience to your verified
                  experience record.
                </p>

                <button
                  type="button"
                  onClick={finishProject}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Complete Project
                  <Check className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your next steps
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Keep moving through the project
                  workflow.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowTaskModal(true)
                }
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add task
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {tasks
                .slice(0, 5)
                .map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onToggle={() =>
                      toggleTask(task.id)
                    }
                    onStatusChange={(status) =>
                      setTaskStatus(
                        task.id,
                        status,
                      )
                    }
                  />
                ))}

              {tasks.length > 5 && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveSection(
                      "backlog",
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-3 text-sm font-semibold text-[#0757d5] transition hover:bg-blue-50"
                >
                  View all tasks
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0757d5]">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Submission readiness
                </h2>

                <p className="text-xs text-slate-500">
                  Complete everything before
                  submitting.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <ReadinessItem
                label="All tasks completed"
                complete={
                  tasks.length > 0 &&
                  completedTasks ===
                    tasks.length
                }
              />

              <ReadinessItem
                label="All deliverables uploaded"
                complete={
                  deliverables.length >
                    0 &&
                  uploadedDeliverables ===
                    deliverables.length
                }
              />

              <ReadinessItem
                label="Professional review"
                complete={
                  submission?.status ===
                  "approved"
                }
              />
            </div>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={openSubmit}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0757d5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#064ab8] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Send className="h-4 w-4" />

              {submission?.status ===
              "changes_requested"
                ? "Resubmit project"
                : "Submit project"}
            </button>
          </section>
        </div>

        {projectSkills.length > 0 && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Skills demonstrated
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {projectSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  function renderBacklog() {
    return (
      <SectionCard
        title="Project Backlog"
        description="Manage every task required to complete your project."
        action={
          <button
            type="button"
            onClick={() =>
              setShowTaskModal(true)
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[#0757d5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#064ab8]"
          >
            <Plus className="h-4 w-4" />
            Add task
          </button>
        }
      >
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              expanded
              onToggle={() =>
                toggleTask(task.id)
              }
              onStatusChange={(status) =>
                setTaskStatus(
                  task.id,
                  status,
                )
              }
              onDelete={() =>
                removeTask(task.id)
              }
            />
          ))}

          {!tasks.length && (
            <EmptyState
              title="No tasks yet"
              description="Add your first task to start planning the project."
              action={
                <button
                  type="button"
                  onClick={() =>
                    setShowTaskModal(
                      true,
                    )
                  }
                  className="rounded-lg bg-[#0757d5] px-4 py-2 text-sm font-semibold text-white"
                >
                  Add task
                </button>
              }
            />
          )}
        </div>
      </SectionCard>
    );
  }

  function renderKanban() {
    const columns: {
      status: TaskStatus;
      title: string;
    }[] = [
      {
        status: "todo",
        title: "To do",
      },
      {
        status: "in_progress",
        title: "In progress",
      },
      {
        status: "done",
        title: "Done",
      },
    ];

    return (
      <div className="space-y-6">
        <PageHeading
          title="Kanban Board"
          description="Move tasks through your project workflow."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => {
            const columnTasks =
              tasks.filter(
                (task) =>
                  task.status ===
                  column.status,
              );

            return (
              <div
                key={column.status}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">
                    {column.title}
                  </h3>

                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            toggleTask(
                              task.id,
                            )
                          }
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            task.status ===
                            "done"
                              ? "bg-emerald-500 text-white"
                              : "border-2 border-slate-300"
                          }`}
                        >
                          {task.status ===
                            "done" && (
                            <Check className="h-3 w-3" />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            {task.title}
                          </p>

                          {task.description && (
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <select
                        value={
                          task.status
                        }
                        onChange={(
                          event,
                        ) =>
                          setTaskStatus(
                            task.id,
                            event.target
                              .value as TaskStatus,
                          )
                        }
                        className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-[#0757d5]"
                      >
                        <option value="todo">
                          To do
                        </option>
                        <option value="in_progress">
                          In progress
                        </option>
                        <option value="done">
                          Done
                        </option>
                      </select>
                    </div>
                  ))}

                  {!columnTasks.length && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-400">
                      No tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderSprint() {
    return (
      <div className="space-y-6">
        <PageHeading
          title="Sprint"
          description="Track the current sprint and keep your work focused."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Sprint progress"
            value={`${progress}%`}
            description={`${completedTasks} of ${tasks.length} tasks completed`}
          />

          <MetricCard
            title="Active work"
            value={String(
              inProgressTasks,
            )}
            description="Tasks currently in progress"
          />

          <MetricCard
            title="Remaining"
            value={String(
              Math.max(
                tasks.length -
                  completedTasks,
                0,
              ),
            )}
            description="Tasks still to complete"
          />
        </div>

        <SectionCard
          title="Sprint checklist"
          description="Complete your project work in a logical sequence."
        >
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                expanded
                onToggle={() =>
                  toggleTask(
                    task.id,
                  )
                }
                onStatusChange={(status) =>
                  setTaskStatus(
                    task.id,
                    status,
                  )
                }
              />
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderTeam() {
    return (
      <EmptyState
        icon={
          <Users className="h-6 w-6" />
        }
        title="Team workspace"
        description="Team collaboration will appear here when this project has multiple contributors."
      />
    );
  }

  function renderDocuments() {
    return (
      <EmptyState
        icon={
          <FolderOpen className="h-6 w-6" />
        }
        title="Project documents"
        description="Project documents and shared files will appear here as you add them."
      />
    );
  }

  function renderDeliverables() {
    return (
      <div className="space-y-6">
        <PageHeading
          title="Deliverables"
          description="Upload the files that represent your completed work."
          action={
            <button
              type="button"
              disabled={!canSubmit}
              onClick={openSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0757d5] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#064ab8] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Send className="h-4 w-4" />

              {submission?.status ===
              "changes_requested"
                ? "Resubmit"
                : "Submit project"}
            </button>
          }
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">
                Deliverable progress
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {uploadedDeliverables} of{" "}
                {deliverables.length} uploaded
              </p>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 sm:w-48">
              <div
                className="h-full rounded-full bg-[#0757d5] transition-all"
                style={{
                  width: `${
                    deliverables.length
                      ? Math.round(
                          (uploadedDeliverables /
                            deliverables.length) *
                            100,
                        )
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {deliverables.map(
            (deliverable) => (
              <div
                key={deliverable.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        deliverable.status ===
                        "uploaded"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-blue-50 text-[#0757d5]"
                      }`}
                    >
                      {deliverable.status ===
                      "uploaded" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        {deliverable.name}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {
                          deliverable.description
                        }
                      </p>

                      {deliverable.fileName && (
                        <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          <Paperclip className="h-3.5 w-3.5 shrink-0" />

                          <span className="truncate font-medium">
                            {
                              deliverable.fileName
                            }
                          </span>

                          {deliverable.fileSize && (
                            <span className="shrink-0 text-slate-400">
                              {formatFileSize(
                                deliverable.fileSize,
                              )}
                            </span>
                          )}
                        </div>
                      )}

                      {deliverable.uploadedAt && (
                        <p className="mt-2 text-[11px] text-slate-400">
                          Uploaded{" "}
                          {formatDate(
                            deliverable.uploadedAt,
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <input
                      ref={(element) => {
                        fileInputRefs.current[
                          deliverable.id
                        ] = element;
                      }}
                      type="file"
                      className="hidden"
                      onChange={(event) =>
                        handleFileChange(
                          event,
                          deliverable.id,
                        )
                      }
                    />

                    {deliverable.status ===
                    "uploaded" ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            fileInputRefs.current[
                              deliverable.id
                            ]?.click()
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Replace
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            removeDeliverableFile(
                              deliverable.id,
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Remove
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRefs.current[
                            deliverable.id
                          ]?.click()
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0757d5] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#064ab8]"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload file
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-800">
          Files are currently stored as browser-local
          metadata for this prototype. Production file
          storage should be connected to Supabase Storage
          before launch.
        </div>
      </div>
    );
  }

  function renderRoadmap() {
    return (
      <div className="space-y-6">
        <PageHeading
          title="Project Roadmap"
          description="Your project journey from brief to verified experience."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="relative space-y-7">
            <RoadmapStep
              number="01"
              title="Understand"
              description="Review the brief and define the problem."
              complete={completedTasks >= 1}
            />

            <RoadmapStep
              number="02"
              title="Research"
              description="Investigate the users, market and problem space."
              complete={completedTasks >= 2}
            />

            <RoadmapStep
              number="03"
              title="Build"
              description="Develop the proposed solution."
              complete={completedTasks >= 4}
            />

            <RoadmapStep
              number="04"
              title="Submit"
              description="Package your deliverables and request review."
              complete={Boolean(submission)}
            />

            <RoadmapStep
              number="05"
              title="Verify"
              description="Receive professional review and complete the project."
              complete={
                submission?.status ===
                "approved"
              }
              last
            />
          </div>
        </div>
      </div>
    );
  }

  function renderReports() {
    return (
      <div className="space-y-6">
        <PageHeading
          title="Reports & Review"
          description="Track your submission, reviewer feedback and project outcome."
        />

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Current status
              </p>

              <div className="mt-2">
                {renderStatusBadge()}
              </div>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                {submission
                  ? statusDescriptions[
                      submission.status
                    ]
                  : "Your project has not been submitted for review yet."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {submission?.status ===
                "changes_requested" && (
                <button
                  type="button"
                  onClick={openSubmit}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0757d5] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#064ab8]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Resubmit
                </button>
              )}

              {submission?.status ===
                "approved" && (
                <button
                  type="button"
                  onClick={finishProject}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Complete Project
                </button>
              )}

              {!submission && (
                <button
                  type="button"
                  disabled={!allWorkComplete}
                  onClick={openSubmit}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0757d5] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <Send className="h-4 w-4" />
                  Submit for review
                </button>
              )}
            </div>
          </div>
        </section>

        {submission && (
          <>
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Reviewer feedback
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Feedback appears here when a reviewer has
                    evaluated your submission.
                  </p>
                </div>

                {submission.score !==
                  undefined && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-400">
                      Score
                    </p>

                    <p className="text-2xl font-bold text-slate-900">
                      {submission.score}

                      <span className="text-sm font-medium text-slate-400">
                        /100
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {submission.reviewerFeedback ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex gap-3">
                      <MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-[#0757d5]" />

                      <div>
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {
                            submission.reviewerFeedback
                          }
                        </p>

                        {(submission.reviewerName ||
                          submission.reviewedAt) && (
                          <p className="mt-4 text-xs text-slate-400">
                            {submission.reviewerName
                              ? `Reviewed by ${submission.reviewerName}`
                              : "Professional review"}

                            {submission.reviewedAt
                              ? ` · ${formatDate(
                                  submission.reviewedAt,
                                )}`
                              : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                    <Clock3 className="mx-auto h-7 w-7 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Awaiting reviewer response
                    </p>

                    <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-500">
                      Your submission is saved. Reviewer
                      feedback will appear here once it is
                      added to this project.
                    </p>
                  </div>
                )}
              </div>

              {submission.strengths &&
                submission.strengths.length >
                  0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-900">
                      Strengths
                    </h3>

                    <div className="mt-3 space-y-2">
                      {submission.strengths.map(
                        (
                          strength,
                          index,
                        ) => (
                          <div
                            key={`${strength}-${index}`}
                            className="flex gap-2 text-sm text-slate-600"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                            <span>
                              {strength}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {submission.improvements &&
                submission.improvements.length >
                  0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-bold text-slate-900">
                      Improvements
                    </h3>

                    <div className="mt-3 space-y-2">
                      {submission.improvements.map(
                        (
                          improvement,
                          index,
                        ) => (
                          <div
                            key={`${improvement}-${index}`}
                            className="flex gap-2 text-sm text-slate-600"
                          >
                            <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                            <span>
                              {improvement}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <button
                type="button"
                onClick={() =>
                  setShowReviewHistory(
                    (current) =>
                      !current,
                  )
                }
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Review history
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    A record of your submission and review events.
                  </p>
                </div>

                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition ${
                    showReviewHistory
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {showReviewHistory && (
                <div className="mt-6 border-t border-slate-100 pt-6">
                  <ReviewTimeline
                    history={
                      submission.reviewHistory ||
                      []
                    }
                  />
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold text-slate-900">
                Submission details
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Detail
                  label="Submitted"
                  value={formatDate(
                    submission.submittedAt,
                  )}
                />

                <Detail
                  label="Status"
                  value={
                    statusLabels[
                      submission.status
                    ]
                  }
                />

                <Detail
                  label="Reviewer"
                  value={
                    submission.reviewerName ||
                    "Awaiting assignment"
                  }
                />

                <Detail
                  label="Last reviewed"
                  value={
                    submission.reviewedAt
                      ? formatDate(
                          submission.reviewedAt,
                        )
                      : "Awaiting review"
                  }
                />
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Submission note
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {submission.note ||
                    "No additional note provided."}
                </p>
              </div>
            </section>
          </>
        )}

        {!submission && (
          <EmptyState
            icon={
              <Send className="h-6 w-6" />
            }
            title="Nothing submitted yet"
            description={
              allWorkComplete
                ? "Everything is complete. Submit your project when you're ready."
                : "Finish your tasks and upload every required deliverable before submitting."
            }
            action={
              allWorkComplete ? (
                <button
                  type="button"
                  onClick={openSubmit}
                  className="rounded-lg bg-[#0757d5] px-4 py-2 text-sm font-semibold text-white"
                >
                  Submit project
                </button>
              ) : undefined
            }
          />
        )}
      </div>
    );
  }

  function renderSection() {
    switch (activeSection) {
      case "backlog":
        return renderBacklog();

      case "kanban":
        return renderKanban();

      case "sprint":
        return renderSprint();

      case "team":
        return renderTeam();

      case "documents":
        return renderDocuments();

      case "deliverables":
        return renderDeliverables();

      case "roadmap":
        return renderRoadmap();

      case "reports":
        return renderReports();

      default:
        return renderOverview();
    }
  }

  if (loading || !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <RefreshCw className="h-5 w-5 animate-spin text-[#0757d5]" />
          Loading workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push("/projects")
              }
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              aria-label="Back to projects"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0757d5]">
                LiveProject Workspace
              </p>

              <p className="truncate text-sm font-bold text-slate-900">
                {project.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              {renderStatusBadge()}
            </div>

            <button
              type="button"
              onClick={() =>
                setShowTaskModal(true)
              }
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:flex"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  "deliverables",
                )
              }
              className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:flex"
            >
              <Paperclip className="h-4 w-4" />
              Deliverables
            </button>

            <button
              type="button"
              onClick={openSubmit}
              disabled={!canSubmit}
              className="hidden items-center gap-2 rounded-lg bg-[#0757d5] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#064ab8] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 sm:flex"
            >
              <Send className="h-4 w-4" />

              {submission?.status ===
              "changes_requested"
                ? "Resubmit"
                : "Submit Work"}
            </button>

            <button
              type="button"
              onClick={() =>
                setMobileNavOpen(
                  (current) =>
                    !current,
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 lg:hidden"
              aria-label="Open workspace menu"
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MoreHorizontal className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <div className="border-b border-slate-200 bg-white p-3 lg:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSection(
                      item.id,
                    );
                    setMobileNavOpen(
                      false,
                    );
                  }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold ${
                    activeSection ===
                    item.id
                      ? "bg-blue-50 text-[#0757d5]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 sm:hidden">
            <button
              type="button"
              onClick={() =>
                setShowTaskModal(
                  true,
                )
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700"
            >
              <Plus className="h-4 w-4" />
              Add task
            </button>

            <button
              type="button"
              disabled={!canSubmit}
              onClick={openSubmit}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0757d5] px-3 py-2.5 text-xs font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
            >
              <Send className="h-4 w-4" />
              Submit
            </button>
          </div>
        </div>
      )}

      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white lg:block">
          <div className="p-4">
            <div className="mb-5 rounded-xl bg-slate-50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Project progress
              </p>

              <div className="mt-3 flex items-end justify-between">
                <span className="text-2xl font-bold text-slate-900">
                  {progress}%
                </span>

                <span className="text-xs text-slate-400">
                  {completedTasks}/
                  {tasks.length}
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[#0757d5] transition-all"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </p>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        item.id,
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${
                      activeSection ===
                      item.id
                        ? "bg-blue-50 text-[#0757d5]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />

                    <span>
                      {item.label}
                    </span>

                    {item.id ===
                      "reports" &&
                      submission && (
                        <span
                          className={`ml-auto h-2 w-2 rounded-full ${
                            submission.status ===
                            "changes_requested"
                              ? "bg-amber-500"
                              : submission.status ===
                                  "approved"
                                ? "bg-emerald-500"
                                : "bg-[#0757d5]"
                          }`}
                        />
                      )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/workspace",
                )
              }
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {renderSection()}
          </div>
        </main>
      </div>

      {showTaskModal && (
        <Modal
          title="Add project task"
          description="Create a task for this project workspace."
          onClose={() =>
            setShowTaskModal(
              false,
            )
          }
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Task name
              </label>

              <input
                autoFocus
                value={newTask}
                onChange={(event) =>
                  setNewTask(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    addTask();
                  }
                }}
                placeholder="e.g. Review competitor research"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0757d5] focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowTaskModal(
                    false,
                  )
                }
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={addTask}
                disabled={
                  !newTask.trim()
                }
                className="rounded-lg bg-[#0757d5] px-4 py-2.5 text-sm font-semibold text-white disabled:bg-slate-200 disabled:text-slate-400"
              >
                Add task
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showSubmitModal && (
        <Modal
          title={
            submission?.status ===
            "changes_requested"
              ? "Resubmit your project"
              : "Submit project for review"
          }
          description={
            submission?.status ===
            "changes_requested"
              ? "Make sure you have addressed the reviewer feedback before resubmitting."
              : "Your completed work will be sent for professional review."
          }
          onClose={() =>
            setShowSubmitModal(
              false,
            )
          }
        >
          <div className="space-y-5">
            {submission?.status ===
              "changes_requested" &&
              submission.reviewerFeedback && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Reviewer feedback
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-amber-900">
                    {
                      submission.reviewerFeedback
                    }
                  </p>
                </div>
              )}

            <div className="grid gap-3 sm:grid-cols-2">
              <ReadinessItem
                label={`${completedTasks}/${tasks.length} tasks complete`}
                complete={
                  tasks.length > 0 &&
                  completedTasks ===
                    tasks.length
                }
              />

              <ReadinessItem
                label={`${uploadedDeliverables}/${deliverables.length} deliverables uploaded`}
                complete={
                  deliverables.length >
                    0 &&
                  uploadedDeliverables ===
                    deliverables.length
                }
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Submission note

                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <textarea
                value={submissionNote}
                onChange={(event) =>
                  setSubmissionNote(
                    event.target
                      .value,
                  )
                }
                rows={5}
                placeholder="Tell the reviewer anything important about your work, decisions or implementation."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#0757d5] focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-800">
              Once submitted, your project will move
              to <strong>Under review</strong>. You
              will not be able to submit another
              version until a reviewer requests
              changes or approves the project.
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowSubmitModal(
                    false,
                  )
                }
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submitProject}
                disabled={
                  !allWorkComplete ||
                  !canSubmit ||
                  saving
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[#0757d5] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                {saving ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}

                {saving
                  ? "Submitting..."
                  : submission?.status ===
                      "changes_requested"
                    ? "Resubmit project"
                    : "Submit project"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="border-b border-slate-100 p-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>

      {action}
    </div>
  );
}

function SectionCard({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      <div>{children}</div>
    </section>
  );
}

function TaskRow({
  task,
  expanded = false,
  onToggle,
  onStatusChange,
  onDelete,
}: {
  task: Task;
  expanded?: boolean;
  onToggle: () => void;
  onStatusChange: (
    status: TaskStatus,
  ) => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`group flex gap-3 p-4 ${
        expanded
          ? "border-b border-slate-100 last:border-b-0"
          : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
          task.status === "done"
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 hover:border-[#0757d5]"
        }`}
        aria-label={
          task.status === "done"
            ? `Mark ${task.title} as incomplete`
            : `Mark ${task.title} as complete`
        }
      >
        {task.status === "done" && (
          <Check className="h-3 w-3" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              task.status === "done"
                ? "text-slate-400 line-through"
                : "text-slate-800"
            }`}
          >
            {task.title}
          </p>

          {task.priority === "high" && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
              High
            </span>
          )}
        </div>

        {task.description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select
          value={task.status}
          onChange={(event) =>
            onStatusChange(
              event.target
                .value as TaskStatus,
            )
          }
          className={`rounded-full border-0 px-2.5 py-1.5 text-[10px] font-bold outline-none ${taskStatusClasses(
            task.status,
          )}`}
          aria-label={`Status for ${task.title}`}
        >
          <option value="todo">
            To do
          </option>
          <option value="in_progress">
            In progress
          </option>
          <option value="done">
            Done
          </option>
        </select>

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-50 hover:text-red-500 group-hover:flex"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function ReadinessItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          complete
            ? "bg-emerald-500 text-white"
            : "border-2 border-slate-200 bg-white"
        }`}
      >
        {complete && (
          <Check className="h-3 w-3" />
        )}
      </div>

      <span
        className={`text-sm ${
          complete
            ? "font-medium text-slate-700"
            : "text-slate-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function ReviewAlert({
  submission,
  onViewReview,
  onResubmit,
}: {
  submission: Submission;
  onViewReview: () => void;
  onResubmit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <RefreshCw className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-bold text-amber-900">
              Changes requested
            </h3>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Your reviewer has requested changes
              before this project can be approved.
            </p>

            {submission.reviewerFeedback && (
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-amber-900">
                {submission.reviewerFeedback}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onViewReview}
            className="rounded-lg border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
          >
            View review
          </button>

          <button
            type="button"
            onClick={onResubmit}
            className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700"
          >
            Resubmit
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewTimeline({
  history,
}: {
  history: ReviewEntry[];
}) {
  if (!history.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No review events recorded yet.
      </div>
    );
  }

  const orderedHistory = [
    ...history,
  ].reverse();

  return (
    <div className="space-y-6">
      {orderedHistory.map(
        (entry, index) => {
          const isLast =
            index ===
            orderedHistory.length - 1;

          return (
            <div
              key={entry.id}
              className="relative flex gap-4"
            >
              {!isLast && (
                <div className="absolute left-[15px] top-8 h-[calc(100%+8px)] w-px bg-slate-200" />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  entry.status ===
                  "approved"
                    ? "bg-emerald-100 text-emerald-600"
                    : entry.status ===
                        "changes_requested"
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-100 text-[#0757d5]"
                }`}
              >
                {entry.status ===
                "approved" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : entry.status ===
                  "changes_requested" ? (
                  <RefreshCw className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-slate-800">
                    {entry.type ===
                    "resubmitted"
                      ? "Project resubmitted"
                      : entry.type ===
                          "changes_requested"
                        ? "Changes requested"
                        : entry.type ===
                            "approved"
                          ? "Project approved"
                          : "Project submitted"}
                  </p>

                  <span className="text-xs text-slate-400">
                    {formatDate(
                      entry.createdAt,
                    )}
                  </span>
                </div>

                {entry.reviewerName && (
                  <p className="mt-1 text-xs text-slate-400">
                    {entry.reviewerName}
                  </p>
                )}

                {entry.feedback && (
                  <div className="mt-3 rounded-xl bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {entry.feedback}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}

function RoadmapStep({
  number,
  title,
  description,
  complete,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  complete: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div className="absolute left-[18px] top-10 h-[calc(100%+12px)] w-px bg-slate-200" />
      )}

      <div
        className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          complete
            ? "bg-[#0757d5] text-white"
            : "border-2 border-slate-200 bg-white text-slate-400"
        }`}
      >
        {complete ? (
          <Check className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <div className="pt-1">
        <p className="font-bold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      {icon && (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          {icon}
        </div>
      )}

      <h2 className="mt-4 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white p-5">
          <div className="pr-4">
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}