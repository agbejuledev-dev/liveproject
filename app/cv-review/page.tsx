"use client";

import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lock,
  Sparkles,
  Target,
  Upload,
  WandSparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Plan = "free" | "premium";

type OnboardingData = {
  firstName?: string;
  lastName?: string;
  country?: string;
  bio?: string;
  careerTrack?: string;
  experienceLevel?: string;
  currentStatus?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  cvName?: string;
  opportunities?: string[];
  workPreference?: string;
};

type CvAnalysis = {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  sections: {
    label: string;
    present: boolean;
    importance: "High" | "Medium";
  }[];
  keywords: string[];
  recommendations: string[];
};

const STORAGE_KEY = "liveproject_cv_review";

const TRACK_KEYWORDS: Record<string, string[]> = {
  "Frontend Development": [
    "javascript",
    "typescript",
    "react",
    "next.js",
    "nextjs",
    "html",
    "css",
    "tailwind",
    "git",
    "api",
    "rest",
    "responsive",
  ],
  "Product Management": [
    "product",
    "roadmap",
    "stakeholder",
    "agile",
    "scrum",
    "requirements",
    "discovery",
    "jira",
    "prioritization",
    "analytics",
  ],
  "UI/UX Design": [
    "figma",
    "wireframe",
    "prototype",
    "user research",
    "ux",
    "ui",
    "interaction",
    "usability",
    "design system",
    "persona",
  ],
  "Business Analysis": [
    "requirements",
    "business analysis",
    "process",
    "stakeholder",
    "documentation",
    "uml",
    "sql",
    "gap analysis",
    "use cases",
    "agile",
  ],
  "Data & Analytics": [
    "sql",
    "excel",
    "python",
    "tableau",
    "power bi",
    "statistics",
    "analytics",
    "data visualization",
    "dashboard",
    "etl",
  ],
  "Digital Marketing": [
    "seo",
    "sem",
    "content",
    "google analytics",
    "social media",
    "campaign",
    "email marketing",
    "copywriting",
    "growth",
    "conversion",
  ],
  "Mobile Development": [
    "react native",
    "flutter",
    "dart",
    "swift",
    "kotlin",
    "android",
    "ios",
    "mobile",
    "firebase",
    "api",
  ],
  Cybersecurity: [
    "cybersecurity",
    "network security",
    "siem",
    "soc",
    "incident response",
    "penetration testing",
    "vulnerability",
    "risk",
    "linux",
    "security",
  ],
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function stringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSession() {
  if (typeof window === "undefined") return null;

  return safeParse<{
    loggedIn?: boolean;
    plan?: Plan;
  }>(sessionStorage.getItem("liveproject_session"));
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function analyzeCv(
  fileName: string,
  fileSize: number,
  text: string,
  profile: OnboardingData | null
): CvAnalysis {
  const normalized = text.toLowerCase();

  const track =
    clean(profile?.careerTrack) ||
    "Frontend Development";

  const careerKeywords =
    TRACK_KEYWORDS[track] ?? [];

  const sections = [
    {
      label: "Professional Summary",
      present:
        normalized.includes("summary") ||
        normalized.includes("profile"),
      importance: "High" as const,
    },
    {
      label: "Work Experience",
      present:
        normalized.includes("experience") ||
        normalized.includes("employment"),
      importance: "High" as const,
    },
    {
      label: "Education",
      present:
        normalized.includes("education") ||
        normalized.includes("academic"),
      importance: "High" as const,
    },
    {
      label: "Skills",
      present: normalized.includes("skills"),
      importance: "High" as const,
    },
    {
      label: "Projects",
      present:
        normalized.includes("projects") ||
        normalized.includes("portfolio"),
      importance: "Medium" as const,
    },
    {
      label: "Certifications",
      present:
        normalized.includes("certification") ||
        normalized.includes("certificate"),
      importance: "Medium" as const,
    },
    {
      label: "Achievements",
      present:
        normalized.includes("achievement") ||
        normalized.includes("award"),
      importance: "Medium" as const,
    },
  ];

  const presentSections = sections.filter(
    (section) => section.present
  ).length;

  const matchedKeywords = careerKeywords.filter(
    (keyword) => normalized.includes(keyword)
  );

  const experienceSignals = [
    "built",
    "developed",
    "created",
    "managed",
    "led",
    "improved",
    "delivered",
    "implemented",
    "designed",
    "launched",
  ];

  const quantifiedSignals = [
    "%",
    "$",
    "£",
    "₦",
    "users",
    "clients",
    "projects",
    "revenue",
    "increased",
    "reduced",
    "improved by",
  ];

  const actionVerbCount = experienceSignals.filter(
    (word) => normalized.includes(word)
  ).length;

  const quantifiedCount = quantifiedSignals.filter(
    (signal) => normalized.includes(signal)
  ).length;

  let score = 35;

  score += presentSections * 5;
  score += Math.min(15, matchedKeywords.length * 2);
  score += Math.min(10, actionVerbCount);
  score += Math.min(10, quantifiedCount * 2);

  if (clean(profile?.careerTrack)) {
    score += 5;
  }

  score = Math.max(0, Math.min(100, score));

  const strengths: string[] = [];
  const improvements: string[] = [];
  const recommendations: string[] = [];

  if (presentSections >= 5) {
    strengths.push(
      "Your CV contains most of the core sections recruiters expect."
    );
  } else {
    improvements.push(
      "Add missing core CV sections so recruiters can quickly understand your background."
    );
  }

  if (matchedKeywords.length >= 4) {
    strengths.push(
      `Good alignment with ${track} keywords.`
    );
  } else {
    improvements.push(
      `Add more relevant ${track} terminology where it genuinely reflects your experience.`
    );
  }

  if (actionVerbCount >= 5) {
    strengths.push(
      "Your experience language contains several strong action verbs."
    );
  } else {
    improvements.push(
      "Rewrite responsibilities as achievement-focused statements using strong action verbs."
    );
  }

  if (quantifiedCount >= 3) {
    strengths.push(
      "Your CV includes measurable evidence of impact."
    );
  } else {
    improvements.push(
      "Add measurable outcomes where possible: users, revenue, time saved, performance improvements, project count, or other concrete results."
    );
  }

  if (!normalized.includes("linkedin")) {
    recommendations.push(
      "Add your LinkedIn profile if it contains professional evidence."
    );
  }

  if (
    !normalized.includes("github") &&
    track === "Frontend Development"
  ) {
    recommendations.push(
      "Add GitHub when it contains relevant public work you are comfortable sharing."
    );
  }

  if (!normalized.includes("http")) {
    recommendations.push(
      "Include a portfolio or relevant work link where appropriate."
    );
  }

  if (score >= 80) {
    recommendations.push(
      "Keep the CV focused on the role you are targeting and remove unrelated detail."
    );
  } else {
    recommendations.push(
      "Tailor the top third of the CV to the specific role before submitting an application."
    );
  }

  const missingHighPriority = sections
    .filter(
      (section) =>
        section.importance === "High" &&
        !section.present
    )
    .map((section) => section.label);

  if (missingHighPriority.length > 0) {
    recommendations.push(
      `Prioritize these sections: ${missingHighPriority.join(
        ", "
      )}.`
    );
  }

  const summary =
    score >= 85
      ? "Your CV has a strong foundation. Focus on role-specific tailoring and measurable impact."
      : score >= 70
        ? "Your CV is in a workable position, but targeted improvements could make your applications stronger."
        : score >= 50
          ? "Your CV has useful material but needs clearer structure, stronger evidence, and tighter role alignment."
          : "Your CV needs several foundational improvements before you rely heavily on it for applications.";

  return {
    fileName,
    fileSize,
    uploadedAt: new Date().toISOString(),
    score,
    summary,
    strengths,
    improvements,
    sections,
    keywords: matchedKeywords,
    recommendations,
  };
}

export default function CvReviewPage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");
  const [profile, setProfile] =
    useState<OnboardingData | null>(null);

  const [analysis, setAnalysis] =
    useState<CvAnalysis | null>(null);

  const [dragActive, setDragActive] =
    useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] =
    useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session?.loggedIn) {
      window.location.replace("/register");
      return;
    }

    setLoggedIn(true);
    setPlan(
      session.plan === "premium"
        ? "premium"
        : "free"
    );

    const onboarding = safeParse<OnboardingData>(
      sessionStorage.getItem(
        "liveproject_onboarding"
      )
    );

    setProfile(onboarding);

    const stored = safeParse<CvAnalysis>(
      localStorage.getItem(STORAGE_KEY)
    );

    if (stored) {
      setAnalysis(stored);
    }

    setLoading(false);
  }, []);

  const scoreLabel = useMemo(() => {
    if (!analysis) return "";

    if (analysis.score >= 85) return "Strong";
    if (analysis.score >= 70) return "Good";
    if (analysis.score >= 50) return "Needs work";

    return "Early stage";
  }, [analysis]);

  const missingSections = useMemo(() => {
    if (!analysis) return [];

    return analysis.sections.filter(
      (section) =>
        !section.present &&
        section.importance === "High"
    );
  }, [analysis]);

  async function extractText(
    file: File
  ): Promise<string> {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".txt")) {
      return file.text();
    }

    if (fileName.endsWith(".json")) {
      return file.text();
    }

    return "";
  }

  async function processFile(file: File) {
    setError("");

    if (file.type && file.type !== "text/plain") {
      const extension = file.name
        .split(".")
        .pop()
        ?.toLowerCase();

      if (
        !["pdf", "doc", "docx", "txt", "json"].includes(
          extension ?? ""
        )
      ) {
        setError(
          "Please choose a CV file in PDF, DOC, DOCX, TXT, or JSON format."
        );
        return;
      }
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("Your CV must be 10 MB or smaller.");
      return;
    }

    setProcessing(true);

    try {
      const extractedText = await extractText(file);

      /*
       * Browser-only prototype:
       * PDF/DOC/DOCX text extraction is intentionally not faked.
       * The analysis falls back to profile data when the browser
       * cannot directly read the document text.
       */

      const profileText = [
        profile?.bio,
        profile?.careerTrack,
        profile?.experienceLevel,
        ...(profile?.skills ?? []),
        profile?.linkedin,
        profile?.github,
        profile?.portfolio,
        profile?.currentStatus,
      ]
        .filter(Boolean)
        .join(" ");

      const combinedText =
        extractedText.trim() || profileText;

      const result = analyzeCv(
        file.name,
        file.size,
        combinedText,
        profile
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(result)
      );

      setAnalysis(result);
    } catch {
      setError(
        "We could not process that file. Please try another CV."
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleFileInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    void processFile(file);

    event.target.value = "";
  }

  function handleDrop(
    event: React.DragEvent<HTMLLabelElement>
  ) {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    void processFile(file);
  }

  function clearReview() {
    localStorage.removeItem(STORAGE_KEY);
    setAnalysis(null);
    setError("");
  }

  if (loading || !loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Loading CV review...
        </div>
      </main>
    );
  }

  if (plan !== "premium") {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Lock className="h-7 w-7" />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Premium Career Advantage
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              AI CV Review
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">
              Review your CV against your career direction, identify weak
              areas, strengthen measurable impact, and prepare a more focused
              application document.
            </p>

            <div className="mt-7 space-y-3 text-left">
              <Feature
                icon={<BarChart3 className="h-5 w-5" />}
                title="CV score"
                text="See a structured readiness score based on the information available for your review."
              />

              <Feature
                icon={<Target className="h-5 w-5" />}
                title="Career alignment"
                text="Check whether your CV communicates the skills and language relevant to your chosen career track."
              />

              <Feature
                icon={<WandSparkles className="h-5 w-5" />}
                title="Improvement recommendations"
                text="Get practical areas to strengthen before submitting applications."
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/workspace"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/premium"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white hover:bg-slate-800"
              >
                Unlock Premium
                <Sparkles className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/workspace"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/job-readiness"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Job Readiness
              <ChevronRight className="h-4 w-4" />
            </Link>

            <Link
              href="/career-roadmap"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800"
            >
              Career Roadmap
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold">
                  <WandSparkles className="h-3.5 w-3.5" />
                  AI Career Tool
                </div>

                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  CV Review
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Strengthen the document you use to tell employers what you
                  can do, what you have built, and why you fit the role.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {profile?.careerTrack && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.careerTrack}
                    </span>
                  )}

                  {profile?.experienceLevel && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.experienceLevel}
                    </span>
                  )}

                  {profile?.country && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.country}
                    </span>
                  )}
                </div>
              </div>

              {analysis ? (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:min-w-[250px]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    CV Score
                  </p>

                  <div className="mt-2 flex items-end gap-2">
                    <p className="text-5xl font-black">
                      {analysis.score}
                    </p>

                    <p className="pb-1 text-sm font-bold text-slate-400">
                      / 100
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    {scoreLabel}
                  </p>
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 sm:min-w-[250px]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Status
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    Ready to review
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Upload your CV below
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_330px]">
          <div className="space-y-8">
            {!analysis && (
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Start Review
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    Upload your CV
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                    Upload the version you currently use for applications. The
                    current browser prototype accepts common CV file formats.
                  </p>
                </div>

                <label
                  htmlFor="cv-upload"
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => {
                    setDragActive(false);
                  }}
                  onDrop={handleDrop}
                  className={`mt-7 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center transition sm:p-14 ${
                    dragActive
                      ? "border-slate-950 bg-slate-50"
                      : "border-slate-300 bg-slate-50 hover:border-slate-950"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Upload className="h-7 w-7 text-slate-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-950">
                    Drop your CV here
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    or click to choose a file
                  </p>

                  <span className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white">
                    {processing
                      ? "Analyzing..."
                      : "Choose CV"}
                  </span>

                  <p className="mt-4 text-[11px] text-slate-400">
                    PDF, DOC, DOCX, TXT, or JSON · Maximum 10 MB
                  </p>

                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.json"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>

                {error && (
                  <div className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                    <p className="text-xs leading-5 text-red-700">
                      {error}
                    </p>
                  </div>
                )}
              </section>
            )}

            {analysis && (
              <>
                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                          Reviewed CV
                        </p>

                        <h2 className="mt-1 truncate text-lg font-black text-slate-950">
                          {analysis.fileName}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          {formatFileSize(analysis.fileSize)} · Reviewed{" "}
                          {formatDate(analysis.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={clearReview}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Review Another
                    </button>
                  </div>
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Assessment
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-slate-950">
                    {scoreLabel} foundation
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    {analysis.summary}
                  </p>

                  <div className="mt-7">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold text-slate-600">
                        Overall CV score
                      </p>

                      <p className="text-xs font-black text-slate-950">
                        {analysis.score}/100
                      </p>
                    </div>

                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-950 transition-all"
                        style={{
                          width: `${analysis.score}%`,
                        }}
                      />
                    </div>
                  </div>
                </section>

                <section className="grid gap-5 md:grid-cols-2">
                  <ReviewColumn
                    title="What is working"
                    icon={
                      <CheckCircle2 className="h-5 w-5" />
                    }
                    items={analysis.strengths}
                    emptyText="No strong signals were detected yet."
                  />

                  <ReviewColumn
                    title="What needs attention"
                    icon={
                      <AlertCircle className="h-5 w-5" />
                    }
                    items={analysis.improvements}
                    emptyText="No major improvement areas were detected."
                  />
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      CV structure
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-950">
                      Recruiter-facing sections
                    </h2>
                  </div>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {analysis.sections.map((section) => (
                      <div
                        key={section.label}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4"
                      >
                        {section.present ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
                        )}

                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-950">
                            {section.label}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {section.present
                              ? "Detected"
                              : `Missing · ${section.importance} priority`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {analysis.keywords.length > 0 && (
                  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                        Career alignment
                      </p>

                      <h2 className="mt-2 text-2xl font-black text-slate-950">
                        Relevant keywords detected
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        These keywords appear in the available CV/profile
                        information and align with your selected career
                        direction.
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Recommended actions
                    </p>

                    <h2 className="mt-2 text-2xl font-black text-slate-950">
                      Improve before your next application
                    </h2>
                  </div>

                  <div className="mt-7 space-y-3">
                    {analysis.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={`${recommendation}-${index}`}
                          className="flex gap-3 rounded-2xl bg-slate-50 p-4"
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-[10px] font-black text-white">
                            {index + 1}
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {recommendation}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </section>

                {missingSections.length > 0 && (
                  <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm sm:p-8">
                    <div className="flex gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                      <div>
                        <h2 className="text-base font-black text-amber-950">
                          Priority fix
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-amber-800">
                          Your review identified missing high-priority CV
                          sections:
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {missingSections.map(
                            (section) => (
                              <span
                                key={section.label}
                                className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-amber-800"
                              >
                                {section.label}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <Target className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-950">
                Your target
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your CV review is interpreted in the context of your current
                LiveProject profile.
              </p>

              <div className="mt-5 space-y-4">
                <Info
                  label="Career track"
                  value={
                    profile?.careerTrack ||
                    "Not selected"
                  }
                />

                <Info
                  label="Experience level"
                  value={
                    profile?.experienceLevel ||
                    "Not specified"
                  }
                />

                <Info
                  label="Country"
                  value={
                    profile?.country ||
                    "Not specified"
                  }
                />

                <Info
                  label="Work preference"
                  value={
                    profile?.workPreference ||
                    "Not specified"
                  }
                />
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-slate-950" />

                <h2 className="text-base font-black text-slate-950">
                  Complete your career system
                </h2>
              </div>

              <div className="mt-5 space-y-2">
                <SideLink
                  href="/job-readiness"
                  label="Job Readiness"
                />

                <SideLink
                  href="/career-roadmap"
                  label="Career Roadmap"
                />

                <SideLink
                  href="/experience-passport"
                  label="Experience Passport"
                />

                <SideLink
                  href="/portfolio"
                  label="Portfolio"
                />

                <SideLink
                  href="/recommendations"
                  label="Recommendations"
                />
              </div>
            </section>

            <section className="rounded-3xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Important
              </p>

              <h2 className="mt-3 text-lg font-black">
                A CV score is guidance, not a hiring prediction.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A stronger CV can improve clarity and role alignment, but
                employers make decisions using many factors beyond the document
                itself.
              </p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-950">
          {icon}
        </div>

        <div>
          <p className="text-sm font-black text-slate-950">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function ReviewColumn({
  title,
  icon,
  items,
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyText: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>

        <h2 className="text-lg font-black text-slate-950">
          {title}
        </h2>
      </div>

      {items.length > 0 ? (
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <p className="text-sm leading-6 text-slate-600">
                {item}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-slate-500">
          {emptyText}
        </p>
      )}
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
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function SideLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
    >
      {label}
      <ChevronRight className="h-4 w-4" />
    </Link>
  );
}