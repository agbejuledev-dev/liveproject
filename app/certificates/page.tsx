// app/certificates/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  FolderKanban,
  LockKeyhole,
  Sparkles,
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
  email?: string;
};

type Onboarding = {
  careerTrack?: string;
  experienceLevel?: string;
};

type CompletedProject = {
  projectId: string;
  projectTitle?: string;
  track?: string;
  level?: string;
  completedAt?: string;
  rating?: number;
  verified?: boolean;
};

type Certificate = {
  id: string;
  title: string;
  projectTitle: string;
  track: string;
  level: string;
  issuedAt: string;
  credentialId: string;
  verified: boolean;
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

function getCertificates(): Certificate[] {
  const stored = readStorage<Certificate[]>(
    "liveproject_certificates",
    []
  );

  if (Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const completed = readStorage<CompletedProject[]>(
    "liveproject_verified_projects",
    []
  );

  if (!Array.isArray(completed)) {
    return [];
  }

  return completed
    .filter((project) => project.verified !== false)
    .map((project, index) => ({
      id: `certificate-${project.projectId}-${index}`,
      title: "Verified Project Certificate",
      projectTitle:
        project.projectTitle || "LiveProject Project",
      track: project.track || "Professional Development",
      level: project.level || "Professional",
      issuedAt:
        project.completedAt ||
        new Date().toLocaleDateString(),
      credentialId: `LP-${String(project.projectId).padStart(
        4,
        "0"
      )}`,
      verified: true,
    }));
}

export default function CertificatesPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registration, setRegistration] =
    useState<Registration | null>(null);
  const [onboarding, setOnboarding] =
    useState<Onboarding | null>(null);
  const [certificates, setCertificates] =
    useState<Certificate[]>([]);
  const [selected, setSelected] =
    useState<Certificate | null>(null);

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

    const storedOnboarding =
      readStorage<Onboarding | null>(
        "liveproject_onboarding",
        null
      );

    if (!storedOnboarding) {
      router.replace("/onboarding");
      return;
    }

    setSession(storedSession);
    setRegistration(storedRegistration);
    setOnboarding(storedOnboarding);
    setCertificates(getCertificates());
    setReady(true);
  }, [router]);

  const fullName =
    [registration?.firstName, registration?.lastName]
      .filter(Boolean)
      .join(" ") || "LiveProject Professional";

  const verifiedCount = certificates.filter(
    (certificate) => certificate.verified
  ).length;

  const hasPremium = session?.plan === "premium";

  const availableTracks = useMemo(
    () =>
      Array.from(
        new Set(
          certificates
            .map((certificate) => certificate.track)
            .filter(Boolean)
        )
      ),
    [certificates]
  );

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading certificates...
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
                  Certificates
                </h1>
              </div>
            </div>

            {!hasPremium && (
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem(
                    "liveproject_after_upgrade",
                    "/certificates"
                  );
                  router.push("/premium");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
              >
                <LockKeyhole size={14} />
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
                    <Award size={13} />
                    Professional credentials
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-[-0.03em] sm:text-5xl">
                    Certificates backed by completed work.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                    Certificates on LiveProject are tied to verified project
                    completion rather than simply completing a course or
                    clicking a button.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                      {fullName}
                    </span>

                    {onboarding?.careerTrack && (
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                        {onboarding.careerTrack}
                      </span>
                    )}

                    {registration?.country && (
                      <span className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                        {registration.country}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-28 w-28 items-center justify-center rounded-[30px] border border-white/10 bg-white/5 lg:h-36 lg:w-36">
                  <Award
                    size={64}
                    className="text-teal-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid border-t border-white/10 sm:grid-cols-3">
              <CredentialMetric
                label="Certificates"
                value={String(certificates.length)}
              />

              <CredentialMetric
                label="Verified"
                value={String(verifiedCount)}
              />

              <CredentialMetric
                label="Tracks"
                value={String(availableTracks.length)}
              />
            </div>
          </section>

          {!hasPremium && (
            <section className="mt-6 rounded-[26px] border border-violet-100 bg-violet-50/70 p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                    <Sparkles size={19} />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-600">
                      Premium credential suite
                    </p>

                    <h3 className="mt-1 text-xl font-black text-violet-950">
                      Make your verified work easier to present.
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-violet-900/70">
                      Premium unlocks access to your full credential and career
                      acceleration layer.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem(
                      "liveproject_after_upgrade",
                      "/certificates"
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
                  Credential history
                </div>

                <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  Your certificates
                </h3>
              </div>

              <p className="text-xs font-semibold text-slate-400">
                {certificates.length} certificate
                {certificates.length === 1 ? "" : "s"}
              </p>
            </div>

            {!hasPremium ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                  <LockKeyhole size={23} />
                </div>

                <h4 className="mt-5 text-lg font-black text-slate-950">
                  Certificates are a Premium career feature.
                </h4>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Your completed work can qualify for verified credentials,
                  but access to the certificate library is part of Premium.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem(
                      "liveproject_after_upgrade",
                      "/certificates"
                    );
                    router.push("/premium");
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
                >
                  Unlock certificates
                  <ArrowRight size={15} />
                </button>
              </div>
            ) : certificates.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-dashed border-slate-300 bg-slate-50/70 p-10 text-center">
                <FileCheck2
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <h4 className="mt-4 text-sm font-black text-slate-950">
                  No certificates yet.
                </h4>

                <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                  Complete and verify LiveProject work to start earning
                  project-backed credentials.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/projects")}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-bold text-white"
                >
                  Explore projects
                  <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {certificates.map((certificate) => (
                  <article
                    key={certificate.id}
                    className="group rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-lg sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        <Award size={22} />
                      </div>

                      {certificate.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-emerald-700">
                          <CheckCircle2 size={10} />
                          Verified
                        </span>
                      )}
                    </div>

                    <h4 className="mt-5 text-lg font-black tracking-tight text-slate-950">
                      {certificate.title}
                    </h4>

                    <p className="mt-2 text-sm font-semibold text-teal-700">
                      {certificate.projectTitle}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {certificate.track}
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-500">
                        {certificate.level}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                          Credential ID
                        </div>

                        <div className="mt-1 text-xs font-black text-slate-700">
                          {certificate.credentialId}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setSelected(certificate)
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700"
                      >
                        View
                        <ArrowRight size={13} />
                      </button>
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
                    Verified experience
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Your work should be easier to prove.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Build practical evidence first. Turn that evidence into
                  credentials as your professional record grows.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/experience-passport")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Open Experience Passport
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close certificate"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[30px] bg-white shadow-2xl">
            <div className="relative overflow-hidden bg-slate-950 p-8 text-white sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" />

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
              >
                <X size={17} />
              </button>

              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-teal-300">
                  <Award size={32} />
                </div>

                <div className="mt-5 text-[10px] font-black uppercase tracking-[0.2em] text-teal-300">
                  LiveProject Certificate
                </div>

                <h2 className="mt-3 text-3xl font-black tracking-tight">
                  {selected.title}
                </h2>

                <p className="mt-3 text-sm text-slate-300">
                  Awarded to
                </p>

                <p className="mt-1 text-xl font-black text-white">
                  {fullName}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <CertificateDetail
                  label="Project"
                  value={selected.projectTitle}
                />

                <CertificateDetail
                  label="Track"
                  value={selected.track}
                />

                <CertificateDetail
                  label="Level"
                  value={selected.level}
                />

                <CertificateDetail
                  label="Issued"
                  value={selected.issuedAt}
                />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Credential ID
                </div>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-sm font-black text-slate-950">
                    {selected.credentialId}
                  </span>

                  {selected.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase text-emerald-700">
                      <CheckCircle2 size={10} />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"
                >
                  <Download size={16} />
                  Export certificate
                </button>

                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function CredentialMetric({
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

function CertificateDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-[9px] font-black uppercase tracking-[0.14em] text-slate-400">
        {label}
      </div>

      <div className="mt-2 text-sm font-black text-slate-950">
        {value}
      </div>
    </div>
  );
}