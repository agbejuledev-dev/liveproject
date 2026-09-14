"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Search,
  Star,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type Professional = {
  id: string;
  name?: string;
  title?: string;
  country?: string;
  track?: string;
  level?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  rating?: number;
  projectsCompleted?: number;
  verified?: boolean;
  availability?: string;
  portfolio?: string;
  email?: string;
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSavedTalent(list: Professional[]) {
  try {
    sessionStorage.setItem(
      "liveproject_saved_talent",
      JSON.stringify(list)
    );
  } catch {
    // Prototype storage.
  }
}

export default function SavedTalentPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [savedTalent, setSavedTalent] = useState<Professional[]>([]);
  const [query, setQuery] = useState("");
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);

  useEffect(() => {
    const session = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role = session.role ?? session.accountType;

    if (role === "professional") {
      router.replace("/workspace");
      return;
    }

    const onboarding = readStorage(
      "liveproject_client_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/business-onboarding");
      return;
    }

    const saved = readStorage<Professional[]>(
      "liveproject_saved_talent",
      []
    );

    setSavedTalent(Array.isArray(saved) ? saved : []);
    setReady(true);
  }, [router]);

  const filteredTalent = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return savedTalent;

    return savedTalent.filter((professional) => {
      const searchable = [
        professional.name,
        professional.title,
        professional.country,
        professional.track,
        professional.level,
        professional.bio,
        professional.experience,
        ...(professional.skills || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }, [savedTalent, query]);

  const removeTalent = (id: string) => {
    const next = savedTalent.filter(
      (professional) => professional.id !== id
    );

    setSavedTalent(next);
    writeSavedTalent(next);

    if (selectedProfessional?.id === id) {
      setSelectedProfessional(null);
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading saved talent...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fbfa] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-200/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-28 -left-24 h-96 w-96 rounded-full bg-cyan-100/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business/talent")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Saved Talent
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/business/talent")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Search size={16} />
              <span className="hidden sm:inline">
                Discover professionals
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-amber-700">
                  <Star size={13} className="fill-current" />
                  Your talent shortlist
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Keep the professionals worth coming back to.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Save promising professionals while you compare
                  candidates, plan projects and build your organisation&apos;s
                  talent pipeline.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 xl:min-w-[190px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
                    <Star size={18} className="fill-current" />
                  </div>

                  <div>
                    <div className="text-xl font-black text-slate-950">
                      {savedTalent.length}
                    </div>

                    <div className="text-xs font-semibold text-slate-500">
                      Saved profiles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search saved professionals..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>
          </section>

          <div className="mt-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Shortlist
            </p>

            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
              {filteredTalent.length}{" "}
              {filteredTalent.length === 1
                ? "professional"
                : "professionals"}
            </h3>
          </div>

          <section className="mt-4">
            {filteredTalent.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Star size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  {savedTalent.length === 0
                    ? "Your saved talent list is empty."
                    : "No saved professionals match your search."}
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {savedTalent.length === 0
                    ? "When you find a professional who looks like a strong fit, save them here so you can easily return to their profile."
                    : "Try another search term or clear the search box."}
                </p>

                {savedTalent.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => router.push("/business/talent")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    Discover professionals
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredTalent.map((professional) => (
                  <article
                    key={professional.id}
                    className="group rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-6"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                        {(professional.name?.[0] || "P").toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-black text-slate-950">
                                {professional.name || "Professional"}
                              </h3>

                              {professional.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-teal-700">
                                  <CheckCircle2 size={10} />
                                  Verified
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm font-semibold text-teal-700">
                              {professional.title ||
                                professional.track ||
                                "Professional"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeTalent(professional.id)
                            }
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            aria-label="Remove saved professional"
                          >
                            <Star size={16} className="fill-current" />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          {professional.country && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} />
                              {professional.country}
                            </span>
                          )}

                          {professional.level && (
                            <span>{professional.level}</span>
                          )}

                          {professional.experience && (
                            <span>{professional.experience}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                      {professional.bio ||
                        "This professional has not added a profile summary yet."}
                    </p>

                    {professional.skills &&
                      professional.skills.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {professional.skills.slice(0, 6).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                        {professional.rating !== undefined && (
                          <span className="inline-flex items-center gap-1 text-amber-600">
                            <Star size={13} className="fill-current" />
                            {professional.rating.toFixed(1)}
                          </span>
                        )}

                        {professional.projectsCompleted !== undefined && (
                          <span>
                            {professional.projectsCompleted} projects
                          </span>
                        )}

                        {professional.availability && (
                          <span className="text-emerald-600">
                            {professional.availability}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProfessional(professional)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 transition hover:text-teal-800"
                      >
                        View profile
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-300">
                  <Star size={17} className="fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Talent pipeline
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Keep building a shortlist before your next project.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Saved professionals give your organisation a faster way to
                  revisit promising talent when a relevant project comes up.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/business/talent")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Find more professionals
                <Search size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>

      {selectedProfessional && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close professional profile"
            onClick={() => setSelectedProfessional(null)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <aside className="relative h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Saved professional
                </div>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  {selectedProfessional.name || "Professional"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProfessional(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                    {(selectedProfessional.name?.[0] || "P").toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      {selectedProfessional.name || "Professional"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-teal-700">
                      {selectedProfessional.title ||
                        selectedProfessional.track ||
                        "Professional"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedProfessional.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-black text-teal-700">
                      <CheckCircle2 size={11} />
                      Verified
                    </span>
                  )}

                  {selectedProfessional.level && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                      {selectedProfessional.level}
                    </span>
                  )}

                  {selectedProfessional.country && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500">
                      {selectedProfessional.country}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  About
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {selectedProfessional.bio ||
                    "This professional has not added a profile summary yet."}
                </p>
              </div>

              {selectedProfessional.skills &&
                selectedProfessional.skills.length > 0 && (
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Skills
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedProfessional.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Experience
                  </div>

                  <div className="mt-2 text-sm font-black text-slate-950">
                    {selectedProfessional.experience || "Not provided"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Projects
                  </div>

                  <div className="mt-2 text-sm font-black text-slate-950">
                    {selectedProfessional.projectsCompleted ?? 0}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Rating
                  </div>

                  <div className="mt-2 flex items-center gap-1 text-sm font-black text-slate-950">
                    <Star
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                    {selectedProfessional.rating
                      ? selectedProfessional.rating.toFixed(1)
                      : "—"}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => removeTalent(selectedProfessional.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
                >
                  <Star size={16} className="fill-current" />
                  Remove from saved
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfessional(null);

                    if (selectedProfessional.email) {
                      window.location.href = `mailto:${selectedProfessional.email}`;
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <MessageSquare size={16} />
                  Start conversation
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}