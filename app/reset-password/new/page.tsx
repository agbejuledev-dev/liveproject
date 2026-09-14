"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verified =
      sessionStorage.getItem("liveproject_reset_verified");

    const email = sessionStorage.getItem(
      "liveproject_reset_email"
    );

    if (verified !== "true" || !email) {
      router.replace("/reset-password");
    }
  }, [router]);

  const checks = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      match:
        password.length > 0 &&
        confirmPassword.length > 0 &&
        password === confirmPassword,
    }),
    [password, confirmPassword]
  );

  const valid =
    checks.length &&
    checks.uppercase &&
    checks.number &&
    checks.match;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!valid) {
      setError(
        "Please create a valid password and make sure both passwords match."
      );
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      try {
        const email =
          sessionStorage.getItem("liveproject_reset_email");

        const registrationRaw =
          sessionStorage.getItem(
            "liveproject_registration"
          );

        if (!email) {
          router.replace("/reset-password");
          return;
        }

        const registration = registrationRaw
          ? JSON.parse(registrationRaw)
          : null;

        /*
         * Prototype persistence:
         * In production this must be replaced by a server-side
         * password reset flow with hashed passwords.
         */
        if (
          registration &&
          registration.email?.toLowerCase() ===
            email.toLowerCase()
        ) {
          sessionStorage.setItem(
            "liveproject_registration",
            JSON.stringify({
              ...registration,
              password,
            })
          );
        }

        sessionStorage.removeItem(
          "liveproject_reset_verified"
        );

        sessionStorage.removeItem(
          "liveproject_reset_email"
        );

        sessionStorage.removeItem(
          "liveproject_session"
        );

        router.push("/login?reset=success");
      } catch {
        setError(
          "Unable to reset your password. Please try again."
        );
        setLoading(false);
      }
    }, 700);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06101d] text-white">
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

          <div className="w-[96px]" />
        </div>
      </header>

      <section className="relative z-10 flex min-h-[calc(100vh-81px)] items-center px-5 py-12 sm:px-8">
        <div className="mx-auto w-full max-w-xl">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-9">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                <KeyRound className="h-8 w-8" />
              </div>

              <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                New password
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Create a new password
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
                Choose a strong password you&apos;ll use the next time
                you sign in.
              </p>
            </div>

            {error && (
              <div className="mt-7 rounded-2xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-200">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <PasswordField
                label="New password"
                value={password}
                show={showPassword}
                onChange={setPassword}
                onToggle={() =>
                  setShowPassword((current) => !current)
                }
                placeholder="Create a strong password"
              />

              <PasswordField
                label="Confirm new password"
                value={confirmPassword}
                show={showConfirmPassword}
                onChange={setConfirmPassword}
                onToggle={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                placeholder="Enter the password again"
              />

              <div className="grid gap-2 sm:grid-cols-2">
                <PasswordCheck
                  valid={checks.length}
                  label="8+ characters"
                />

                <PasswordCheck
                  valid={checks.uppercase}
                  label="Uppercase letter"
                />

                <PasswordCheck
                  valid={checks.number}
                  label="Contains a number"
                />

                <PasswordCheck
                  valid={checks.match}
                  label="Passwords match"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !valid}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? (
                  "Updating password..."
                ) : (
                  <>
                    Save New Password
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <div>
                  <p className="text-sm font-black">
                    Use a unique password
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Avoid reusing passwords from other services.
                    A strong, unique password helps protect your
                    LiveProject account.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-sm text-white/35">
              Remembered your password?{" "}
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
      </section>
    </main>
  );
}

function PasswordField({
  label,
  value,
  show,
  onChange,
  onToggle,
  placeholder,
}: {
  label: string;
  value: string;
  show: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
        {label}
      </label>

      <div className="relative mt-2">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
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
      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold ${
        valid
          ? "border-emerald-300/20 bg-emerald-300/[0.06] text-emerald-200"
          : "border-white/10 bg-white/[0.02] text-white/30"
      }`}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full">
        {valid && <Check className="h-3.5 w-3.5" />}
      </span>

      {label}
    </div>
  );
}