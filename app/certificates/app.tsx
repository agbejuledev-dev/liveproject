"use client";

import { useRouter } from "next/navigation";
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function CertificatesPage() {
  const router = useRouter();

  const isPremium = false;

  if (!isPremium) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[85vh] max-w-5xl items-center justify-center">
          <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
            <button
              onClick={() => router.back()}
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100">
              <Lock className="h-9 w-9 text-slate-500" />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              PREMIUM
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Certificates are Premium
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-500">
              Earn professional LiveProject certificates that validate the
              experience and skills you build through your projects and
              learning journey.
            </p>

            <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
              {[
                "Verified project and learning achievements",
                "Professional certificate credentials",
                "Shareable career proof",
                "Strengthen your Experience Passport",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/premium")}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              Upgrade to Premium
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            <Award className="h-4 w-4" />
            VERIFIED ACHIEVEMENTS
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Your Certificates
          </h1>

          <p className="mt-2 text-slate-500">
            Your verified LiveProject learning and experience credentials.
          </p>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-8">
          <div className="flex items-center gap-4">
            <ShieldCheck className="h-10 w-10 text-blue-600" />
            <div>
              <h2 className="font-bold">Certificate centre</h2>
              <p className="text-sm text-slate-500">
                Your earned certificates will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}