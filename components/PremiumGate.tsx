"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import {
  getLiveProjectSession,
  isLoggedIn,
  isPremiumUser,
  saveAfterAuthDestination,
  saveAfterUpgradeDestination,
} from "@/lib/access";

type PremiumGateProps = {
  children: ReactNode;
  featureName?: string;
  destination?: string;
  compact?: boolean;
};

export default function PremiumGate({
  children,
  featureName = "this Premium feature",
  destination,
  compact = false,
}: PremiumGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [premium, setPremium] = useState(false);

  useEffect(() => {
    const session = getLiveProjectSession();

    setLoggedIn(isLoggedIn());
    setPremium(isPremiumUser());
    setReady(true);

    if (
      session?.loggedIn &&
      session?.plan === "premium"
    ) {
      setPremium(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="animate-pulse rounded-2xl bg-slate-100 p-6">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-56 rounded bg-slate-200" />
      </div>
    );
  }

  if (premium) {
    return <>{children}</>;
  }

  const handleAccess = () => {
    const target =
      destination ||
      (typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : "/premium");

    if (!loggedIn) {
      saveAfterAuthDestination(target);
      router.push("/login");
      return;
    }

    saveAfterUpgradeDestination(target);
    router.push("/premium");
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleAccess}
        className="group inline-flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-black text-teal-800 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-100"
      >
        <LockKeyhole size={14} />
        Unlock Premium
        <ArrowRight
          size={13}
          className="transition group-hover:translate-x-0.5"
        />
      </button>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <Sparkles size={21} />
        </div>

        <div className="mt-5 flex items-center gap-2">
          <LockKeyhole size={15} className="text-slate-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            Premium
          </span>
        </div>

        <h3 className="mt-2 text-xl font-black tracking-tight text-slate-950">
          Unlock {featureName}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {loggedIn
            ? "Upgrade your LiveProject account to unlock this career feature."
            : "Create your LiveProject account first, then upgrade to unlock this career feature."}
        </p>

        <button
          type="button"
          onClick={handleAccess}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          {loggedIn ? "Upgrade to Premium" : "Create Account"}
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}