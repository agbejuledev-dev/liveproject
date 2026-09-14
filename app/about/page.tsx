// app/about/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Globe2,
  Layers3,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

const values = [
  {
    icon: Target,
    title: "Experience first",
    description:
      "We believe professionals become stronger by solving meaningful problems, not simply by collecting certificates.",
  },
  {
    icon: ShieldCheck,
    title: "Evidence over claims",
    description:
      "Professional growth should be supported by real work, useful feedback, measurable outcomes and demonstrated skills.",
  },
  {
    icon: Users,
    title: "Built around people",
    description:
      "Professionals, businesses, mentors and organisations all have a place inside the LiveProject ecosystem.",
  },
  {
    icon: Globe2,
    title: "Global by design",
    description:
      "LiveProject is designed for a global professional community and opportunities beyond geographic boundaries.",
  },
];

const journey = [
  {
    number: "01",
    title: "Learn",
    description:
      "Develop the knowledge, context and skills you need to perform confidently in your chosen career track.",
  },
  {
    number: "02",
    title: "Work",
    description:
      "Apply your knowledge to structured real-world and realistic business projects built around professional situations.",
  },
  {
    number: "03",
    title: "Prove",
    description:
      "Turn completed work, feedback, outcomes and demonstrated capabilities into evidence-backed professional experience.",
  },
  {
    number: "04",
    title: "Get hired",
    description:
      "Use your experience profile, portfolio and career tools to become more prepared and visible for opportunities.",
  },
];

