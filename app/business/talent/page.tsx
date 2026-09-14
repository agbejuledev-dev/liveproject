// @ts-nocheck
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  MapPin,
  MessageSquare,
  Search,
  SlidersHorizontal,
  Star,
  UserPlus,
  Users,
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
};

const professionalSeed: Professional[] = [
  {
    id: "professional-1",
    name: "Professional Profile",
    title: "Frontend Developer",
    country: "Global",
    track: "Software Development",
    level: "Intermediate",
    bio: "Frontend professional focused on building clean, accessible and practical digital experiences.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    experience: "2+ years",
    rating: 4.8,
    projectsCompleted: 8,
    verified: true,
    availability: "Available",
  },
  {
    id: "professional-2",
    name: "Project Professional",
    title: "Product Manager",
    country: "Global",
    track: "Product Management",
    level: "Advanced",
    bio: "Product professional experienced in translating business problems into focused product outcomes.",
    skills: ["Product Strategy", "Roadmaps", "Agile", "Stakeholder Management"],
    experience: "4+ years",
    rating: 4.9,
    projectsCompleted: 14,
    verified: true,
    availability: "Available",
  },
  {
    id: "professional-3",
    name: "Business Professional",
    title: "Business Analyst",
    country: "Global",
    track: "Business Analysis",
    level: "Professional",
    bio: "Business analyst with a focus on requirements, process improvement and measurable outcomes.",
    skills: ["Requirements", "Process Mapping", "Agile", "Business Analysis"],
    experience: "5+ years",
    rating: 4.7,
    projectsCompleted: 19,
    verified: true,
    availability: "Available",
  },
  {
    id: "professional-4",
    name: "UX Professional",
    title: "UX Designer",
    country: "Global",
    track: "UX / UI Design",
    level: "Intermediate",
    bio: "UX designer focused on research-backed interfaces and practical user experiences.",
    skills: ["Figma", "UX Research", "Wireframing", "Prototyping"],
    experience: "3+ years",
    rating: 4.8,
    projectsCompleted: 11,
    verified: true,
    availability: "Open to projects",
  },
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) return fallback;

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadProfessionals(): Professional[] {
  if (typeof window === "undefined") {
    return professionalSeed;
  }

  const keys = [
    "liveproject_professionals",
    "liveproject_public_professionals",
    "liveproject_verified_professionals",
  ];

  for (const key of keys) {
    try {
      const raw = sessionStorage.getItem(key);

      if (!raw) continue;

      const parsed = JSON.parse(raw);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Continue.
    }
  }

  return professionalSeed;
}

