"use client";

import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      try {
        const registration = JSON.parse(
          sessionStorage.getItem(
            "liveproject_registration"
          ) || "null"
        );

        if (
          registration?.email &&
          registration.email.toLowerCase() !== trimmedEmail
        ) {
          setError(
            "No LiveProject account was found with that email address."
          );
          setLoading(false);
          return;
        }

        sessionStorage.setItem(
          "liveproject_reset_email",
          trimmedEmail
        );

        router.push("/reset-otp");
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }, 650);
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
                Account recovery
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Reset your password
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
                Enter your LiveProject email address and we&apos;ll
                send you a verification code.
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
              <div>
                <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                  Email address
                </label>

                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Checking..."
                ) : (
                  <>
                    Continue
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
                    Secure account recovery
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    You&apos;ll need to verify ownership of the email
                    account before creating a new password.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-sm text-white/35">
              Remember your password?{" "}
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