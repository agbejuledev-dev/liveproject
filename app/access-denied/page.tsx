"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071f1f] px-5 py-16 text-white">
      <style jsx>{`
        @keyframes accessGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 46px 46px;
          }
        }

        @keyframes accessGlow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.5;
            transform: scale(1.04);
          }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.07) 1px, transparent 1px)",
          backgroundSize: "46px 46px",
          animation: "accessGrid 18s linear infinite",
        }}
      />

      <div
        className="absolute -right-20 top-10 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl"
        style={{
          animation: "accessGlow 7s ease-in-out infinite",
        }}
      />

      <section className="relative w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-7 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-300">
          <LockKeyhole size={29} />
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-200">
          <ShieldAlert size={12} />
          Access Required
        </div>

        <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
          You do not have access to this area.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
          This LiveProject area requires the correct account role or Premium
          access. Return to your dashboard or continue through the appropriate
          access flow.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/workspace"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-300 px-5 py-3.5 text-xs font-black text-slate-950 transition hover:bg-teal-200"
          >
            Dashboard
            <ArrowRight size={15} />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-xs font-black text-white transition hover:bg-white/10"
          >
            <ArrowLeft size={15} />
            Back Home
          </Link>
        </div>
      </section>
    </main>
  );
}