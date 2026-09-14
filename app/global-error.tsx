// app/global-error.tsx

"use client";

import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function GlobalError({
  reset,
}: {
  reset: () => void;
}) {
  useEffect(() => {
    console.error("LiveProject global application error");
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#061f1e] text-white">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
          <style jsx>{`
            @keyframes globalErrorPulse {
              0%,
              100% {
                transform: scale(0.96);
                opacity: 0.25;
              }

              50% {
                transform: scale(1.04);
                opacity: 0.5;
              }
            }

            @keyframes globalErrorGrid {
              0% {
                background-position: 0 0;
              }

              100% {
                background-position: 48px 48px;
              }
            }
          `}</style>

          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(45,212,191,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.07) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              animation: "globalErrorGrid 18s linear infinite",
            }}
          />

          <div
            className="absolute h-96 w-96 rounded-full bg-red-400/10 blur-3xl"
            style={{
              animation:
                "globalErrorPulse 5s ease-in-out infinite",
            }}
          />

          <section className="relative w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-7 text-center shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400/10 text-red-300">
              <AlertTriangle size={30} />
            </div>

            <div className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">
              LiveProject
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Something went wrong.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
              LiveProject ran into an unexpected problem while loading this
              page. Your account and learning progress have not been intentionally
              changed.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => reset()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-300 px-5 py-3.5 text-xs font-black text-slate-950 transition hover:bg-teal-200"
              >
                <RefreshCcw size={15} />
                Try Again
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-xs font-black text-white transition hover:bg-white/10"
              >
                <ArrowLeft size={15} />
                Back Home
              </button>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}