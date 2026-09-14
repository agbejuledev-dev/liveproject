"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      try {
        const registration = JSON.parse(
          sessionStorage.getItem("liveproject_registration") || "null"
        );

        if (!registration) {
          setError(
            "No LiveProject account was found. Please create an account first."
          );
          setLoading(false);
          return;
        }

        if (
          registration.email?.toLowerCase() !== email.trim().toLowerCase()
        ) {
          setError("No account was found with this email address.");
          setLoading(false);
          return;
        }

        if (registration.password && registration.password !== password) {
          setError("The password you entered is incorrect.");
          setLoading(false);
          return;
        }

        const session = {
          loggedIn: true,
          plan: "free" as const,
          email: registration.email,
          firstName: registration.firstName || "",
          lastName: registration.lastName || "",
          country: registration.country || "",
          role: registration.role || "professional",
          loggedInAt: new Date().toISOString(),
        };

        sessionStorage.setItem(
          "liveproject_session",
          JSON.stringify(session)
        );

        const afterAuth =
          sessionStorage.getItem("liveproject_after_auth") || "/workspace";

        sessionStorage.removeItem("liveproject_after_auth");

        router.push(afterAuth);
      } catch {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    }, 650);
  }

  function handleGoogleLogin() {
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      const session = {
        loggedIn: true,
        plan: "free" as const,
        provider: "google",
        loggedInAt: new Date().toISOString(),
      };

      sessionStorage.setItem(
        "liveproject_session",
        JSON.stringify(session)
      );

      const afterAuth =
        sessionStorage.getItem("liveproject_after_auth") || "/workspace";

      sessionStorage.removeItem("liveproject_after_auth");

      router.push(afterAuth);
    }, 700);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#06101d] text-white">
      {/* Continuous background effects */}
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
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
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
            onClick={() => router.push("/register")}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-2.5 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/[0.1]"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main */}
      <section className="relative z-10 flex min-h-[calc(100vh-81px)] items-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Left */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome back
            </div>

            <h1 className="mt-7 text-6xl font-black leading-[0.98] tracking-[-0.06em]">
              Continue
              <span className="block text-cyan-300">building.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-white/50">
              Pick up where you left off. Continue your projects, build
              verified experience and keep moving your career forward.
            </p>

            <div className="mt-10 space-y-4">
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Verified experience"
                description="Keep building evidence from completed LiveProject work."
              />

              <Feature
                icon={<LockKeyhole className="h-5 w-5" />}
                title="One professional profile"
                description="Your career information stays connected across the platform."
              />

              <Feature
                icon={<Sparkles className="h-5 w-5" />}
                title="AI-powered career tools"
                description="Get smarter guidance as you grow."
              />
            </div>
          </div>

          {/* Login Card */}
          <div className="mx-auto w-full max-w-xl">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
              <div className="mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <LockKeyhole className="h-7 w-7" />
                </div>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Sign in
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Welcome back to LiveProject
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  Access your dashboard, projects and professional journey.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                    Email
                  </label>

                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                      Password
                    </label>

                    <button
                      type="button"
                      onClick={() => router.push("/reset-password")}
                      className="text-xs font-bold text-cyan-300 transition hover:text-cyan-200"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative mt-2">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-white/10 bg-black/10 py-3.5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-bold text-white/25">
                  OR CONTINUE WITH
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-4 text-sm font-black text-white/75 transition hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-xs font-black text-slate-900">
                  G
                </span>
                Continue with Google
              </button>

              <p className="mt-7 text-center text-sm text-white/40">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="font-black text-cyan-300 transition hover:text-cyan-200"
                >
                  Create one
                </button>
              </p>
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-white/25">
              By continuing, you agree to LiveProject&apos;s{" "}
              <button
                type="button"
                onClick={() => router.push("/terms")}
                className="font-bold text-white/45 hover:text-white"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => router.push("/privacy")}
                className="font-bold text-white/45 hover:text-white"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
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
    <div className="flex max-w-lg items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
        {icon}
      </div>

      <div>
        <p className="font-black">{title}</p>
        <p className="mt-1 text-sm leading-6 text-white/40">{description}</p>
      </div>
    </div>
  );
}