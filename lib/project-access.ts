"use client";

export type UserPlan = "free" | "premium";

export function getUserSession(): {
  loggedIn: boolean;
  plan: UserPlan;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem("liveproject_session");

    if (!raw) {
      return null;
    }

    const session = JSON.parse(raw);

    if (!session?.loggedIn) {
      return null;
    }

    return {
      loggedIn: true,
      plan: session.plan === "premium" ? "premium" : "free",
    };
  } catch {
    return null;
  }
}

export function requireProjectAccess(): {
  allowed: boolean;
  reason: "authenticated" | "unauthenticated";
  plan: UserPlan | null;
} {
  const session = getUserSession();

  if (!session?.loggedIn) {
    return {
      allowed: false,
      reason: "unauthenticated",
      plan: null,
    };
  }

  return {
    allowed: true,
    reason: "authenticated",
    plan: session.plan,
  };
}