"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Globe2,
  Mail,
  Users,
} from "lucide-react";

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Insurance",
  "Retail",
  "E-commerce",
  "Media & Entertainment",
  "Professional Services",
  "Real Estate",
  "Manufacturing",
  "Non-profit",
  "Other",
];

const companySizes = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "501–1,000",
  "1,001+",
];

const needs = [
  "Post real-world projects",
  "Find professionals",
  "Build project teams",
  "Hire talent",
  "Get project support",
  "Mentor professionals",
];

export default function BusinessOnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState({
    organisationName: "",
    country: "",
    website: "",
    industry: "",
    companySize: "",
    description: "",
    contactName: "",
    contactEmail: "",
    needs: [] as string[],
  });

  const totalSteps = 3;

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

      if (
        registration?.accountType !== "client" &&
        registration?.role !== "client"
      ) {
        router.replace("/onboarding");
        return;
      }

      const saved = sessionStorage.getItem(
        "liveproject_client_onboarding"
      );

      const savedData = saved ? JSON.parse(saved) : null;

      setData({
        organisationName:
          savedData?.organisationName ||
          registration?.organisationName ||
          "",
        country:
          savedData?.country ||
          registration?.country ||
          "",
        website:
          savedData?.website ||
          registration?.website ||
          "",
        industry: savedData?.industry || "",
        companySize: savedData?.companySize || "",
        description: savedData?.description || "",
        contactName: savedData?.contactName || "",
        contactEmail:
          savedData?.contactEmail ||
          registration?.email ||
          "",
        needs: Array.isArray(savedData?.needs)
          ? savedData.needs
          : [],
      });
    } catch {
      router.replace("/register");
      return;
    } finally {
      setLoaded(true);
    }
  }, [router]);

  function update(
    key: keyof typeof data,
    value: string | string[]
  ) {
    setData((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleNeed(value: string) {
    setData((current) => ({
      ...current,
      needs: current.needs.includes(value)
        ? current.needs.filter((item) => item !== value)
        : [...current.needs, value],
    }));
  }

  function save() {
    sessionStorage.setItem(
      "liveproject_client_onboarding",
      JSON.stringify(data)
    );
  }

  function canContinue() {
    if (step === 1) {
      return Boolean(
        data.organisationName.trim() &&
          data.country &&
          data.industry &&
          data.companySize
      );
    }

    if (step === 2) {
      return Boolean(
        data.contactName.trim() &&
          data.contactEmail.trim() &&
          data.description.trim()
      );
    }

    return data.needs.length > 0;
  }

  function next() {
    if (!canContinue()) return;

    save();

    if (step < totalSteps) {
      setStep((current) => current + 1);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    setSaving(true);

    sessionStorage.setItem(
      "liveproject_client_onboarding",
      JSON.stringify(data)
    );

    sessionStorage.setItem(
      "liveproject_profile_complete",
      "100"
    );

    const existingSession = sessionStorage.getItem(
      "liveproject_session"
    );

    try {
      const parsedSession = existingSession
        ? JSON.parse(existingSession)
        : {};

      sessionStorage.setItem(
        "liveproject_session",
        JSON.stringify({
          ...parsedSession,
          loggedIn: true,
          accountType: "client",
          role: "client",
          organisationName: data.organisationName,
          country: data.country,
        })
      );
    } catch {
      sessionStorage.setItem(
        "liveproject_session",
        JSON.stringify({
          loggedIn: true,
          accountType: "client",
          role: "client",
          organisationName: data.organisationName,
          country: data.country,
        })
      );
    }

    window.setTimeout(() => {
      router.push("/business");
    }, 450);
  }

  function back() {
    if (step > 1) {
      setStep((current) => current - 1);
      return;
    }

    router.back();
  }

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fbff]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0757D9]" />
          <p className="text-sm font-medium text-slate-500">
            Preparing your business profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xl font-black tracking-tight"
          >
            LiveProject<span className="text-[#0757D9]">.</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-slate-400 sm:block">
              Business onboarding
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0757D9]">
              <Building2 size={19} />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <div className="mb-10 max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[#0757D9]">
            <Building2 size={16} />
            Business / Client
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Set up your organisation.
          </h1>

          <p className="mt-3 text-base leading-7 text-slate-500">
            Give LiveProject enough context to help your organisation
            discover talent, create projects and build effective teams.
          </p>
        </div>

        <div className="mb-8 flex items-center gap-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-1 items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-black ${
                  step >= item
                    ? "border-[#0757D9] bg-[#0757D9] text-white"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {step > item ? <Check size={16} /> : item}
              </div>

              {item < 3 && (
                <div
                  className={`h-px flex-1 ${
                    step > item
                      ? "bg-[#0757D9]"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-black">
                  About your organisation
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Help professionals understand who they may be working with.
                </p>

                <div className="mt-8 space-y-5">
                  <Field
                    label="Organisation / Business name"
                    value={data.organisationName}
                    onChange={(value) =>
                      update("organisationName", value)
                    }
                    placeholder="Your organisation"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Country
                    </label>

                    <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4">
                      <Globe2
                        size={18}
                        className="text-[#0757D9]"
                      />

                      <span className="text-sm font-bold">
                        {data.country}
                      </span>
                    </div>
                  </div>

                  <Field
                    label="Website"
                    value={data.website}
                    onChange={(value) =>
                      update("website", value)
                    }
                    placeholder="https://yourcompany.com"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Industry
                    </label>

                    <select
                      value={data.industry}
                      onChange={(event) =>
                        update("industry", event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
                    >
                      <option value="">Select industry</option>

                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Organisation size
                    </label>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {companySizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            update("companySize", size)
                          }
                          className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                            data.companySize === size
                              ? "border-[#0757D9] bg-blue-50 text-[#0757D9]"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          }`}
                        >
                          <Users
                            size={15}
                            className="mr-2 inline"
                          />
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-black">
                  Tell us about the business need
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This helps us understand the type of work your organisation
                  wants to create or support.
                </p>

                <div className="mt-8 space-y-5">
                  <Field
                    label="Primary contact name"
                    value={data.contactName}
                    onChange={(value) =>
                      update("contactName", value)
                    }
                    placeholder="Full name"
                  />

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Contact email
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={data.contactEmail}
                        onChange={(event) =>
                          update(
                            "contactEmail",
                            event.target.value
                          )
                        }
                        type="email"
                        className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Tell us about your organisation
                    </label>

                    <textarea
                      value={data.description}
                      onChange={(event) =>
                        update(
                          "description",
                          event.target.value
                        )
                      }
                      rows={6}
                      placeholder="What does your organisation do? What kind of projects or challenges would you like to bring to LiveProject?"
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-black">
                  What do you want to accomplish?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Choose everything that applies. You can change this later.
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {needs.map((item) => {
                    const selected = data.needs.includes(item);

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleNeed(item)}
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
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-3xl bg-slate-900 p-6 text-white">
                  <p className="text-sm font-bold">
                    Your Business Dashboard
                  </p>

                  <h3 className="mt-2 text-xl font-black">
                    Bring projects. Find people. Get things done.
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    Once onboarding is complete, your business workspace
                    will give you access to project creation, talent,
                    applicants, teams and business profile tools.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={back}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
              >
                <ArrowLeft size={17} />
                Back
              </button>

              <button
                type="button"
                onClick={next}
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
                    ? "Complete business profile"
                    : "Continue"}

                <ArrowRight size={17} />
              </button>
            </div>
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0757D9]">
                  <Building2 size={20} />
                </div>

                <h3 className="mt-5 font-black">
                  Business account
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your organisation gets a dedicated experience built
                  around projects, talent and collaboration.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-black">
                  Your onboarding
                </p>

                <ul className="mt-4 space-y-3">
                  {[
                    "Organisation profile",
                    "Business needs",
                    "Project & talent goals",
                    "Business dashboard",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-slate-500"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-[#0757D9]"
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

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#0757D9] focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}