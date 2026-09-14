"use client";

import Link from "next/link";
import { ArrowLeft, CreditCard, RotateCcw } from "lucide-react";

export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 py-16 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
            <CreditCard className="h-7 w-7 text-amber-300" />
          </div>

          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-teal-300">
            Payment not completed
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your payment was cancelled
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300">
            No payment was completed. Your account and LiveProject access have
            not been changed.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/checkout?plan=premium"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-teal-400"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Link>

            <Link
              href="/workspace"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Workspace
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
