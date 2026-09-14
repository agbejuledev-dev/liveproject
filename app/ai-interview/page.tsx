"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Mic2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Video,
  Volume2,
  X,
} from "lucide-react";

type InterviewMode =
  | "ready"
  | "setup"
  | "live"
  | "complete"
  | "report";

type InterviewQuestion = {
  id: number;
  question: string;
  category: string;
  followUp: string;
};

const questions: InterviewQuestion[] = [
  {
    id: 1,
    question:
      "Tell me about yourself and the experience that makes you a strong candidate for this role.",
    category: "Introduction",
    followUp:
      "Which part of your background is most relevant to the role you are targeting?",
  },
  {
    id: 2,
    question:
      "Tell me about a project you worked on where you had to solve a difficult problem.",
    category: "Experience",
    followUp:
      "What specifically did you do, and what was the outcome?",
  },
  {
    id: 3,
    question:
      "How do you approach working with stakeholders who have different priorities?",
    category: "Collaboration",
    followUp:
      "Can you give me a practical example?",
  },
  {
    id: 4,
    question:
      "Describe a time when something changed unexpectedly during a project.",
    category: "Adaptability",
    followUp:
      "How did you respond and what did you learn?",
  },
  {
    id: 5,
    question:
      "What is your strongest technical or professional skill, and how have you demonstrated it?",
    category: "Skills",
    followUp:
      "How would that skill create value for this organisation?",
  },
  {
    id: 6,
    question:
      "Why are you interested in this role and why should we choose you?",
    category: "Motivation",
    followUp:
      "What would you aim to accomplish in your first 90 days?",
  },
];

const STORAGE_KEY = "liveproject_ai_interviews";

