"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061d1d] px-5 text-white">
      <style jsx global>{`
        @keyframes errorGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes errorGlow {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.62;
            transform: scale(1.05);
          }
        }

        .error-grid {
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: errorGrid 18s linear infinite;
        }
      `}</style>

      <div className="error-grid absolute inset-0 opacity-70" />

      <div
        className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-red-400/10 blur-3xl"
        style={{ animation: "errorGlow 6s ease-in-out infinite" }}
      />

      <div
        className="absolute -left-24 bottom-[-100px] h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
        style={{ animation: "errorGlow 8s ease-in-out infinite" }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-300 ring-1 ring-red-400/20">
          <AlertTriangle size={30} />
        </div>

        <p className="mt-7 text-xs font-black uppercase tracking-[0.24em] text-teal-300">
          LiveProject
        </p>

        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          Something interrupted the journey.
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          We hit an unexpected problem while loading this page. Your account
          and progress are still safe. Try the page again or return to your
          workspace.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-teal-300"
          >
            <RefreshCw size={16} />
            Try Again
          </button>

          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <Home size={16} />
            Dashboard
          </Link>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mx-auto mt-7 inline-flex items-center gap-2 text-xs font-black text-slate-500 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Go back
        </button>

        <div className="mt-10 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
          <Sparkles size={12} className="text-teal-400" />
          Learn. Work on Live Projects. Build Verified Experience. Get Hired.
        </div>
      </div>
    </main>
  );
}