function getSavedTalent(): Professional[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = sessionStorage.getItem(
      "liveproject_saved_talent"
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function DiscoverProfessionalsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [professionals, setProfessionals] = useState<
    Professional[]
  >([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("all");
  const [selectedProfessional, setSelectedProfessional] =
    useState<Professional | null>(null);
  const [mobileFilters, setMobileFilters] = useState(false);

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

    setProfessionals(loadProfessionals());

    const saved = getSavedTalent();

    setSavedIds(saved.map((professional) => professional.id));
    setReady(true);
  }, [router]);

  const tracks = useMemo(() => {
    return Array.from(
      new Set(
        professionals
          .map((professional) => professional.track)
          .filter(Boolean)
      )
    ) as string[];
  }, [professionals]);

  const levels = useMemo(() => {
    return Array.from(
      new Set(
        professionals
          .map((professional) => professional.level)
          .filter(Boolean)
      )
    ) as string[];
  }, [professionals]);

  const filteredProfessionals = useMemo(() => {
    const search = query.trim().toLowerCase();

    return professionals.filter((professional) => {
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

      const matchesSearch =
        !search || searchable.includes(search);

      const matchesTrack =
        trackFilter === "all" ||
        professional.track === trackFilter;

      const matchesLevel =
        levelFilter === "all" ||
        professional.level === levelFilter;

      const availability =
        professional.availability?.toLowerCase() || "";

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" &&
          availability.includes("available")) ||
        (availabilityFilter === "open" &&
          availability.includes("open"));

      return (
        matchesSearch &&
        matchesTrack &&
        matchesLevel &&
        matchesAvailability
      );
    });
  }, [
    professionals,
    query,
    trackFilter,
    levelFilter,
    availabilityFilter,
  ]);

  const saveProfessional = (professional: Professional) => {
    const currentlySaved = savedIds.includes(professional.id);

    const nextIds = currentlySaved
      ? savedIds.filter((id) => id !== professional.id)
      : [...savedIds, professional.id];

    setSavedIds(nextIds);

    const savedProfessionals = professionals.filter((item) =>
      nextIds.includes(item.id)
    );

    try {
      sessionStorage.setItem(
        "liveproject_saved_talent",
        JSON.stringify(savedProfessionals)
      );
    } catch {
      // Prototype storage can fail silently.
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading professionals...
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
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Discover Professionals
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push("/business/talent/saved")
              }
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              <Star size={16} />
              <span className="hidden sm:inline">
                Saved talent
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">
                {savedIds.length}
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* Hero */}
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="grid gap-8 xl:grid-cols-[1fr_auto] xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <Users size={13} />
                  Talent discovery
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Find professionals with skills they can actually demonstrate.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Search the LiveProject professional ecosystem by career
                  track, experience level, skills and availability.
                </p>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5 xl:w-[270px]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <div className="text-xl font-black text-slate-950">
                      {professionals.filter(
                        (professional) => professional.verified
                      ).length}
                    </div>

                    <div className="text-xs font-semibold text-slate-500">
                      Verified profiles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Search and filters */}
          <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                <SlidersHorizontal size={16} />
                Search & filters
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFilters((value) => !value)
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600"
              >
                {mobileFilters ? "Hide" : "Show"}
              </button>
            </div>

            <div
              className={[
                "mt-4 grid gap-4 lg:mt-0 lg:grid-cols-[1fr_220px_190px_190px]",
                mobileFilters ? "grid" : "hidden lg:grid",
              ].join(" ")}
            >
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Search name, role, skills..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div className="relative">
                <select
                  value={trackFilter}
                  onChange={(event) =>
                    setTrackFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                >
                  <option value="all">All tracks</option>

                  {tracks.map((track) => (
                    <option key={track} value={track}>
                      {track}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={levelFilter}
                  onChange={(event) =>
                    setLevelFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                >
                  <option value="all">All levels</option>

                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <div className="relative">
                <select
                  value={availabilityFilter}
                  onChange={(event) =>
                    setAvailabilityFilter(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                >
                  <option value="all">Any availability</option>
                  <option value="available">Available</option>
                  <option value="open">Open to projects</option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Result header */}
          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Professionals
              </p>

              <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                {filteredProfessionals.length}{" "}
                {filteredProfessionals.length === 1
                  ? "profile"
                  : "profiles"}{" "}
                available
              </h3>
            </div>

            <p className="text-xs font-medium text-slate-500">
              Profiles are presented as professional evidence, not just
              job titles.
            </p>
          </div>

          {/* Professionals */}
          <section className="mt-4">
            {filteredProfessionals.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Users size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  No professionals found.
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Try broadening your search or changing the filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setTrackFilter("all");
                    setLevelFilter("all");
                    setAvailabilityFilter("all");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredProfessionals.map((professional) => {
                  const saved = savedIds.includes(
                    professional.id
                  );

                  return (
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
                                  {professional.name ||
                                    "Professional"}
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
                                saveProfessional(professional)
                              }
                              className={[
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition",
                                saved
                                  ? "border-amber-200 bg-amber-50 text-amber-600"
                                  : "border-slate-200 bg-white text-slate-400 hover:text-amber-500",
                              ].join(" ")}
                              aria-label={
                                saved
                                  ? "Remove from saved talent"
                                  : "Save professional"
                              }
                            >
                              <Star
                                size={16}
                                className={
                                  saved
                                    ? "fill-current"
                                    : ""
                                }
                              />
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
                              <span>
                                {professional.experience}
                              </span>
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
                            {professional.skills
                              .slice(0, 6)
                              .map((skill) => (
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
                              <Star
                                size={13}
                                className="fill-current"
                              />
                              {professional.rating.toFixed(1)}
                            </span>
                          )}

                          {professional.projectsCompleted !==
                            undefined && (
                            <span>
                              {professional.projectsCompleted}{" "}
                              projects
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
                            setSelectedProfessional(
                              professional
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 transition group-hover:text-teal-800"
                        >
                          View profile
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <div className="h-10" />
        </div>
      </div>

      {/* Profile drawer */}
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
                  Professional profile
                </div>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  {selectedProfessional.name ||
                    "Professional"}
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
                    {(selectedProfessional.name?.[0] ||
                      "P").toUpperCase()}
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-950">
                      {selectedProfessional.name ||
                        "Professional"}
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
                      {selectedProfessional.skills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Experience
                  </div>
                  <div className="mt-2 text-sm font-black text-slate-950">
                    {selectedProfessional.experience ||
                      "Not provided"}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Projects
                  </div>
                  <div className="mt-2 text-sm font-black text-slate-950">
                    {selectedProfessional.projectsCompleted ??
                      0}
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
                      : "â€”"}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    saveProfessional(selectedProfessional)
                  }
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition",
                    savedIds.includes(selectedProfessional.id)
                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                  ].join(" ")}
                >
                  <Star
                    size={16}
                    className={
                      savedIds.includes(
                        selectedProfessional.id
                      )
                        ? "fill-current"
                        : ""
                    }
                  />
                  {savedIds.includes(selectedProfessional.id)
                    ? "Saved"
                    : "Save talent"}
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

              <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <BriefcaseBusiness size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-teal-900">
                      Match talent to the work
                    </p>

                    <p className="mt-1 text-xs leading-6 text-teal-800/80">
                      Use demonstrated skills, completed projects,
                      recommendations and availability when deciding who
                      is a strong fit for your business problem.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
