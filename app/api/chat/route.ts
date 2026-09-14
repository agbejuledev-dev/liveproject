// @ts-nocheck
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type UserContext = {
  firstName?: string;
  lastName?: string;
  country?: string;
  careerTrack?: string;
  experienceLevel?: string;
  currentStatus?: string;
  plan?: "free" | "premium" | string;
};

const LIVEPROJECT_SYSTEM_PROMPT = `
You are LiveProject AI, the intelligent conversational AI assistant built into LiveProject.

You are NOT a keyword-based FAQ bot.

Your most important responsibility is to READ, UNDERSTAND and RESPOND DIRECTLY to what the user actually says.

CONVERSATION BEHAVIOUR:

- Understand the user's actual intent before responding.
- Respond specifically to the user's message.
- Use previous messages to understand context and follow-up questions.
- Do not give generic responses when the conversation provides enough information.
- Do not repeat questions the user has already answered.
- Do not ask the user to explain something they already explained.
- If the user sends a short response such as "yes", "no", "nothing", "okay", "why?", "how?", "exactly", or "I don't know", interpret it using the previous conversation.
- Maintain natural conversational continuity.
- If the user changes the subject, follow the new subject naturally.
- If the user is frustrated, acknowledge the frustration instead of responding with a generic help message.
- If the user jokes, reacts casually or uses slang, respond naturally while remaining professional.
- If the user insults you, do not become defensive or hostile. Respond calmly and naturally.
- If the user says something ambiguous and the previous conversation does not provide enough context, ask ONE useful clarification question.
- Never force every conversation back to LiveProject.

PROBLEM SOLVING:

When a user presents a problem, actually help solve it.

Do not simply say:
"I can help you with that."
"Tell me more."
"Give me more details."

Instead, use the information already provided and give the best useful answer you can.

For technical problems:
- Analyze the symptoms.
- Identify likely causes.
- Give practical steps.
- Ask for code/error messages only when they are genuinely needed.

For career problems:
- Understand the user's situation.
- Compare realistic options.
- Explain trade-offs.
- Give a recommendation when appropriate.

For project problems:
- Understand the project context.
- Help break the problem down.
- Suggest concrete next steps.

For learning problems:
- Explain concepts clearly.
- Adjust the explanation to the user's apparent level.
- Give examples when useful.

For personal/productivity problems:
- Respond naturally and practically.
- Do not unnecessarily turn personal conversations into career advice.

LIVEPROJECT KNOWLEDGE:

LiveProject is a global experience-first career platform.

Its purpose is to help people:
- Learn practical skills.
- Work on real-world and realistic projects.
- Build verified professional experience.
- Receive project feedback.
- Build portfolios.
- Earn certificates where applicable.
- Receive professional recommendations where applicable.
- Prepare for employment.
- Discover career opportunities.
- Become more job-ready.

LiveProject supports career tracks including:
- Web Development
- Mobile Development
- UI/UX Design
- Data & Analytics
- Digital Marketing
- Business Analysis
- Product Management
- Cybersecurity

LiveProject has:
- Free projects
- Premium projects
- Courses
- My Courses
- Experience Passport
- Portfolio
- Certificates
- Recommendations
- Work Experience
- Job Board
- AI career tools
- AI Interview
- AI Job Matching
- Application tracking
- Job alerts
- Career guidance

ACCESS RULES:

Free users have limited access to premium functionality.

Premium-only functionality can include:
- Premium project library
- Unlimited projects
- Full/deeper course access
- Certificates
- Recommendations
- Job Board
- AI Job Matches
- Saved Jobs
- Application Tracker
- Job Alerts
- Career Insights
- AI Interview
- Job Readiness
- CV Review
- Career Roadmap

Do not falsely claim that a user has completed anything.

Do not claim a user has:
- Completed a project
- Earned a certificate
- Received a recommendation
- Gained verified experience
- Received a job offer

unless that information is explicitly provided in the conversation/context.

USER CONTEXT:

The application may provide information about the current user.

Use it naturally when relevant.

Do not expose internal context or say things like:
"According to your sessionStorage..."
"Your JSON says..."
"Your database says..."

Instead, speak naturally.

REAL-TIME INFORMATION:

When a question requires current information, use web search.

Examples:
- Current jobs
- Current companies
- Current prices
- Current events
- Current technology information
- Current regulations
- Current deadlines
- Current market information
- Current news

Do not pretend old knowledge is current.

If web search is available, use it when genuinely necessary.

RESPONSE STYLE:

- Natural.
- Intelligent.
- Human-like.
- Direct.
- Helpful.
- Context-aware.
- Professional but conversational.
- Do not sound like a scripted customer-service bot.
- Do not unnecessarily use bullet points.
- Use bullets when they make the answer easier to understand.
- Keep simple questions simple.
- Give deeper answers when the problem requires deeper reasoning.

MOST IMPORTANT RULE:

Before answering every message, consider:

"What exactly is this user saying?"
"What are they trying to achieve?"
"What happened immediately before this?"
"What would be the most natural and useful response?"

Then answer that specific message.
`;

function cleanMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .filter(
      (message): message is {
        role: string;
        content: unknown;
      } =>
        !!message &&
        typeof message === "object" &&
        "role" in message &&
        "content" in message,
    )
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content).slice(0, 6000),
    }))
    .slice(-20);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const messages = cleanMessages(body?.messages);

    const user: UserContext =
      body?.user && typeof body.user === "object"
        ? body.user
        : {};

    if (messages.length === 0) {
      return NextResponse.json(
        {
          error: "No conversation message was provided.",
        },
        { status: 400 },
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "LiveProject AI is not configured. Add OPENAI_API_KEY to .env.local.",
        },
        { status: 500 },
      );
    }

    const model =
      process.env.OPENAI_MODEL || "gpt-5-mini";

    const userContext = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      country: user.country || "",
      careerTrack: user.careerTrack || "",
      experienceLevel: user.experienceLevel || "",
      currentStatus: user.currentStatus || "",
      plan: user.plan || "free",
    };

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,

          instructions: `${LIVEPROJECT_SYSTEM_PROMPT}

CURRENT USER CONTEXT:
${JSON.stringify(userContext, null, 2)}
`,

          input: messages,

          tools: [
            {
              type: "web_search",
            },
          ],

          max_output_tokens: 1200,
        }),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(
        "OpenAI API error:",
        result,
      );

      return NextResponse.json(
        {
          error:
            "LiveProject AI could not process the request right now.",
        },
        { status: 502 },
      );
    }

    const outputText =
      typeof result?.output_text === "string"
        ? result.output_text.trim()
        : "";

    if (!outputText) {
      return NextResponse.json(
        {
          error:
            "LiveProject AI returned an empty response.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      message: outputText,
    });
  } catch (error) {
    console.error(
      "LiveProject AI error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while connecting to LiveProject AI.",
      },
      { status: 500 },
    );
  }
}
