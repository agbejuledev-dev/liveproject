"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  FileCheck2,
  Lock,
  Rocket,
  ShieldCheck,
  Users,
} from "lucide-react";

import { getProjectById, type Project } from "@/lib/projects";

type LiveProjectSession = {
  loggedIn?: boolean;
  plan?: "free" | "premium";
};

type RegistrationData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  role?: string;
};

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

type ApplicationRecord = {
  id: string;
  projectId: number;
  status:
    | "submitted"
    | "approved"
    | "changes_requested"
    | "rejected";
  applicant: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
  };
  motivation: string;
  relevantExperience: string;
  relevantSkills: string[];
  availability: string;
  commitment: string;
  workPreference: string;
  submittedAt: string;
};

function getSession(): LiveProjectSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(
      "liveproject_session"
    );

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);

    if (!parsed?.loggedIn) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getRegistration(): RegistrationData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(
      "liveproject_registration"
    );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getOnboarding(): OnboardingData | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(
      "liveproject_onboarding"
    );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function hasCompletedOnboarding() {
  const onboarding = getOnboarding();

  if (!onboarding) {
    return false;
  }

  const requiredFields = [
    onboarding.careerTrack,
    onboarding.experienceLevel,
    onboarding.currentStatus,
    onboarding.workPreference,
  ];

  return requiredFields.every(Boolean);
}

function getApplications(): ApplicationRecord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(
      "liveproject_applications"
    );

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveApplications(
  applications: ApplicationRecord[]
) {
  sessionStorage.setItem(
    "liveproject_applications",
    JSON.stringify(applications)
  );
}

