"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Link2,
  Send,
  Upload,
  X,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  track: string;
  level: string;
  description: string;
  deliverables: string[];
};

type Submission = {
  projectId: string;
  projectTitle: string;
  submittedAt: string;
  status: "submitted" | "changes_requested" | "approved";
  description: string;
  files: string[];
  links: string[];
};

export default function SubmitProjectPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = String(params.projectId);

  const [project, setProject] = useState<Project | null>(null);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([""]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const registration = sessionStorage.getItem("liveproject_registration");
      const onboarding = sessionStorage.getItem("liveproject_onboarding");
      const session = sessionStorage.getItem("liveproject_session");

      if (!registration || !onboarding || !session) {
        router.replace("/register");
        return;
      }

      const activeProject = sessionStorage.getItem("liveproject_active_project");

      if (!activeProject) {
        router.replace("/projects");
        return;
      }

      const parsedProject = JSON.parse(activeProject);

      if (String(parsedProject.id) !== projectId) {
        router.replace("/projects");
        return;
      }

      setProject(parsedProject);

      const existingSubmission = sessionStorage.getItem(
        `liveproject_submission_${projectId}`,
      );

      if (existingSubmission) {
        const parsedSubmission: Submission = JSON.parse(existingSubmission);

        setDescription(parsedSubmission.description || "");
        setFiles(parsedSubmission.files || []);
        setLinks(
          parsedSubmission.links?.length
            ? parsedSubmission.links
            : [""],
        );
        setSubmitted(true);
      }
    } catch {
      router.replace("/projects");
    }
  }, [projectId, router]);

  const validLinks = useMemo(
    () => links.filter((link) => link.trim().length > 0),
    [links],
  );

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFiles = Array.from(event.target.files || []);

    const names = selectedFiles.map((file) => file.name);

    setFiles((current) => [...current, ...names]);
  }

  function removeFile(fileName: string) {
    setFiles((current) =>
      current.filter((file) => file !== fileName),
    );
  }

  function updateLink(index: number, value: string) {
    setLinks((current) =>
      current.map((link, i) => (i === index ? value : link)),
    );
  }

  function addLink() {
    setLinks((current) => [...current, ""]);
  }

  function removeLink(index: number) {
    setLinks((current) => {
      const updated = current.filter((_, i) => i !== index);

      return updated.length ? updated : [""];
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError("");

    if (!project) {
      setError("Project information could not be loaded.");
      return;
    }

    if (!description.trim()) {
      setError(
        "Please provide a short description of the work you completed.",
      );
      return;
    }

    if (files.length === 0 && validLinks.length === 0) {
      setError(
        "Please add at least one file or project link before submitting.",
      );
      return;
    }

    const submission: Submission = {
      projectId,
      projectTitle: project.title,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      description: description.trim(),
      files,
      links: validLinks,
    };

    sessionStorage.setItem(
      `liveproject_submission_${projectId}`,
      JSON.stringify(submission),
    );

    const startedProjectsRaw = sessionStorage.getItem(
      "liveproject_started_projects",
    );

    if (startedProjectsRaw) {
      try {
        const startedProjects = JSON.parse(startedProjectsRaw);

        const updatedProjects = Array.isArray(startedProjects)
          ? startedProjects.map((item: any) =>
              String(item.id) === projectId
                ? {
                    ...item,
                    status: "submitted",
                    submittedAt: submission.submittedAt,
                  }
                : item,
            )
          : startedProjects;

        sessionStorage.setItem(
          "liveproject_started_projects",
          JSON.stringify(updatedProjects),
        );
      } catch {
        // Keep submission successful even if the project list cannot be updated.
      }
    }

    setSubmitted(true);
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading submission workspace...
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#f7f9fc] px-5 py-10">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() =>
              router.push(`/workspace/${projectId}`)
            }
            className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            <ArrowLeft size={17} />
            Back to Workspace
          </button>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2
                  size={42}
                  className="text-emerald-600"
                />
              </div>

              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Submission Received
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Your project is under review.
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Your work has been submitted successfully. A project
                reviewer can now review your deliverables and provide
                feedback.
              </p>

              <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Project
                </p>

                <p className="mt-2 font-semibold text-slate-950">
                  {project.title}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="rounded-full bg-white px-3 py-1.5">
                    {project.track}
                  </span>

                  <span className="rounded-full bg-white px-3 py-1.5">
                    {project.level}
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700">
                    Under Review
                  </span>
                </div>
              </div>

              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                <button
                  onClick={() =>
                    router.push(`/workspace/${projectId}`)
                  }
                  className="flex-1 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Return to Workspace
                </button>

                <button
                  onClick={() => router.push("/workspace")}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] px-5 py-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() =>
            router.push(`/workspace/${projectId}`)
          }
          className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft size={17} />
          Back to Workspace
        </button>

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Final Submission
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
            Submit your project
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Submit the work you completed for review. Your submission
            will become part of your LiveProject experience record once
            the project is approved.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Project
          </p>

          <h2 className="mt-2 text-xl font-bold text-slate-950">
            {project.title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {project.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-950">
                Project summary
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Explain what you built, what you contributed, and the
                approach you took.
              </p>
            </div>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the work you completed..."
              rows={8}
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-950">
                Deliverables
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Upload the files that demonstrate your completed work.
              </p>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <Upload size={24} className="text-blue-600" />
              </div>

              <p className="font-semibold text-slate-950">
                Upload deliverables
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Select files from your computer
              </p>

              <input
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {files.length > 0 && (
              <div className="mt-5 space-y-2">
                {files.map((file) => (
                  <div
                    key={file}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <FileText
                        size={18}
                        className="shrink-0 text-blue-600"
                      />

                      <span className="truncate text-sm font-medium text-slate-700">
                        {file}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="ml-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-950">
                Project links
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add links to live demos, GitHub repositories, Figma
                files, reports, dashboards, or other relevant work.
              </p>
            </div>

            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Link2
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={link}
                      onChange={(event) =>
                        updateLink(index, event.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  {links.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="rounded-xl border border-slate-200 p-3 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addLink}
              className="mt-4 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              + Add another link
            </button>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-950">
                Ready to submit?
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Make sure your deliverables and project links are
                correct. Once submitted, the project will move into
                review.
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Send size={18} />
              Submit Project for Review
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}