// app/not-found.tsx

import Link from "next/link";
import { ArrowLeft, ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061f1e] px-5 py-16 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <section className="relative w-full max-w-xl rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-300 text-slate-950 shadow-xl">
          <Compass size={30} />
        </div>

        <p className="mt-7 text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
          LiveProject
        </p>

        <h1 className="mt-3 text-6xl font-black tracking-[-0.06em] sm:text-7xl">
          404
        </h1>

        <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
          Page not found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
          The page you're looking for doesn't exist, may have moved, or is no
          longer available.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-300 px-5 py-3.5 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-200"
          >
            <ArrowLeft size={15} />
            Back Home
          </Link>

          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-xs font-black text-white transition hover:bg-white/10"
          >
            Explore Projects
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}