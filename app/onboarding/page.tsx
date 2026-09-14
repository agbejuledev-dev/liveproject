// app/onboarding/page.tsx

"use client";

import type {
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Code2,
  Globe2,
  Link2,
  Plus,
  Sparkles,
  Upload,
  UserRound,
  X,
} from "lucide-react";

const careerTracks = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Data & Analytics",
  "Digital Marketing",
  "Business Analysis",
  "Product Management",
  "Cybersecurity",
];

const recommendedSkills: Record<string, string[]> = {
  "Web Development": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Git",
    "REST APIs",
  ],
  "Mobile Development": [
    "React Native",
    "Flutter",
    "Dart",
    "Java",
    "Kotlin",
    "Firebase",
    "API Integration",
  ],
  "UI/UX Design": [
    "Figma",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Design Systems",
    "Interaction Design",
  ],
  "Data & Analytics": [
    "Excel",
    "SQL",
    "Python",
    "Power BI",
    "Tableau",
    "Data Visualization",
  ],
  "Digital Marketing": [
    "SEO",
    "Content Marketing",
    "Social Media",
    "Google Ads",
    "Analytics",
    "Email Marketing",
  ],
  "Business Analysis": [
    "Requirements Gathering",
    "Process Mapping",
    "Business Documentation",
    "SQL",
    "Data Analysis",
    "Stakeholder Management",
  ],
  "Product Management": [
    "Product Strategy",
    "Roadmapping",
    "User Research",
    "Agile",
    "Product Analytics",
    "Jira",
  ],
  Cybersecurity: [
    "Network Security",
    "Linux",
    "Ethical Hacking",
    "Security Analysis",
    "OWASP",
    "Risk Assessment",
  ],
};

const experienceLevels = [
  "Just starting",
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];

const statuses = [
  "Student",
  "Looking for opportunities",
  "Working",
  "Freelancing",
  "Building a business",
  "Career switcher",
];

const opportunityTypes = [
  "Real-world projects",
  "Internships",
  "Freelance opportunities",
  "Remote jobs",
  "Team projects",
  "Mentorship",
];

const workPreferences = [
  "Remote",
  "Hybrid",
  "On-site",
  "Any",
];

type OnboardingData = {
  firstName: string;
  lastName: string;
  country: string;
  bio: string;
  careerTrack: string;
  experienceLevel: string;
  currentStatus: string;
  skills: string[];
  linkedin: string;
  github: string;
  portfolio: string;
  cvName: string;
  opportunities: string[];
  workPreference: string;
};

