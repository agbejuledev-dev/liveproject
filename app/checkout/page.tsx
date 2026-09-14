"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false);

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;

  const plan = params?.get("plan") || "premium";

  const isPremium = plan === "premium";

  const features = useMemo(
    () => [
      "UK Job Board",
      "AI Job Matches",
      "Saved Jobs",
      "Application Tracker",
      "AI Interview",
      "Job Readiness",
      "CV Review",
      "Career Roadmap",
      "Premium Certificates",
      "Professional Recommendations",
    ],
    []
  );

  function handleCheckout() {
    setProcessing(true);

    window.setTimeout(() => {
      const current = JSON.parse(
        sessionStorage.getItem("liveproject_session") || "{}"
      );

      sessionStorage.setItem(
        "liveproject_session",
        JSON.stringify({
          ...current,
          loggedIn: true,
          plan: "premium",
          role: current.role || "professional",
        })
      );

      sessionStorage.setItem(
        "liveproject_payment",
        JSON.stringify({
          id: `payment-${Date.now()}`,
          plan: "premium",
          amount: 99,
          currency: "USD",
          status: "success",
          paidAt: new Date().toISOString(),
        })
      );

      window.location.href = "/checkout/success";
    }, 1000);
  }

  return (
    <main className="min-h-screen bg-[#f5f8f8] text-[#10201f]">
      <style jsx global>{`
        @keyframes checkoutGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        .checkout-grid {
          background-image:
            linear-gradient(rgba(13, 148, 136, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(13, 148, 136, 0.05) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: checkoutGrid 18s linear infinite;
        }
      `}</style>

      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-[1250px] items-center justify-between px-5 py-4 lg:px-8">
          <Link
            href="/premium"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-700"
          >
            <ArrowLeft size={16} />
            Back to Premium
          </Link>

          <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-teal-700">
            <Lock size={13} />
            Secure Checkout
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-[#082c2b] text-white">
        <div className="checkout-grid absolute inset-0 opacity-70" />

        <div className="relative mx-auto max-w-[1250px] px-5 py-12 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black text-teal-200">
              <Sparkles size={14} />
              LIVEPROJECT PREMIUM
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Unlock your complete career workspace.
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              One Premium plan. All the career acceleration tools you need in
              one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1250px] gap-6 px-5 py-10 lg:grid-cols-[1fr_420px] lg:px-8">
        <div className="rounded-[2rem] border border-black/6 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <BadgeCheck size={21} />
            </div>

            <div>
              <h2 className="text-lg font-black">
                What you&apos;re unlocking
              </h2>
              <p className="text-xs text-slate-400">
                Full Premium access
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 rounded-xl bg-[#f8fbfb] px-3.5 py-3 text-xs font-bold text-slate-700"
              >
                <CheckCircle2
                  size={14}
                  className="shrink-0 text-teal-600"
                />
                {feature}
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-teal-100 bg-teal-50 p-5">
            <div className="flex items-center gap-2 text-sm font-black text-teal-800">
              <ShieldCheck size={17} />
              Built for your career journey
            </div>

            <p className="mt-2 text-sm leading-6 text-teal-900/70">
              Premium connects opportunities, preparation, evidence and career
              planning into one experience.
            </p>
          </div>
        </div>

        <div className="h-fit rounded-[2rem] border border-black/6 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">
                Plan
              </p>
              <h2 className="mt-1 text-xl font-black">
                {isPremium ? "LiveProject Premium" : "Premium"}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles size={19} />
            </div>
          </div>

          <div className="mt-7 rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Total
            </div>

            <div className="mt-1 flex items-end gap-2">
              <span className="text-5xl font-black">$99</span>
              <span className="pb-2 text-sm text-slate-400">
                Premium
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Full Premium access.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-xs font-black text-slate-600">
                Account
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-black/8 bg-slate-50 px-4 py-3">
                <UserRound size={16} className="text-slate-400" />

                <span className="text-sm font-bold text-slate-600">
                  Your LiveProject account
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-black text-slate-600">
                Payment method
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-black/8 bg-slate-50 px-4 py-3">
                <CreditCard size={16} className="text-slate-400" />

                <span className="text-sm font-bold text-slate-600">
                  Secure card checkout
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={processing}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-4 text-sm font-black text-white transition hover:bg-teal-700 disabled:cursor-wait disabled:opacity-60"
          >
            {processing ? (
              "Processing..."
            ) : (
              <>
                Complete Premium Purchase
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
            Prototype checkout. Production payment verification will be
            connected to the payment provider and server-side entitlement
            system.
          </p>
        </div>
      </section>

      <footer className="mx-auto max-w-[1250px] px-5 pb-10 text-center text-xs text-slate-400 lg:px-8">
        Secure LiveProject checkout experience.
      </footer>
    </main>
  );
}