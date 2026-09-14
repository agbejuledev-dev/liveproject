

export type LessonType = "lesson" | "quiz" | "practical" | "assessment";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type PracticalExercise = {
  title: string;
  brief: string;
  instructions: string[];
  deliverables: string[];
};

export type LearningLesson = {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  isPremium: boolean;
  objectives: string[];
  content: string[];
  keyTakeaways: string[];
  resources: string[];
  practical?: PracticalExercise;
  quiz?: QuizQuestion[];
  videoUrl?: string;
};

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  lessons: LearningLesson[];
};

export type CourseLearningContent = {
  courseId: string;
  courseTitle: string;
  description: string;
  learningOutcomes: string[];
  modules: LearningModule[];
  finalAssessment: LearningLesson;
};

export type CourseProgress = {
  completedLessonIds: string[];
  notes: Record<string, string>;
  quizScores: Record<string, number>;
  lastLessonId: string | null;
  startedAt: string | null;
  completedAt: string | null;
};

const quiz = (
  id: string,
  question: string,
  options: string[],
  answer: number,
  explanation: string
): QuizQuestion => ({
  id,
  question,
  options,
  answer,
  explanation,
});

const lesson = (
  id: string,
  title: string,
  content: string[],
  options: {
    premium?: boolean;
    duration?: string;
    objectives?: string[];
    keyTakeaways?: string[];
    resources?: string[];
    practical?: PracticalExercise;
    quiz?: QuizQuestion[];
  } = {}
): LearningLesson => ({
  id,
  title,
  type: "lesson",
  duration: options.duration ?? "20 min",
  isPremium: options.premium ?? false,
  objectives: options.objectives ?? [
    `Understand the core concepts behind ${title.toLowerCase()}.`,
    "Explain why the concept matters in professional work.",
    "Apply the concept to a realistic workplace problem.",
  ],
  content,
  keyTakeaways: options.keyTakeaways ?? [
    "Understand the core principle before applying the technique.",
    "Use evidence and clear reasoning when making decisions.",
    "Connect learning to a practical professional outcome.",
  ],
  resources: options.resources ?? [
    "Lesson notes",
    "Practical checklist",
    "Professional reference guide",
  ],
  practical: options.practical,
  quiz: options.quiz,
});

const quizLesson = (
  id: string,
  title: string,
  questions: QuizQuestion[],
  premium = false
): LearningLesson => ({
  id,
  title,
  type: "quiz",
  duration: "10 min",
  isPremium: premium,
  objectives: [
    "Check your understanding of the module.",
    "Identify concepts that need revision.",
    "Apply the material to professional scenarios.",
  ],
  content: [
    "This knowledge check is designed to test understanding rather than memorisation.",
    "Read every question carefully and select the answer that best represents the principle taught in this module.",
    "A score of 70% or higher is required for the activity to count as complete.",
  ],
  keyTakeaways: [
    "Use the quiz to identify gaps in your understanding.",
    "Review incorrect answers before moving forward.",
    "Apply the concepts rather than memorising definitions.",
  ],
  resources: [
    "Module notes",
    "Knowledge-check review",
    "Professional practice checklist",
  ],
  quiz: questions,
});

const practicalLesson = (
  id: string,
  title: string,
  exercise: PracticalExercise,
  premium = false
): LearningLesson => ({
  id,
  title,
  type: "practical",
  duration: "45 min",
  isPremium: premium,
  objectives: [
    "Translate theory into practical work.",
    "Produce a professional-quality deliverable.",
    "Document your reasoning and decisions.",
  ],
  content: [
    "This practical activity is designed to move you from passive learning into professional application.",
    "Treat the exercise as if it were assigned by a real manager, client, product team or project stakeholder.",
    "Your submission should be clear enough for another professional to understand what you did, why you did it and what outcome you were targeting.",
  ],
  keyTakeaways: [
    "Professional learning should produce evidence of ability.",
    "Good deliverables explain decisions, not just results.",
    "Clear documentation makes your work easier to review.",
  ],
  resources: [
    "Practical brief",
    "Submission checklist",
    "Professional documentation guide",
  ],
  practical: exercise,
});

const assessment = (
  id: string,
  courseTitle: string,
  questions: QuizQuestion[]
): LearningLesson => ({
  id,
  title: `${courseTitle} — Final Assessment`,
  type: "assessment",
  duration: "30 min",
  isPremium: true,
  objectives: [
    "Demonstrate understanding of the complete course.",
    "Apply concepts to realistic professional scenarios.",
    "Demonstrate readiness for the next stage of learning.",
  ],
  content: [
    `The final assessment evaluates your understanding of ${courseTitle}.`,
    "The assessment combines conceptual understanding, decision-making and practical judgement.",
    "Do not rush. Review the relevant modules before attempting the assessment if you are unsure about any topic.",
    "A passing score demonstrates that you have completed the learning stage. Your practical project and verified experience activities remain separate parts of the LiveProject journey.",
  ],
  keyTakeaways: [
    "Strong professionals combine knowledge with practical judgement.",
    "Assessment results should identify areas for continued improvement.",
    "Completion is the beginning of applying your skills in real project environments.",
  ],
  resources: [
    "Full course revision guide",
    "Assessment preparation checklist",
    "Professional skills checklist",
  ],
  quiz: questions,
});

