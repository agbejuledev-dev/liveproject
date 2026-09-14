"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  FileText,
  Info,
  Plus,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type BusinessProject = {
  id: string;
  title: string;
  description: string;
  status: "Draft" | "Open" | "In Review" | "Completed";
  applicants: number;
  createdAt: string;
  track: string;
  level: string;
  format: "Solo" | "Team";
  duration: string;
  skills: string[];
  deliverables: string[];
  access: "free" | "premium";
};

const tracks = [
  "Project Management",
  "Product Management",
  "Business Analysis",
  "Software Development",
  "Quality Assurance",
  "UX / UI Design",
  "Data & Analytics",
  "Cybersecurity",
];

const levels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];

const formats = ["Solo", "Team"];

const durations = [
  "1 week",
  "2 weeks",
  "3 weeks",
  "4 weeks",
  "6 weeks",
  "8 weeks",
];

const accessTypes = [
  {
    value: "free",
    label: "Free Project",
    description:
      "Professionals can view and apply without a Premium subscription.",
  },
  {
    value: "premium",
    label: "Premium Project",
    description:
      "Designed for Premium professionals looking for higher-value opportunities.",
  },
];

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

function saveProjects(projects: BusinessProject[]) {
  try {
    const serialized = JSON.stringify(projects);

    sessionStorage.setItem(
      "liveproject_business_projects",
      serialized
    );

    sessionStorage.setItem(
      "liveproject_client_projects",
      serialized
    );

    sessionStorage.setItem(
      "liveproject_projects",
      serialized
    );
  } catch {
    // Prototype storage.
  }
}