export default function AIInterviewPage() {
  const [mode, setMode] = useState<InterviewMode>("ready");
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [answerSeconds, setAnswerSeconds] = useState(90);
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showExit, setShowExit] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);

  useEffect(() => {
    if (mode !== "live") return;

    const interval = window.setInterval(() => {
      setElapsed((value) => value + 1);
      setAnswerSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode]);

  const currentQuestion = questions[questionIndex];

  const minutes = Math.floor(elapsed / 60);
  const seconds = String(elapsed % 60).padStart(2, "0");

  const report = useMemo(() => {
    const answered = answers.filter((item) => item.trim()).length;
    const clarity = Math.min(96, 66 + answered * 5);
    const structure = Math.min(94, 64 + answered * 5);
    const relevance = Math.min(95, 68 + answered * 4);
    const confidence = Math.min(92, 62 + answered * 5);
    const overall = Math.round(
      (clarity + structure + relevance + confidence) / 4
    );

    return {
      answered,
      clarity,
      structure,
      relevance,
      confidence,
      overall,
    };
  }, [answers]);

  function saveInterview() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);

      const existing = raw ? JSON.parse(raw) : [];

      existing.push({
        id: `interview-${Date.now()}`,
        role,
        difficulty,
        duration: elapsed,
        score: report.overall,
        answered: report.answered,
        completedAt: new Date().toISOString(),
      });

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } catch {
      // Prototype storage failure should not block the UI.
    }

    setReportSaved(true);
  }

  function startInterview() {
    setQuestionIndex(0);
    setElapsed(0);
    setAnswerSeconds(90);
    setAnswer("");
    setAnswers([]);
    setCameraOn(false);
    setMicOn(true);
    setReportSaved(false);
    setMode("live");
  }

  function submitAnswer() {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = answer;
    setAnswers(nextAnswers);

    if (questionIndex >= questions.length - 1) {
      setMode("complete");
      return;
    }

    setQuestionIndex((value) => value + 1);
    setAnswer("");
    setAnswerSeconds(90);
  }

  function resetInterview() {
    setMode("ready");
    setQuestionIndex(0);
    setElapsed(0);
    setAnswer("");
    setAnswers([]);
  }

  return (
    <main className="min-h-screen bg-[#061d1d] text-white">
      <style jsx global>{`
        @keyframes interviewGrid {
          0% {
            background-position: 0 0;
          }

          100% {
            background-position: 48px 48px;
          }
        }

        @keyframes interviewPulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.45;
          }

          50% {
            transform: scale(1.05);
            opacity: 0.85;
          }
        }

        @keyframes interviewFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes interviewBars {
          0%,
          100% {
            transform: scaleY(0.35);
          }

          50% {
            transform: scaleY(1);
          }
        }

        .interview-grid {
          background-image:
            linear-gradient(rgba(45, 212, 191, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45, 212, 191, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: interviewGrid 18s linear infinite;
        }
      `}</style>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061d1d]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/premium-dashboard"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                Premium Career Tool
              </p>
              <h1 className="text-lg font-black">AI Interview</h1>
            </div>
          </div>

          {mode === "live" && (
            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-black text-red-300">
                LIVE
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300">
                {minutes}:{seconds}
              </div>
            </div>
          )}
        </div>
      </header>

      {mode === "ready" && (
        <section className="relative min-h-[calc(100vh-73px)] overflow-hidden">
          <div className="interview-grid absolute inset-0 opacity-70" />

          <div
            className="absolute -right-32 top-16 h-[420px] w-[420px] rounded-full bg-teal-400/15 blur-3xl"
            style={{ animation: "interviewPulse 6s ease-in-out infinite" }}
          />

          <div
            className="absolute -left-28 bottom-0 h-[380px] w-[380px] rounded-full bg-cyan-400/10 blur-3xl"
            style={{ animation: "interviewPulse 8s ease-in-out infinite" }}
          />

          <div className="relative mx-auto grid max-w-[1500px] gap-12 px-5 py-16 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-teal-200">
                <Sparkles size={14} />
                LIVEPROJECT AI INTERVIEWER
              </div>

              <h2 className="mt-6 max-w-3xl text-5xl font-black tracking-[-0.05em] sm:text-6xl">
                Practice like the{" "}
                <span className="text-teal-300">real interview.</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Enter a realistic interview room where LiveProject AI asks
                role-specific questions, follows up on your answers, and gives
                you structured feedback when you finish.
              </p>

              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                {[
                  {
                    icon: Video,
                    title: "Interview room",
                    text: "Practice with camera and microphone.",
                  },
                  {
                    icon: Mic2,
                    title: "AI follow-ups",
                    text: "Questions adapt to your answers.",
                  },
                  {
                    icon: Target,
                    title: "Role-focused",
                    text: "Questions match your target role.",
                  },
                  {
                    icon: FileText,
                    title: "Detailed report",
                    text: "Review your performance afterwards.",
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                    >
                      <Icon size={18} className="text-teal-300" />

                      <h3 className="mt-3 text-sm font-black">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setMode("setup")}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-2xl bg-teal-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-300"
              >
                Enter Interview Room
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="relative hidden min-h-[500px] lg:block">
              <div
                className="absolute right-0 top-8 w-[470px] rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur"
                style={{ animation: "interviewFloat 6s ease-in-out infinite" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      LiveProject AI
                    </div>

                    <div className="mt-1 text-2xl font-black">
                      Interviewer ready
                    </div>
                  </div>

                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                    <Bot size={27} />

                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-[#102f2e]" />
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-black/20 p-5">
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border border-teal-300/20 bg-teal-400/10">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-400 text-slate-950 shadow-2xl shadow-teal-400/20">
                      <Bot size={38} />
                    </div>
                  </div>

                  <div className="mt-5 text-center">
                    <div className="text-sm font-black">
                      Your AI interviewer
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      Calm. Professional. Role-focused.
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-teal-400 p-4 text-slate-950">
                  <div className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Ready prompt
                  </div>

                  <div className="mt-1 text-sm font-bold">
                    &quot;Tell me about a project where you solved a difficult
                    problem.&quot;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {mode === "setup" && (
        <section className="min-h-[calc(100vh-73px)] px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                Interview Setup
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Configure your practice session.
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Choose the role and difficulty you want the AI interviewer to
                simulate.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <label className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Target Role
                </label>

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-[#0a2928] px-4 py-3.5 text-sm font-bold text-white outline-none"
                >
                  <option>Frontend Developer</option>
                  <option>React Developer</option>
                  <option>Product Manager</option>
                  <option>Business Analyst</option>
                  <option>Project Manager</option>
                  <option>Scrum Master</option>
                  <option>QA Engineer</option>
                  <option>UX Designer</option>
                  <option>Data Analyst</option>
                </select>
              </div>

              <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
                <label className="text-xs font-black uppercase tracking-wide text-slate-400">
                  Difficulty
                </label>

                <select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/10 bg-[#0a2928] px-4 py-3.5 text-sm font-bold text-white outline-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="mt-5 rounded-[1.8rem] border border-white/10 bg-white/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                  <Clock3 size={21} />
                </div>

                <div>
                  <h3 className="text-lg font-black">
                    About this session
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    You will receive {questions.length} questions covering
                    introduction, experience, collaboration, adaptability,
                    skills and motivation. Each answer has up to 90 seconds.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                onClick={() => setMode("ready")}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300"
              >
                Back
              </button>

              <button
                onClick={startInterview}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-black text-slate-950"
              >
                Start Interview
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {mode === "live" && (
        <section className="min-h-[calc(100vh-73px)] p-4 lg:p-6">
          <div className="mx-auto grid max-w-[1500px] gap-5 lg:grid-cols-[1fr_380px]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a2726] shadow-2xl">
              <div className="border-b border-white/8 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      {role}
                    </p>

                    <div className="mt-1 text-sm font-bold text-white">
                      Question {questionIndex + 1} of {questions.length}
                    </div>
                  </div>

                  <div className="rounded-full bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-teal-300">
                    {currentQuestion.category}
                  </div>
                </div>
              </div>

              <div className="relative aspect-video min-h-[320px] bg-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div
                      className="absolute inset-[-30px] rounded-full bg-teal-400/20 blur-3xl"
                      style={{ animation: "interviewPulse 3s ease-in-out infinite" }}
                    />

                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-teal-300/20 bg-teal-400/10">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-400 text-slate-950">
                        <Bot size={38} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-red-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  Live
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
                  <div className="rounded-xl bg-black/60 px-3 py-2 text-xs font-bold text-white backdrop-blur">
                    LiveProject AI
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCameraOn((value) => !value)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur ${
                        cameraOn
                          ? "bg-teal-400 text-slate-950"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <Camera size={16} />
                    </button>

                    <button
                      onClick={() => setMicOn((value) => !value)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur ${
                        micOn
                          ? "bg-teal-400 text-slate-950"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      <Mic2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/8 p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock3 size={14} />
                    {answerSeconds}s remaining
                  </div>

                  <div className="h-2 w-28 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-teal-300 transition-all duration-1000"
                      style={{
                        width: `${(answerSeconds / 90) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
                  {currentQuestion.question}
                </h2>

                <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-teal-300">
                    <Volume2 size={14} />
                    AI FOLLOW-UP LOGIC
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    After your answer, the interviewer can probe deeper into
                    your example before moving on.
                  </p>
                </div>

                <textarea
                  value={answer}
                  onChange={(event) => setAnswer(event.target.value)}
                  rows={7}
                  placeholder="Speak your answer or type it here for this prototype..."
                  className="mt-5 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-teal-400"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <button
                    onClick={() => setShowExit(true)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300"
                  >
                    Exit Interview
                  </button>

                  <button
                    onClick={submitAnswer}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-black text-slate-950"
                  >
                    {questionIndex >= questions.length - 1
                      ? "Finish Interview"
                      : "Submit Answer"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                      Session
                    </p>
                    <p className="mt-1 text-xl font-black">
                      {difficulty}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400 text-slate-950">
                    <Target size={19} />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold ${
                        index === questionIndex
                          ? "bg-teal-400 text-slate-950"
                          : index < questionIndex
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-white/5 text-slate-500"
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10 text-[10px] font-black">
                        {index + 1}
                      </span>

                      <span className="truncate">
                        {question.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-teal-300">
                  <Sparkles size={14} />
                  Interview tip
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Use a real example. Explain the situation, what you did, why
                  you did it, and what changed because of your work.
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}

      {mode === "complete" && (
        <section className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-16">
          <div className="w-full max-w-2xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-teal-400 text-slate-950 shadow-2xl shadow-teal-400/20">
              <CheckCircle2 size={38} />
            </div>

            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-teal-300">
              Interview complete
            </p>

            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Nice work.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Your interview session has been completed. Review your
              performance report to see where you are strongest and where more
              practice could help.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-black">
                  {answers.filter(Boolean).length}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Answers submitted
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-black">{questions.length}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Questions
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-2xl font-black">
                  {minutes}:{seconds}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Total time
                </div>
              </div>
            </div>

            <button
              onClick={() => setMode("report")}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-teal-400 px-6 py-3.5 text-sm font-black text-slate-950"
            >
              View Interview Report
              <ArrowRight size={17} />
            </button>
          </div>
        </section>
      )}

      {mode === "report" && (
        <section className="min-h-[calc(100vh-73px)] px-5 py-12 lg:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-300">
                  Performance Report
                </p>

                <h2 className="mt-2 text-4xl font-black tracking-tight">
                  Your interview results
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {role} · {difficulty}
                </p>
              </div>

              <button
                onClick={saveInterview}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-black text-slate-950"
              >
                {reportSaved ? (
                  <>
                    <CheckCircle2 size={15} />
                    Report Saved
                  </>
                ) : (
                  <>
                    <FileText size={15} />
                    Save Report
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Overall Score
                </p>

                <div className="mt-4 text-7xl font-black text-teal-300">
                  {report.overall}
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  out of 100
                </p>

                <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-teal-300"
                    style={{ width: `${report.overall}%` }}
                  />
                </div>

                <div className="mt-6 rounded-2xl bg-black/20 p-4">
                  <div className="flex items-center gap-2 text-sm font-black text-teal-300">
                    <Sparkles size={15} />
                    AI Summary
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    You demonstrated a good foundation. Focus on giving
                    specific examples, quantifying outcomes, and structuring
                    answers clearly.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Clarity", report.clarity],
                  ["Structure", report.structure],
                  ["Relevance", report.relevance],
                  ["Confidence", report.confidence],
                ].map(([label, score]) => (
                  <div
                    key={String(label)}
                    className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black">
                        {label}
                      </span>
                      <span className="text-lg font-black text-teal-300">
                        {score}
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-teal-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <p className="mt-4 text-xs leading-5 text-slate-500">
                      {label === "Clarity"
                        ? "Your responses should be easy to understand and direct."
                        : label === "Structure"
                          ? "Use a logical beginning, action and outcome."
                          : label === "Relevance"
                            ? "Keep examples closely connected to the question."
                            : "Project confidence through specific examples and ownership."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <h3 className="text-xl font-black">
                Recommended next steps
              </h3>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  "Practise STAR-style answers",
                  "Add more measurable outcomes",
                  "Repeat the interview with harder questions",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-black/20 p-4"
                  >
                    <CheckCircle2 size={17} className="text-teal-300" />
                    <p className="mt-3 text-sm font-bold text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={resetInterview}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300"
              >
                <RotateCcw size={15} />
                Practise Again
              </button>

              <Link
                href="/job-readiness"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-sm font-black text-slate-950"
              >
                Check Job Readiness
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {showExit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0a2726] p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
              <X size={22} />
            </div>

            <h3 className="mt-5 text-xl font-black">
              Leave this interview?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your current session will not be saved as a completed interview.
            </p>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setShowExit(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300"
              >
                Keep Practising
              </button>

              <button
                onClick={() => {
                  setShowExit(false);
                  resetInterview();
                }}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-black text-white"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}