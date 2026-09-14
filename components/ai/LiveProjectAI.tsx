"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Bot,
  ChevronDown,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const STORAGE_KEY = "liveproject_ai_chat";

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi 👋 I’m LiveProject AI. I’m here to help you with projects, career decisions, learning, jobs, technical problems, or anything else you’re working through. What’s on your mind?",
};

const quickPrompts = [
  "Help me choose a career track",
  "What should I work on next?",
  "I'm stuck on a project",
  "How does LiveProject work?",
];

function RobotAvatar({
  small = false,
}: {
  small?: boolean;
}) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border border-blue-400/30 bg-slate-950 shadow-[0_0_35px_rgba(37,99,235,0.35)] ${
        small ? "h-10 w-10" : "h-16 w-16"
      }`}
    >
      <div className="absolute inset-[4px] rounded-full border border-blue-400/20" />

      <div
        className={`relative flex items-center justify-center rounded-[11px] border border-blue-300/60 bg-gradient-to-b from-slate-700 to-slate-950 ${
          small ? "h-6 w-7" : "h-8 w-10"
        }`}
      >
        <span
          className={`absolute rounded-full bg-blue-300 shadow-[0_0_8px_#60a5fa] ${
            small
              ? "left-[6px] top-[8px] h-1.5 w-1.5"
              : "left-[8px] top-[10px] h-2 w-2"
          }`}
        />

        <span
          className={`absolute rounded-full bg-blue-300 shadow-[0_0_8px_#60a5fa] ${
            small
              ? "right-[6px] top-[8px] h-1.5 w-1.5"
              : "right-[8px] top-[10px] h-2 w-2"
          }`}
        />

        <span
          className={`absolute bottom-[5px] rounded-full bg-blue-400/80 ${
            small ? "h-[2px] w-3" : "h-[3px] w-4"
          }`}
        />
      </div>

      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />
    </div>
  );
}

function getUserContext() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const registration = JSON.parse(
      sessionStorage.getItem(
        "liveproject_registration",
      ) || "null",
    );

    const onboarding = JSON.parse(
      sessionStorage.getItem(
        "liveproject_onboarding",
      ) || "null",
    );

    const session = JSON.parse(
      sessionStorage.getItem(
        "liveproject_session",
      ) || "null",
    );

    return {
      firstName:
        registration?.firstName ||
        onboarding?.firstName ||
        "",

      lastName:
        registration?.lastName ||
        onboarding?.lastName ||
        "",

      country:
        registration?.country ||
        onboarding?.country ||
        "",

      careerTrack:
        onboarding?.careerTrack || "",

      experienceLevel:
        onboarding?.experienceLevel || "",

      currentStatus:
        onboarding?.currentStatus || "",

      plan:
        session?.plan || "free",
    };
  } catch {
    return {};
  }
}

function loadStoredMessages(): Message[] {
  if (typeof window === "undefined") {
    return [welcomeMessage];
  }

  try {
    const stored =
      sessionStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [welcomeMessage];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [welcomeMessage];
    }

    return parsed;
  } catch {
    return [welcomeMessage];
  }
}

export default function LiveProjectAI() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] =
    useState<Message[]>(loadStoredMessages);

  const [input, setInput] = useState("");

  const [sending, setSending] =
    useState(false);

  const scrollRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages),
      );
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, sending]);

  async function sendMessage(
    suppliedText?: string,
  ) {
    const content = (
      suppliedText ?? input
    ).trim();

    if (!content || sending) {
      return;
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };

    const conversation = [
      ...messages,
      userMessage,
    ];

    setMessages(conversation);
    setInput("");
    setSending(true);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            messages: conversation.map(
              ({
                role,
                content: messageContent,
              }) => ({
                role,
                content: messageContent,
              }),
            ),

            user: getUserContext(),
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "LiveProject AI is unavailable.",
        );
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.message,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error(error);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            "I’m temporarily unable to connect to my AI service. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    void sendMessage();
  }

  function clearConversation() {
    const freshConversation = [
      welcomeMessage,
    ];

    setMessages(freshConversation);

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          freshConversation,
        ),
      );
    } catch {}
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[9999] flex w-[calc(100vw-2rem)] max-w-[420px] flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.3)] sm:right-6">
          {/* HEADER */}
          <div className="flex items-center justify-between bg-slate-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <RobotAvatar small />

              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black">
                    LiveProject AI
                  </p>

                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                </div>

                <p className="text-[11px] text-slate-400">
                  Your intelligent career assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearConversation}
                className="rounded-xl px-2 py-2 text-[10px] font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                New chat
              </button>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close LiveProject AI"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* CHAT */}
          <div
            ref={scrollRef}
            className="h-[430px] space-y-4 overflow-y-auto bg-slate-50 p-4"
          >
            {messages.map(
              (message) => (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${
                    message.role ===
                    "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role ===
                    "assistant" && (
                    <RobotAvatar small />
                  )}

                  <div
                    className={`max-w-[84%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role ===
                      "user"
                        ? "rounded-br-md bg-[#0b5cff] text-white"
                        : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ),
            )}

            {messages.length ===
              1 &&
              !sending && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2 px-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-500" />

                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Start a conversation
                    </p>
                  </div>

                  {quickPrompts.map(
                    (prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() =>
                          void sendMessage(
                            prompt,
                          )
                        }
                        className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        {prompt}
                      </button>
                    ),
                  )}
                </div>
              )}

            {sending && (
              <div className="flex items-center gap-2 pl-1 text-xs text-slate-400">
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />

                LiveProject AI is thinking...
              </div>
            )}
          </div>

          {/* INPUT */}
          <form
            onSubmit={submit}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 focus-within:border-blue-400">
              <input
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value,
                  )
                }
                placeholder="Ask me anything..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={
                  !input.trim() ||
                  sending
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b5cff] text-white transition hover:bg-[#084ed8] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ROBOT */}
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className="fixed bottom-5 right-4 z-[9998] flex items-center gap-3 rounded-full border border-blue-400/20 bg-slate-950 px-3 py-3 text-white shadow-[0_15px_50px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)] sm:bottom-6 sm:right-6"
        aria-label="Open LiveProject AI"
      >
        <div className="relative">
          <div className="absolute -inset-2 animate-pulse rounded-full bg-blue-500/10" />

          <RobotAvatar small />
        </div>

        <span className="hidden pr-1 text-sm font-black sm:block">
          {open
            ? "Close AI"
            : "Ask LiveProject AI"}
        </span>

        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <Sparkles className="h-4 w-4 text-blue-400" />
        )}
      </button>
    </>
  );
}