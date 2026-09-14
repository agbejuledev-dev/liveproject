"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetOtpPage() {
  const router = useRouter();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(45);

  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem(
      "liveproject_reset_email"
    );

    if (!savedEmail) {
      router.replace("/reset-password");
      return;
    }

    setEmail(savedEmail);
  }, [router]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [seconds]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);

    setCode((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (
      event.key === "Backspace" &&
      !code[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handlePaste(
    event: React.ClipboardEvent<HTMLInputElement>
  ) {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const next = ["", "", "", "", "", ""];

    pasted.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setCode(next);

    inputs.current[Math.min(pasted.length, 5)]?.focus();
  }

  function handleVerify(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const otp = code.join("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    window.setTimeout(() => {
      sessionStorage.setItem(
        "liveproject_reset_verified",
        "true"
      );

      router.push("/reset-password/new");
    }, 650);
  }

  function resendCode() {
    if (seconds > 0) return;

    setCode(["", "", "", "", "", ""]);
    setError("");
    setResent(true);
    setSeconds(45);

    inputs.current[0]?.focus();

    window.setTimeout(() => {
      setResent(false);
    }, 2500);
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
                Verify password reset
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Enter your code
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
                Enter the 6-digit code sent to
              </p>

              <p className="mt-2 break-all text-sm font-black text-white/80">
                {email || "your email address"}
              </p>
            </div>

            {error && (
              <div className="mt-7 rounded-2xl border border-red-300/15 bg-red-300/[0.06] px-4 py-3 text-sm leading-6 text-red-200">
                {error}
              </div>
            )}

            {resent && (
              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.06] px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                A new reset code has been sent.
              </div>
            )}

            <form onSubmit={handleVerify} className="mt-8">
              <div className="flex justify-center gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      inputs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) =>
                      updateDigit(index, event.target.value)
                    }
                    onKeyDown={(event) =>
                      handleKeyDown(index, event)
                    }
                    onPaste={handlePaste}
                    inputMode="numeric"
                    maxLength={1}
                    aria-label={`Reset code digit ${index + 1}`}
                    className="h-14 w-11 rounded-2xl border border-white/10 bg-black/10 text-center text-xl font-black text-white outline-none transition focus:border-cyan-300/50 focus:bg-white/[0.04] sm:h-16 sm:w-14"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  "Verifying..."
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-white/35">
                Didn&apos;t receive the code?
              </p>

              <button
                type="button"
                onClick={resendCode}
                disabled={seconds > 0}
                className="mt-2 inline-flex items-center gap-2 text-sm font-black text-cyan-300 transition hover:text-cyan-200 disabled:cursor-not-allowed disabled:text-white/25"
              >
                <RefreshCw className="h-4 w-4" />

                {seconds > 0
                  ? `Resend code in ${seconds}s`
                  : "Resend reset code"}
              </button>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />

                <div>
                  <p className="text-sm font-black">
                    Keep your account secure
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Never share a verification code with another person.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-7 text-center text-xs leading-5 text-white/25">
              Wrong email?{" "}
              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                className="font-bold text-white/50 transition hover:text-white"
              >
                Change it
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}