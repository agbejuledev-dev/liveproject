"use client";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Plan = "free" | "premium";

type OnboardingData = {
  firstName?: string;
  lastName?: string;
  country?: string;
  careerTrack?: string;
  experienceLevel?: string;
  currentStatus?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

type WorkExperience = {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  skills: string[];
  createdAt: string;
};

const STORAGE_KEY = "liveproject_work_experience";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Volunteer",
];

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getSession() {
  if (typeof window === "undefined") return null;

  return safeParse<{
    loggedIn?: boolean;
    plan?: Plan;
  }>(sessionStorage.getItem("liveproject_session"));
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

function formatDate(value: string) {
  if (!value) return "";

  const date = new Date(`${value}-01`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });
}

function makeId() {
  return `experience-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function emptyForm(): Omit<WorkExperience, "id" | "createdAt"> {
  return {
    title: "",
    company: "",
    employmentType: "Full-time",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    skills: [],
  };
}

export default function WorkExperiencePage() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");
  const [profile, setProfile] = useState<OnboardingData | null>(null);
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const session = getSession();

    if (!session?.loggedIn) {
      window.location.replace("/register");
      return;
    }

    setLoggedIn(true);
    setPlan(session.plan === "premium" ? "premium" : "free");

    const onboarding = safeParse<OnboardingData>(
      sessionStorage.getItem("liveproject_onboarding")
    );

    setProfile(onboarding);

    const stored = safeParse<WorkExperience[]>(
      localStorage.getItem(STORAGE_KEY)
    );

    if (Array.isArray(stored)) {
      setExperiences(
        stored.filter(
          (item) =>
            item &&
            typeof item === "object" &&
            clean(item.title) &&
            clean(item.company)
        )
      );
    }

    setLoading(false);
  }, []);

  const fullName = useMemo(() => {
    const value =
      `${clean(profile?.firstName)} ${clean(profile?.lastName)}`.trim();

    return value || "Professional";
  }, [profile]);

  const totalExperience = experiences.length;

  const uniqueSkills = useMemo(() => {
    return Array.from(
      new Set(
        experiences.flatMap((experience) => stringArray(experience.skills))
      )
    );
  }, [experiences]);

  function persist(next: WorkExperience[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setExperiences(next);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setSkillInput("");
    setShowForm(true);
  }

  function openEdit(experience: WorkExperience) {
    setEditingId(experience.id);

    setForm({
      title: experience.title,
      company: experience.company,
      employmentType: experience.employmentType,
      location: experience.location,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      skills: [...experience.skills],
    });

    setSkillInput("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm());
    setSkillInput("");
  }

  function addSkill() {
    const skill = clean(skillInput);

    if (!skill) return;

    const exists = form.skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase()
    );

    if (!exists) {
      setForm((current) => ({
        ...current,
        skills: [...current.skills, skill],
      }));
    }

    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
  }

  function saveExperience(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = clean(form.title);
    const company = clean(form.company);

    if (!title || !company || !form.startDate) {
      return;
    }

    const normalized: WorkExperience = {
      id: editingId ?? makeId(),
      title,
      company,
      employmentType: clean(form.employmentType) || "Full-time",
      location: clean(form.location),
      startDate: form.startDate,
      endDate: form.current ? "" : clean(form.endDate),
      current: Boolean(form.current),
      description: clean(form.description),
      skills: stringArray(form.skills),
      createdAt:
        editingId &&
        experiences.find((experience) => experience.id === editingId)
          ?.createdAt
          ? experiences.find(
              (experience) => experience.id === editingId
            )!.createdAt
          : new Date().toISOString(),
    };

    const next = editingId
      ? experiences.map((experience) =>
          experience.id === editingId ? normalized : experience
        )
      : [normalized, ...experiences];

    persist(next);
    closeForm();

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  }

  function deleteExperience(id: string) {
    const experience = experiences.find((item) => item.id === id);

    if (!experience) return;

    const confirmed = window.confirm(
      `Remove "${experience.title}" at ${experience.company} from your work experience?`
    );

    if (!confirmed) return;

    persist(experiences.filter((item) => item.id !== id));
  }

  function exportExperience() {
    const payload = {
      profile: {
        name: fullName,
        careerTrack: profile?.careerTrack ?? "",
        country: profile?.country ?? "",
      },
      workExperience: experiences,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "liveproject-work-experience.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  }

  if (loading || !loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-600 shadow-sm">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Loading work experience...
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
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportExperience}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <FileText className="h-4 w-4" />
              {saved ? "Saved" : "Export"}
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              Add Experience
            </button>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 px-6 py-10 text-white sm:px-10">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold">
                  <BriefcaseBusiness className="h-3.5 w-3.5" />
                  Career Profile
                </div>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Work Experience
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Keep your professional history organized alongside the
                  verified experience you build through LiveProject.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                    {fullName}
                  </span>

                  {profile?.careerTrack && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.careerTrack}
                    </span>
                  )}

                  {profile?.country && (
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                      {profile.country}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[330px]">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Experience
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {totalExperience}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {totalExperience === 1 ? "role" : "roles"}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Skills
                  </p>

                  <p className="mt-2 text-3xl font-black">
                    {uniqueSkills.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    recorded skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_330px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  Professional History
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  Your work experience
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add roles you have actually held. Keep verified LiveProject
                  work separate from manually entered employment history.
                </p>
              </div>

              {experiences.length > 0 && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />
                  Add role
                </button>
              )}
            </div>

            {experiences.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <BriefcaseBusiness className="h-6 w-6 text-slate-500" />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  No work experience added yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add your real employment, freelance, internship, contract,
                  or volunteer experience to strengthen your career profile.
                </p>

                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Add your first role
                </button>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                {experiences.map((experience) => (
                  <article
                    key={experience.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                          <BriefcaseBusiness className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-base font-black text-slate-950">
                            {experience.title}
                          </h3>

                          <p className="mt-1 text-sm font-semibold text-slate-600">
                            {experience.company}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span>{experience.employmentType}</span>

                            {experience.location && (
                              <>
                                <span>•</span>
                                <span>{experience.location}</span>
                              </>
                            )}

                            <span>•</span>

                            <span>
                              {formatDate(experience.startDate)} —{" "}
                              {experience.current
                                ? "Present"
                                : formatDate(experience.endDate) ||
                                  "End date not added"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(experience)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteExperience(experience.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${experience.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {experience.description && (
                      <p className="mt-5 text-sm leading-7 text-slate-600">
                        {experience.description}
                      </p>
                    )}

                    {experience.skills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {experience.skills.map((skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-lg font-black text-slate-950">
                Keep evidence separate
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manually entered employment history is useful context, but
                LiveProject verification is reserved for evidence created
                inside the platform.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-5 text-slate-600">
                    Employment history stays editable by you.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-5 text-slate-600">
                    Verified projects are recorded separately.
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p className="text-xs leading-5 text-slate-600">
                    Your Experience Passport can combine both sections without
                    presenting manual claims as platform verification.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <UserRound className="h-5 w-5 text-slate-950" />
                <h2 className="text-base font-black text-slate-950">
                  Career profile
                </h2>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Career track
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {profile?.careerTrack || "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Experience level
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {profile?.experienceLevel || "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Country
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">
                    {profile?.country || "Not specified"}
                  </p>
                </div>
              </div>

              <Link
                href="/profile"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Manage Profile
                <ChevronRight className="h-4 w-4" />
              </Link>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-slate-950" />
                <h2 className="text-base font-black text-slate-950">
                  Career evidence
                </h2>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Continue building evidence through real project work,
                learning, certificates, and recommendations.
              </p>

              <div className="mt-5 space-y-2">
                <Link
                  href="/experience-passport"
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Experience Passport
                  <ChevronRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/portfolio"
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Portfolio
                  <ExternalLink className="h-4 w-4" />
                </Link>

                <Link
                  href="/recommendations"
                  className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Recommendations
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {plan === "premium" && (
              <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Premium
                </p>

                <h2 className="mt-2 text-lg font-black">
                  Your career profile is ready for more evidence.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Use your verified projects, learning records, and career
                  tools to build a stronger professional story.
                </p>

                <Link
                  href="/experience-passport"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-white"
                >
                  Open Experience Passport
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                {editingId ? "Edit Experience" : "New Experience"}
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-950">
                {editingId
                  ? "Update your work experience"
                  : "Add work experience"}
              </h2>
            </div>

            <form
              onSubmit={saveExperience}
              className="max-h-[75vh] overflow-y-auto px-6 py-6 sm:px-7"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Job title *
                  </label>

                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Frontend Developer"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Company / Organization *
                  </label>

                  <input
                    value={form.company}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        company: event.target.value,
                      }))
                    }
                    placeholder="Company name"
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Employment type
                  </label>

                  <select
                    value={form.employmentType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        employmentType: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-950"
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
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
                    placeholder="Remote, Lagos, London..."
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    Start date *
                  </label>

                  <input
                    type="month"
                    value={form.startDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        startDate: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700">
                    End date
                  </label>

                  <input
                    type="month"
                    value={form.endDate}
                    disabled={form.current}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        endDate: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-slate-950"
                  />

                  <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={form.current}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          current: event.target.checked,
                          endDate: event.target.checked
                            ? ""
                            : current.endDate,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    I currently work here
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold text-slate-700">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Describe what you did, what you owned, and the impact of your work..."
                  rows={5}
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-slate-950"
                />

                <p className="mt-2 text-[11px] text-slate-400">
                  Keep this factual and focused on your actual responsibilities
                  and outcomes.
                </p>
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold text-slate-700">
                  Skills used
                </label>

                <div className="mt-2 flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(event) =>
                      setSkillInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="React, TypeScript..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-950"
                  />

                  <button
                    type="button"
                    onClick={addSkill}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>

                {form.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        {skill} ×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-slate-950 px-5 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  {editingId ? "Save Changes" : "Add Experience"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}