export default function NewProjectPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [track, setTrack] = useState("");
  const [level, setLevel] = useState("");
  const [format, setFormat] = useState<"Solo" | "Team">("Solo");
  const [duration, setDuration] = useState("");
  const [access, setAccess] = useState<"free" | "premium">("free");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    setReady(true);
  }, [router]);

  const canSubmit = useMemo(() => {
    return Boolean(
      title.trim() &&
        track &&
        level &&
        format &&
        duration &&
        description.trim() &&
        skills.length > 0 &&
        deliverables.length > 0
    );
  }, [
    title,
    track,
    level,
    format,
    duration,
    description,
    skills,
    deliverables,
  ]);

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    const exists = skills.some(
      (skill) => skill.toLowerCase() === value.toLowerCase()
    );

    if (exists) {
      setSkillInput("");
      return;
    }

    setSkills((current) => [...current, value]);
    setSkillInput("");
  };

  const addDeliverable = () => {
    const value = deliverableInput.trim();

    if (!value) return;

    setDeliverables((current) => [...current, value]);
    setDeliverableInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((current) =>
      current.filter((item) => item !== skill)
    );
  };

  const removeDeliverable = (deliverable: string) => {
    setDeliverables((current) =>
      current.filter((item) => item !== deliverable)
    );
  };

  const submitProject = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canSubmit || submitting) {
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const existingProjects = readStorage<BusinessProject[]>(
        "liveproject_business_projects",
        []
      );

      const newProject: BusinessProject = {
        id: `business-project-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        status: "Open",
        applicants: 0,
        createdAt: new Date().toLocaleDateString(),
        track,
        level,
        format,
        duration,
        skills,
        deliverables,
        access,
      };

      const nextProjects = [
        newProject,
        ...(Array.isArray(existingProjects)
          ? existingProjects
          : []),
      ];

      saveProjects(nextProjects);

      setSuccess(true);

      setTimeout(() => {
        router.push(`/business/projects/${newProject.id}`);
      }, 700);
    } catch {
      setError(
        "We couldn't create the project. Please try again."
      );
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading project creator...
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
          <div className="mx-auto flex h-[76px] max-w-[1250px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
                aria-label="Go back"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Post a Project
                </h1>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 sm:flex">
              <BriefcaseBusiness size={15} className="text-teal-700" />
              <span className="text-xs font-bold text-slate-600">
                Create a real project opportunity
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1250px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
            <form
              onSubmit={submitProject}
              className="space-y-6"
            >
              {/* Basic Information */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <FileText size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Project brief
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Tell professionals what needs to be solved.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      A strong project brief makes it easier for the right
                      professionals to understand the opportunity and apply.
                    </p>
                  </div>
                </div>

                <div className="mt-7 space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Project title
                    </label>

                    <input
                      value={title}
                      onChange={(event) =>
                        setTitle(event.target.value)
                      }
                      placeholder="e.g. Redesign a SaaS onboarding experience"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Project description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      rows={8}
                      placeholder="Explain the business problem, what you are trying to achieve, and what a successful outcome looks like."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />

                    <div className="mt-2 flex items-start gap-2 text-xs text-slate-400">
                      <Info size={13} className="mt-0.5 shrink-0" />
                      <span>
                        Focus on the business problem and expected outcome,
                        rather than writing a traditional job description.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Project Configuration */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Configuration
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Define the shape of the work.
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Career track
                    </label>

                    <div className="relative">
                      <select
                        value={track}
                        onChange={(event) =>
                          setTrack(event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      >
                        <option value="">
                          Select a career track
                        </option>

                        {tracks.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Experience level
                    </label>

                    <div className="relative">
                      <select
                        value={level}
                        onChange={(event) =>
                          setLevel(event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      >
                        <option value="">
                          Select project level
                        </option>

                        {levels.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Project format
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {formats.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setFormat(
                              item as "Solo" | "Team"
                            )
                          }
                          className={[
                            "rounded-xl border px-4 py-3.5 text-sm font-bold transition",
                            format === item
                              ? "border-teal-300 bg-teal-50 text-teal-800"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                          ].join(" ")}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Expected duration
                    </label>

                    <div className="relative">
                      <select
                        value={duration}
                        onChange={(event) =>
                          setDuration(event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      >
                        <option value="">
                          Select duration
                        </option>

                        {durations.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Skills
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      What should the professional demonstrate?
                    </h2>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex gap-2">
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
                      placeholder="e.g. React, Product Strategy, Figma"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={addSkill}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  {skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-teal-500 hover:text-red-600"
                          >
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Deliverables */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <CheckCircle2 size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Expected outputs
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Define the deliverables.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      These are the concrete outputs professionals will work
                      toward.
                    </p>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex gap-2">
                    <input
                      value={deliverableInput}
                      onChange={(event) =>
                        setDeliverableInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addDeliverable();
                        }
                      }}
                      placeholder="e.g. Product requirements document"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={addDeliverable}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  {deliverables.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {deliverables.map((deliverable, index) => (
                        <div
                          key={`${deliverable}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-slate-500">
                              {index + 1}
                            </span>

                            <span className="text-sm font-semibold text-slate-700">
                              {deliverable}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeDeliverable(deliverable)
                            }
                            className="shrink-0 text-slate-400 transition hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Access */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <Users size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Opportunity access
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Choose who can access the project.
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-3">
                  {accessTypes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setAccess(
                          item.value as "free" | "premium"
                        )
                      }
                      className={[
                        "rounded-2xl border p-4 text-left transition",
                        access === item.value
                          ? "border-teal-300 bg-teal-50/70"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-black text-slate-950">
                            {item.label}
                          </div>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {item.description}
                          </p>
                        </div>

                        <div
                          className={[
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            access === item.value
                              ? "border-teal-600 bg-teal-600"
                              : "border-slate-300 bg-white",
                          ].join(" ")}
                        >
                          {access === item.value && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={18} />
                  Project created successfully. Opening your project...
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <ArrowLeft size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!canSubmit || submitting || success}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Creating project..." : "Create project"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Sidebar */}
            <aside className="space-y-5">
              <div className="sticky top-[100px] rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-teal-700">
                  <Sparkles size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.16em]">
                    Project quality
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-black tracking-tight text-slate-950">
                  Build a brief professionals can actually act on.
                </h3>

                <div className="mt-5 space-y-3">
                  {[
                    ["Clear business problem", Boolean(description.trim())],
                    ["Defined career track", Boolean(track)],
                    ["Experience level", Boolean(level)],
                    ["Relevant skills", skills.length > 0],
                    ["Concrete deliverables", deliverables.length > 0],
                    ["Timeline", Boolean(duration)],
                  ].map(([label, complete]) => (
                    <div
                      key={label as string}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-lg",
                          complete
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-slate-50 text-slate-300",
                        ].join(" ")}
                      >
                        <CheckCircle2 size={14} />
                      </div>

                      <span
                        className={[
                          "text-xs font-semibold",
                          complete
                            ? "text-slate-700"
                            : "text-slate-400",
                        ].join(" ")}
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-teal-100 bg-teal-50/70 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                  <Users size={18} />
                </div>

                <h3 className="mt-4 text-sm font-black text-teal-950">
                  What happens after publishing?
                </h3>

                <div className="mt-4 space-y-3">
                  {[
                    "Professionals discover your project.",
                    "Interested professionals submit applications.",
                    "You review evidence and shortlist candidates.",
                    "The selected team begins project work.",
                  ].map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-3"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-teal-700 shadow-sm">
                        {index + 1}
                      </div>

                      <p className="text-xs leading-5 text-teal-900/75">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}