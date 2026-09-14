"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

type Mode = "loader" | "interview" | "chatbot";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starterMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi 👋 I’m LiveProject AI. I’m here to help you find the right project, understand your career path, learn new skills, and make the most of LiveProject. What would you like to do?",
  },
];

const quickPrompts = [
  "What project should I start with?",
  "How does LiveProject work?",
  "What does Premium include?",
  "Help me choose a career track",
];

function RobotAvatar({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`ai-avatar relative flex shrink-0 items-center justify-center rounded-full ${
        small ? "h-10 w-10" : "h-16 w-16"
      }`}
    >
      <div className="ai-avatar-ring absolute inset-0 rounded-full" />

      <div className="ai-avatar-ring-two absolute inset-[4px] rounded-full" />

      <div
        className={`ai-head relative flex items-center justify-center rounded-[13px] border border-blue-300/50 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_0_30px_rgba(37,99,235,0.35)] ${
          small ? "h-6 w-7" : "h-9 w-11"
        }`}
      >
        <span
          className={`ai-eye absolute rounded-full bg-blue-300 shadow-[0_0_9px_#60a5fa] ${
            small
              ? "left-[5px] top-[7px] h-1.5 w-1.5"
              : "left-[8px] top-[11px] h-2 w-2"
          }`}
        />

        <span
          className={`ai-eye ai-eye-delay absolute rounded-full bg-blue-300 shadow-[0_0_9px_#60a5fa] ${
            small
              ? "right-[5px] top-[7px] h-1.5 w-1.5"
              : "right-[8px] top-[11px] h-2 w-2"
          }`}
        />

        <span
          className={`absolute rounded-full bg-blue-400/80 ${
            small
              ? "bottom-[4px] h-[2px] w-2.5"
              : "bottom-[6px] h-[2px] w-4"
          }`}
        />
      </div>

      <span className="ai-status absolute -right-0.5 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 bg-emerald-400" />

      <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_12px_#60a5fa]" />
    </div>
  );
}

function getUserContext() {
  try {
    const registration = JSON.parse(
      sessionStorage.getItem("liveproject_registration") || "null",
    );

    const onboarding = JSON.parse(
      sessionStorage.getItem("liveproject_onboarding") || "null",
    );

    const session = JSON.parse(
      sessionStorage.getItem("liveproject_session") || "null",
    );

    return {
      firstName: registration?.firstName || onboarding?.firstName || "",
      country: registration?.country || onboarding?.country || "",
      careerTrack: onboarding?.careerTrack || "",
      experienceLevel: onboarding?.experienceLevel || "",
      currentStatus: onboarding?.currentStatus || "",
      plan: session?.plan || "free",
    };
  } catch {
    return {};
  }
}

