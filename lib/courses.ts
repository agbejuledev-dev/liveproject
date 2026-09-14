export type CourseAccess = "free" | "premium";

export type CourseLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

export type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  level: CourseLevel;
  access: CourseAccess;
  duration: string;
  instructor: string;
  skills: string[];
  modules: number;

  /**
   * Short introduction video explaining:
   * - what the course is
   * - what the learner will learn
   * - what benefit they get from completing it
   */
  introVideoUrl?: string;

  /**
   * Optional thumbnail/poster for the introduction video.
   */
  introVideoPoster?: string;

  /**
   * Short benefit statement shown beside the video.
   */
  introVideoDescription?: string;
};

const courses: Course[] = [
  {
    id: "agile-foundations",
    title: "Agile Foundations",
    description:
      "Understand Agile principles, Scrum fundamentals, iterative delivery and how modern teams organise real-world work.",
    category: "Agile & Delivery",
    level: "Beginner",
    access: "free",
    duration: "3 hours",
    instructor: "LiveProject Academy",
    skills: [
      "Agile",
      "Scrum",
      "Sprint Planning",
      "Backlog Management",
    ],
    modules: 7,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Get a quick overview of Agile Foundations, what you will learn and how these skills can help you contribute confidently to modern delivery teams.",
  },

  {
    id: "scrum-master-foundations",
    title: "Scrum Master Foundations",
    description:
      "Learn the responsibilities, ceremonies, facilitation techniques and delivery practices behind effective Scrum teams.",
    category: "Agile & Delivery",
    level: "Intermediate",
    access: "premium",
    duration: "5 hours",
    instructor: "LiveProject Academy",
    skills: [
      "Scrum",
      "Facilitation",
      "Sprint Planning",
      "Retrospectives",
      "Stakeholder Management",
    ],
    modules: 9,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Discover what Scrum Masters actually do, how this course prepares you for practical delivery work and how you can turn the knowledge into portfolio evidence.",
  },

  {
    id: "product-management",
    title: "Product Management Essentials",
    description:
      "Learn how product managers identify problems, define outcomes, prioritise work and collaborate with delivery teams.",
    category: "Product",
    level: "Beginner",
    access: "free",
    duration: "4 hours",
    instructor: "LiveProject Academy",
    skills: [
      "Product Discovery",
      "Roadmapping",
      "Prioritisation",
      "User Stories",
      "Product Strategy",
    ],
    modules: 8,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Understand what product management involves, what you will practise in this course and how the skills translate into real product work.",
  },

  {
    id: "business-analysis",
    title: "Business Analysis Foundations",
    description:
      "Build practical business analysis skills including requirements gathering, stakeholder analysis, process mapping and documentation.",
    category: "Business Analysis",
    level: "Beginner",
    access: "free",
    duration: "4 hours",
    instructor: "LiveProject Academy",
    skills: [
      "Requirements",
      "Stakeholder Analysis",
      "Process Mapping",
      "Documentation",
      "Analysis",
    ],
    modules: 8,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "See how business analysts create clarity between business problems and technology solutions, and why these skills are valuable across industries.",
  },

  {
    id: "frontend-development",
    title: "Modern Frontend Development",
    description:
      "Build a strong foundation in modern frontend development using HTML, CSS, JavaScript, React and practical project work.",
    category: "Technology",
    level: "Intermediate",
    access: "premium",
    duration: "8 hours",
    instructor: "LiveProject Academy",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Responsive Design",
    ],
    modules: 12,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Learn what modern frontend development involves, what you'll build throughout the course and how the resulting skills translate into professional opportunities.",
  },

  {
    id: "project-management",
    title: "Project Management Essentials",
    description:
      "Learn how projects are initiated, planned, monitored and delivered while managing stakeholders, scope, risks and dependencies.",
    category: "Project Management",
    level: "Beginner",
    access: "free",
    duration: "5 hours",
    instructor: "LiveProject Academy",
    skills: [
      "Project Planning",
      "Risk Management",
      "Stakeholders",
      "Delivery",
      "Governance",
    ],
    modules: 9,
    introVideoUrl: "",
    introVideoPoster: "",
    introVideoDescription:
      "Understand the fundamentals of project management and how this course helps you build practical delivery skills you can demonstrate in real projects.",
  },
];

export const allCourses = courses;

export function getCourseById(id: string) {
  return allCourses.find((course) => course.id === id);
}
export const getCourse = getCourseById;

