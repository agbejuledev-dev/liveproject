"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Link2,
  MessageSquare,
  Send,
  Upload,
  X,
} from "lucide-react";

const deliverables = [
  {
    id: 1,
    title: "Project requirements document",
    required: true,
    completed: true,
  },
  {
    id: 2,
    title: "Responsive frontend implementation",
    required: true,
    completed: false,
  },
  {
    id: 3,
    title: "GitHub repository",
    required: true,
    completed: false,
  },
  {
    id: 4,
    title: "Project presentation",
    required: false,
    completed: false,
  },
];

export default function SubmissionPage() {
  const [title, setTitle] = useState(
    "E-commerce Conversion Optimization"
  );
  const [summary, setSummary] = useState("");
  const [challenges, setChallenges] = useState("");
  const [learnings, setLearnings] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const addFile = () => {
    const mockFile = `Project-evidence-${files.length + 1}.pdf`;
    setFiles((current) => [...current, mockFile]);
  };

  const removeFile = (file: string) => {
    setFiles((current) => current.filter((item) => item !== file));
  };

  const handleSubmit = () => {
    if (!summary.trim()) {
      alert("Please provide a project summary.");
      return;
    }

    setSubmitted(true);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
            <a
              href="/workspace"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to workspace
            </a>

            <span className="text-lg font-black">
              Live<span className="text-blue-600">Project</span>
            </span>
          </div>
        </header>

        <div className="mx-auto flex max-w-3xl px-6 py-16 lg:py-24">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm lg:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={40} />
            </div>

            <p className="mt-7 text-sm font-bold text-emerald-600">
              SUBMISSION RECEIVED
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Your project is now under review.
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
              Your deliverables have been submitted successfully. The project
              owner can now review your work and provide feedback.
            </p>

            <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Review status</span>

                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                  Awaiting Review
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-1/2 rounded-full bg-blue-600" />
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Once reviewed, your project status and feedback will appear
                here.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/workspace"
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700"
              >
                Return to Workspace
              </a>

              <a
                href="/applications"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                View Applications
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/workspace"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Back to workspace
          </a>

          <div className="text-lg font-black">
            Live<span className="text-blue-600">Project</span>
          </div>

          <span className="hidden text-xs font-semibold text-slate-400 sm:block">
            Project Submission
          </span>
        </div>
      </header>

      {/* PAGE */}
      <div className="mx-auto max-w-6xl px-6 py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
          {/* LEFT */}
          <div>
            <div>
              <p className="text-sm font-bold text-blue-600">
                FINAL SUBMISSION
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Submit your project
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                Document what you built, what you learned and the evidence
                behind your contribution. Your submission becomes part of your
                professional experience record.
              </p>
            </div>

            {/* PROJECT */}
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <FileText size={21} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-blue-600">
                    NOVA COMMERCE
                  </p>

                  <h2 className="mt-1 text-lg font-bold">
                    {title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Frontend Developer · 4 weeks · Team project
                  </p>
                </div>
              </div>
            </section>

            {/* SUMMARY */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div>
                <label className="text-sm font-bold">
                  Project summary
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  Explain what you worked on and what you delivered.
                </p>

                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={6}
                  placeholder="Describe your contribution, the problem you worked on, what you built and the outcome..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  Challenges encountered
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  What problems did you face and how did you solve them?
                </p>

                <textarea
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  rows={5}
                  placeholder="Tell us about the technical, product or teamwork challenges you encountered..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="mt-6">
                <label className="text-sm font-bold">
                  Key learnings
                </label>

                <p className="mt-1 text-xs text-slate-500">
                  What did this project teach you?
                </p>

                <textarea
                  value={learnings}
                  onChange={(e) => setLearnings(e.target.value)}
                  rows={5}
                  placeholder="Describe the skills, processes or professional lessons you gained..."
                  className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 outline-none transition focus:border-blue-500 focus:bg-white"
                />
              </div>
            </section>

            {/* LINKS */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Link2 size={18} />
                </div>

                <div>
                  <h2 className="font-bold">Project links</h2>

                  <p className="text-xs text-slate-500">
                    Add links that help verify your work.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-600">
                    GitHub repository
                  </label>

                  <input
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">
                    Live project URL
                  </label>

                  <input
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            </section>

            {/* EVIDENCE */}
            <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <Upload size={18} />
                </div>

                <div>
                  <h2 className="font-bold">Evidence & files</h2>

                  <p className="text-xs text-slate-500">
                    Upload screenshots, documents or other project evidence.
                  </p>
                </div>
              </div>

              <button
                onClick={addFile}
                className="mt-5 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                  <Upload size={20} />
                </div>

                <p className="mt-4 text-sm font-bold">
                  Click to add evidence
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PDF, PNG, JPG or other project documentation
                </p>
              </button>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                          <FileText size={16} />
                        </div>

                        <span className="text-sm font-medium">
                          {file}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFile(file)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SUBMIT */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <a
                href="/workspace"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Save & Continue Later
              </a>

              <button
                onClick={handleSubmit}
                disabled={submitted}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                <Send size={16} />
                Submit for Review
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside>
            <div className="sticky top-24 space-y-5">
              {/* PROGRESS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">Submission checklist</h2>

                  <span className="text-xs font-bold text-blue-600">
                    1 / 4
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-1/4 rounded-full bg-blue-600" />
                </div>

                <div className="mt-6 space-y-4">
                  {deliverables.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                          item.completed
                            ? "bg-emerald-500 text-white"
                            : "border-2 border-slate-200"
                        }`}
                      >
                        {item.completed && <CheckCircle2 size={13} />}
                      </div>

                      <div>
                        <p className="text-sm font-semibold">
                          {item.title}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {item.required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REVIEW INFO */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
                <MessageSquare
                  size={20}
                  className="text-blue-600"
                />

                <h3 className="mt-4 font-bold text-blue-950">
                  What happens after submission?
                </h3>

                <div className="mt-4 space-y-3 text-sm leading-6 text-blue-900/70">
                  <p>
                    1. Your project owner reviews your submission.
                  </p>

                  <p>
                    2. They can approve it or request changes.
                  </p>

                  <p>
                    3. Feedback is added to your project record.
                  </p>

                  <p>
                    4. Approved work can contribute to your verified
                    experience.
                  </p>
                </div>
              </div>

              {/* PREMIUM */}
              <div className="rounded-2xl bg-slate-950 p-6 text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <ImageIcon size={18} />
                </div>

                <h3 className="mt-4 font-bold">
                  Want deeper feedback?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Premium projects can include detailed professional
                  assessment, scoring, strengths, weaknesses and recommendations
                  for improvement.
                </p>

                <button className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950 hover:bg-slate-100">
                  Learn about Premium
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}