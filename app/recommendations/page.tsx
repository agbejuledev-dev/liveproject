// @ts-nocheck
// app/recommendations/page.tsx

"use client";
import { ArrowUpRight } from "lucide-react";


import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  Plus,
  Quote,
  Sparkles,
  Star,
  UserRound,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
  plan?: "free" | "premium";
};

type Registration = {
  firstName?: string;
  lastName?: string;
  country?: string;
};

type Recommendation = {
  id: string;
  projectTitle?: string;
  author?: string;
  role?: string;
  comment?: string;
  createdAt?: string;
  rating?: number;
  verified?: boolean;
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

function writeRecommendations(
  recommendations: Recommendation[]
) {
  try {
    sessionStorage.setItem(
      "liveproject_recommendations",
      JSON.stringify(recommendations)
    );
  } catch {
    // Prototype storage.
  }
}

export default function RecommendationsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registration, setRegistration] =
    useState<Registration | null>(null);
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);
  const [selected, setSelected] =
    useState<Recommendation | null>(null);
  const [showRequest, setShowRequest] = useState(false);

  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestProject, setRequestProject] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const storedSession = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!storedSession?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role =
      storedSession.role ?? storedSession.accountType;

    if (role === "client") {
      router.replace("/business");
      return;
    }

    const storedRegistration =
      readStorage<Registration | null>(
        "liveproject_registration",
        null
      );

    const onboarding = readStorage(
      "liveproject_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/onboarding");
      return;
    }

    setSession(storedSession);
    setRegistration(storedRegistration);

    setRecommendations(
      readStorage<Recommendation[]>(
        "liveproject_recommendations",
        []
      )
    );

    setReady(true);
  }, [router]);

  const fullName =
    [registration?.firstName, registration?.lastName]
      .filter(Boolean)
      .join(" ") || "LiveProject Professional";

  const averageRating = useMemo(() => {
    const ratings = recommendations
      .map((recommendation) => recommendation.rating)
      .filter(
        (rating): rating is number =>
          typeof rating === "number" && rating > 0
      );

    if (!ratings.length) return null;

    return (
      ratings.reduce((sum, rating) => sum + rating, 0) /
      ratings.length
    ).toFixed(1);
  }, [recommendations]);

  const verifiedCount = recommendations.filter(
    (recommendation) => recommendation.verified !== false
  ).length;

  const submitRequest = () => {
    if (
      !requestName.trim() ||
      !requestEmail.trim() ||
      !requestProject.trim()
    ) {
      return;
    }

    const pendingRequest = {
      id: `recommendation-request-${Date.now()}`,
      professional: fullName,
      requester: requestName.trim(),
      email: requestEmail.trim(),
      projectTitle: requestProject.trim(),
      message: requestMessage.trim(),
      createdAt: new Date().toLocaleDateString(),
      status: "pending",
    };

    const existing = readStorage<any[]>(
      "liveproject_recommendation_requests",
      []
    );

    try {
      sessionStorage.setItem(
        "liveproject_recommendation_requests",
        JSON.stringify([
          ...existing,
          pendingRequest,
        ])
      );
    } catch {
      // Prototype storage.
    }

    setRequestSent(true);

    setTimeout(() => {
      setRequestName("");
      setRequestEmail("");
      setRequestProject("");
      setRequestMessage("");
      setRequestSent(false);
      setShowRequest(false);
    }, 900);
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading recommendations...
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
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/workspace")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Career profile
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Recommendations
                </h1>
              </div>
            </div>

            {session?.plan === "premium" ? (
              <button
                type="button"
                onClick={() => setShowRequest(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                <Plus size={15} />
                Request recommendation
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(
                    "liveproject_after_upgrade",
                    "/recommendations"
                  );
                  router.push("/premium");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                <Sparkles size={14} />
                Unlock Premium
              </button>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="overflow-hidden rounded-[30px] bg-slate-950 text-white shadow-[0_25px_90px_rgba(15,23,42,0.15)]">
            <div className="relative p-7 sm:p-9 lg:p-11">
              <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />

              <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-teal-300">
                    <Quote size={13} />
                    Professional recommendations
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                    Let the people you worked with tell the story.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Recommendations add context to your project evidence by
                    showing how collaborators, clients and project leads
                    experienced working with you.
                  </p>
                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-[30px] border border-white/10 bg-white/5 lg:h-36 lg:w-36">
                  <MessageSquare
                    size={62}
                    className="text-teal-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid border-t border-white/10 sm:grid-cols-3">
              <RecommendationMetric
                label="Recommendations"
                value={String(recommendations.length)}
              />

              <RecommendationMetric
                label="Verified"
                value={String(verifiedCount)}
              />

              <RecommendationMetric
                label="Average rating"
                value={averageRating || "â€”"}
              />
            </div>
          </section>

          {session?.plan !== "premium" && (
            <section className="mt-6 rounded-[26px] border border-violet-100 bg-violet-50/70 p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-600">
                      Premium career tool
                    </p>

                    <h3 className="mt-1 text-xl font-black text-violet-950">
                      Build stronger professional proof.
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-900/70">
                      Recommendation requests and the wider verified career
                      layer are available through Premium.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem(
                      "liveproject_after_upgrade",
                      "/recommendations"
                    );
                    router.push("/premium");
                  }}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
                >
                  Upgrade to Premium
                  <ArrowRight size={15} />
                </button>
              </div>
            </section>
          )}

          <section className="mt-6 rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Social proof
                </div>

                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  What people say about your work
                </h3>
              </div>

              <p className="text-xs font-semibold text-slate-400">
                {recommendations.length}{" "}
                {recommendations.length === 1
                  ? "recommendation"
                  : "recommendations"}
              </p>
            </div>

            {session?.plan !== "premium" ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <LockIcon />
                </div>

                <h4 className="mt-5 text-lg font-black text-slate-950">
                  Recommendations are a Premium feature.
                </h4>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Unlock recommendation requests and present stronger
                  professional proof to future employers and clients.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem(
                      "liveproject_after_upgrade",
                      "/recommendations"
                    );
                    router.push("/premium");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
                >
                  Unlock Premium
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
                <Quote
                  size={28}
                  className="mx-auto text-slate-300"
                />

                <h4 className="mt-4 text-sm font-black text-slate-950">
                  No recommendations yet.
                </h4>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                  Request a recommendation from someone who has worked with
                  you on a project.
                </p>

                <button
                  type="button"
                  onClick={() => setShowRequest(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  <Plus size={14} />
                  Request recommendation
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {recommendations.map((recommendation) => (
                  <article
                    key={recommendation.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                          {(recommendation.author?.[0] || "R").toUpperCase()}
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-slate-950">
                            {recommendation.author ||
                              "Project collaborator"}
                          </h4>

                          <p className="mt-1 text-xs text-slate-500">
                            {recommendation.role ||
                              "Project collaborator"}
                          </p>
                        </div>
                      </div>

                      {recommendation.verified !== false && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-700">
                          <CheckCircle2 size={10} />
                          Verified
                        </span>
                      )}
                    </div>

                    {recommendation.rating && (
                      <div className="mt-4 flex items-center gap-1 text-amber-600">
                        {Array.from({
                          length: 5,
                        }).map((_, index) => (
                          <Star
                            key={index}
                            size={14}
                            className={
                              index <
                              recommendation.rating!
                                ? "fill-current"
                                : "text-slate-200"
                            }
                          />
                        ))}
                      </div>
                    )}

                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      â€œ
                      {recommendation.comment ||
                        "Recommendation content not available."}
                      â€
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-[10px] font-semibold text-slate-400">
                        {recommendation.projectTitle ||
                          "LiveProject collaboration"}
                      </span>

                      {recommendation.createdAt && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          {recommendation.createdAt}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-300">
                  <Award size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Professional proof
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Pair recommendations with verified work.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Your strongest professional profile combines what you did
                  with evidence from the people who experienced your work.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/experience-passport")
                }
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Experience Passport
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>

      {showRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close recommendation request"
            onClick={() => setShowRequest(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.16em] text-teal-700">
                  Request recommendation
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Ask someone you worked with.
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The recipient can later submit a recommendation that becomes
                  part of your professional proof.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRequest(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <Input
                label="Their name"
                value={requestName}
                onChange={setRequestName}
                placeholder="Person's full name"
              />

              <Input
                label="Their email"
                value={requestEmail}
                onChange={setRequestEmail}
                placeholder="name@company.com"
                type="email"
              />

              <Input
                label="Project"
                value={requestProject}
                onChange={setRequestProject}
                placeholder="Project you worked on together"
              />

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Message
                </label>

                <textarea
                  value={requestMessage}
                  onChange={(event) =>
                    setRequestMessage(event.target.value)
                  }
                  rows={5}
                  placeholder="Add a short personal message..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>
            </div>

            {requestSent && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={15} />
                Recommendation request created.
              </div>
            )}

            <button
              type="button"
              onClick={submitRequest}
              disabled={
                !requestName.trim() ||
                !requestEmail.trim() ||
                !requestProject.trim() ||
                requestSent
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUpRight size={15} />
              ArrowUpRight recommendation request
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function RecommendationMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-t border-white/10 p-5 sm:border-r">
      <div className="text-2xl font-black text-white">
        {value}
      </div>

      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
      />
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-6 w-6"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
