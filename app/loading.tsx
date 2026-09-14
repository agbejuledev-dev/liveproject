"use client";

import { Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#061f1e]">
      <style jsx>{`
        @keyframes loaderGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes loaderPulse {
          0%,
          100% {
            transform: scale(0.92);
            opacity: 0.35;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.7;
          }
        }

        @keyframes loaderSpin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes loaderShimmer {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(120%);
          }
        }
      `}</style>

      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(45,212,191,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,191,.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          animation: "loaderGrid 16s linear infinite",
        }}
      />

      <div
        className="absolute h-72 w-72 rounded-full bg-teal-400/20 blur-3xl"
        style={{ animation: "loaderPulse 4s ease-in-out infinite" }}
      />

      <div className="relative flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-[1.7rem] bg-teal-300 text-slate-950 shadow-2xl shadow-teal-500/20">
          <Sparkles size={31} />

          <div
            className="absolute inset-[-8px] rounded-[1.9rem] border border-teal-300/30 border-t-teal-200"
            style={{ animation: "loaderSpin 1.4s linear infinite" }}
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-black tracking-tight text-white">
            LiveProject
          </p>

          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.22em] text-teal-300">
            Preparing your workspace
          </p>
        </div>

        <div className="mt-7 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full w-1/2 rounded-full bg-teal-300"
            style={{
              animation: "loaderShimmer 1.2s ease-in-out infinite",
            }}
          />
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Loading LiveProject...
        </p>
      </div>
    </main>
  );
}