const emptyData: OnboardingData = {
  firstName: "",
  lastName: "",
  country: "",
  bio: "",
  careerTrack: "",
  experienceLevel: "",
  currentStatus: "",
  skills: [],
  linkedin: "",
  github: "",
  portfolio: "",
  cvName: "",
  opportunities: [],
  workPreference: "Any",
};

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(emptyData);
  const [customSkill, setCustomSkill] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const totalSteps = 5;

  useEffect(() => {
    try {
      const registrationRaw = sessionStorage.getItem(
        "liveproject_registration"
      );

      const verified = sessionStorage.getItem(
        "liveproject_email_verified"
      );

      if (!registrationRaw) {
        router.replace("/register");
        return;
      }

      if (verified !== "true") {
        router.replace("/verify");
        return;
      }

      const registration = JSON.parse(registrationRaw);

      const savedOnboardingRaw = sessionStorage.getItem(
        "liveproject_onboarding"
      );

      const savedOnboarding = savedOnboardingRaw
        ? JSON.parse(savedOnboardingRaw)
        : null;

      setData({
        ...emptyData,
        ...(savedOnboarding || {}),
        firstName:
          savedOnboarding?.firstName ||
          registration?.firstName ||
          "",
        lastName:
          savedOnboarding?.lastName ||
          registration?.lastName ||
          "",
        country:
          savedOnboarding?.country ||
          registration?.country ||
          "",
      });
    } catch {
      router.replace("/register");
      return;
    } finally {
      setLoaded(true);
    }
  }, [router]);

  const updateData = <K extends keyof OnboardingData>(
    key: K,
    value: OnboardingData[K]
  ) => {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleArrayValue = (
    key: "skills" | "opportunities",
    value: string
  ) => {
    setData((current) => {
      const values = current[key];

      if (values.includes(value)) {
        return {
          ...current,
          [key]: values.filter((item) => item !== value),
        };
      }

      if (key === "skills" && values.length >= 12) {
        return current;
      }

      return {
        ...current,
        [key]: [...values, value],
      };
    });
  };

  const addCustomSkill = () => {
    const skill = customSkill.trim();

    if (!skill) return;

    if (data.skills.includes(skill)) {
      setCustomSkill("");
      return;
    }

    if (data.skills.length >= 12) {
      return;
    }

    setData((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setCustomSkill("");
  };

  const removeSkill = (skill: string) => {
    setData((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill),
    }));
  };

  const progress = useMemo(() => {
    const fields = [
      Boolean(data.firstName.trim()),
      Boolean(data.lastName.trim()),
      Boolean(data.country),
      Boolean(data.bio.trim()),
      Boolean(data.careerTrack),
      Boolean(data.experienceLevel),
      Boolean(data.currentStatus),
      data.skills.length > 0,
      Boolean(
        data.linkedin.trim() ||
          data.github.trim() ||
          data.portfolio.trim()
      ),
      data.opportunities.length > 0,
      Boolean(data.workPreference),
    ];

    return Math.round(
      (fields.filter(Boolean).length / fields.length) * 100
    );
  }, [data]);

  const saveProgress = () => {
    sessionStorage.setItem(
      "liveproject_onboarding",
      JSON.stringify(data)
    );
  };

  const completeOnboarding = () => {
    setSaving(true);

    try {
      sessionStorage.setItem(
        "liveproject_onboarding",
        JSON.stringify(data)
      );

      sessionStorage.setItem(
        "liveproject_profile_complete",
        String(progress)
      );

      const currentSessionRaw = sessionStorage.getItem(
        "liveproject_session"
      );

      if (currentSessionRaw) {
        const currentSession = JSON.parse(currentSessionRaw);

        sessionStorage.setItem(
          "liveproject_session",
          JSON.stringify({
            ...currentSession,
            loggedIn: true,
            firstName: data.firstName,
            lastName: data.lastName,
            country: data.country,
          })
        );
      }

      const afterAuth =
        sessionStorage.getItem("liveproject_after_auth");

      if (afterAuth) {
        sessionStorage.removeItem("liveproject_after_auth");
        router.push(afterAuth);
        return;
      }

      const afterUpgrade =
        sessionStorage.getItem("liveproject_after_upgrade");

      if (afterUpgrade) {
        sessionStorage.removeItem("liveproject_after_upgrade");
        router.push(afterUpgrade);
        return;
      }

      router.push("/workspace");
    } catch {
      setSaving(false);
    }
  };

  const nextStep = () => {
    if (!canContinue()) return;

    saveProgress();

    if (step < totalSteps) {
      setStep((current) => current + 1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    completeOnboarding();
  };

  const previousStep = () => {
    if (step <= 1) {
      router.back();
      return;
    }

    setStep((current) => current - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function canContinue() {
    if (step === 1) {
      return Boolean(
        data.firstName.trim() &&
          data.lastName.trim() &&
          data.country
      );
    }

    if (step === 2) {
      return Boolean(
        data.careerTrack &&
          data.experienceLevel &&
          data.currentStatus
      );
    }

    if (step === 3) {
      return data.skills.length > 0;
    }

    return true;
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fbff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0757D9]" />

          <p className="text-sm font-medium text-slate-500">
            Preparing your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xl font-black tracking-tight text-slate-950"
          >
            LiveProject
            <span className="text-[#0757D9]">.</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs text-slate-400">
                Profile completion
              </p>

              <p className="text-sm font-black text-slate-900">
                {progress}%
              </p>
            </div>

            <div className="h-10 w-10 rounded-full bg-blue-50 p-1">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0757D9] text-sm font-black text-white">
                {data.firstName?.charAt(0) || "L"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        {/* Intro */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[#0757D9]">
            <Sparkles size={16} />
            Personalize your LiveProject experience
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Let&apos;s build your professional profile.
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-500">
            Tell us a little about yourself so we can connect you
            with the right projects, opportunities and experiences.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-10 overflow-x-auto">
          <div className="flex min-w-[680px] items-center">
            {[
              {
                number: 1,
                label: "About you",
                icon: UserRound,
              },
              {
                number: 2,
                label: "Professional",
                icon: BriefcaseBusiness,
              },
              {
                number: 3,
                label: "Skills",
                icon: Code2,
              },
              {
                number: 4,
                label: "Links",
                icon: Link2,
              },
              {
                number: 5,
                label: "Preferences",
                icon: Globe2,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              const active = step === item.number;
              const completed = step > item.number;

              return (
                <div
                  key={item.number}
                  className="flex flex-1 items-center"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (item.number < step) {
                        setStep(item.number);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }
                    }}
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        completed
                          ? "border-[#0757D9] bg-[#0757D9] text-white"
                          : active
                            ? "border-[#0757D9] bg-blue-50 text-[#0757D9]"
                            : "border-slate-200 bg-white text-slate-400"
                      }`}
                    >
                      {completed ? (
                        <Check size={17} />
                      ) : (
                        <Icon size={17} />
                      )}
                    </span>

                    <span
                      className={`hidden text-sm font-bold sm:block ${
                        active || completed
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>

                  {index < 4 && (
                    <div
                      className={`mx-4 h-px flex-1 ${
                        completed
                          ? "bg-[#0757D9]"
                          : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-950">
                    Tell us about yourself
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This information will appear on your professional
                    profile.
                  </p>
                </div>

                <div className="mb-8 flex items-center gap-5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#0757D9]">
                    <UserRound size={30} />
                  </div>

                  <div>
                    <button
                      type="button"
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      Add profile photo
                    </button>

                    <p className="mt-2 text-xs text-slate-400">
                      A professional photo helps people recognize
                      you.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    label="First name"
                    value={data.firstName}
                    onChange={(value) =>
                      updateData("firstName", value)
                    }
                  />

                  <FormField
                    label="Last name"
                    value={data.lastName}
                    onChange={(value) =>
                      updateData("lastName", value)
                    }
                  />
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Country
                  </label>

                  <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <Globe2
                      size={18}
                      className="text-[#0757D9]"
                    />

                    <span className="text-sm font-bold text-slate-800">
                      {data.country ||
                        "Country selected during registration"}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Your country was selected during registration
                    and will be part of your LiveProject profile.
                  </p>
                </div>

                <div className="mt-5">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Short bio
                  </label>

                  <textarea
                    value={data.bio}
                    onChange={(event) =>
                      updateData("bio", event.target.value)
                    }
                    rows={5}
                    maxLength={500}
                    placeholder="Tell the LiveProject community who you are, what you do, and what you're hoping to build..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-2 text-right text-xs text-slate-400">
                    {data.bio.length}/500
                  </p>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-950">
                    Your professional direction
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Help us understand what kind of work you want to
                    build experience in.
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    Career track
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {careerTracks.map((track) => (
                      <button
                        key={track}
                        type="button"
                        onClick={() =>
                          updateData("careerTrack", track)
                        }
                        className={`rounded-2xl border p-4 text-left transition ${
                          data.careerTrack === track
                            ? "border-[#0757D9] bg-blue-50 ring-2 ring-blue-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-bold text-slate-900">
                          {track}
                        </div>

                        {data.careerTrack === track && (
                          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-[#0757D9]">
                            <Check size={14} />
                            Selected
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    Experience level
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() =>
                          updateData("experienceLevel", level)
                        }
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          data.experienceLevel === level
                            ? "border-[#0757D9] bg-blue-50 font-bold text-[#0757D9]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    Current status
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          updateData("currentStatus", status)
                        }
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          data.currentStatus === status
                            ? "border-[#0757D9] bg-blue-50 font-bold text-[#0757D9]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-950">
                    What can you do?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select the skills you already have. You can add
                    more later.
                  </p>
                </div>

                {data.careerTrack && (
                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-sm font-bold text-slate-700">
                        Recommended for {data.careerTrack}
                      </label>

                      <span className="text-xs text-slate-400">
                        {data.skills.length}/12 selected
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(recommendedSkills[data.careerTrack] || []).map(
                        (skill) => {
                          const selected = data.skills.includes(skill);

                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() =>
                                toggleArrayValue("skills", skill)
                              }
                              className={`rounded-full border px-4 py-2 text-sm transition ${
                                selected
                                  ? "border-[#0757D9] bg-[#0757D9] text-white"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              {selected && (
                                <Check
                                  size={14}
                                  className="mr-1 inline"
                                />
                              )}
                              {skill}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

                {data.skills.length > 0 && (
                  <div className="mt-8">
                    <p className="mb-3 text-sm font-bold text-slate-700">
                      Selected skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-bold text-[#0757D9]"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="rounded-full hover:bg-blue-100"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Add another skill
                  </label>

                  <div className="flex gap-2">
                    <input
                      value={customSkill}
                      onChange={(event) =>
                        setCustomSkill(event.target.value)
                      }
                      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          addCustomSkill();
                        }
                      }}
                      placeholder="e.g. Docker"
                      className="h-12 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={addCustomSkill}
                      className="flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      <Plus size={17} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-950">
                    Add your professional links
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    These links help clients and other professionals
                    discover your work.
                  </p>
                </div>

                <div className="space-y-5">
                  <LinkField
                    label="LinkedIn"
                    value={data.linkedin}
                    placeholder="https://linkedin.com/in/yourname"
                    icon={<Link2 size={17} />}
                    onChange={(value) =>
                      updateData("linkedin", value)
                    }
                  />

                  <LinkField
                    label="GitHub"
                    value={data.github}
                    placeholder="https://github.com/yourusername"
                    icon={<Code2 size={17} />}
                    onChange={(value) =>
                      updateData("github", value)
                    }
                  />

                  <LinkField
                    label="Portfolio website"
                    value={data.portfolio}
                    placeholder="https://yourportfolio.com"
                    icon={<Globe2 size={17} />}
                    onChange={(value) =>
                      updateData("portfolio", value)
                    }
                  />

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      CV / Resume
                    </label>

                    <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-5 transition hover:border-[#0757D9] hover:bg-blue-50/50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0757D9]">
                        <Upload size={20} />
                      </div>

                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">
                          {data.cvName ||
                            "Upload your CV or resume"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          PDF, DOC or DOCX
                        </p>
                      </div>

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(
                          event: ChangeEvent<HTMLInputElement>
                        ) => {
                          const file = event.target.files?.[0];

                          if (file) {
                            updateData("cvName", file.name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                  <div className="flex gap-3">
                    <Sparkles
                      size={19}
                      className="mt-0.5 shrink-0 text-[#0757D9]"
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        Your profile becomes your Experience Passport
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        As you complete LiveProjects, your verified
                        work, skills, feedback, certificates and
                        recommendations can become part of your
                        professional identity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-950">
                    What are you looking for?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Choose the opportunities you want LiveProject to
                    surface for you.
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    I&apos;m interested in
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {opportunityTypes.map((opportunity) => {
                      const selected =
                        data.opportunities.includes(opportunity);

                      return (
                        <button
                          key={opportunity}
                          type="button"
                          onClick={() =>
                            toggleArrayValue(
                              "opportunities",
                              opportunity
                            )
                          }
                          className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-[#0757D9] bg-blue-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                              selected
                                ? "border-[#0757D9] bg-[#0757D9] text-white"
                                : "border-slate-300"
                            }`}
                          >
                            {selected && <Check size={13} />}
                          </span>

                          <span
                            className={`text-sm font-bold ${
                              selected
                                ? "text-[#0757D9]"
                                : "text-slate-700"
                            }`}
                          >
                            {opportunity}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8">
                  <label className="mb-3 block text-sm font-bold text-slate-700">
                    Preferred work setup
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {workPreferences.map((preference) => (
                      <button
                        key={preference}
                        type="button"
                        onClick={() =>
                          updateData(
                            "workPreference",
                            preference
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                          data.workPreference === preference
                            ? "border-[#0757D9] bg-blue-50 font-bold text-[#0757D9]"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {preference}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10 rounded-3xl bg-[#0757D9] p-6 text-white">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Sparkles size={18} />
                        <span className="text-sm font-bold">
                          You&apos;re almost ready
                        </span>
                      </div>

                      <h3 className="text-xl font-black">
                        Welcome to the LiveProject ecosystem.
                      </h3>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
                        Once your profile is complete, you can discover
                        projects, build verified experience, collaborate
                        with professionals around the world and start
                        building your Experience Passport.
                      </p>
                    </div>

                    <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                      <Globe2 size={30} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={previousStep}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
              >
                <ArrowLeft size={17} />
                Back
              </button>

              <button
                type="button"
                onClick={nextStep}
                disabled={!canContinue() || saving}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition ${
                  canContinue() && !saving
                    ? "bg-[#0757D9] text-white shadow-lg shadow-blue-100 hover:bg-[#064bb8]"
                    : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
              >
                {saving
                  ? "Saving..."
                  : step === totalSteps
                    ? "Complete profile"
                    : "Continue"}

                <ArrowRight size={17} />
              </button>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0757D9]">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Profile strength
                    </p>

                    <p className="text-xs text-slate-400">
                      Keep building your profile
                    </p>
                  </div>
                </div>

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Completion
                  </span>

                  <span className="text-sm font-black text-slate-900">
                    {progress}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-[#0757D9] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Globe2
                    size={19}
                    className="text-[#0757D9]"
                  />

                  <h3 className="text-sm font-bold text-slate-900">
                    Global ecosystem
                  </h3>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  LiveProject connects professionals, businesses,
                  mentors and opportunities across countries and
                  career tracks.
                </p>
              </div>

              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <p className="text-sm font-bold">
                  Why complete your profile?
                </p>

                <ul className="mt-4 space-y-3">
                  {[
                    "Better project recommendations",
                    "Stronger professional profile",
                    "More relevant opportunities",
                    "Build your Experience Passport",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-400"
                      />

                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

function LinkField({
  label,
  value,
  placeholder,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none transition focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
        />
      </div>
    </div>
  );
}