export default function LiveProjectAI({
  mode = "chatbot",
  onComplete,
}: {
  mode?: Mode;
  onComplete?: () => void;
}) {
  const [open, setOpen] = useState(mode === "interview");
  const [loading, setLoading] = useState(mode === "loader");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "loader") return;

    const timer = window.setTimeout(() => {
      setLoading(false);
      onComplete?.();
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [mode, onComplete]);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();

    if (!content || sending) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
    };

    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
          user: getUserContext(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to reach LiveProject AI.");
      }

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-error`,
          role: "assistant",
          content:
            "I’m having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  if (mode === "interview") {
    return (
      <div className="relative min-h-[430px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <style jsx>{`
          .interview-orb {
            animation: interviewOrb 7s ease-in-out infinite;
          }

          .interview-ring {
            animation: interviewRing 14s linear infinite;
          }

          @keyframes interviewOrb {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.35;
            }

            50% {
              transform: scale(1.12);
              opacity: 0.6;
            }
          }

          @keyframes interviewRing {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(37,99,235,0.22),transparent_42%)]" />

        <div className="interview-orb absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex min-h-[370px] flex-col items-center justify-center text-center">
          <div className="interview-ring absolute h-52 w-52 rounded-full border border-blue-400/10" />

          <RobotAvatar />

          <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-blue-400">
            LiveProject AI Interviewer
          </p>

          <h3 className="mt-3 text-2xl font-black">
            Your AI interviewer is ready.
          </h3>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            Role-specific questions, adaptive follow-ups and performance
            feedback — powered by LiveProject AI.
          </p>

          <div className="mt-7 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Premium feature
          </div>
        </div>
      </div>
    );
  }

  if (mode === "loader" && loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-slate-950">
        <style jsx>{`
          .loader-orb {
            animation: loaderOrb 6s ease-in-out infinite;
          }

          .loader-ring {
            animation: loaderRing 12s linear infinite;
          }

          @keyframes loaderOrb {
            0%,
            100% {
              transform: scale(1);
              opacity: 0.3;
            }

            50% {
              transform: scale(1.12);
              opacity: 0.65;
            }
          }

          @keyframes loaderRing {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}</style>

        <div className="loader-orb absolute h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="loader-ring absolute h-56 w-56 rounded-full border border-blue-400/10" />

        <div className="flex flex-col items-center text-center text-white">
          <RobotAvatar />

          <p className="mt-7 text-sm font-black uppercase tracking-[0.25em] text-blue-400">
            LiveProject AI
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Preparing your experience...
          </p>

          <div className="mt-5 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .lp-ai-window {
          animation: lpAiWindowIn 0.35s ease-out both;
        }

        .lp-ai-button {
          animation: lpAiButtonFloat 5s ease-in-out infinite;
        }

        .lp-ai-glow {
          animation: lpAiGlow 4s ease-in-out infinite;
        }

        .lp-ai-header-glow {
          animation: lpAiHeaderGlow 5s ease-in-out infinite;
        }

        .lp-ai-avatar-float {
          animation: lpAiAvatarFloat 4.5s ease-in-out infinite;
        }

        .lp-ai-message-in {
          animation: lpAiMessageIn 0.3s ease-out both;
        }

        .lp-ai-quick {
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .lp-ai-quick:hover {
          transform: translateY(-2px);
        }

        @keyframes lpAiWindowIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes lpAiButtonFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes lpAiGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(1);
          }

          50% {
            opacity: 0.7;
            transform: scale(1.08);
          }
        }

        @keyframes lpAiHeaderGlow {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(22px);
          }
        }

        @keyframes lpAiAvatarFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-3px);
          }
        }

        @keyframes lpAiMessageIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {open && (
        <div className="lp-ai-window fixed bottom-24 right-4 z-[90] w-[calc(100vw-2rem)] max-w-[410px] overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.3)] sm:right-6">
          {/* HEADER */}
          <div className="relative overflow-hidden bg-slate-950 px-5 py-4 text-white">
            <div className="lp-ai-header-glow pointer-events-none absolute -right-20 -top-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="lp-ai-avatar-float">
                  <RobotAvatar small />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-black tracking-tight">
                      LiveProject AI
                    </p>

                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  </div>

                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Career & project intelligence
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close LiveProject AI"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div
            ref={scrollRef}
            className="relative h-[410px] space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4"
          >
            <div className="lp-ai-glow pointer-events-none absolute -right-20 top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />

            {messages.map((message) => (
              <div
                key={message.id}
                className={`lp-ai-message-in relative flex gap-2.5 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="pt-1">
                    <RobotAvatar small />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#0b5cff] text-white shadow-blue-500/10"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && !sending && (
              <div className="relative space-y-2 pt-2">
                <p className="px-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Suggested
                </p>

                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="lp-ai-quick block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left text-xs font-semibold text-slate-600 hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {sending && (
              <div className="relative flex items-center gap-2 pl-1 text-xs text-slate-400">
                <div className="lp-ai-avatar-float">
                  <RobotAvatar small />
                </div>

                <span>LiveProject AI is thinking...</span>

                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
              </div>
            )}
          </div>

          {/* INPUT */}
          <form
            onSubmit={submit}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-blue-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.06)]">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Message LiveProject AI..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0b5cff] text-white transition hover:-translate-y-0.5 hover:bg-[#084ed8] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FLOATING AI BUTTON */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="lp-ai-button fixed bottom-5 right-4 z-[91] flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/20 bg-slate-950 text-white shadow-[0_15px_50px_rgba(15,23,42,0.32)] transition hover:scale-105 hover:shadow-[0_20px_60px_rgba(37,99,235,0.32)] sm:bottom-6 sm:right-6"
        aria-label={open ? "Close LiveProject AI" : "Open LiveProject AI"}
      >
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />

        <div className="relative">
          <RobotAvatar small />
        </div>
      </button>
    </>
  );
}