"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSending(true);

    setTimeout(() => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      sessionStorage.setItem("liveproject_reset_email", normalizedEmail);
      sessionStorage.setItem("liveproject_reset_otp", otp);
      sessionStorage.removeItem("liveproject_reset_verified");

      setSending(false);
      setSent(true);

      setTimeout(() => {
        router.push("/reset-otp");
      }, 900);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#0757d8] p-10 text-white lg:flex lg:min-h-screen lg:flex-col lg:justify-between">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0757d8] shadow-lg">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-black tracking-tight">
              LiveProject
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
            <ShieldCheck size={16} />
            Secure account recovery
          </div>

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight">
            Your account,
            <br />
            safely back
            <br />
            in your hands.
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-8 text-blue-100">
            We verify your identity before allowing a password reset. Your
            security comes first at LiveProject.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <Mail size={21} />
              <p className="mt-4 font-bold">Email verification</p>
              <p className="mt-1 text-sm leading-6 text-blue-100">
                A secure verification code is sent to your email.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <LockKeyhole size={21} />
              <p className="mt-4 font-bold">Protected reset</p>
              <p className="mt-1 text-sm leading-6 text-blue-100">
                Password creation is unlocked only after verification.
              </p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-blue-100">
          Learn. Work on Live Projects. Build Verified Experience. Get Hired.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => router.push("/login")}
            className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft size={17} />
            Back to login
          </button>

          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0757d8] text-white">
                <Sparkles size={19} />
              </div>
              <span className="text-xl font-black text-slate-950">
                LiveProject
              </span>
            </div>
          </div>

          {!sent ? (
            <>
              <div className="mb-9">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0757d8]">
                  <LockKeyhole size={26} />
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-950">
                  Forgot your password?
                </h2>

                <p className="mt-3 text-base leading-7 text-slate-500">
                  Enter the email connected to your LiveProject account and
                  we&apos;ll send you a verification code.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0757d8] focus:ring-4 focus:ring-blue-50"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#0757d8] text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#064bc0] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending code...
                    </>
                  ) : (
                    <>
                      Send verification code
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-[#0757d8]"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Why do we need this?
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Resetting your password requires a one-time verification
                      code. You won&apos;t be able to access the password reset
                      screen until your code is verified.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={40} />
              </div>

              <h2 className="mt-7 text-3xl font-black tracking-tight text-slate-950">
                Code sent
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-500">
                We&apos;ve sent a verification code to{" "}
                <span className="font-bold text-slate-800">{email}</span>.
              </p>

              <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-left">
                <p className="text-sm font-bold text-[#0757d8]">
                  Next step
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Enter the six-digit code on the next screen to continue
                  securely.
                </p>
              </div>

              <div className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#0757d8]" />
                Opening verification...
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}