// app/projects/page.tsx

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Lock,
  Rocket,
  Search,
  Sparkles,
} from "lucide-react";

import {
  allProjects,
  tracks,
  type Project,
} from "@/lib/projects";

import {
  getLiveProjectSession,
  saveAfterAuthDestination,
} from "@/lib/access";

export default function ProjectsPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [selectedTrack, setSelectedTrack] =
    useState("All Tracks");
  const [selectedAccess, setSelectedAccess] =
    useState("All Access");

  const filteredProjects = useMemo(() => {
    const search = query.trim().toLowerCase();

    return allProjects.filter((project) => {
      const matchesSearch =
        !search ||
        project.title.toLowerCase().includes(search) ||
        project.company.toLowerCase().includes(search) ||
        project.track.toLowerCase().includes(search);

      const matchesTrack =
        selectedTrack === "All Tracks" ||
        project.track === selectedTrack;

      const matchesAccess =
        selectedAccess === "All Access" ||
        (selectedAccess === "Free" &&
          project.access === "free") ||
        (selectedAccess === "Premium" &&
          project.access === "premium");

      return (
        matchesSearch &&
        matchesTrack &&
        matchesAccess
      );
    });
  }, [
    query,
    selectedTrack,
    selectedAccess,
  ]);

  function handleProjectClick(project: Project) {
    const session = getLiveProjectSession();

    /*
      Logged-in users can enter the project directly.
    */
    if (session?.loggedIn) {
      router.push(`/projects/${project.id}`);
      return;
    }

    /*
      Visitors must authenticate first.
      We remember the exact project they selected.
    */
    saveAfterAuthDestination(
      `/projects/${project.id}`
    );

    router.push("/register");
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-950">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Rocket className="h-5 w-5" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                LiveProject
              </p>

              <p className="hidden text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Experience First
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:text-slate-950 sm:block"
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-600"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* BACK */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm font-bold text-slate-500 transition hover:text-blue-600"
          >
            ← Back to LiveProject
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-slate-950 px-5 py-20 text-white sm:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-blue-300">
              Real-world projects
            </span>

            <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Build experience
              <br />
              <span className="text-blue-400">
                you can prove.
              </span>
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
              Explore opportunities across LiveProject career
              tracks. Create an account to unlock the full project
              brief and begin building verified experience.
            </p>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="mt-12 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search projects, companies or tracks..."
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 text-sm font-medium text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <select
              value={selectedTrack}
              onChange={(event) =>
                setSelectedTrack(event.target.value)
              }
              className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white outline-none focus:border-blue-500"
            >
              <option
                value="All Tracks"
                className="text-slate-950"
              >
                All Tracks
              </option>

              {tracks.map((track) => (
                <option
                  key={track}
                  value={track}
                  className="text-slate-950"
                >
                  {track}
                </option>
              ))}
            </select>

            <select
              value={selectedAccess}
              onChange={(event) =>
                setSelectedAccess(event.target.value)
              }
              className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white outline-none focus:border-blue-500"
            >
              <option
                value="All Access"
                className="text-slate-950"
              >
                All Access
              </option>

              <option
                value="Free"
                className="text-slate-950"
              >
                Free
              </option>

              <option
                value="Premium"
                className="text-slate-950"
              >
                Premium
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* PROJECT LIST */}
      <section className="px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-600">
                Explore
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Available Projects
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Browse opportunities. Create an account to unlock
                the full brief.
              </p>
            </div>

            <p className="text-sm font-bold text-slate-400">
              {filteredProjects.length} projects
            </p>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* TEASER HEADER */}
                  <div className="border-b border-slate-100 bg-slate-50 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500 shadow-sm">
                        {project.track}
                      </span>

                      {project.access === "premium" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700">
                          <Sparkles className="h-3.5 w-3.5" />
                          Premium
                        </span>
                      ) : (
                        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TEASER CONTENT */}
                  <div className="p-7">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-600">
                      {project.company}
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-2xl font-black tracking-tight text-slate-950">
                      {project.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-slate-500">
                      A practical project experience designed to
                      help you build evidence of your capabilities.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        {project.level}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        {project.format}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        {project.duration}
                      </span>
                    </div>

                    {/* PROTECTED CONTENT */}
                    <div className="mt-7 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400">
                          <Lock className="h-4 w-4" />
                        </div>

                        <div>
                          <p className="text-sm font-black text-slate-800">
                            Full project brief locked
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Create your LiveProject account to see the
                            complete project details, skills,
                            deliverables and expectations.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTION */}
                    <button
                      type="button"
                      onClick={() =>
                        handleProjectClick(project)
                      }
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-blue-600"
                    >
                      Get Started
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-16 text-center">
              <p className="text-lg font-black text-slate-950">
                No projects found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 px-5 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Ready to build real experience?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-blue-100">
            Create your account to unlock project details and start
            your LiveProject journey.
          </p>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-black text-blue-600 transition hover:bg-blue-50"
          >
            Create Account
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#05070b] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <Rocket className="h-4 w-4" />
            </div>

            <span className="font-black">
              LiveProject
            </span>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-500">
            <button
              type="button"
              onClick={() => router.push("/about")}
              className="hover:text-white"
            >
              About
            </button>

            <button
              type="button"
              onClick={() => router.push("/blog")}
              className="hover:text-white"
            >
              Blog
            </button>

            <button
              type="button"
              onClick={() => router.push("/resources")}
              className="hover:text-white"
            >
              Resources
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}