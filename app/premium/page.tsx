
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Crown,
  FileCheck2,
  GraduationCap,
  Lock,
  MessageSquareQuote,
  Rocket,
  
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const PREMIUM_PRICE = 99;

const benefits = [
  {
    icon: Rocket,
    title: "Unlimited Real-World Projects",
    description:
      "Access the complete LiveProject project library with advanced and professional challenges across every career field.",
  },
  {
    icon: BookOpen,
    title: "Unlimited Learning",
    description:
      "Access the complete course library with deeper lessons, practical resources and advanced learning content.",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    description:
      "Earn professional certificates that validate the projects, skills and learning you have completed.",
  },
  {
    icon: MessageSquareQuote,
    title: "Professional Recommendations",
    description:
      "Request and showcase recommendations that strengthen the credibility of your professional profile.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Premium Job Board",
    description:
      "Discover opportunities, match your experience to jobs, save opportunities and manage your applications.",
  },
  {
    icon: Sparkles,
    title: "AI Job Matching",
    description:
      "Let LiveProject AI analyse your experience and identify opportunities that match your current capabilities.",
  },
  {
    icon: Target,
    title: "Job Readiness",
    description:
      "Understand where you stand, identify skill gaps and receive a personalized improvement roadmap.",
  },
  {
    icon: GraduationCap,
    title: "AI Interview",
    description:
      "Practice realistic interviews with the LiveProject AI interviewer and receive detailed performance feedback.",
  },
  {
    icon: FileCheck2,
    title: "CV Review",
    description:
      "Get AI-powered feedback on your CV and understand how well it communicates your experience.",
  },
  {
    icon: Zap,
    title: "Career Roadmap",
    description:
      "Get personalized recommendations for projects, learning and career actions based on your goals.",
  },
  {
    icon: Users,
    title: "Team Projects",
    description:
      "Participate in deeper collaborative experiences designed to simulate professional team environments.",
  },
  {
    icon: BadgeCheck,
    title: "Enhanced Experience Passport",
    description:
      "Turn your verified projects, skills, certificates and recommendations into stronger career evidence.",
  },
];

const comparison = [
  ["Real-world projects", "Free projects", "400+ projects"],
  ["Projects per career field", "Limited", "50+"],
  ["Courses", "Up to 2", "Unlimited"],
  ["Course depth", "Basic", "Full"],
  ["Experience Passport", true, true],
  ["Portfolio", true, true],
  ["Certificates", false, true],
  ["Recommendations", false, true],
  ["Premium Job Board", false, true],
  ["AI Job Matching", false, true],
  ["Saved Jobs", false, true],
  ["Application Tracker", false, true],
  ["Job Alerts", false, true],
  ["Career Insights", false, true],
  ["AI Interview", false, true],
  ["Job Readiness", false, true],
  ["CV Review", false, true],
  ["Career Roadmap", false, true],
];

const faqs = [
  {
    question: "What happens immediately after I upgrade?",
    answer:
      "Your account is upgraded to Premium and the Premium areas of your LiveProject dashboard become available. You can then access Premium projects, the complete course library and Premium career tools.",
  },
  {
    question: "How many projects can I access with Premium?",
    answer:
      "Premium users can access the full LiveProject project library. The platform is designed to grow continuously, with at least 50 projects available for every career field.",
  },
  {
    question: "How many courses can I take with Free?",
    answer:
      "Free users can access up to two courses. Premium removes that limitation and gives access to the full learning library and deeper course content.",
  },
  {
    question: "Are certificates available on the Free plan?",
    answer:
      "No. Certificates are part of the Premium career-profile experience.",
  },
  {
    question: "Can Free users use the AI Interview?",
    answer:
      "No. AI Interview is a Premium feature.",
  },
  {
    question: "Can I use the Job Board without Premium?",
    answer:
      "No. The LiveProject Job Board is part of the Premium career-advantage system.",
  },
];

