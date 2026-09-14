export type UserPlan = "free" | "premium";

export const FREE_COURSE_LIMIT = 2;

export const CAREER_PROFILE_ACCESS = {
  experiencePassport: {
    free: true,
    premium: true,
  },
  portfolio: {
    free: true,
    premium: true,
  },
  certificates: {
    free: false,
    premium: true,
  },
  recommendations: {
    free: false,
    premium: true,
  },
  profile: {
    free: true,
    premium: true,
  },
} as const;

export function isPremium(plan: UserPlan): boolean {
  return plan === "premium";
}

export function canAccessCareerProfileItem(
  item:
    | "experiencePassport"
    | "portfolio"
    | "certificates"
    | "recommendations"
    | "profile",
  plan: UserPlan
): boolean {
  return CAREER_PROFILE_ACCESS[item][plan];
}

export function canAccessCourse(
  courseIndex: number,
  plan: UserPlan
): boolean {
  if (plan === "premium") {
    return true;
  }

  return courseIndex < FREE_COURSE_LIMIT;
}

export function hasReachedFreeCourseLimit(
  completedOrEnrolledCourses: number,
  plan: UserPlan
): boolean {
  if (plan === "premium") {
    return false;
  }

  return completedOrEnrolledCourses >= FREE_COURSE_LIMIT;
}