function makeApplicationId() {
  return `APP-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;
}

export default function ProjectApplicationPage() {
  const params = useParams();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [existingApplication, setExistingApplication] =
    useState<ApplicationRecord | null>(null);

  const [motivation, setMotivation] = useState("");
  const [relevantExperience, setRelevantExperience] =
    useState("");
  const [availability, setAvailability] =
    useState("");
  const [commitment, setCommitment] = useState("");
  const [workPreference, setWorkPreference] =
    useState("Remote");
  const [selectedSkills, setSelectedSkills] = useState<
    string[]
  >([]);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const rawId = params?.projectId;

    const projectId = Number(
      Array.isArray(rawId) ? rawId[0] : rawId
    );

    if (!Number.isFinite(projectId)) {
      router.replace("/projects");
      return;
    }

    const found = getProjectById(projectId);

    if (!found) {
      router.replace("/projects");
      return;
    }

    const session = getSession();

    if (!session?.loggedIn) {
      sessionStorage.setItem(
        "liveproject_after_auth",
        `/projects/${projectId}/apply`
      );

      router.replace("/register");
      return;
    }

    if (!hasCompletedOnboarding()) {
      sessionStorage.setItem(
        "liveproject_after_auth",
        `/projects/${projectId}/apply`
      );

      router.replace("/onboarding");
      return;
    }

    const plan =
      session.plan === "premium" ? "premium" : "free";

    if (
      found.access === "premium" &&
      plan !== "premium"
    ) {
      sessionStorage.setItem(
        "liveproject_after_auth",
        `/projects/${projectId}/apply`
      );

      router.replace("/checkout");
      return;
    }

    const applications = getApplications();

    const applicantEmail =
      getRegistration()?.email?.toLowerCase() || "";

    const existing = applications.find(
      (application) =>
        application.projectId === projectId &&
        application.applicant.email.toLowerCase() ===
          applicantEmail
    );

    setExistingApplication(existing || null);
    setProject(found);
    setLoading(false);
  }, [params, router]);

  const registration = useMemo(
    () => getRegistration(),
    []
  );

  const onboarding = useMemo(
    () => getOnboarding(),
    []
  );

  const availableSkills = project?.skills || [];

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) => {
      if (current.includes(skill)) {
        return current.filter((item) => item !== skill);
      }

      return [...current, skill];
    });

    setError("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!project) {
      return;
    }

    setError("");

    if (!motivation.trim()) {
      setError(
        "Please explain why you want to work on this project."
      );
      return;
    }

    if (motivation.trim().length < 80) {
      setError(
        "Your motivation should be at least 80 characters."
      );
      return;
    }

    if (!relevantExperience.trim()) {
      setError(
        "Please tell us about your relevant experience."
      );
      return;
    }

    if (!availability) {
      setError("Please select your weekly availability.");
      return;
    }

    if (!commitment) {
      setError(
        "Please select the level of commitment you can make."
      );
      return;
    }

    if (selectedSkills.length === 0) {
      setError(
        "Select at least one skill relevant to this project."
      );
      return;
    }

    if (!agreed) {
      setError(
        "Please accept the project participation terms."
      );
      return;
    }

    setSubmitting(true);

    try {
      const applications = getApplications();

      const newApplication: ApplicationRecord = {
        id: makeApplicationId(),
        projectId: project.id,
        status: "submitted",
        applicant: {
          firstName:
            onboarding?.firstName ||
            registration?.firstName ||
            "",
          lastName:
            onboarding?.lastName ||
            registration?.lastName ||
            "",
          email: registration?.email || "",
          country:
            onboarding?.country ||
            registration?.country ||
            "",
        },
        motivation: motivation.trim(),
        relevantExperience:
          relevantExperience.trim(),
        relevantSkills: selectedSkills,
        availability,
        commitment,
        workPreference,
        submittedAt: new Date().toISOString(),
      };

      const updatedApplications = [
        ...applications,
        newApplication,
      ];

      saveApplications(updatedApplications);

      sessionStorage.setItem(
        "liveproject_current_application",
        JSON.stringify(newApplication)
      );

      setExistingApplication(newApplication);
      setSubmitted(true);

      setTimeout(() => {
        router.push(
          `/projects/${project.id}/workspace`
        );
      }, 1800);
    } catch {
      setError(
        "Something went wrong while submitting your application."
      );
      setSubmitting(false);
    }
  };

  if (loading || !project) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-white">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

          <p className="text-sm font-semibold text-slate-400">
            Preparing your application...
          </p>
        </div>
      </main>
    );
  }

  if (existingApplication || submitted) {
    return (
      <main className="min-h-screen bg-[#f7f9fc]">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex h-[76px] max-w-5xl items-center justify-between px-5 sm:px-8">
            <button
              type="button"
              onClick={() =>
                router.push(`/projects/${project.id}`)
              }
              className="flex items-center gap-3 font-black text-slate-950"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Rocket className="h-5 w-5" />
              </div>

              LiveProject
            </button>

            <button
              type="button"
              onClick={() =>
                router.push(`/projects/${project.id}`)
              }
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Project
            </button>
          </div>
        </header>

        <section className="px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check className="h-10 w-10" />
              </div>

              <p className="mt-7 text-sm font-black uppercase tracking-[0.16em] text-emerald-600">
                Application submitted
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
                You&apos;re officially in the process.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">
                Your application for{" "}
                <span className="font-bold text-slate-950">
                  {project.title}
                </span>{" "}
                has been recorded. Your project workspace is being
                prepared.
              </p>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                  Application ID
                </p>

                <p className="mt-2 font-mono text-sm font-bold text-slate-800">
                  {existingApplication?.id ||
                    "Preparing..."}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
                Taking you to your workspace...
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() =>
              router.push(`/projects/${project.id}`)
            }
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Rocket className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                LiveProject
              </p>

              <p className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Project Application
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(`/projects/${project.id}`)
            }
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </button>
        </div>
      </header>

      {/* TOP INTRO */}
      <section className="bg-slate-950 px-5 py-14 text-white sm:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-blue-500/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">
              Application
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
              {project.track}
            </span>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-300">
              {project.level}
            </span>
          </div>

          <p className="mt-7 text-sm font-bold text-blue-400">
            {project.company}
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Apply for {project.title}
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            Tell us how you would approach the project and what you
            can bring to the work. This helps create a meaningful
            project experience rather than a generic placement.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-12 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* PROFILE */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Your profile
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    We&apos;ll attach your LiveProject profile to this
                    application.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Name
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {onboarding?.firstName ||
                      registration?.firstName ||
                      "Not provided"}{" "}
                    {onboarding?.lastName ||
                      registration?.lastName ||
                      ""}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm font-bold text-slate-800">
                    {registration?.email ||
                      "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Career Track
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {onboarding?.careerTrack ||
                      project.track}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                    Experience Level
                  </p>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {onboarding?.experienceLevel ||
                      project.level}
                  </p>
                </div>
              </div>
            </div>

            {/* MOTIVATION */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <label
                htmlFor="motivation"
                className="text-2xl font-black"
              >
                Why do you want to work on this project?
              </label>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Tell us what interests you about the project and what
                you want to learn or prove through the experience.
              </p>

              <textarea
                id="motivation"
                value={motivation}
                onChange={(event) => {
                  setMotivation(event.target.value);
                  setError("");
                }}
                rows={7}
                placeholder="I am interested in this project because..."
                className="mt-6 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
              />

              <p className="mt-2 text-right text-xs font-semibold text-slate-400">
                {motivation.length} characters
              </p>
            </div>

            {/* EXPERIENCE */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <label
                htmlFor="experience"
                className="text-2xl font-black"
              >
                Relevant experience
              </label>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                You can include previous projects, coursework,
                freelance work, volunteering, internships, or other
                practical experience.
              </p>

              <textarea
                id="experience"
                value={relevantExperience}
                onChange={(event) => {
                  setRelevantExperience(event.target.value);
                  setError("");
                }}
                rows={7}
                placeholder="Describe the experience that makes you a good fit for this project..."
                className="mt-6 w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* SKILLS */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <FileCheck2 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Relevant skills
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select the skills you feel most confident using
                    on this project.
                  </p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {availableSkills.map((skill) => {
                  const selected =
                    selectedSkills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={[
                        "rounded-full border px-4 py-2.5 text-sm font-bold transition",
                        selected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600",
                      ].join(" ")}
                    >
                      {selected && (
                        <Check className="mr-1.5 inline-block h-3.5 w-3.5" />
                      )}

                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AVAILABILITY */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Clock3 className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Your availability
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose the amount of time you can realistically
                    dedicate each week.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Less than 5 hours",
                  "5–10 hours",
                  "10–20 hours",
                  "20+ hours",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setAvailability(option);
                      setError("");
                    }}
                    className={[
                      "rounded-2xl border p-4 text-left text-sm font-bold transition",
                      availability === option
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* COMMITMENT */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-black">
                Commitment
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                What level of commitment can you make to completing
                the project?
              </p>

              <div className="mt-7 space-y-3">
                {[
                  {
                    title: "I can commit from start to finish",
                    value: "Full commitment",
                  },
                  {
                    title: "I can commit consistently but may need flexibility",
                    value: "Flexible commitment",
                  },
                  {
                    title: "I am exploring the project before making a full commitment",
                    value: "Exploring",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setCommitment(option.value);
                      setError("");
                    }}
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition",
                      commitment === option.value
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                  >
                    <p className="text-sm font-bold text-slate-800">
                      {option.title}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {option.value}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* WORK PREFERENCE */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    Work preference
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Tell us how you would prefer to participate.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  "Remote",
                  "Hybrid",
                  "Any",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setWorkPreference(option);
                      setError("");
                    }}
                    className={[
                      "rounded-2xl border p-4 text-sm font-bold transition",
                      workPreference === option
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* TERMS */}
            <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
              <label className="flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => {
                    setAgreed(event.target.checked);
                    setError("");
                  }}
                  className="mt-1 h-5 w-5 rounded border-slate-300 accent-blue-600"
                />

                <span className="text-sm leading-7 text-slate-600">
                  I understand that LiveProject is an
                  experience-building platform and that I am expected
                  to complete the work professionally, meet project
                  expectations, communicate responsibly, and submit
                  original work.
                </span>
              </label>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-6 text-red-700">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 text-sm font-black text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Submitting application..."
                : "Submit Application"}

              {!submitting && (
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl">
              <div className="bg-slate-950 p-7 text-white">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-400">
                  Application Summary
                </p>

                <h2 className="mt-3 text-2xl font-black">
                  {project.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-slate-400">
                  {project.company}
                </p>
              </div>

              <div className="space-y-5 p-7">
                <div className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-blue-600" />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {project.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 text-blue-600" />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Format
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {project.format}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileCheck2 className="mt-0.5 h-4 w-4 text-blue-600" />

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-400">
                      Deliverables
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {project.deliverables.length} planned
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-blue-700">
                    <ShieldCheck className="h-4 w-4" />

                    <span className="text-xs font-black uppercase tracking-[0.12em]">
                      What happens next
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-blue-900/75">
                    Once your application is submitted, LiveProject
                    will create your project workspace and attach this
                    application to your experience record.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(`/projects/${project.id}`)
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Review Project
                </button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
              <Lock className="h-3.5 w-3.5" />
              Your application is attached to your account
            </div>
          </aside>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LiveProject</p>

          <button
            type="button"
            onClick={() =>
              router.push(`/projects/${project.id}`)
            }
            className="font-bold text-slate-500 hover:text-blue-600"
          >
            Back to Project
          </button>
        </div>
      </footer>
    </main>
  );
}