const frontendModules: LearningModule[] = [
  {
    id: "frontend-m1",
    title: "Module 1 — How the Web Works",
    description:
      "Build a strong mental model of browsers, servers, HTTP, domains, hosting and modern web architecture.",
    lessons: [
      lesson(
        "frontend-m1-l1",
        "The Internet vs the Web",
        [
          "The internet is the global network infrastructure that allows computers and devices to communicate. The web is one service that operates on top of that infrastructure.",
          "When you visit a website, your browser communicates with remote systems using established networking protocols. Understanding this relationship helps frontend developers reason about what happens before a page appears on screen.",
          "A frontend application is therefore not isolated HTML and CSS. It participates in a larger system involving networks, browsers, servers, APIs, databases and third-party services.",
        ],
        {
          objectives: [
            "Differentiate the internet from the web.",
            "Describe the major components involved in loading a website.",
            "Understand where frontend development fits into a web application.",
          ],
          keyTakeaways: [
            "The internet is the underlying network.",
            "The web is a service built on internet infrastructure.",
            "Frontend applications communicate with other systems to deliver user experiences.",
          ],
        }
      ),
      lesson(
        "frontend-m1-l2",
        "Browsers and Rendering",
        [
          "A browser is more than a window that displays websites. It parses HTML, builds a document structure, processes CSS, executes JavaScript and renders pixels to the screen.",
          "HTML provides structure, CSS controls presentation and JavaScript provides behaviour. Modern frameworks such as React operate within this browser environment and help developers manage complex interfaces.",
          "Understanding rendering helps developers diagnose issues such as layout shifts, slow pages, blocked scripts and inefficient DOM updates.",
        ],
        {
          premium: true,
          objectives: [
            "Explain the role of HTML, CSS and JavaScript in rendering.",
            "Understand the browser rendering process at a high level.",
            "Recognise common causes of poor rendering performance.",
          ],
        }
      ),
      lesson(
        "frontend-m1-l3",
        "HTTP, HTTPS and APIs",
        [
          "HTTP is the protocol commonly used for communication between clients and web servers. A request typically contains a method, URL, headers and sometimes a request body.",
          "Common HTTP methods include GET for retrieving data, POST for creating data, PUT or PATCH for updating data and DELETE for removing data.",
          "APIs allow applications to communicate without exposing the implementation details of the systems behind them. A frontend may request product data from an API and then render that data in the interface.",
          "HTTPS adds encryption through TLS, protecting information while it travels between the browser and server.",
        ],
        {
          premium: true,
          objectives: [
            "Understand the purpose of HTTP.",
            "Differentiate common HTTP methods.",
            "Explain how frontend applications consume APIs.",
            "Understand why HTTPS matters.",
          ],
        }
      ),
      lesson(
        "frontend-m1-l4",
        "Domains, DNS and Hosting",
        [
          "A domain is a human-readable address used to locate a service on the internet. DNS translates domain names into information that allows clients to locate the appropriate server.",
          "Hosting provides the infrastructure needed to serve an application or website. Modern frontend applications may be deployed through platforms that automatically build and distribute applications globally.",
          "A professional frontend developer should understand the deployment chain: domain, DNS, hosting, build process, environment variables, application runtime and monitoring.",
        ],
        {
          premium: true,
          practical: {
            title: "Map the Journey of a Web Request",
            brief:
              "Create a simple technical diagram showing what happens from the moment a user enters a domain until the page appears.",
            instructions: [
              "Choose a familiar website or a project you have built.",
              "Map the browser, DNS, server or hosting platform and application.",
              "Show where HTTPS and API requests may occur.",
              "Add a short explanation for each stage.",
              "Export the final diagram as an image or PDF.",
            ],
            deliverables: [
              "Web request architecture diagram",
              "One-page explanation of the request lifecycle",
            ],
          },
        }
      ),
      quizLesson(
        "frontend-m1-q",
        "Module 1 Knowledge Check",
        [
          quiz(
            "frontend-m1-q1",
            "What is the primary role of DNS?",
            [
              "To style web pages",
              "To translate domain names into network information",
              "To execute JavaScript",
              "To store database records",
            ],
            1,
            "DNS helps translate human-readable domain names into information used to locate internet services."
          ),
          quiz(
            "frontend-m1-q2",
            "Which technology provides the structure of a web document?",
            ["CSS", "JavaScript", "HTML", "SQL"],
            2,
            "HTML defines the semantic and structural content of a web document."
          ),
          quiz(
            "frontend-m1-q3",
            "Which HTTP method is normally used to retrieve data?",
            ["GET", "POST", "DELETE", "PATCH"],
            0,
            "GET requests are commonly used to retrieve resources."
          ),
        ]
      ),
    ],
  },

  {
    id: "frontend-m2",
    title: "Module 2 — HTML and Accessible Structure",
    description:
      "Learn to build semantic, accessible and search-friendly document structures.",
    lessons: [
      lesson(
        "frontend-m2-l1",
        "HTML Document Structure",
        [
          "A well-structured HTML document gives browsers, assistive technologies and search engines meaningful information about the page.",
          "Elements such as header, nav, main, section, article, aside and footer communicate the purpose of different parts of a page.",
          "Semantic structure also makes code easier for other developers to understand and maintain.",
        ],
        {
          objectives: [
            "Understand semantic HTML.",
            "Choose appropriate structural elements.",
            "Build maintainable document structures.",
          ],
        }
      ),
      lesson(
        "frontend-m2-l2",
        "Forms and Validation",
        [
          "Forms are one of the most important interaction mechanisms on the web. A professional form should communicate what information is required, accept appropriate input types and provide useful feedback when something goes wrong.",
          "Native HTML validation provides a useful baseline, but production applications often add application-level validation as well.",
          "Validation should help users recover from mistakes rather than simply telling them that an error occurred.",
        ],
        {
          premium: true,
          practical: {
            title: "Build an Accessible Registration Form",
            brief:
              "Create a registration form that demonstrates semantic markup, labels, appropriate input types and useful validation feedback.",
            instructions: [
              "Create fields for full name, email, password and country.",
              "Associate every field with a visible label.",
              "Use appropriate HTML input types.",
              "Add required-field validation.",
              "Display clear error messages.",
              "Test the form using keyboard navigation.",
            ],
            deliverables: [
              "Working registration form",
              "Accessibility checklist",
              "Screenshot or deployed URL",
            ],
          },
        }
      ),
      lesson(
        "frontend-m2-l3",
        "Accessibility Fundamentals",
        [
          "Accessibility means designing and developing products that can be used by people with different abilities and assistive technologies.",
          "Keyboard navigation, meaningful labels, semantic elements, sufficient focus states, descriptive links and appropriate alternative text are foundational practices.",
          "Accessibility should not be treated as a final checklist. It should influence component structure and interaction decisions from the beginning of a project.",
        ],
        {
          premium: true,
          objectives: [
            "Understand the purpose of accessible interfaces.",
            "Identify common accessibility problems.",
            "Apply keyboard and semantic accessibility practices.",
          ],
        }
      ),
      lesson(
        "frontend-m2-l4",
        "SEO-Friendly HTML",
        [
          "Search engines need understandable page structure to interpret content. Semantic HTML, descriptive titles, headings, links and metadata all contribute to discoverability.",
          "Good SEO starts with useful content and clear structure. Technical optimisation should support the user's ability to understand and navigate the page.",
          "Frontend developers should understand the relationship between HTML structure, metadata, performance, accessibility and search visibility.",
        ],
        {
          premium: true,
          objectives: [
            "Understand basic technical SEO.",
            "Create logical heading structures.",
            "Use descriptive metadata and links.",
          ],
        }
      ),
      quizLesson(
        "frontend-m2-q",
        "Module 2 Knowledge Check",
        [
          quiz(
            "frontend-m2-q1",
            "Which element is most appropriate for the primary content of a page?",
            ["div", "main", "span", "b"],
            1,
            "The main element identifies the primary content of a document."
          ),
          quiz(
            "frontend-m2-q2",
            "Why should form inputs have labels?",
            [
              "Only to make the form colourful",
              "To improve accessibility and communicate the purpose of fields",
              "To increase JavaScript execution speed",
              "To replace validation",
            ],
            1,
            "Labels communicate field purpose and are particularly important for accessibility."
          ),
        ]
      ),
    ],
  },

  {
    id: "frontend-m3",
    title: "Module 3 — CSS and Responsive Interfaces",
    description:
      "Master layout, responsive design, typography and scalable styling systems.",
    lessons: [
      lesson(
        "frontend-m3-l1",
        "Selectors, Cascade and Specificity",
        [
          "CSS determines how elements are presented. The cascade decides which declarations apply when multiple rules target the same element.",
          "Specificity, source order and inheritance all influence the final result.",
          "Understanding these rules is more valuable than repeatedly adding overrides. Good CSS architecture aims to make styles predictable.",
        ],
        {
          objectives: [
            "Understand the CSS cascade.",
            "Explain specificity and inheritance.",
            "Avoid unnecessary style overrides.",
          ],
        }
      ),
      lesson(
        "frontend-m3-l2",
        "The Box Model",
        [
          "Every HTML element can be understood through the CSS box model: content, padding, border and margin.",
          "Many layout problems become easier to solve once the box model is understood. Developers should know how width, height, padding and borders interact.",
          "The box-sizing property is commonly used to create more predictable sizing behaviour.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m3-l3",
        "Flexbox and Grid",
        [
          "Flexbox is designed primarily for arranging elements along one dimension, while CSS Grid provides powerful two-dimensional layout capabilities.",
          "Professional interfaces often combine both. Grid can establish the page structure while Flexbox handles navigation groups, buttons and smaller component layouts.",
          "The goal is not to memorise every property. The goal is to choose the simplest layout system that expresses the intended design.",
        ],
        {
          premium: true,
          practical: {
            title: "Rebuild a Responsive Dashboard Layout",
            brief:
              "Create a dashboard layout containing a sidebar, header, metric cards and a responsive content area.",
            instructions: [
              "Create a desktop layout with a sidebar and main content.",
              "Use Grid for the primary page layout.",
              "Use Flexbox inside cards and navigation groups.",
              "Add responsive behaviour for tablet and mobile widths.",
              "Test at several viewport sizes.",
              "Document the layout decisions you made.",
            ],
            deliverables: [
              "Responsive dashboard",
              "Mobile screenshot",
              "Desktop screenshot",
              "Short layout decision note",
            ],
          },
        }
      ),
      lesson(
        "frontend-m3-l4",
        "Responsive and Mobile-First Design",
        [
          "Responsive design allows an interface to adapt to different screen sizes and interaction contexts.",
          "A mobile-first approach begins with the constraints of smaller screens and progressively enhances the layout for larger displays.",
          "Responsive design is more than shrinking desktop content. Navigation, typography, spacing, controls and information hierarchy may all need to change.",
        ],
        {
          premium: true,
          objectives: [
            "Understand responsive design principles.",
            "Apply mobile-first thinking.",
            "Design layouts that adapt rather than simply shrink.",
          ],
        }
      ),
      quizLesson(
        "frontend-m3-q",
        "Module 3 Knowledge Check",
        [
          quiz(
            "frontend-m3-q1",
            "Which layout system is especially suited to two-dimensional layouts?",
            ["Float", "CSS Grid", "Inline styling", "HTML tables"],
            1,
            "CSS Grid is designed for two-dimensional row and column layouts."
          ),
          quiz(
            "frontend-m3-q2",
            "What does responsive design primarily address?",
            [
              "Only website colours",
              "Adaptation to different screen sizes and contexts",
              "Database security",
              "Server-side authentication",
            ],
            1,
            "Responsive design allows interfaces to adapt to different devices and viewport sizes."
          ),
        ]
      ),
    ],
  },

  {
    id: "frontend-m4",
    title: "Module 4 — JavaScript and Application Behaviour",
    description:
      "Build the programming foundation needed to create interactive web applications.",
    lessons: [
      lesson(
        "frontend-m4-l1",
        "Variables, Types and Functions",
        [
          "JavaScript allows interfaces to respond to user actions and work with application data.",
          "Variables hold values, data types describe the kinds of values being represented and functions encapsulate reusable behaviour.",
          "Good JavaScript is organised around clear responsibilities rather than large blocks of code that attempt to do everything at once.",
        ],
        {
          premium: true,
          objectives: [
            "Understand JavaScript variables and data types.",
            "Create reusable functions.",
            "Write readable application logic.",
          ],
        }
      ),
      lesson(
        "frontend-m4-l2",
        "Arrays, Objects and Data Transformation",
        [
          "Most application interfaces work with collections of structured data. Arrays represent ordered collections while objects represent related properties.",
          "Methods such as map, filter and reduce allow developers to transform data into structures suitable for presentation.",
          "Understanding data transformation is essential when consuming APIs and building component-driven interfaces.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m4-l3",
        "DOM Events and User Interaction",
        [
          "The DOM represents the document structure exposed to JavaScript. Events allow applications to respond to actions such as clicks, typing, submitting forms and keyboard input.",
          "Event-driven programming is fundamental to interactive interfaces.",
          "Modern frameworks provide abstractions over many DOM operations, but understanding the underlying model makes debugging considerably easier.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m4-l4",
        "Asynchronous JavaScript and Fetch",
        [
          "Network requests take time, so applications must handle asynchronous operations without freezing the interface.",
          "Promises and async/await provide structured ways to work with asynchronous operations.",
          "The Fetch API allows browser applications to communicate with HTTP endpoints. Production interfaces should account for loading, success, empty and error states.",
        ],
        {
          premium: true,
          practical: {
            title: "Build an API-Powered Search Interface",
            brief:
              "Create a small frontend interface that retrieves data from a public API and presents useful results.",
            instructions: [
              "Choose an appropriate public API.",
              "Create a search or filtering interface.",
              "Implement the request using fetch.",
              "Handle loading and error states.",
              "Handle an empty result state.",
              "Render the returned data clearly.",
            ],
            deliverables: [
              "Working API-powered interface",
              "Source code",
              "README explaining the API and implementation",
            ],
          },
        }
      ),
      quizLesson(
        "frontend-m4-q",
        "Module 4 Knowledge Check",
        [
          quiz(
            "frontend-m4-q1",
            "Which method creates a new array by transforming each item?",
            ["filter", "map", "find", "push"],
            1,
            "map transforms every item and returns a new array."
          ),
          quiz(
            "frontend-m4-q2",
            "Why are loading and error states important when consuming APIs?",
            [
              "They make the code shorter",
              "Network operations can take time or fail",
              "They replace authentication",
              "They eliminate the need for testing",
            ],
            1,
            "Network requests can be delayed, fail or return no useful data, so interfaces should communicate those states."
          ),
        ]
      ),
    ],
  },

  {
    id: "frontend-m5",
    title: "Module 5 — Modern Frontend Engineering",
    description:
      "Move from basic JavaScript into component architecture, React, APIs, Git and professional development workflows.",
    lessons: [
      lesson(
        "frontend-m5-l1",
        "Component-Based Architecture",
        [
          "Component-based development breaks interfaces into reusable units with clear responsibilities.",
          "A good component should have an understandable purpose and predictable inputs and outputs.",
          "Poor component architecture often produces components that are too large, too tightly coupled or responsible for unrelated concerns.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m5-l2",
        "React Components, Props and State",
        [
          "React uses components to describe interface behaviour and presentation.",
          "Props allow information to flow into components while state represents information that can change during interaction.",
          "A strong React application separates reusable presentation from business logic where appropriate and keeps state ownership intentional.",
        ],
        {
          premium: true,
          objectives: [
            "Understand React components.",
            "Differentiate props and state.",
            "Design sensible component boundaries.",
          ],
        }
      ),
      lesson(
        "frontend-m5-l3",
        "Working with Forms and APIs",
        [
          "Production applications frequently combine form input with API requests. The frontend must manage user input, validation, loading, success and failure states.",
          "Good form experiences communicate what is happening and prevent duplicate or invalid submissions.",
          "API integration should be isolated enough that changing a backend endpoint does not require rewriting the entire interface.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m5-l4",
        "Git and GitHub Workflow",
        [
          "Git provides version control so developers can track changes, collaborate and safely experiment.",
          "A professional workflow typically uses meaningful commits, branches for isolated work and pull requests or reviews where teams require them.",
          "GitHub also acts as evidence of engineering activity. A clean repository with documentation and meaningful commit history can strengthen a professional portfolio.",
        ],
        {
          premium: true,
          practical: {
            title: "Prepare a Professional GitHub Project",
            brief:
              "Take a small frontend project and prepare it as a portfolio-ready repository.",
            instructions: [
              "Create or clean the project repository.",
              "Write a professional README.",
              "Add setup and installation instructions.",
              "Document key technical decisions.",
              "Use meaningful commits.",
              "Include screenshots and a deployed link where possible.",
            ],
            deliverables: [
              "GitHub repository",
              "Professional README",
              "Deployed project link",
            ],
          },
        }
      ),
      quizLesson(
        "frontend-m5-q",
        "Module 5 Knowledge Check",
        [
          quiz(
            "frontend-m5-q1",
            "What are props primarily used for in React?",
            [
              "Passing data into components",
              "Creating database tables",
              "Deploying applications",
              "Replacing CSS",
            ],
            0,
            "Props are inputs passed into React components."
          ),
          quiz(
            "frontend-m5-q2",
            "What is the main purpose of Git?",
            [
              "Image compression",
              "Version control",
              "Database hosting",
              "UI design",
            ],
            1,
            "Git tracks changes and supports version control and collaboration."
          ),
        ]
      ),
    ],
  },

  {
    id: "frontend-m6",
    title: "Module 6 — Production, Quality and Deployment",
    description:
      "Learn the practices that turn working frontend code into production-quality software.",
    lessons: [
      lesson(
        "frontend-m6-l1",
        "Performance Fundamentals",
        [
          "Performance affects usability, conversion and accessibility. Users should be able to understand and interact with a page without unnecessary waiting.",
          "Large images, excessive JavaScript, inefficient rendering, unnecessary network requests and poor caching strategies can all contribute to slow experiences.",
          "Performance work should be guided by measurement rather than assumptions.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m6-l2",
        "Frontend Security Basics",
        [
          "Frontend developers participate in application security even when the backend owns many critical controls.",
          "Common concerns include unsafe handling of user input, exposing secrets in client-side code, insecure authentication flows and trusting client-side validation as a security boundary.",
          "Sensitive credentials should never be treated as safe merely because they are hidden in frontend source code.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m6-l3",
        "Testing and Debugging",
        [
          "Testing provides confidence that software behaves as expected. Debugging is the process of finding and understanding the cause of unexpected behaviour.",
          "Useful debugging begins with reproducing the problem, narrowing the scope, inspecting evidence and testing a hypothesis.",
          "Frontend teams may use unit tests, integration tests, component tests and end-to-end tests depending on the product.",
        ],
        {
          premium: true,
        }
      ),
      lesson(
        "frontend-m6-l4",
        "Deployment and Production Readiness",
        [
          "Deployment moves an application from development into an environment where users can access it.",
          "Production readiness includes environment configuration, error handling, performance, accessibility, responsive behaviour, security considerations and a reliable deployment process.",
          "A professional developer should be able to explain how their application is built, deployed and maintained.",
        ],
        {
          premium: true,
          practical: {
            title: "Production Readiness Audit",
            brief:
              "Audit one of your frontend projects as if you were preparing it for a professional launch.",
            instructions: [
              "Test the application on desktop and mobile.",
              "Check accessibility and keyboard navigation.",
              "Inspect loading and error states.",
              "Review images and performance.",
              "Check for accidentally exposed secrets.",
              "Test the main user journey.",
              "Write a production-readiness report.",
            ],
            deliverables: [
              "Production audit report",
              "Issue list with priorities",
              "Updated project",
              "Deployment URL",
            ],
          },
        }
      ),
      quizLesson(
        "frontend-m6-q",
        "Module 6 Knowledge Check",
        [
          quiz(
            "frontend-m6-q1",
            "Which is a valid frontend performance concern?",
            [
              "Oversized images",
              "Meaningful HTML",
              "Clear labels",
              "Keyboard navigation",
            ],
            0,
            "Oversized images can significantly increase page load cost."
          ),
          quiz(
            "frontend-m6-q2",
            "Where should sensitive API secrets generally be kept?",
            [
              "Visible client-side source code",
              "Public HTML",
              "Secure server-side environment configuration",
              "CSS files",
            ],
            2,
            "Sensitive secrets should not be exposed to the browser and should be managed securely on the server or infrastructure."
          ),
        ]
      ),
    ],
  },
];

const genericCourseBlueprints: Record<
  string,
  {
    description: string;
    outcomes: string[];
    modules: {
      title: string;
      topics: string[];
    }[];
  }
> = {
  "Product Management Foundations": {
    description:
      "Learn how product professionals discover problems, define opportunities, prioritise work and guide products from idea to measurable outcome.",
    outcomes: [
      "Understand the product lifecycle.",
      "Conduct structured discovery.",
      "Write clear product requirements.",
      "Prioritise opportunities using evidence.",
      "Build roadmaps around outcomes.",
      "Work effectively with cross-functional teams.",
    ],
    modules: [
      {
        title: "Product Thinking and Discovery",
        topics: [
          "The role of a product manager",
          "Problem discovery",
          "Customer interviews",
          "Personas and jobs-to-be-done",
        ],
      },
      {
        title: "Product Strategy",
        topics: [
          "Product vision",
          "Market and competitor analysis",
          "Value propositions",
          "Strategic goals",
        ],
      },
      {
        title: "Requirements and Prioritisation",
        topics: [
          "Product requirements",
          "User stories",
          "Acceptance criteria",
          "Prioritisation frameworks",
        ],
      },
      {
        title: "Roadmaps and Delivery",
        topics: [
          "Roadmap design",
          "Agile delivery",
          "Stakeholder alignment",
          "Release planning",
        ],
      },
      {
        title: "Product Analytics",
        topics: [
          "Product metrics",
          "Funnels",
          "Retention",
          "Experimentation",
        ],
      },
      {
        title: "Product Launch and Growth",
        topics: [
          "Launch planning",
          "Go-to-market",
          "Feedback loops",
          "Growth experiments",
        ],
      },
    ],
  },

  "UI/UX Design Foundations": {
    description:
      "Learn how professional designers research users, structure experiences, create interfaces and validate design decisions.",
    outcomes: [
      "Understand UX research.",
      "Create user journeys.",
      "Build wireframes and information architecture.",
      "Create accessible interfaces.",
      "Prototype and test designs.",
      "Build professional design case studies.",
    ],
    modules: [
      {
        title: "UX Foundations and Research",
        topics: [
          "UX principles",
          "User research",
          "Interview techniques",
          "Research synthesis",
        ],
      },
      {
        title: "Information Architecture",
        topics: [
          "User journeys",
          "Navigation",
          "Information architecture",
          "Content hierarchy",
        ],
      },
      {
        title: "Wireframing and Interaction",
        topics: [
          "Low-fidelity wireframes",
          "Interaction patterns",
          "Forms",
          "Error states",
        ],
      },
      {
        title: "Visual Interface Design",
        topics: [
          "Typography",
          "Colour",
          "Spacing",
          "Design systems",
        ],
      },
      {
        title: "Prototyping and Testing",
        topics: [
          "High-fidelity prototypes",
          "Usability testing",
          "Design iteration",
          "Accessibility",
        ],
      },
      {
        title: "Portfolio and Case Studies",
        topics: [
          "Design documentation",
          "Case study structure",
          "Presenting design decisions",
          "Handoff",
        ],
      },
    ],
  },

  "Business Analysis Foundations": {
    description:
      "Learn how business analysts investigate problems, gather requirements, model processes and translate business needs into actionable solutions.",
    outcomes: [
      "Understand the BA role.",
      "Identify stakeholders.",
      "Gather and validate requirements.",
      "Model business processes.",
      "Write user stories and acceptance criteria.",
      "Produce professional analysis documentation.",
    ],
    modules: [
      {
        title: "Business Analysis Fundamentals",
        topics: [
          "Role of the business analyst",
          "Business problems",
          "Stakeholder identification",
          "Analysis mindset",
        ],
      },
      {
        title: "Requirements Elicitation",
        topics: [
          "Interviews",
          "Workshops",
          "Observation",
          "Document analysis",
        ],
      },
      {
        title: "Requirements Management",
        topics: [
          "Functional requirements",
          "Non-functional requirements",
          "Traceability",
          "Requirement validation",
        ],
      },
      {
        title: "Process Analysis",
        topics: [
          "Process mapping",
          "BPMN concepts",
          "As-is analysis",
          "To-be processes",
        ],
      },
      {
        title: "Solution Analysis",
        topics: [
          "Gap analysis",
          "Options analysis",
          "Business cases",
          "Acceptance criteria",
        ],
      },
      {
        title: "Professional BA Delivery",
        topics: [
          "Analysis documentation",
          "Stakeholder communication",
          "Presentation",
          "Handover",
        ],
      },
    ],
  },

  "Data & Analytics Foundations": {
    description:
      "Build practical data analysis skills covering data preparation, SQL, visualisation, dashboards and evidence-based business decisions.",
    outcomes: [
      "Understand analytical thinking.",
      "Prepare and clean datasets.",
      "Use SQL for analysis.",
      "Create meaningful visualisations.",
      "Build business dashboards.",
      "Communicate analytical findings.",
    ],
    modules: [
      {
        title: "Data and Analytical Thinking",
        topics: [
          "Data types",
          "Analytical questions",
          "Data quality",
          "Descriptive analysis",
        ],
      },
      {
        title: "Data Cleaning and Preparation",
        topics: [
          "Missing values",
          "Duplicates",
          "Data types",
          "Transformation",
        ],
      },
      {
        title: "SQL Foundations",
        topics: [
          "SELECT queries",
          "Filtering",
          "Joins",
          "Aggregations",
        ],
      },
      {
        title: "Data Visualisation",
        topics: [
          "Chart selection",
          "Visual hierarchy",
          "Dashboard design",
          "Avoiding misleading charts",
        ],
      },
      {
        title: "Business Intelligence",
        topics: [
          "KPIs",
          "Dashboards",
          "Drill-down analysis",
          "Decision support",
        ],
      },
      {
        title: "Analytics Storytelling",
        topics: [
          "Insight generation",
          "Recommendations",
          "Executive reporting",
          "Presenting findings",
        ],
      },
    ],
  },

  "Digital Marketing Foundations": {
    description:
      "Learn the foundations of modern digital marketing across audience research, content, SEO, paid campaigns, email and measurement.",
    outcomes: [
      "Understand digital marketing strategy.",
      "Define audiences and positioning.",
      "Create content strategies.",
      "Understand SEO fundamentals.",
      "Plan campaigns.",
      "Measure marketing performance.",
    ],
    modules: [
      {
        title: "Digital Marketing Strategy",
        topics: [
          "Marketing fundamentals",
          "Audience research",
          "Positioning",
          "Customer journeys",
        ],
      },
      {
        title: "Content Marketing",
        topics: [
          "Content strategy",
          "Content pillars",
          "Copywriting",
          "Content distribution",
        ],
      },
      {
        title: "SEO Foundations",
        topics: [
          "Search intent",
          "Keyword research",
          "On-page SEO",
          "Technical SEO",
        ],
      },
      {
        title: "Social Media and Paid Campaigns",
        topics: [
          "Platform strategy",
          "Campaign objectives",
          "Creative testing",
          "Audience targeting",
        ],
      },
      {
        title: "Email and Conversion",
        topics: [
          "Email funnels",
          "Lead nurturing",
          "Landing pages",
          "Conversion optimisation",
        ],
      },
      {
        title: "Marketing Analytics",
        topics: [
          "KPIs",
          "Attribution",
          "Campaign analysis",
          "Reporting",
        ],
      },
    ],
  },

  "Mobile Development Foundations": {
    description:
      "Learn the foundations of professional mobile application development, from interface architecture through APIs, state and deployment.",
    outcomes: [
      "Understand mobile application architecture.",
      "Build responsive mobile interfaces.",
      "Work with application state.",
      "Consume APIs.",
      "Handle device and UX considerations.",
      "Prepare applications for release.",
    ],
    modules: [
      {
        title: "Mobile Development Fundamentals",
        topics: [
          "Mobile platforms",
          "Application architecture",
          "Development environments",
          "Mobile UX",
        ],
      },
      {
        title: "Mobile UI and Navigation",
        topics: [
          "Screen composition",
          "Navigation",
          "Responsive layouts",
          "Accessibility",
        ],
      },
      {
        title: "State and Data",
        topics: [
          "Local state",
          "Global state",
          "Persistence",
          "Data modelling",
        ],
      },
      {
        title: "APIs and Authentication",
        topics: [
          "HTTP requests",
          "API integration",
          "Authentication",
          "Error handling",
        ],
      },
      {
        title: "Mobile Performance and Security",
        topics: [
          "Performance",
          "Permissions",
          "Secure storage",
          "Testing",
        ],
      },
      {
        title: "Testing and Release",
        topics: [
          "Testing strategy",
          "Build configuration",
          "Release preparation",
          "Monitoring",
        ],
      },
    ],
  },

  "Cybersecurity Foundations": {
    description:
      "Build a strong foundation in cybersecurity covering security principles, threats, risk, identity, application security and incident response.",
    outcomes: [
      "Understand core security principles.",
      "Identify common threats.",
      "Perform basic risk analysis.",
      "Understand identity and access controls.",
      "Recognise application security risks.",
      "Develop incident response thinking.",
    ],
    modules: [
      {
        title: "Cybersecurity Fundamentals",
        topics: [
          "CIA triad",
          "Threats",
          "Vulnerabilities",
          "Security controls",
        ],
      },
      {
        title: "Risk and Threat Analysis",
        topics: [
          "Risk identification",
          "Threat modelling",
          "Risk treatment",
          "Security assessments",
        ],
      },
      {
        title: "Identity and Access Management",
        topics: [
          "Authentication",
          "Authorisation",
          "Least privilege",
          "Access reviews",
        ],
      },
      {
        title: "Application and API Security",
        topics: [
          "Common web risks",
          "Input validation",
          "Authentication security",
          "API protection",
        ],
      },
      {
        title: "Network and Cloud Security",
        topics: [
          "Network segmentation",
          "Encryption",
          "Cloud responsibilities",
          "Monitoring",
        ],
      },
      {
        title: "Incident Response",
        topics: [
          "Incident identification",
          "Containment",
          "Investigation",
          "Recovery",
        ],
      },
    ],
  },
};

function buildGenericModules(
  courseId: string,
  courseTitle: string,
  blueprint: (typeof genericCourseBlueprints)[string]
): LearningModule[] {
  return blueprint.modules.map((module, moduleIndex) => {
    const lessons = module.topics.map((topic, topicIndex) => {
      const premium =
        moduleIndex >= 1 ||
        topicIndex >= 2 ||
        !["Product Management Foundations", "UI/UX Design Foundations", "Business Analysis Foundations"].includes(
          courseTitle
        );

      const topicSlug = topic
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      return lesson(
        `${courseId}-m${moduleIndex + 1}-l${topicIndex + 1}`,
        topic,
        [
          `${topic} is an important part of ${courseTitle.toLowerCase()}. Professional practitioners need to understand both the concept and the context in which it is used.`,
          `Start by understanding the problem that ${topic.toLowerCase()} is designed to solve. Good professional practice begins with the underlying need rather than immediately selecting a tool or process.`,
          `When applying ${topic.toLowerCase()}, consider stakeholders, evidence, constraints, risks and expected outcomes. A technically correct activity can still fail if it does not solve the underlying business or user problem.`,
          `Document your reasoning. Professional teams need to understand not only what decision was made, but why it was made and what evidence supported it.`,
        ],
        {
          premium,
          objectives: [
            `Explain the purpose of ${topic.toLowerCase()}.`,
            `Identify where ${topic.toLowerCase()} is used in professional work.`,
            "Apply the concept to a realistic scenario.",
          ],
          keyTakeaways: [
            `${topic} should be applied in context rather than treated as an isolated technique.`,
            "Professional decisions should be supported by evidence.",
            "Clear documentation improves collaboration and review.",
          ],
          resources: [
            `${topic} reference notes`,
            "Professional practice checklist",
            "Scenario worksheet",
          ],
          practical:
            topicIndex === module.topics.length - 1
              ? {
                  title: `Practical Exercise — ${topic}`,
                  brief: `Apply ${topic.toLowerCase()} to a realistic ${courseTitle.toLowerCase()} scenario and produce a professional deliverable.`,
                  instructions: [
                    "Define the scenario and the problem being addressed.",
                    `Apply the principles of ${topic.toLowerCase()}.`,
                    "Document the assumptions and evidence used.",
                    "Explain your recommendation or outcome.",
                    "Review the work for clarity and completeness.",
                  ],
                  deliverables: [
                    `${topic} working document`,
                    "Decision/recommendation summary",
                    "Evidence or supporting analysis",
                  ],
                }
              : undefined,
        }
      );
    });

    const knowledgeCheckPremium = !["Frontend Development Foundations", "Product Management Foundations", "UI/UX Design Foundations", "Business Analysis Foundations"].includes(courseTitle) || moduleIndex >= 1;

    lessons.push(
      quizLesson(
        `${courseId}-m${moduleIndex + 1}-q`,
        `${module.title} — Knowledge Check`,
        [
          quiz(
            `${courseId}-${module.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-q1`,
            `What is the most important starting point when applying ${module.topics[0].toLowerCase()}?`,
            [
              "Choose a tool immediately",
              "Understand the problem and desired outcome",
              "Skip stakeholder input",
              "Document nothing",
            ],
            1,
            "Professional work begins by understanding the problem, context and desired outcome."
          ),
          quiz(
            `${courseId}-${module.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-q2`,
            `Why is evidence important when working with ${module.title.toLowerCase()}?`,
            [
              "It removes the need for judgement",
              "It supports decisions and recommendations",
              "It guarantees success",
              "It replaces communication",
            ],
            1,
            "Evidence gives professional decisions a defensible foundation."
          ),
          quiz(
            `${courseId}-${module.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-q3`,
            "What should professional documentation communicate?",
            [
              "Only the final answer",
              "Only the tools used",
              "The decision, reasoning and relevant evidence",
              "Nothing beyond a title",
            ],
            2,
            "Useful documentation communicates what was done, why it was done and what evidence informed the work."
          ),
        ],
        knowledgeCheckPremium
      )
    );

    return {
      id: `${courseId}-m${moduleIndex + 1}`,
      title: `Module ${moduleIndex + 1} — ${module.title}`,
      description: `Develop practical understanding of ${module.title.toLowerCase()} through guided lessons, scenarios and knowledge checks.`,
      lessons,
    };
  });
}

const courseLearningContent: Record<string, CourseLearningContent> = {
  "frontend-development-foundations": {
    courseId: "frontend-development-foundations",
    courseTitle: "Frontend Development Foundations",
    description:
      "A complete foundation in modern frontend development, from how the web works through production-ready application development.",
    learningOutcomes: [
      "Understand how the web works.",
      "Build semantic and accessible HTML.",
      "Create responsive interfaces with CSS.",
      "Write JavaScript application logic.",
      "Build component-based interfaces.",
      "Consume APIs and manage application states.",
      "Use Git and GitHub professionally.",
      "Prepare frontend applications for production.",
    ],
    modules: frontendModules,
    finalAssessment: assessment(
      "frontend-final-assessment",
      "Frontend Development Foundations",
      [
        quiz(
          "frontend-final-1",
          "Which layer primarily provides semantic structure?",
          ["CSS", "HTML", "JavaScript", "Git"],
          1,
          "HTML provides the semantic structure of a web document."
        ),
        quiz(
          "frontend-final-2",
          "Which approach is generally best for responsive development?",
          [
            "Design only for desktop",
            "Use a layout that adapts to different contexts",
            "Disable mobile browsers",
            "Use fixed widths everywhere",
          ],
          1,
          "Responsive design creates interfaces that adapt to different viewport sizes and interaction contexts."
        ),
        quiz(
          "frontend-final-3",
          "Why should API-driven interfaces include error states?",
          [
            "APIs always fail",
            "Network operations can fail or return unexpected results",
            "Error states are only decorative",
            "They replace backend validation",
          ],
          1,
          "Network operations are inherently fallible and users need meaningful feedback."
        ),
        quiz(
          "frontend-final-4",
          "Which is an appropriate use of Git?",
          [
            "Tracking project changes",
            "Replacing HTML",
            "Compressing images",
            "Hosting databases",
          ],
          0,
          "Git is a version-control system used to track and manage changes."
        ),
        quiz(
          "frontend-final-5",
          "What should production readiness include?",
          [
            "Only visual styling",
            "Only deployment",
            "Performance, accessibility, security and reliable behaviour",
            "Only a GitHub repository",
          ],
          2,
          "Production readiness considers the broader quality and reliability of the application."
        ),
      ]
    ),
  },
};

for (const [courseTitle, blueprint] of Object.entries(genericCourseBlueprints)) {
  const courseId = courseTitle
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const modules = buildGenericModules(courseId, courseTitle, blueprint);

  courseLearningContent[courseId] = {
    courseId,
    courseTitle,
    description: blueprint.description,
    learningOutcomes: blueprint.outcomes,
    modules,
    finalAssessment: assessment(
      `${courseId}-final-assessment`,
      courseTitle,
      [
        quiz(
          `${courseId}-final-1`,
          "What should professional learning ultimately help a learner do?",
          [
            "Memorise definitions",
            "Apply knowledge to meaningful problems",
            "Avoid practical work",
            "Use as many tools as possible",
          ],
          1,
          "Professional learning is valuable when knowledge can be applied to meaningful problems."
        ),
        quiz(
          `${courseId}-final-2`,
          "What should guide a professional recommendation?",
          [
            "Personal preference only",
            "Evidence, context and desired outcomes",
            "The newest tool",
            "The shortest document",
          ],
          1,
          "Professional recommendations should account for evidence, context and outcomes."
        ),
        quiz(
          `${courseId}-final-3`,
          "Why is documentation important?",
          [
            "It makes work look longer",
            "It helps others understand decisions and outcomes",
            "It replaces communication",
            "It guarantees approval",
          ],
          1,
          "Documentation creates a shared record of decisions, reasoning and outcomes."
        ),
      ]
    ),
  };
}

export function getCourseLearningContent(
  courseId: string
): CourseLearningContent | null {
  if (courseLearningContent[courseId]) {
    return courseLearningContent[courseId];
  }

  const normalized = courseId
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return courseLearningContent[normalized] ?? null;
}

export function getAllLearningLessons(
  content: CourseLearningContent | null | undefined
): LearningLesson[] {
  if (!content || !Array.isArray(content.modules)) {
    return [];
  }

  return content.modules.flatMap((module) =>
    Array.isArray(module.lessons) ? module.lessons : []
  );
}

export function getLearningProgress(
  courseId: string
): CourseProgress {
  if (typeof window === "undefined") {
    return {
      completedLessonIds: [],
      notes: {},
      quizScores: {},
      lastLessonId: null,
      startedAt: null,
      completedAt: null,
    };
  }

  try {
    const raw = localStorage.getItem(
      `liveproject_course_progress_${courseId}`
    );

    if (!raw) {
      return {
        completedLessonIds: [],
        notes: {},
        quizScores: {},
        lastLessonId: null,
        startedAt: null,
        completedAt: null,
      };
    }

    const parsed = JSON.parse(raw);

    return {
      completedLessonIds: Array.isArray(parsed.completedLessonIds)
        ? parsed.completedLessonIds
        : [],
      notes:
        parsed.notes && typeof parsed.notes === "object"
          ? parsed.notes
          : {},
      quizScores:
        parsed.quizScores && typeof parsed.quizScores === "object"
          ? parsed.quizScores
          : {},
      lastLessonId:
        typeof parsed.lastLessonId === "string"
          ? parsed.lastLessonId
          : null,
      startedAt:
        typeof parsed.startedAt === "string"
          ? parsed.startedAt
          : null,
      completedAt:
        typeof parsed.completedAt === "string"
          ? parsed.completedAt
          : null,
    };
  } catch {
    return {
      completedLessonIds: [],
      notes: {},
      quizScores: {},
      lastLessonId: null,
      startedAt: null,
      completedAt: null,
    };
  }
}

export function saveLearningProgress(
  courseId: string,
  progress: CourseProgress
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    `liveproject_course_progress_${courseId}`,
    JSON.stringify(progress)
  );
}

export function calculateLearningProgress(
  content: CourseLearningContent | null | undefined,
  progress: CourseProgress
) {
  const lessons = getAllLearningLessons(content);
  const completed = lessons.filter((item) =>
    progress.completedLessonIds.includes(item.id)
  ).length;

  const total = lessons.length;

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}