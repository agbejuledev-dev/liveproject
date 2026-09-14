"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Globe2,
  GraduationCap,
  Layers3,
  Menu,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";

import { allProjects, tracks, type Project } from "@/lib/projects";
import {
  getLiveProjectSession,
  saveAfterAuthDestination,
} from "@/lib/access";

function FeaturePoint({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl transition duration-500 group-hover:bg-blue-500/20" />

      <div className="relative">
        <div className="mb-7 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.22em] text-white/35">
            {number}
          </span>

          <div className="feature-icon flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white">
            {icon}
          </div>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-white/55">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className="project-card group w-full text-left"
    >
      <div className="relative h-full overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_30px_70px_rgba(15,23,42,0.1)]">
        <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 blur-3xl transition duration-700 group-hover:bg-blue-500/20" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {project.track}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                project.access === "premium"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {project.access === "premium" ? "Premium" : "Free"}
            </span>
          </div>

          <h3 className="mt-6 max-w-[90%] text-xl font-semibold leading-tight tracking-tight text-slate-950">
            {project.title}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500">
              {project.level}
            </span>

            <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500">
              {project.duration}
            </span>

            <span className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500">
              {project.format}
            </span>
          </div>

          <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-sm font-medium text-slate-500">
              Explore project
            </span>

            <span className="card-arrow flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function TrackCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="track-card group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]">
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl transition duration-500 group-hover:bg-blue-500/15" />

      <div className="relative">
        <div className="track-icon flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
          {icon}
        </div>

        <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-950">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

        <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-slate-950">
          Explore track
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}

function ProtectedLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const session = getLiveProjectSession();

    if (!session?.loggedIn) {
      event.preventDefault();
      saveAfterAuthDestination(href);
      window.location.href = "/register";
    }
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const featuredProjects = allProjects
    .filter((project) => project.access === "free")
    .slice(0, 4);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openProject = (project: Project) => {
    const session = getLiveProjectSession();

    if (!session?.loggedIn) {
      saveAfterAuthDestination(`/projects/${project.id}`);
      window.location.href = "/register";
      return;
    }

    window.location.href = `/projects/${project.id}`;
  };

  const faqs = [
    {
      question: "What is LiveProject?",
      answer:
        "LiveProject is an experience-first career platform where professionals can work on structured business projects, build evidence of what they can actually do, and turn that work into a stronger professional profile.",
    },
    {
      question: "Do I need professional experience to get started?",
      answer:
        "No. Projects are structured across different experience levels, allowing you to start from your current level and progressively build stronger evidence.",
    },
    {
      question: "Can I work on projects alone?",
      answer:
        "Yes. LiveProject supports solo and team-based project formats, depending on the individual project.",
    },
    {
      question: "How does verification work?",
      answer:
        "Verification is tied to completed work, submitted deliverables, project activity and review outcomes rather than simply signing up or purchasing a plan.",
    },
    {
      question: "Is LiveProject available internationally?",
      answer:
        "Yes. LiveProject is designed as a global ecosystem. Your registration and professional profile are not restricted to one country.",
    },
    {
      question: "Are there free projects?",
      answer:
        "Yes. Free projects are available so professionals can begin building practical experience before deciding whether they want additional premium career tools.",
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          background: #fff;
        }

        .hero-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.045) 1px,
              transparent 1px
            );
          background-size: 56px 56px;
          animation: gridDrift 18s linear infinite;
        }

        .noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.045'/%3E%3C/svg%3E");
        }

        .hero-glow {
          animation: heroFloat 8s ease-in-out infinite;
        }

        .hero-glow-two {
          animation: heroFloatReverse 11s ease-in-out infinite;
        }

        .hero-scan {
          animation: scanMove 6s ease-in-out infinite;
        }

        .hero-line {
          animation: lineMove 4s ease-in-out infinite;
        }

        .pulse-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }

        .feature-icon,
        .track-icon {
          animation: iconFloat 4.5s ease-in-out infinite;
        }

        .project-card:nth-child(2) {
          animation: cardFloat 6s ease-in-out infinite 0.7s;
        }

        .project-card:nth-child(3) {
          animation: cardFloat 7s ease-in-out infinite 1.2s;
        }

        .project-card:nth-child(4) {
          animation: cardFloat 6.5s ease-in-out infinite 1.7s;
        }

        .track-card:nth-child(1) {
          animation: cardFloat 7s ease-in-out infinite;
        }

        .track-card:nth-child(3) {
          animation: cardFloat 8s ease-in-out infinite 0.8s;
        }

        .track-card:nth-child(5) {
          animation: cardFloat 7.5s ease-in-out infinite 1.4s;
        }

        .track-card:nth-child(7) {
          animation: cardFloat 8s ease-in-out infinite 2s;
        }

        .marquee {
          animation: marquee 24s linear infinite;
          width: max-content;
        }

        .shimmer {
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
        }

        @keyframes heroFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, -28px, 0) scale(1.04);
          }
        }

        @keyframes heroFloatReverse {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, 22px, 0) scale(1.05);
          }
        }

        @keyframes scanMove {
          0%,
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }

          20%,
          70% {
            opacity: 1;
          }

          85% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes lineMove {
          0%,
          100% {
            transform: translateX(-15%);
            opacity: 0.3;
          }

          50% {
            transform: translateX(15%);
            opacity: 0.9;
          }
        }

        @keyframes pulseDot {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.35);
          }

          50% {
            box-shadow: 0 0 0 7px rgba(52, 211, 153, 0);
          }
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes gridDrift {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 56px 56px;
          }
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes shimmer {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -200% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      {/* NAV */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/80 px-4 text-white shadow-2xl backdrop-blur-xl sm:px-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                L
              </div>

              <div>
                <div className="text-sm font-semibold tracking-tight">
                  LiveProject
                </div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                  Build verified experience
                </div>
              </div>
            </Link>

            <nav className="hidden items-center gap-7 lg:flex">
              <Link
                href="/about"
                className="text-sm font-medium text-white/65 transition hover:text-white"
              >
                About
              </Link>

              <Link
                href="/projects"
                className="text-sm font-medium text-white/65 transition hover:text-white"
              >
                Real Projects
              </Link>

              <ProtectedLink
                href="/job-board"
                className="text-sm font-medium text-white/65 transition hover:text-white"
              >
                Job Board
              </ProtectedLink>

              <Link
                href="#resources"
                className="text-sm font-medium text-white/65 transition hover:text-white"
              >
                Resources
              </Link>
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
              >
                Get Started
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 lg:hidden"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {mobileOpen && (
            <div className="mt-2 rounded-2xl border border-white/10 bg-slate-950 p-4 text-white lg:hidden">
              <div className="flex flex-col gap-2">
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-white/5"
                >
                  About
                </Link>

                <Link
                  href="/projects"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-white/5"
                >
                  Real Projects
                </Link>

                <ProtectedLink
                  href="/job-board"
                  className="rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-white/5"
                >
                  Job Board
                </ProtectedLink>

                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-semibold"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-slate-950"
                >
                  Get Started
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="hero-grid absolute inset-0 opacity-60" />
        <div className="noise pointer-events-none absolute inset-0" />

        <div className="hero-glow absolute -left-24 top-28 h-[28rem] w-[28rem] rounded-full bg-blue-600/20 blur-[110px]" />
        <div className="hero-glow-two absolute right-[-8rem] top-44 h-[34rem] w-[34rem] rounded-full bg-indigo-500/15 blur-[120px]" />

        <div className="hero-scan pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />

        <div className="relative mx-auto grid min-h-[850px] max-w-7xl items-center gap-16 px-4 pb-20 pt-40 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3.5 py-2 text-xs font-medium text-white/65 backdrop-blur">
              <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
              A new way to build career evidence
            </div>

            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Build experience
              <span className="block text-white/45">before you need it.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/55 sm:text-lg">
              LiveProject helps professionals turn practical work into
              credible career evidence through structured projects, meaningful
              deliverables and verified outcomes.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
              >
                Start building experience
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                Explore projects
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 text-xs text-white/40">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Solo & team projects
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Structured deliverables
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Evidence-backed experience
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="hero-glow absolute inset-8 rounded-[2rem] bg-blue-500/10 blur-3xl" />

            <div className="hero-line pointer-events-none absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-300/20 to-transparent" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#08111f] p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                      Professional workspace
                    </p>

                    <h2 className="mt-2 text-lg font-semibold text-white">
                      Experience dashboard
                    </h2>
                  </div>

                  <Sparkles className="h-4 w-4 text-white/70" />
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/40">
                        Active Project
                      </span>

                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-300">
                        ACTIVE
                      </span>
                    </div>

                    <h3 className="mt-7 text-base font-semibold text-white">
                      Customer Experience Improvement
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/40">
                      Product Management
                    </p>

                    <div className="mt-5">
                      <div className="flex justify-between text-[11px] text-white/40">
                        <span>Project progress</span>
                        <span>72%</span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="shimmer h-full w-[72%] rounded-full bg-gradient-to-r from-white/40 via-white to-white/40" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
                    <span className="text-xs text-white/40">
                      Experience evidence
                    </span>

                    <div className="mt-6 space-y-3">
                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                          <Check className="h-4 w-4 text-emerald-300" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">
                            Deliverable approved
                          </p>

                          <p className="text-[10px] text-white/35">
                            Product strategy
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                          <Award className="h-4 w-4 text-blue-300" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">
                            Skill demonstrated
                          </p>

                          <p className="text-[10px] text-white/35">
                            Stakeholder management
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                          <ShieldCheck className="h-4 w-4 text-violet-300" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-white">
                            Evidence recorded
                          </p>

                          <p className="text-[10px] text-white/35">
                            Verified activity
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.05] to-transparent p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40">
                        Career direction
                      </p>

                      <p className="mt-1 text-sm font-medium text-white">
                        Product → Project → Delivery
                      </p>
                    </div>

                    <div className="flex -space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#08111f] bg-slate-700 text-[10px]">
                        PM
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#08111f] bg-slate-600 text-[10px]">
                        BA
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#08111f] bg-slate-500 text-[10px]">
                        QA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <section className="overflow-hidden border-b border-slate-200 bg-white py-5">
        <div className="marquee flex items-center gap-10 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          {Array.from({ length: 2 }).map((_, index) => (
            <React.Fragment key={index}>
              <span>Real-world projects</span>
              <span>•</span>
              <span>Professional evidence</span>
              <span>•</span>
              <span>Structured delivery</span>
              <span>•</span>
              <span>Verified experience</span>
              <span>•</span>
              <span>Global opportunities</span>
              <span>•</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* WHY */}
      <section className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Why LiveProject
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Your career should show more than what you say you can do.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">
              A strong CV tells people what you have worked on. LiveProject
              helps you create the work, document it and build evidence that
              makes the story more credible.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeaturePoint
              number="01"
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Work on meaningful projects"
              description="Build practical experience through structured business and product challenges."
            />

            <FeaturePoint
              number="02"
              icon={<Layers3 className="h-5 w-5" />}
              title="Build evidence"
              description="Turn project activity, deliverables and feedback into tangible professional proof."
            />

            <FeaturePoint
              number="03"
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Get verified"
              description="Create stronger career evidence based on what you actually completed."
            />

            <FeaturePoint
              number="04"
              icon={<Rocket className="h-5 w-5" />}
              title="Move forward"
              description="Use your accumulated experience to pursue better opportunities with more confidence."
            />
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="bg-slate-50 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Real Projects
              </span>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Stop waiting for experience.
                <span className="block text-slate-400">Start creating it.</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
                Explore structured projects designed to help you practice,
                deliver, receive feedback and leave with stronger evidence.
              </p>
            </div>

            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
            >
              Explore all projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={openProject}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Career Tracks
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Build experience around the direction you actually want.
            </h2>

            <p className="mt-6 text-base leading-8 text-slate-500">
              Choose a track, work through practical projects and gradually
              build a body of evidence around your professional direction.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <TrackCard
              title={tracks[0] || "Product Management"}
              description="Turn problems into clear product decisions, priorities and delivery plans."
              icon={<Target className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[1] || "Project Management"}
              description="Practice planning, delivery, governance, communication and execution."
              icon={<BriefcaseBusiness className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[2] || "Business Analysis"}
              description="Translate business problems into structured requirements and useful insights."
              icon={<Search className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[3] || "Software Development"}
              description="Build practical solutions, ship useful features and document what you delivered."
              icon={<Code2 className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[4] || "Quality Assurance"}
              description="Build confidence through testing, quality thinking and structured validation."
              icon={<CheckCircle2 className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[5] || "UX & Design"}
              description="Create better digital experiences through practical design challenges."
              icon={<Sparkles className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[6] || "Data"}
              description="Work with structured problems, insights, analysis and evidence-led decisions."
              icon={<Zap className="h-5 w-5" />}
            />

            <TrackCard
              title={tracks[7] || "Agile & Delivery"}
              description="Develop the planning, facilitation and delivery habits teams rely on."
              icon={<Users className="h-5 w-5" />}
            />
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="bg-slate-950 px-4 py-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
            The process
          </span>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Learn by doing.
            <span className="block text-white/40">Grow by proving.</span>
          </h2>

          <div className="mt-16 grid gap-10 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Choose a project",
                text: "Find a project aligned with your track, level and professional direction.",
              },
              {
                number: "02",
                title: "Do the work",
                text: "Plan, collaborate, solve problems and deliver work inside a structured workspace.",
              },
              {
                number: "03",
                title: "Receive feedback",
                text: "Get responses on your work and refine your output as the project progresses.",
              },
              {
                number: "04",
                title: "Build your evidence",
                text: "Completed work contributes to the professional proof behind your profile.",
              },
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="mb-7 text-xs font-semibold tracking-[0.25em] text-white/25">
                  {step.number}
                </div>

                <div className="hero-line h-px w-full bg-white/10" />

                <h3 className="mt-7 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSPORT */}
      <section className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Experience Passport
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Your work should travel with you.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
              Build a professional record around completed projects, skills
              demonstrated, project outcomes and meaningful feedback.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Completed project evidence",
                "Skills demonstrated through work",
                "Professional recommendations",
                "Certificates and recognition",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>

                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-5 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
            <div className="hero-glow absolute right-0 top-0 h-56 w-56 rounded-full bg-blue-500/15 blur-[100px]" />

            <div className="relative rounded-[1.5rem] border border-white/10 bg-[#07101c] p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    Experience Passport
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Professional Evidence
                  </h3>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                  Verified
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                    Role
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Product Professional
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                    Track
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Product Management
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">
                      Evidence
                    </p>

                    <p className="mt-2 text-sm font-medium text-white">
                      Completed business improvement project
                    </p>
                  </div>

                  <Award className="h-5 w-5 text-amber-300" />
                </div>

                <div className="mt-5 h-px bg-white/10" />

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] text-white/30">Deliverables</p>
                    <p className="mt-1 text-sm font-semibold text-white">08</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/30">Skills</p>
                    <p className="mt-1 text-sm font-semibold text-white">06</p>
                  </div>

                  <div>
                    <p className="text-[10px] text-white/30">Outcome</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Approved
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM */}
      <section className="bg-slate-50 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                <Sparkles className="h-3.5 w-3.5" />
                Premium
              </span>

              <h2 className="mt-7 max-w-xl text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                When you are ready to move from building experience to
                accelerating your career.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
                Premium gives you access to deeper career support, advanced
                project opportunities and tools designed to help you become
                more prepared for your next opportunity.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Advanced project opportunities",
                  "Professional feedback and review",
                  "Career-focused AI tools",
                  "Expanded professional evidence",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
                      <Check className="h-3 w-3" />
                    </div>

                    <span className="text-sm font-medium text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                See what premium can unlock
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative overflow-hidden bg-slate-950 p-6 sm:p-8">
              <div className="hero-glow absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_40%)]" />

              <div className="relative flex h-full min-h-[420px] flex-col justify-end rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-6">
                <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Sparkles className="h-5 w-5 text-blue-300" />
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  Career acceleration
                </p>

                <h3 className="mt-4 max-w-sm text-2xl font-semibold text-white">
                  Build the work. Strengthen the story. Improve your readiness.
                </h3>

                <div className="mt-8 space-y-3">
                  {[
                    {
                      icon: Video,
                      text: "AI interview preparation",
                    },
                    {
                      icon: BriefcaseBusiness,
                      text: "Career opportunities",
                    },
                    {
                      icon: GraduationCap,
                      text: "Professional development",
                    },
                  ].map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.text}
                        className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05]">
                          <Icon className="h-4 w-4 text-white/80" />
                        </div>

                        <span className="text-sm text-white/70">
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS */}
      <section className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                UK Opportunities
              </span>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Build proof before you pursue the next role.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500">
                The LiveProject job experience is designed to connect your
                growing professional evidence with opportunities worth
                pursuing.
              </p>

              <ProtectedLink
                href="/job-board"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
              >
                Explore the UK Job Board
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ProtectedLink>
            </div>

            <div className="grid gap-4">
              {[
                {
                  company: "Product Company",
                  role: "Associate Product Manager",
                  location: "London, United Kingdom",
                },
                {
                  company: "Technology Company",
                  role: "Junior Business Analyst",
                  location: "Manchester, United Kingdom",
                },
                {
                  company: "Delivery Consultancy",
                  role: "Project Analyst",
                  location: "Birmingham, United Kingdom",
                },
              ].map((job) => (
                <div
                  key={job.role}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_15px_40px_rgba(15,23,42,0.06)]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-white">
                          {job.company
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            {job.company}
                          </p>

                          <h3 className="mt-1 text-base font-semibold text-slate-950">
                            {job.role}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <Globe2 className="h-3.5 w-3.5" />
                        {job.location}
                      </div>
                    </div>

                    <ChevronRight className="mt-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI */}
      <section className="bg-slate-950 px-4 py-28 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
              Career preparation
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Practice before the room matters.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/45">
              Premium career tools are designed to help professionals prepare
              more intentionally for interviews, applications and the next
              step in their career.
            </p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Video className="h-5 w-5 text-blue-300" />

                <h3 className="mt-4 text-sm font-semibold">
                  AI interview room
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Practice answering questions in a realistic interview
                  environment.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <Sparkles className="h-5 w-5 text-violet-300" />

                <h3 className="mt-4 text-sm font-semibold">
                  Career intelligence
                </h3>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Get practical guidance around your next career move.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="hero-glow absolute inset-8 rounded-full bg-blue-500/10 blur-[100px]" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#07101c] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      AI Interview
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      Product Manager Interview
                    </h3>
                  </div>

                  <Sparkles className="h-4 w-4 text-blue-300" />
                </div>

                <div className="mt-7 flex flex-col items-center justify-center rounded-[1.4rem] border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent px-6 py-12 text-center">
                  <div className="hero-glow flex h-20 w-20 items-center justify-center rounded-full border border-blue-300/20 bg-blue-400/10">
                    <Sparkles className="h-8 w-8 text-blue-300" />
                  </div>

                  <p className="mt-6 text-sm font-semibold text-white">
                    LiveProject AI
                  </p>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-white/35">
                    “Tell me about a time you had to make a difficult product
                    decision.”
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-3">
                  <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-400" />

                  <span className="text-xs text-white/45">
                    Interview session active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section id="resources" className="px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Resources
              </span>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Keep learning while you build.
              </h2>

              <p className="mt-6 text-base leading-8 text-slate-500">
                Guides, templates, courses, career content and challenges
                designed to support the work behind your progress.
              </p>
            </div>

            <Link
              href="/resources"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
            >
              Explore resources
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: GraduationCap,
                title: "Learning",
                text: "Build knowledge alongside practical experience.",
              },
              {
                icon: Globe2,
                title: "Career Guides",
                text: "Practical ideas for navigating your next move.",
              },
              {
                icon: Rocket,
                title: "Challenges",
                text: "Stretch yourself through additional career-focused challenges.",
              },
            ].map((resource) => {
              const Icon = resource.icon;

              return (
                <Link
                  key={resource.title}
                  href="/resources"
                  className="group block rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-500 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(15,23,42,0.07)]"
                >
                  <div className="track-icon flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-950">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {resource.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {resource.text}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
                    Explore
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-slate-50 px-4 py-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Frequently asked
            </span>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
              Questions, answered.
            </h2>
          </div>

          <div className="mt-12 divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((faq, index) => {
              const open = faqOpen === index;

              return (
                <div key={faq.question}>
                  <button
                    type="button"
                    onClick={() => setFaqOpen(open ? null : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="text-base font-semibold text-slate-950">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-slate-500">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-16 text-white sm:px-10 lg:px-16 lg:py-20">
          <div className="relative">
            <div className="hero-glow absolute -right-24 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]" />

            <div className="relative max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/30">
                Your next chapter
              </span>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                Build something you can actually show.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/45">
                Start with a project. Build the work. Strengthen your evidence.
                Then take that progress with you wherever your career goes.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
                >
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Explore projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                  L
                </div>

                <span className="text-sm font-semibold text-slate-950">
                  LiveProject
                </span>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
                Learn. Work on Live Projects. Build Verified Experience. Get
                Hired.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Platform
              </h3>

              <div className="mt-5 space-y-3">
                <Link
                  href="/projects"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Projects
                </Link>

                <ProtectedLink
                  href="/job-board"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Job Board
                </ProtectedLink>

                <Link
                  href="/about"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  About
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Resources
              </h3>

              <div className="mt-5 space-y-3">
                <Link
                  href="/resources"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Career Guides
                </Link>

                <Link
                  href="/resources"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Courses
                </Link>

                <Link
                  href="/resources"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Templates
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Account
              </h3>

              <div className="mt-5 space-y-3">
                <Link
                  href="/login"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block text-sm text-slate-500 transition hover:text-slate-950"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} LiveProject. All rights reserved.</p>

            <div className="flex gap-5">
              <Link href="/privacy" className="transition hover:text-slate-950">
                Privacy
              </Link>

              <Link href="/terms" className="transition hover:text-slate-950">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* PROJECT PREVIEW */}
      {activeProject && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {activeProject.track}
                  </span>

                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">
                    {activeProject.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="mt-5 text-sm leading-7 text-slate-500">
                {activeProject.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
                  {activeProject.level}
                </span>

                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
                  {activeProject.duration}
                </span>

                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500">
                  {activeProject.format}
                </span>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Project access
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Create an account to view the full project brief, detailed
                  deliverables, requirements and application flow.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => openProject(activeProject)}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}