const ecosystem = [
  {
    icon: BriefcaseBusiness,
    title: "Professionals",
    description:
      "Build practical experience, strengthen your portfolio and create evidence that supports your next career move.",
  },
  {
    icon: Layers3,
    title: "Businesses",
    description:
      "Bring meaningful business problems into an ecosystem where capable professionals can work on structured challenges.",
  },
  {
    icon: Users,
    title: "Mentors & trainers",
    description:
      "Support professionals through guidance, feedback and practical development throughout their experience journey.",
  },
  {
    icon: Rocket,
    title: "Career opportunities",
    description:
      "Connect demonstrated experience with career development, interview preparation and relevant opportunities.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .about-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.045) 1px,
              transparent 1px
            );
          background-size: 54px 54px;
          animation: aboutGridMove 18s linear infinite;
        }

        .hero-glow-one {
          animation: aboutOrbOne 8s ease-in-out infinite;
        }

        .hero-glow-two {
          animation: aboutOrbTwo 11s ease-in-out infinite;
        }

        .hero-ring-one {
          animation: aboutRingOne 22s linear infinite;
        }

        .hero-ring-two {
          animation: aboutRingTwo 28s linear infinite;
        }

        .hero-ring-three {
          animation: aboutRingThree 34s linear infinite;
        }

        .hero-badge {
          animation: aboutBadgeFloat 4.5s ease-in-out infinite;
        }

        .hero-stat {
          animation: aboutStatFloat 6s ease-in-out infinite;
        }

        .hero-stat:nth-child(2) {
          animation-delay: 0.8s;
        }

        .hero-stat:nth-child(3) {
          animation-delay: 1.6s;
        }

        .about-value-card {
          animation: aboutCardFloat 7s ease-in-out infinite;
        }

        .about-value-card:nth-child(2) {
          animation-delay: 0.7s;
        }

        .about-value-card:nth-child(3) {
          animation-delay: 1.4s;
        }

        .about-value-card:nth-child(4) {
          animation-delay: 2.1s;
        }

        .about-icon-float {
          animation: aboutIconFloat 4.2s ease-in-out infinite;
        }

        .journey-card {
          animation: aboutJourneyFloat 7s ease-in-out infinite;
        }

        .journey-card:nth-child(2) {
          animation-delay: 0.6s;
        }

        .journey-card:nth-child(3) {
          animation-delay: 1.2s;
        }

        .journey-card:nth-child(4) {
          animation-delay: 1.8s;
        }

        .journey-number {
          animation: aboutNumberPulse 3s ease-in-out infinite;
        }

        .ecosystem-card {
          animation: aboutEcoFloat 8s ease-in-out infinite;
        }

        .ecosystem-card:nth-child(2) {
          animation-delay: 0.8s;
        }

        .ecosystem-card:nth-child(3) {
          animation-delay: 1.6s;
        }

        .ecosystem-card:nth-child(4) {
          animation-delay: 2.4s;
        }

        .ecosystem-icon {
          animation: aboutIconFloat 4.8s ease-in-out infinite;
        }

        .leadership-ring-one {
          animation: aboutRingOne 24s linear infinite;
        }

        .leadership-ring-two {
          animation: aboutRingTwo 30s linear infinite reverse;
        }

        .leadership-portrait-glow {
          animation: aboutPortraitGlow 6s ease-in-out infinite;
        }

        .leadership-photo {
          animation: aboutPhotoFloat 7s ease-in-out infinite;
        }

        .leadership-founder {
          animation: aboutFounderFloat 6s ease-in-out infinite;
        }

        .leadership-mini {
          animation: aboutMiniFloat 7s ease-in-out infinite;
        }

        .leadership-mini:nth-child(2) {
          animation-delay: 0.6s;
        }

        .leadership-mini:nth-child(3) {
          animation-delay: 1.2s;
        }

        .leadership-mini:nth-child(4) {
          animation-delay: 1.8s;
        }

        .cta-glow {
          animation: aboutCtaGlow 7s ease-in-out infinite;
        }

        .cta-shine {
          background-size: 200% 100%;
          animation: aboutShine 4s linear infinite;
        }

        @keyframes aboutGridMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 54px 54px;
          }
        }

        @keyframes aboutOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, -26px, 0) scale(1.06);
          }
        }

        @keyframes aboutOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, 22px, 0) scale(1.05);
          }
        }

        @keyframes aboutRingOne {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes aboutRingTwo {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes aboutRingThree {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes aboutBadgeFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes aboutStatFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes aboutCardFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes aboutIconFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes aboutJourneyFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes aboutNumberPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(7, 87, 213, 0);
          }

          50% {
            box-shadow: 0 0 0 7px rgba(7, 87, 213, 0.08);
          }
        }

        @keyframes aboutEcoFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes aboutPortraitGlow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }

          50% {
            opacity: 0.62;
            transform: scale(1.06);
          }
        }

        @keyframes aboutPhotoFloat {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.012);
          }
        }

        @keyframes aboutFounderFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes aboutMiniFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes aboutCtaGlow {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.4;
          }

          50% {
            transform: translate3d(0, -12px, 0) scale(1.08);
            opacity: 0.7;
          }
        }

        @keyframes aboutShine {
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

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#06122f]">
        <div className="about-grid absolute inset-0 opacity-60" />

        <div className="hero-glow-one absolute -left-24 top-32 h-72 w-72 rounded-full bg-blue-600/24 blur-[100px]" />

        <div className="hero-glow-two absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="hero-ring-one absolute -left-24 top-32 h-72 w-72 rounded-full border border-white/5" />

        <div className="hero-ring-two absolute -right-32 bottom-0 h-96 w-96 rounded-full border border-white/5" />

        <div className="hero-ring-three absolute left-1/2 top-20 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-white/[0.035]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-7 sm:px-8 lg:px-10 lg:pb-28 lg:pt-9">
          <nav className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="about-icon-float flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0757d5] shadow-lg transition duration-300 group-hover:scale-110">
                <Sparkles className="h-5 w-5" />
              </div>

              <span className="text-lg font-black tracking-tight text-white">
                LiveProject
              </span>
            </Link>

            <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
              <Link href="/about" className="text-white">
                About
              </Link>

              <Link
                href="/projects"
                className="transition hover:text-white"
              >
                Real Projects
              </Link>

              <Link
                href="/resources"
                className="transition hover:text-white"
              >
                Resources
              </Link>

              <Link href="/blog" className="transition hover:text-white">
                Blog
              </Link>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-300 transition hover:text-white sm:px-4"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#0757d5] shadow-lg transition hover:bg-blue-50"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </nav>

          <div className="mx-auto mt-20 max-w-5xl text-center lg:mt-28">
            <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-blue-200 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              The experience-first career ecosystem
            </div>

            <h1 className="mt-8 text-4xl font-black leading-[1.07] tracking-tight text-white sm:text-5xl lg:text-7xl">
              Your career should be
              <span className="block bg-gradient-to-r from-blue-200 via-white to-cyan-200 bg-clip-text text-transparent">
                built on experience.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              LiveProject exists to close the gap between learning something
              and being able to prove you can do it. We give professionals a
              place to learn, work on meaningful projects, build verified
              experience and move confidently towards opportunity.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0757d5] px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:-translate-y-1 hover:bg-[#0b66ee]"
              >
                Start building experience
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
              >
                Explore projects
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 max-w-6xl lg:mt-24">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="hero-stat rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-lg font-black text-white">Learn</p>
                <p className="mt-1 text-sm text-slate-300">
                  Build relevant knowledge
                </p>
              </div>

              <div className="hero-stat rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-lg font-black text-white">Work</p>
                <p className="mt-1 text-sm text-slate-300">
                  Apply it to practical projects
                </p>
              </div>

              <div className="hero-stat rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <p className="text-lg font-black text-white">Prove</p>
                <p className="mt-1 text-sm text-slate-300">
                  Turn work into professional evidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY LIVEPROJECT */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0757d5]">
              Why LiveProject
            </p>

            <h2 className="mt-4 max-w-xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Learning should lead somewhere.
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-lg leading-8 text-slate-600">
              Traditional career journeys often separate learning from work.
              You study, collect certificates, apply for jobs and are then
              asked to prove that you have experience.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              LiveProject is built to change that sequence. We bring learning,
              practical project work, professional feedback, verified evidence
              and career progression into one connected ecosystem.
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Instead of simply saying you are capable, you get structured
              opportunities to demonstrate it.
            </p>

            <div className="mt-8 flex items-start gap-3 text-sm font-bold leading-6 text-slate-900">
              <span className="about-icon-float mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0757d5]">
                <CheckCircle2 className="h-4 w-4" />
              </span>

              <span>
                Learn. Work on Live Projects. Build Verified Experience. Get
                Hired.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#f6f8fc]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0757d5]">
              Our values
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              What we believe
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Everything we build is guided by a simple idea: professional
              growth should be practical, measurable and connected to real
              outcomes.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="about-value-card group rounded-2xl border border-slate-200 bg-white p-7 transition duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                >
                  <div className="about-icon-float flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0757d5] transition group-hover:bg-[#0757d5] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0757d5]">
                The LiveProject journey
              </p>

              <h2 className="mt-4 max-w-md text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                From potential to proof.
              </h2>

              <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
                Our ecosystem is designed around the progression professionals
                actually need — from learning something to demonstrating that
                they can deliver it.
              </p>

              <Link
                href="/register"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#0757d5] transition hover:gap-3"
              >
                Build your journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {journey.map((item) => (
                <div
                  key={item.number}
                  className="journey-card group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-100"
                >
                  <div className="journey-number flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white transition group-hover:bg-[#0757d5]">
                    {item.number}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-950">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="bg-[#06122f]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
              One ecosystem
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Built for the people who make careers happen.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-300 sm:text-lg">
              Professionals need experience. Businesses need capable people.
              Mentors help close the gap. LiveProject brings those pieces
              together.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {ecosystem.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="ecosystem-card rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition duration-500 hover:-translate-y-2 hover:border-blue-400/30 hover:bg-white/[0.07]"
                >
                  <div className="ecosystem-icon flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-blue-200">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEADERSHIP */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0757d5]">
                <span className="line-pulse h-px w-8 bg-[#0757d5]" />
                Leadership
              </div>

              <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
                The people
                <span className="block text-[#0757d5]">
                  behind the vision.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-600">
                LiveProject brings together professional delivery experience
                and technology to create a better bridge between learning,
                practical experience and opportunity.
              </p>
            </div>

            <div className="max-w-2xl lg:ml-auto">
              <p className="text-xl font-semibold leading-9 tracking-tight text-slate-900 sm:text-2xl">
                “We are building the kind of ecosystem we believe professionals
                should have had all along — one where opportunity is connected
                to what you can actually do.”
              </p>
            </div>
          </div>

          <div className="mt-16 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            {/* CO-FOUNDER PHOTO FEATURE */}
            <div className="leadership-photo group relative overflow-hidden rounded-[32px] bg-[#060b17]">
              <div className="leadership-portrait-glow pointer-events-none absolute -right-20 top-0 z-10 h-72 w-72 rounded-full bg-blue-500/15 blur-[110px]" />

              <div className="leadership-ring-one pointer-events-none absolute -right-16 top-20 z-10 h-56 w-56 rounded-full border border-white/[0.06]" />

              <div className="leadership-ring-two pointer-events-none absolute -left-24 bottom-8 z-10 h-72 w-72 rounded-full border border-white/[0.04]" />

              <div className="relative h-[620px] overflow-hidden sm:h-[720px]">
                <Image
                  src="/images/oluwatobiloba.png"
                  alt="Oluwatobiloba Agbejule"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain object-center transition duration-700 group-hover:scale-[1.015]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />

                <div className="absolute left-6 top-6 z-20">
                  <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    Co-Founder
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-20 p-7 sm:p-9">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                    Technology · Product · Digital Experience
                  </p>

                  <h3 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
                    Oluwatobiloba
                    <span className="block">Agbejule</span>
                  </h3>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                    Software development, product thinking and technology
                    shaping the digital experience behind LiveProject.
                  </p>
                </div>
              </div>
            </div>

            {/* LEADERSHIP CONTENT */}
            <div className="space-y-10">
              {/* CO-FOUNDER */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="about-icon-float flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0757d5]">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Co-Founder
                    </p>

                    <p className="text-lg font-black text-slate-950">
                      Oluwatobiloba Agbejule
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-7 text-slate-600">
                  Oluwatobiloba Agbejule combines software development, product
                  thinking and technology to help shape the LiveProject
                  experience. His focus is on turning the platform&apos;s vision
                  into an accessible, modern digital ecosystem for
                  professionals around the world.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  He is focused on creating intuitive digital experiences that
                  make practical work, professional evidence and career
                  development feel connected rather than fragmented.
                </p>

                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <LeadershipPoint text="Software development" />
                  <LeadershipPoint text="Product & technology" />
                  <LeadershipPoint text="Digital experiences" />
                  <LeadershipPoint text="Career-focused platform design" />
                </div>
              </div>

              <div className="h-px bg-slate-200" />

              {/* FOUNDER */}
              <div className="leadership-founder relative overflow-hidden rounded-[28px] bg-[#07183d] p-7 sm:p-8">
                <div className="floating-orb absolute right-0 top-0 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative">
                  <div className="flex items-start gap-5">
                    <div className="about-icon-float flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-[#0757d5] text-2xl font-black text-white shadow-lg shadow-blue-950/30">
                      CB
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">
                        Founder
                      </p>

                      <h3 className="mt-1 text-2xl font-black tracking-tight text-white">
                        Chris Banjo
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Leadership · Agile · Project Delivery
                      </p>
                    </div>
                  </div>

                  <div className="mt-7">
                    <p className="text-sm leading-7 text-slate-300">
                      Chris Banjo is a certified Scrum Master and Product Owner
                      with over 20 years of experience in the IT domain. He has
                      successfully delivered projects across digital
                      transformation, process improvement, and change delivery
                      within the financial services, insurance, and public
                      sectors.
                    </p>

                    <p className="mt-4 text-sm leading-7 text-slate-300">
                      Throughout his career, Chris has helped organisations
                      deliver programmes more efficiently, streamline
                      operations, and transform ways of working by supporting
                      the transition from traditional Waterfall approaches to
                      Agile methodologies.
                    </p>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                      20+ years IT experience
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                      Certified Scrum Master
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                      Certified Product Owner
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                      Transformation & Change
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LEADERSHIP PRINCIPLE */}
          <div className="mt-14 border-t border-slate-200 pt-10">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="leadership-mini rounded-2xl border border-white/10 bg-[#07183d] p-5">
                <div className="about-icon-float flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-blue-200">
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Experience
                </p>

                <p className="mt-1 text-sm font-black text-white">
                  Practical
                </p>
              </div>

              <div className="leadership-mini rounded-2xl border border-slate-200 bg-white p-5">
                <div className="about-icon-float flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757d5]">
                  <ShieldCheck className="h-4 w-4" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Evidence
                </p>

                <p className="mt-1 text-sm font-black text-slate-900">
                  Verified
                </p>
              </div>

              <div className="leadership-mini rounded-2xl border border-slate-200 bg-white p-5">
                <div className="about-icon-float flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757d5]">
                  <Globe2 className="h-4 w-4" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Reach
                </p>

                <p className="mt-1 text-sm font-black text-slate-900">
                  Global
                </p>
              </div>

              <div className="leadership-mini rounded-2xl border border-slate-200 bg-white p-5">
                <div className="about-icon-float flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0757d5]">
                  <Rocket className="h-4 w-4" />
                </div>

                <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Focus
                </p>

                <p className="mt-1 text-sm font-black text-slate-900">
                  Career
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f6f8fc]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0757d5] to-[#06378e] px-6 py-12 text-white shadow-2xl shadow-blue-900/10 sm:px-10 lg:px-14 lg:py-16">
            <div className="cta-glow absolute -right-12 -top-20 h-64 w-64 rounded-full bg-cyan-300/15 blur-[100px]" />

            <div className="relative">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
                    <Zap className="h-3.5 w-3.5" />
                    Your next chapter starts with proof
                  </div>

                  <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                    Stop waiting for experience. Start building it.
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-blue-100 sm:text-base">
                    Join LiveProject and start building practical experience
                    that strengthens your skills, your portfolio and your
                    career story.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/register"
                    className="cta-shine inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-white via-blue-50 to-white px-6 py-3.5 text-sm font-bold text-[#0757d5] transition hover:-translate-y-1"
                  >
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/projects"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-1 hover:bg-white/10"
                  >
                    Explore projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <div className="flex items-center gap-2">
            <div className="about-icon-float flex h-9 w-9 items-center justify-center rounded-lg bg-[#0757d5] text-white">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-black text-slate-900">
                LiveProject
              </p>

              <p className="text-xs text-slate-400">
                Learn. Work. Prove. Get hired.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
            <Link href="/about" className="text-slate-900">
              About
            </Link>

            <Link
              href="/projects"
              className="transition hover:text-slate-900"
            >
              Projects
            </Link>

            <Link
              href="/resources"
              className="transition hover:text-slate-900"
            >
              Resources
            </Link>

            <Link href="/blog" className="transition hover:text-slate-900">
              Blog
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function LeadershipPoint({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0757d5]" />

      <span className="text-xs font-semibold leading-5 text-slate-700">
        {text}
      </span>
    </div>
  );
}