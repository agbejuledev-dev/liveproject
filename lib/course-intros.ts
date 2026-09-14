export type CourseIntroVideo = {
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
};

const courseIntros: Record<string, CourseIntroVideo> = {
  "Frontend Development Foundations": {
    title: "Welcome to Frontend Development Foundations",
    description:
      "In this short introduction, you'll learn what frontend development is, what you'll build throughout the course, the skills you'll develop, and how the learning journey works.",
    videoUrl: "/videos/courses/frontend-development-foundations-intro.mp4",
    duration: "2:15",
  },

  "Product Management Foundations": {
    title: "Welcome to Product Management Foundations",
    description:
      "Get a clear overview of product management, what product managers actually do, the skills you'll develop, and how this course will prepare you for practical product work.",
    videoUrl: "/videos/courses/product-management-foundations-intro.mp4",
    duration: "2:20",
  },

  "UI/UX Design Foundations": {
    title: "Welcome to UI/UX Design Foundations",
    description:
      "Discover how designers understand users, solve problems, create interfaces, and turn ideas into meaningful digital experiences.",
    videoUrl: "/videos/courses/ui-ux-design-foundations-intro.mp4",
    duration: "2:10",
  },

  "Business Analysis Foundations": {
    title: "Welcome to Business Analysis Foundations",
    description:
      "This introduction explains the role of a business analyst, the problems you'll learn to solve, the techniques you'll practice, and what you can expect from the course.",
    videoUrl: "/videos/courses/business-analysis-foundations-intro.mp4",
    duration: "2:20",
  },

  "Data & Analytics Foundations": {
    title: "Welcome to Data & Analytics Foundations",
    description:
      "Learn what modern data and analytics work looks like, what you'll learn throughout the course, and how you'll turn data into useful business insights.",
    videoUrl: "/videos/courses/data-analytics-foundations-intro.mp4",
    duration: "2:25",
  },

  "Digital Marketing Foundations": {
    title: "Welcome to Digital Marketing Foundations",
    description:
      "Get introduced to digital marketing, customer acquisition, content, social media, campaigns, analytics, and the practical skills you'll build.",
    videoUrl: "/videos/courses/digital-marketing-foundations-intro.mp4",
    duration: "2:15",
  },

  "Mobile Development Foundations": {
    title: "Welcome to Mobile Development Foundations",
    description:
      "Understand how mobile applications are planned, designed, developed, tested, and prepared for real users.",
    videoUrl: "/videos/courses/mobile-development-foundations-intro.mp4",
    duration: "2:20",
  },

  "Cybersecurity Foundations": {
    title: "Welcome to Cybersecurity Foundations",
    description:
      "This introduction gives you an overview of cybersecurity, common security challenges, defensive thinking, and what you'll learn during the course.",
    videoUrl: "/videos/courses/cybersecurity-foundations-intro.mp4",
    duration: "2:25",
  },
};

export function getCourseIntro(
  courseTitle: string,
): CourseIntroVideo | null {
  return courseIntros[courseTitle] ?? null;
}