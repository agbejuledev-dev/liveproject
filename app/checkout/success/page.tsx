"use client";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Route,
  Sparkles,
  Target,
} from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#061d1d] px-5 text-white">
      <style jsx global>{`
        @keyframes successGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes successGlow {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(0.96);
          }

          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.055) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "successGrid 18s linear infinite",
        }}
      />

      <div
        className="absolute right-[-80px] top-10 h-96 w-96 rounded-full bg-teal-400/15 blur-3xl"
        style={{ animation: "successGlow 6s ease-in-out infinite" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center py-16">
        <div className="w-full text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-teal-400 text-slate-950 shadow-2xl shadow-teal-400/20">
            <CheckCircle2 size={46} />
          </div>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-teal-300">
            Premium Activated
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Welcome to LiveProject Premium.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Your Premium career workspace is now active. You can start using
            the full opportunity, AI and career-development experience.
          </p>

          <div className="mx-auto mt-9 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: BriefcaseBusiness,
                title: "UK Jobs",
              },
              {
                icon: Sparkles,
                title: "AI Job Matches",
              },
              {
                icon: Target,
                title: "Job Readiness",
              },
              {
                icon: FileText,
                title: "CV Review",
              },
              {
                icon: Route,
                title: "Career Roadmap",
              },
              {
                icon: BadgeCheck,
                title: "Premium Evidence",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/10 text-teal-300">
                    <Icon size={18} />
                  </div>

                  <span className="text-sm font-bold">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/premium-dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-400 px-6 py-3.5 text-sm font-black text-slate-950"
            >
              Enter Premium Dashboard
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/uk-job-board"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white"
            >
              Start Exploring Jobs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}