export default function PremiumPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleUpgrade() {
    router.push("/checkout?plan=premium");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-950">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        .premium-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.045) 1px,
              transparent 1px
            );
          background-size: 54px 54px;
          animation: premiumGrid 18s linear infinite;
        }

        .premium-orb-one {
          animation: premiumOrbOne 8s ease-in-out infinite;
        }

        .premium-orb-two {
          animation: premiumOrbTwo 11s ease-in-out infinite;
        }

        .premium-ring {
          animation: premiumRing 25s linear infinite;
        }

        .premium-card-float {
          animation: premiumCardFloat 6s ease-in-out infinite;
        }

        .premium-card-float:nth-child(2) {
          animation-delay: 0.7s;
        }

        .premium-card-float:nth-child(3) {
          animation-delay: 1.4s;
        }

        .premium-card-float:nth-child(4) {
          animation-delay: 2.1s;
        }

        .premium-icon {
          animation: premiumIcon 4s ease-in-out infinite;
        }

        .premium-shine {
          background-size: 200% 100%;
          animation: premiumShine 4s linear infinite;
        }

        .premium-pulse {
          animation: premiumPulse 2.5s ease-in-out infinite;
        }

        @keyframes premiumGrid {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 54px 54px;
          }
        }

        @keyframes premiumOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, -24px, 0) scale(1.06);
          }
        }

        @keyframes premiumOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(0, 20px, 0) scale(1.05);
          }
        }

        @keyframes premiumRing {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes premiumCardFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes premiumIcon {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes premiumShine {
          from {
            background-position: 200% 0;
          }

          to {
            background-position: -200% 0;
          }
        }

        @keyframes premiumPulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.3);
          }

          50% {
            box-shadow: 0 0 0 8px rgba(96, 165, 250, 0);
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

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xl font-black tracking-tight"
          >
            Live<span className="text-blue-600">Project</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/workspace")}
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 sm:block"
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={handleUpgrade}
              className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Upgrade
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
        <div className="premium-grid absolute inset-0 opacity-60" />

        <div className="premium-orb-one absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[110px]" />

        <div className="premium-orb-two absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[110px]" />

        <div className="premium-ring absolute left-1/2 top-12 h-[500px] w-[500px] -translate-x-1/2 rounded-full border border-white/[0.035]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="premium-pulse mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-black tracking-widest text-blue-300">
            <Crown className="h-4 w-4" />
            LIVEPROJECT PREMIUM
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Turn your experience into{" "}
            <span className="bg-gradient-to-r from-blue-300 via-white to-cyan-300 bg-clip-text text-transparent">
              career opportunities.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Go beyond learning. Build real experience, prove your skills,
            prepare for interviews and discover opportunities with the complete
            LiveProject career acceleration system.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleUpgrade}
              className="premium-shine group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1"
            >
              Start Premium — ${PREMIUM_PRICE}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("comparison")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Compare Plans
            </button>
          </div>

          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="h-4 w-4 text-emerald-400" />
            One Premium plan · $99
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
          {[
            ["400+", "Projects"],
            ["50+", "Per career field"],
            ["Unlimited", "Courses"],
            ["AI-powered", "Career tools"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="premium-card-float px-5 py-7 text-center"
            >
              <p className="text-xl font-black sm:text-2xl">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black tracking-widest text-blue-600">
              SIMPLE PRICING
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              One plan. Everything unlocked.
            </h2>

            <p className="mt-4 text-slate-500">
              Premium is $99. Upgrade when you are ready to take your career
              experience further.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-2xl">
            <div className="relative overflow-hidden rounded-[2rem] border-2 border-blue-600 bg-slate-950 p-7 text-white shadow-[0_35px_100px_rgba(37,99,235,0.15)] sm:p-10">
              <div className="premium-orb-one absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-[90px]" />

              <div className="relative">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-blue-400" />
                      <p className="text-sm font-black text-blue-400">
                        PREMIUM
                      </p>
                    </div>

                    <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                      The complete LiveProject career acceleration system.
                    </p>
                  </div>

                  <div className="w-fit rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-black tracking-wider">
                    RECOMMENDED
                  </div>
                </div>

                <div className="mt-9">
                  <span className="text-6xl font-black">$99</span>
                  <span className="ml-2 text-sm text-slate-500">Premium</span>
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  One Premium plan with the complete feature set.
                </p>

                <div className="my-8 h-px bg-white/10" />

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    "Unlimited real-world projects",
                    "Unlimited courses",
                    "Verified certificates",
                    "Professional recommendations",
                    "Premium Job Board",
                    "AI Job Matching",
                    "Application Tracker",
                    "Job Alerts",
                    "AI Interview",
                    "Job Readiness",
                    "CV Review",
                    "Career Roadmap",
                    "Team Projects",
                    "Enhanced Experience Passport",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3"
                    >
                      <Check className="h-4 w-4 shrink-0 text-blue-400" />
                      <span className="text-sm text-slate-200">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleUpgrade}
                  className="premium-shine mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  Upgrade for $99
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Lock className="h-3.5 w-3.5" />
                  Secure checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-black tracking-widest text-blue-600">
              EVERYTHING UNLOCKED
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">
              Premium is your complete career system.
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Every feature is designed to move you from learning, to
              experience, to proof, to opportunities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <article
                  key={benefit.title}
                  className="premium-card-float rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="premium-icon flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>

                  <h3 className="mt-5 text-lg font-black">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="comparison"
        className="px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-black tracking-widest text-blue-600">
              FREE VS PREMIUM
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              See exactly what you unlock.
            </h2>
          </div>

          <div className="mt-12 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-slate-950 px-5 py-5 text-sm font-black text-white sm:px-7">
              <span>Feature</span>
              <span>Free</span>
              <span>Premium</span>
            </div>

            {comparison.map(([feature, free, premium], index) => (
              <div
                key={String(feature)}
                className={`grid grid-cols-[1.6fr_1fr_1fr] px-5 py-4 text-sm transition hover:bg-blue-50/30 sm:px-7 ${
                  index % 2 === 0 ? "bg-slate-50" : "bg-white"
                }`}
              >
                <span className="font-semibold text-slate-700">
                  {feature}
                </span>

                <span>
                  {typeof free === "boolean" ? (
                    free ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300" />
                    )
                  ) : (
                    <span className="text-slate-500">{free}</span>
                  )}
                </span>

                <span>
                  {typeof premium === "boolean" ? (
                    premium ? (
                      <Check className="h-4 w-4 text-blue-600" />
                    ) : (
                      <X className="h-4 w-4 text-slate-300" />
                    )
                  ) : (
                    <span className="font-bold text-blue-600">
                      {premium}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-black tracking-widest text-blue-400">
              YOUR PREMIUM JOURNEY
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              From experience to opportunity.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-5">
            {[
              ["01", "Build", "Work on real-world projects."],
              ["02", "Learn", "Go deeper with practical courses."],
              ["03", "Prove", "Earn verified career evidence."],
              ["04", "Prepare", "Improve your job readiness."],
              ["05", "Get Hired", "Find and pursue opportunities."],
            ].map(([number, title, description]) => (
              <div
                key={number}
                className="premium-card-float rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-2 hover:bg-white/[0.07]"
              >
                <span className="text-xs font-black text-blue-400">
                  {number}
                </span>

                <h3 className="mt-6 text-xl font-black">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={handleUpgrade}
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-sm font-black hover:bg-blue-500"
            >
              Start Your Premium Journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-black tracking-widest text-blue-600">
              FAQ
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              Questions about Premium?
            </h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, index) => {
              const open = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-2xl border border-slate-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : index)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                  >
                    <span className="text-sm font-bold sm:text-base">
                      {faq.question}
                    </span>

                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-slate-400 transition ${
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
                      <p className="border-t border-slate-100 px-5 py-5 text-sm leading-7 text-slate-500">
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

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-600 px-6 py-14 text-center text-white sm:px-12">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-[100px]" />

          <div className="relative">
            <Crown className="mx-auto h-10 w-10" />

            <h2 className="mt-5 text-3xl font-black sm:text-5xl">
              Your next opportunity starts with proof.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">
              Build it. Prove it. Prepare for it. Find it.
              <br />
              Unlock the complete LiveProject experience for $99.
            </p>

            <button
              type="button"
              onClick={handleUpgrade}
              className="premium-shine mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-white via-blue-50 to-white px-7 py-4 text-sm font-black text-slate-950 transition hover:-translate-y-1"
            >
              Upgrade to Premium — $99
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="font-black text-slate-950"
          >
            Live<span className="text-blue-600">Project</span>
          </button>

          <p>
            Learn. Work on Live Projects. Build Verified Experience. Get Hired.
          </p>
        </div>
      </footer>
    </main>
  );
}
