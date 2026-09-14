// @ts-nocheck
"use client";
import { BriefcaseBusiness, Plus, X } from "lucide-react";


import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Save,
  Users,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type Registration = {
  accountType?: "professional" | "client";
  organisationName?: string;
  email?: string;
  country?: string;
  website?: string;
};

type ClientOnboarding = {
  organisationName?: string;
  country?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  description?: string;
  contactName?: string;
  contactEmail?: string;
  needs?: string[];
};

const industries = [
  "Technology",
  "Financial Services",
  "Healthcare",
  "Education",
  "E-commerce",
  "Marketing & Media",
  "Consulting",
  "Professional Services",
  "Manufacturing",
  "Real Estate",
  "Nonprofit",
  "Other",
];

const companySizes = [
  "1â€“10",
  "11â€“50",
  "51â€“200",
  "201â€“500",
  "501â€“1,000",
  "1,001+",
];

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

export default function BusinessProfilePage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const [organisationName, setOrganisationName] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);

  const [needInput, setNeedInput] = useState("");

  useEffect(() => {
    const storedSession = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!storedSession?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role =
      storedSession.role ?? storedSession.accountType;

    if (role === "professional") {
      router.replace("/workspace");
      return;
    }

    const registration = readStorage<Registration | null>(
      "liveproject_registration",
      null
    );

    const onboarding = readStorage<ClientOnboarding | null>(
      "liveproject_client_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/business-onboarding");
      return;
    }

    setSession(storedSession);

    setOrganisationName(
      onboarding.organisationName ||
        registration?.organisationName ||
        ""
    );

    setCountry(
      onboarding.country ||
        registration?.country ||
        ""
    );

    setWebsite(
      onboarding.website ||
        registration?.website ||
        ""
    );

    setIndustry(onboarding.industry || "");
    setCompanySize(onboarding.companySize || "");
    setDescription(onboarding.description || "");
    setContactName(onboarding.contactName || "");
    setContactEmail(onboarding.contactEmail || "");
    setNeeds(onboarding.needs || []);

    setReady(true);
  }, [router]);

  const addNeed = () => {
    const value = needInput.trim();

    if (!value) return;

    if (
      needs.some(
        (need) => need.toLowerCase() === value.toLowerCase()
      )
    ) {
      setNeedInput("");
      return;
    }

    setNeeds((current) => [...current, value]);
    setNeedInput("");
  };

  const removeNeed = (need: string) => {
    setNeeds((current) =>
      current.filter((item) => item !== need)
    );
  };

  const profileFields = [
    organisationName,
    country,
    website,
    industry,
    companySize,
    description,
    contactName,
    contactEmail,
  ];

  const completion = Math.round(
    (profileFields.filter((value) => value.trim()).length /
      profileFields.length) *
      100
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setSaved(false);

    const profile: ClientOnboarding = {
      organisationName: organisationName.trim(),
      country: country.trim(),
      website: website.trim(),
      industry,
      companySize,
      description: description.trim(),
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      needs,
    };

    try {
      sessionStorage.setItem(
        "liveproject_client_onboarding",
        JSON.stringify(profile)
      );

      const registration = readStorage<Registration | null>(
        "liveproject_registration",
        null
      );

      sessionStorage.setItem(
        "liveproject_registration",
        JSON.stringify({
          ...(registration || {}),
          accountType: "client",
          organisationName: organisationName.trim(),
          country: country.trim(),
          website: website.trim(),
        })
      );

      sessionStorage.setItem(
        "liveproject_profile_complete",
        String(completion)
      );

      sessionStorage.setItem(
        "liveproject_session",
        JSON.stringify({
          ...(session || {}),
          loggedIn: true,
          role: "client",
          accountType: "client",
        })
      );

      setSaved(true);
    } catch {
      setSaved(false);
    }

    setTimeout(() => {
      setSaving(false);
    }, 500);
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading business profile...
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
          <div className="mx-auto flex h-[76px] max-w-[1350px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Organisation
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Business Profile
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="hidden text-xs font-bold text-slate-600 sm:inline">
                Business account
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1350px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <Building2 size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Organisation
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Tell professionals who you are.
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      A strong business profile gives professionals more
                      context before they apply to your projects.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Organisation name
                    </label>

                    <input
                      value={organisationName}
                      onChange={(event) =>
                        setOrganisationName(event.target.value)
                      }
                      placeholder="Your company or organisation"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Country
                    </label>

                    <div className="relative">
                      <MapPin
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={country}
                        onChange={(event) =>
                          setCountry(event.target.value)
                        }
                        placeholder="Country"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Website
                    </label>

                    <div className="relative">
                      <Globe
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={website}
                        onChange={(event) =>
                          setWebsite(event.target.value)
                        }
                        placeholder="https://yourcompany.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Industry
                    </label>

                    <select
                      value={industry}
                      onChange={(event) =>
                        setIndustry(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    >
                      <option value="">
                        Select industry
                      </option>

                      {industries.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Company size
                    </label>

                    <select
                      value={companySize}
                      onChange={(event) =>
                        setCompanySize(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    >
                      <option value="">
                        Select company size
                      </option>

                      {companySizes.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Organisation description
                    </label>

                    <textarea
                      value={description}
                      onChange={(event) =>
                        setDescription(event.target.value)
                      }
                      rows={6}
                      placeholder="Describe your organisation, what you do and the type of work you care about."
                      className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <Users size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Contact
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Who should professionals communicate with?
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Contact name
                    </label>

                    <input
                      value={contactName}
                      onChange={(event) =>
                        setContactName(event.target.value)
                      }
                      placeholder="Full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Contact email
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(event) =>
                          setContactEmail(event.target.value)
                        }
                        placeholder="contact@company.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Talent needs
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      What are you looking for?
                    </h2>
                  </div>
                </div>

                <div className="mt-7">
                  <div className="flex gap-2">
                    <input
                      value={needInput}
                      onChange={(event) =>
                        setNeedInput(event.target.value)
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();

                          const value = needInput.trim();

                          if (
                            value &&
                            !needs.some(
                              (item) =>
                                item.toLowerCase() ===
                                value.toLowerCase()
                            )
                          ) {
                            setNeeds((current) => [
                              ...current,
                              value,
                            ]);
                            setNeedInput("");
                          }
                        }
                      }}
                      placeholder="e.g. Product strategy, frontend development"
                      className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const value = needInput.trim();

                        if (!value) return;

                        if (
                          needs.some(
                            (item) =>
                              item.toLowerCase() ===
                              value.toLowerCase()
                          )
                        ) {
                          setNeedInput("");
                          return;
                        }

                        setNeeds((current) => [
                          ...current,
                          value,
                        ]);
                        setNeedInput("");
                      }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800"
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  {needs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {needs.map((need) => (
                        <span
                          key={need}
                          className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-2 text-xs font-bold text-teal-800"
                        >
                          {need}

                          <button
                            type="button"
                            onClick={() =>
                              setNeeds((current) =>
                                current.filter(
                                  (item) => item !== need
                                )
                              )
                            }
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

              {saved && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={18} />
                  Business profile saved successfully.
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => router.push("/business")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <ArrowLeft size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Saving..." : "Save business profile"}
                  <Save size={16} />
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <div className="sticky top-[100px] rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Profile strength
                    </div>

                    <div className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                      {completion}%
                    </div>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <CheckCircle2 size={20} />
                  </div>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-500"
                    style={{
                      width: `${completion}%`,
                    }}
                  />
                </div>

                <div className="mt-5 space-y-3">
                  {[
                    ["Organisation name", !!organisationName.trim()],
                    ["Country", !!country.trim()],
                    ["Website", !!website.trim()],
                    ["Industry", !!industry],
                    ["Company size", !!companySize],
                    ["Description", !!description.trim()],
                    ["Contact", !!contactName.trim() && !!contactEmail.trim()],
                    ["Talent needs", needs.length > 0],
                  ].map(([label, complete]) => (
                    <div
                      key={label as string}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2
                        size={15}
                        className={
                          complete
                            ? "text-emerald-500"
                            : "text-slate-300"
                        }
                      />

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
                  <BriefcaseBusiness size={18} />
                </div>

                <h3 className="mt-4 text-sm font-black text-teal-950">
                  Why complete your profile?
                </h3>

                <p className="mt-2 text-xs leading-6 text-teal-900/75">
                  Professionals use your organisation profile to understand
                  who they may work with, what you do and whether your projects
                  match their goals.
                </p>

                <div className="mt-4 space-y-2">
                  {[
                    "Build trust before applications.",
                    "Give professionals project context.",
                    "Make your organisation easier to understand.",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 text-xs font-semibold text-teal-900/80"
                    >
                      <CheckCircle2
                        size={13}
                        className="mt-0.5 shrink-0"
                      />
                      <span>{item}</span>
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
