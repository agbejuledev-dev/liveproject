export type LiveProjectSession = {
  loggedIn?: boolean;
  plan?: "free" | "premium";
};

export function getLiveProjectSession(): LiveProjectSession | null {
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

export function isLoggedIn() {
  return Boolean(getLiveProjectSession()?.loggedIn);
}

export function isPremiumUser() {
  return getLiveProjectSession()?.plan === "premium";
}

export function hasCompletedOnboarding() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const onboardingRaw = sessionStorage.getItem(
      "liveproject_onboarding"
    );

    if (!onboardingRaw) {
      return false;
    }

    const onboarding = JSON.parse(onboardingRaw);

    if (!onboarding) {
      return false;
    }

    const requiredFields = [
      onboarding.firstName,
      onboarding.lastName,
      onboarding.country,
      onboarding.careerTrack,
      onboarding.experienceLevel,
      onboarding.currentStatus,
      onboarding.workPreference,
    ];

    return requiredFields.every(
      (value) =>
        typeof value === "string" && value.trim().length > 0
    );
  } catch {
    return false;
  }
}

export function getAfterAuthDestination() {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem("liveproject_after_auth");
}

export function saveAfterAuthDestination(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    "liveproject_after_auth",
    path
  );
}

export function clearAfterAuthDestination() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem("liveproject_after_auth");
}

export function getAfterUpgradeDestination() {
  if (typeof window === "undefined") {
    return null;
  }

  return sessionStorage.getItem(
    "liveproject_after_upgrade"
  );
}

export function saveAfterUpgradeDestination(path: string) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(
    "liveproject_after_upgrade",
    path
  );
}

export function clearAfterUpgradeDestination() {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(
    "liveproject_after_upgrade"
  );
}