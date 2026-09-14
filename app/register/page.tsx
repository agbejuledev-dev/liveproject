"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Globe2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

const countries = [
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Brazil",
  "Cameroon",
  "Canada",
  "China",
  "Denmark",
  "Egypt",
  "Finland",
  "France",
  "Germany",
  "Ghana",
  "India",
  "Ireland",
  "Italy",
  "Japan",
  "Kenya",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Norway",
  "Portugal",
  "Rwanda",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tanzania",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Other",
];

type AccountType = "professional" | "client";

export default function RegisterPage() {
  const router = useRouter();

  const [accountType, setAccountType] =
    useState<AccountType>("professional");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    organisationName: "",
    email: "",
    password: "",
    country: "",
    website: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      number: /\d/.test(form.password),
    }),
    [form.password]
  );

  const passwordStrong =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.number;

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function selectAccountType(type: AccountType) {
    setAccountType(type);
    setError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setError("Please create a password.");
      return;
    }

    if (!form.country) {
      setError("Please select your country.");
      return;
    }

    if (!passwordStrong) {
      setError(
        "Your password must contain at least 8 characters, one uppercase letter and one number."
      );
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    if (accountType === "professional") {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError("Please enter your first and last name.");
        return;
      }
    }

    if (
      accountType === "client" &&
      !form.organisationName.trim()
    ) {
      setError("Please enter your organisation or business name.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      try {
        const registration = {
          accountType,

          firstName:
            accountType === "professional"
              ? form.firstName.trim()
              : "",

          lastName:
            accountType === "professional"
              ? form.lastName.trim()
              : "",

          organisationName:
            accountType === "client"
              ? form.organisationName.trim()
              : "",

          email: form.email.trim().toLowerCase(),

          password: form.password,

          country: form.country,

          website:
            accountType === "client"
              ? form.website.trim()
              : "",

          role:
            accountType === "professional"
              ? "professional"
              : "client",

          registeredAt: new Date().toISOString(),
        };

        sessionStorage.setItem(
          "liveproject_registration",
          JSON.stringify(registration)
        );

        sessionStorage.removeItem("liveproject_session");
        sessionStorage.removeItem("liveproject_email_verified");
        sessionStorage.removeItem("liveproject_onboarding");
        sessionStorage.removeItem("liveproject_client_onboarding");

        router.push("/verify");
      } catch {
        setError("Unable to create your account. Please try again.");
        setLoading(false);
      }
    }, 650);
  }

  function continueWithGoogle() {
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      try {
        const registration = {
          accountType,

          firstName:
            accountType === "professional"
              ? ""
              : "",

          lastName: "",

          organisationName:
            accountType === "client"
              ? ""
              : "",

          email: "",

          password: "",

          country: "",

          website: "",

          role:
            accountType === "professional"
              ? "professional"
              : "client",

          provider: "google",

          registeredAt: new Date().toISOString(),
        };

        sessionStorage.setItem(
          "liveproject_registration",
          JSON.stringify(registration)
        );

        sessionStorage.setItem(
          "liveproject_google_signup",
          "true"
        );

        sessionStorage.removeItem("liveproject_session");
        sessionStorage.removeItem("liveproject_onboarding");
        sessionStorage.removeItem("liveproject_client_onboarding");

        router.push("/verify");
      } catch {
        setError("Unable to continue with Google.");
        setLoading(false);
      }
    }, 700);
  }

  const isProfessional = accountType === "professional";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06101d] text-white">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-600/15 blur-3xl" />

        <div className="absolute right-[-12rem] top-[10%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="absolute bottom-[-14rem] left-[25%] h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-[#06101d]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-lg font-black tracking-tight"
          >
            LiveProject
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2.5 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/[0.1]"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          {/* Left */}
          <div className="pt-4 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              <Globe2 className="h-3.5 w-3.5" />
              Join LiveProject
            </div>

            <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-[-0.06em] sm:text-6xl">
              Choose how
              <span className="block text-cyan-300">
                you&apos;ll use it.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/50">
              LiveProject brings professionals and businesses into one
              experience-first ecosystem.
            </p>

            <div className="mt-10 space-y-4">
              <Feature
                icon={<UserRound className="h-5 w-5" />}
                title="Professionals"
                description="Build practical experience, prove your skills and grow your career."
              />

              <Feature
                icon={<Building2 className="h-5 w-5" />}
                title="Businesses & Clients"
                description="Bring real projects, business problems and talent needs into the ecosystem."
              />

              <Feature
                icon={<Globe2 className="h-5 w-5" />}
                title="Global by design"
                description="Choose your country and connect with opportunities without unnecessary location restrictions."
              />
            </div>
          </div>

          {/* Form */}
          <div className="w-full">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
              <div className="mb-7">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Create your account
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  What brings you to LiveProject?
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Select the account type that best describes how you
                  intend to use the platform.
                </p>
              </div>

              {/* Account type */}
              <div className="grid gap-4 sm:grid-cols-2">
                <AccountTypeCard
                  selected={accountType === "professional"}
                  icon={<UserRound className="h-6 w-6" />}
                  title="Professional"
                  description="Build experience, complete projects, strengthen your portfolio and advance your career."
                  onClick={() =>
                    selectAccountType("professional")
                  }
                />

                <AccountTypeCard
                  selected={accountType === "client"}
                  icon={<Building2 className="h-6 w-6" />}
                  title="Business / Client"
                  description="Bring projects, business problems and talent needs into the LiveProject ecosystem."
                  onClick={() => selectAccountType("client")}
                />
              </div>

              <div className="my-8 h-px bg-white/10" />

              {error && (
                <div className="mb-5 rounded-2xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-200">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {isProfessional ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="First name"
                      value={form.firstName}
                      onChange={(value) =>
                        updateField("firstName", value)
                      }
                      placeholder="First name"
                    />

                    <Field
                      label="Last name"
                      value={form.lastName}
                      onChange={(value) =>
                        updateField("lastName", value)
                      }
                      placeholder="Last name"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                      Organisation / Business name
                    </label>

                    <div className="relative mt-2">
                      <Building2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                      <input
                        type="text"
                        value={form.organisationName}
                        onChange={(event) =>
                          updateField(
                            "organisationName",
                            event.target.value
                          )
                        }
                        placeholder="Your company or organisation"
                        className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    Email
                  </label>

                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value
                        )
                      }
                      placeholder={
                        isProfessional
                          ? "you@example.com"
                          : "work@example.com"
                      }
                      autoComplete="email"
                      className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    Country
                  </label>

                  <div className="relative mt-2">
                    <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <select
                      value={form.country}
                      onChange={(event) =>
                        updateField(
                          "country",
                          event.target.value
                        )
                      }
                      className="w-full appearance-none rounded-2xl border border-white/10 bg-[#091522] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300/40"
                    >
                      <option
                        value=""
                        className="bg-[#091522]"
                      >
                        Select your country
                      </option>

                      {countries.map((country) => (
                        <option
                          key={country}
                          value={country}
                          className="bg-[#091522]"
                        >
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {accountType === "client" && (
                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                      Website
                      <span className="ml-2 normal-case tracking-normal text-white/25">
                        optional
                      </span>
                    </label>

                    <input
                      type="url"
                      value={form.website}
                      onChange={(event) =>
                        updateField(
                          "website",
                          event.target.value
                        )
                      }
                      placeholder="https://yourcompany.com"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    Password
                  </label>

                  <div className="relative mt-2">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={(event) =>
                        updateField(
                          "password",
                          event.target.value
                        )
                      }
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    <PasswordCheck
                      valid={passwordChecks.length}
                      label="8+ characters"
                    />

                    <PasswordCheck
                      valid={passwordChecks.uppercase}
                      label="Uppercase"
                    />

                    <PasswordCheck
                      valid={passwordChecks.number}
                      label="Number"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) =>
                      setAcceptedTerms(
                        event.target.checked
                      )
                    }
                    className="mt-0.5 h-4 w-4 accent-cyan-300"
                  />

                  <span className="text-xs leading-5 text-white/45">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() =>
                        router.push("/terms")
                      }
                      className="font-bold text-white/70 hover:text-white"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() =>
                        router.push("/privacy")
                      }
                      className="font-bold text-white/70 hover:text-white"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create{" "}
                      {isProfessional
                        ? "Professional"
                        : "Business"}{" "}
                      Account
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs font-bold text-white/25">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                onClick={continueWithGoogle}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-4 text-sm font-black text-white/75 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-xs font-black text-slate-900">
                  G
                </span>

                Continue with Google
              </button>

              <p className="mt-7 text-center text-sm text-white/40">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-black text-cyan-300 transition hover:text-cyan-200"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>
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
      <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete="off"
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
      />
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
          {icon}
        </div>

        <p className="font-black">{title}</p>
      </div>

      <p className="mt-3 text-sm leading-6 text-white/40">
        {description}
      </p>
    </div>
  );
}

function AccountTypeCard({
  selected,
  icon,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group rounded-3xl border p-5 text-left transition ${
        selected
          ? "border-cyan-300/40 bg-cyan-300/[0.08] shadow-[0_0_35px_rgba(34,211,238,0.06)]"
          : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
            selected
              ? "bg-cyan-300/15 text-cyan-200"
              : "bg-white/[0.05] text-white/50"
          }`}
        >
          {icon}
        </div>

        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
            selected
              ? "border-cyan-300 bg-cyan-300 text-[#04111c]"
              : "border-white/20"
          }`}
        >
          {selected && <Check className="h-3 w-3" />}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-white/40">
        {description}
      </p>

      {selected && (
        <p className="mt-4 text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
          Selected
        </p>
      )}
    </button>
  );
}

function PasswordCheck({
  valid,
  label,
}: {
  valid: boolean;
  label: string;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-center text-[10px] font-bold ${
        valid
          ? "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200"
          : "border-white/10 bg-white/[0.02] text-white/30"
      }`}
    >
      {label}
    </div>
  );
}