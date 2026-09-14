export type ProjectAccess = "free" | "premium";
export type ProjectFormat = "Solo" | "Team";

export type Project = {
  id: number;
  title: string;
  company: string;
  track: string;
  level: string;
  access: ProjectAccess;
  duration: string;
  format: ProjectFormat;
  description: string;
  skills: string[];
  deliverables: string[];
};

export const tracks = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Data & Analytics",
  "Digital Marketing",
  "Business Analysis",
  "Product Management",
  "Cybersecurity",
];

export const levels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Professional",
];

const companies = [
  "Nova Labs",
  "FinFlow",
  "MediConnect",
  "GrowthLab",
  "DataBridge",
  "SecureAxis",
  "LogiCore",
  "PayFlow",
  "CloudCore",
  "MarketSphere",
  "HealthStack",
  "RetailX",
  "InsightWorks",
  "TechNova",
  "Orbit Systems",
  "Vertex Labs",
  "BrightPath",
  "CoreBridge",
  "ScalePoint",
  "FutureWorks",
];

const projectThemes: Record<string, string[]> = {
  "Web Development": [
    "E-commerce Platform",
    "Fintech Dashboard",
    "Healthcare Booking Platform",
    "Learning Management System",
    "Real Estate Marketplace",
    "Restaurant Ordering System",
    "Event Management Platform",
    "Logistics Tracking Platform",
    "SaaS Analytics Dashboard",
    "Customer Support Portal",
  ],

  "Mobile Development": [
    "Mobile Banking App",
    "Fitness Tracking App",
    "Food Delivery App",
    "Healthcare Companion App",
    "Travel Planner App",
    "Expense Management App",
    "Learning Mobile App",
    "Social Community App",
    "Delivery Driver App",
    "Personal Finance App",
  ],

  "UI/UX Design": [
    "Fintech Experience Redesign",
    "Healthcare App Redesign",
    "E-commerce UX System",
    "SaaS Dashboard Design",
    "Travel Booking Experience",
    "Education Platform Design",
    "Banking Mobile Experience",
    "Restaurant Ordering Experience",
    "Real Estate UX System",
    "Product Onboarding Experience",
  ],

  "Data & Analytics": [
    "Customer Analytics Platform",
    "Sales Performance Dashboard",
    "Marketing Analytics System",
    "Financial Reporting Dashboard",
    "Healthcare Analytics Platform",
    "Operations Intelligence Dashboard",
    "Product Analytics System",
    "Supply Chain Analytics",
    "Customer Retention Analysis",
    "Business Intelligence Portal",
  ],

  "Digital Marketing": [
    "Brand Growth Strategy",
    "Social Media Growth Campaign",
    "SEO Growth Strategy",
    "Content Marketing Campaign",
    "Email Marketing Campaign",
    "Product Launch Campaign",
    "Lead Generation Strategy",
    "Influencer Campaign",
    "Digital Brand Audit",
    "Conversion Growth Campaign",
  ],

  "Business Analysis": [
    "Fintech Process Analysis",
    "Healthcare Requirements Analysis",
    "E-commerce Process Improvement",
    "Customer Journey Analysis",
    "Operations Process Mapping",
    "SaaS Requirements Discovery",
    "Business Performance Analysis",
    "Digital Transformation Analysis",
    "Market Expansion Analysis",
    "Workflow Optimization Study",
  ],

  "Product Management": [
    "Fintech Product Strategy",
    "Healthcare Product Roadmap",
    "E-commerce Product Growth",
    "SaaS Product Discovery",
    "Mobile Product Strategy",
    "Customer Experience Roadmap",
    "Product Launch Strategy",
    "Marketplace Product Strategy",
    "Product Analytics Strategy",
    "B2B Product Development Plan",
  ],

  Cybersecurity: [
    "Application Security Review",
    "Cloud Security Assessment",
    "Security Awareness Programme",
    "Vulnerability Assessment",
    "Incident Response Plan",
    "Identity Access Review",
    "API Security Assessment",
    "Network Security Review",
    "Data Protection Assessment",
    "Security Risk Assessment",
  ],
};

const skillSets: Record<string, string[]> = {
  "Web Development": [
    "React",
    "Next.js",
    "TypeScript",
    "REST APIs",
  ],

  "Mobile Development": [
    "React Native",
    "TypeScript",
    "Mobile UI",
    "APIs",
  ],

  "UI/UX Design": [
    "Figma",
    "UX Research",
    "Wireframing",
    "Prototyping",
  ],

  "Data & Analytics": [
    "SQL",
    "Excel",
    "Power BI",
    "Data Visualization",
  ],

  "Digital Marketing": [
    "SEO",
    "Analytics",
    "Content",
    "Campaign Strategy",
  ],

  "Business Analysis": [
    "Requirements",
    "Process Mapping",
    "User Stories",
    "BPMN",
  ],

  "Product Management": [
    "Product Strategy",
    "Roadmapping",
    "Analytics",
    "Agile",
  ],

  Cybersecurity: [
    "Risk Assessment",
    "Security Testing",
    "Threat Modeling",
    "Security Controls",
  ],
};

export function generateProjects(): Project[] {
  const result: Project[] = [];
  let id = 1;

  tracks.forEach((track) => {
    const themes = projectThemes[track];
    const skills = skillSets[track];

    for (let i = 0; i < 50; i++) {
      const theme = themes[i % themes.length];
      const company = companies[i % companies.length];

      const level =
        i < 12
          ? "Beginner"
          : i < 30
            ? "Intermediate"
            : i < 44
              ? "Advanced"
              : "Professional";

      const access: ProjectAccess =
        i >= 10 ? "premium" : "free";

      result.push({
        id,
        title: `${theme} ${i + 1}`,
        company,
        track,
        level,
        access,
        duration:
          i % 3 === 0
            ? "2 weeks"
            : i % 3 === 1
              ? "3 weeks"
              : "4 weeks",
        format: i % 4 === 0 ? "Team" : "Solo",

        description: `Work on a practical ${track.toLowerCase()} challenge for ${company}. Analyse the problem, create a professional solution, document your decisions, and submit your work for review.`,

        skills: skills.map((skill, index) =>
          i % 4 === index
            ? `${skill} Advanced`
            : skill
        ),

        deliverables: [
          "Project brief analysis",
          "Professional solution",
          "Documentation",
          "Final presentation",
        ],
      });

      id++;
    }
  });

  return result;
}

export const allProjects = generateProjects();

export function getProjectById(
  projectId: number
): Project | undefined {
  return allProjects.find(
    (project) => project.id === projectId
  );
}