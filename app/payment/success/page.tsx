"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setLoading(false);
      }, 1500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#07111f] px-6 text-white flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
        {loading ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-400" />

            <h1 className="mt-6 text-3xl font-bold">
              Confirming your Premium access...
            </h1>

            <p className="mt-3 text-slate-400">
              Your payment is being verified securely.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-9 w-9 text-emerald-400" />
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Welcome to Premium.
            </h1>

            <p className="mt-3 text-slate-400">
              Your subscription has been received.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/workspace";
              }}
              className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </main>
  );
}
