"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Database,
  Globe2,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101d] text-white">
      {/* Ambient effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -right-40 top-[20%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-15rem] left-[30%] h-[32rem] w-[32rem] rounded-full bg-indigo-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-[#06101d]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-lg font-black tracking-tight"
          >
            LiveProject
          </button>

          <button
            type="button"
            onClick={() => router.push("/contact")}
            className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#06101d] transition hover:-translate-y-0.5 hover:bg-cyan-200 sm:inline-flex"
          >
            Contact Us
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-24">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] shadow-[0_0_45px_rgba(34,211,238,0.08)]">
            <LockKeyhole className="h-8 w-8 text-cyan-300" />
          </div>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-[-0.055em] sm:text-6xl">
            Your information should
            <span className="block text-cyan-300">work for you, not against you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/50">
            LiveProject is built around professional development, verified
            experience and meaningful career opportunities. This policy
            explains how information is handled when you use the platform.
          </p>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-white/25">
            Last updated: September 2026
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-3">
          <TrustCard
            icon={<Database className="h-5 w-5" />}
            title="Purpose-driven"
            description="Information is collected to operate, improve and secure LiveProject."
          />

          <TrustCard
            icon={<UserRound className="h-5 w-5" />}
            title="User control"
            description="You remain in control of the professional information you choose to provide."
          />

          <TrustCard
            icon={<Globe2 className="h-5 w-5" />}
            title="Global platform"
            description="LiveProject is designed for professionals, businesses and mentors worldwide."
          />
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="space-y-6">
            <PrivacySection
              number="01"
              title="Information we collect"
              content={
                <>
                  <p>
                    When you create or use a LiveProject account, we may
                    collect information that you provide directly, including
                    your name, email address, country, career track, experience
                    level, skills, professional links, career goals and other
                    profile information.
                  </p>

                  <p>
                    Information may also be created through your use of the
                    platform, such as projects you apply for, project progress,
                    submissions, feedback, verified experience records,
                    portfolio information and career activity.
                  </p>
                </>
              }
            />

            <PrivacySection
              number="02"
              title="How we use your information"
              content={
                <>
                  <p>
                    We use information to provide and operate LiveProject,
                    personalize your experience and connect platform features
                    to your career goals.
                  </p>

                  <ul>
                    <li>Provide access to projects and platform features.</li>
                    <li>
                      Build your professional profile and verified experience
                      record.
                    </li>
                    <li>
                      Improve project, learning and career recommendations.
                    </li>
                    <li>
                      Provide support, security and service communications.
                    </li>
                    <li>
                      Improve LiveProject&apos;s products, systems and user
                      experience.
                    </li>
                  </ul>
                </>
              }
            />

            <PrivacySection
              number="03"
              title="Professional profiles and visibility"
              content={
                <p>
                  Some information may be displayed within the LiveProject
                  ecosystem where necessary to support professional
                  collaboration, project participation, portfolios or verified
                  experience. We aim to make visibility meaningful and
                  connected to the purpose of the feature rather than exposing
                  unnecessary personal information.
                </p>
              }
            />

            <PrivacySection
              number="04"
              title="Projects and verified experience"
              content={
                <>
                  <p>
                    LiveProject is designed around evidence-backed
                    professional development. Project activity, submissions,
                    approvals, client feedback and completed work may be used
                    to create records associated with your professional
                    experience.
                  </p>

                  <p>
                    These records are intended to represent work performed
                    through LiveProject and should not be treated as a
                    substitute for independent verification where an employer,
                    institution or other third party requires it.
                  </p>
                </>
              }
            />

            <PrivacySection
              number="05"
              title="AI features"
              content={
                <>
                  <p>
                    LiveProject may provide AI-powered features such as career
                    assistance, recommendations, project guidance, CV review
                    and interview preparation.
                  </p>

                  <p>
                    Information submitted to an AI feature may be processed to
                    provide the requested response or functionality. AI output
                    should be treated as assistance and not as a guaranteed
                    hiring, career or professional decision.
                  </p>
                </>
              }
            />

            <PrivacySection
              number="06"
              title="Communications"
              content={
                <p>
                  We may use your contact information to communicate with you
                  about your account, projects, security, support requests,
                  important service changes and other information necessary to
                  provide LiveProject. Where applicable, you may also control
                  optional communications.
                </p>
              }
            />

            <PrivacySection
              number="07"
              title="Security"
              content={
                <p>
                  We take reasonable technical and organisational measures to
                  protect information from unauthorized access, misuse,
                  alteration or loss. No internet-based service can guarantee
                  absolute security, so users should also protect their account
                  credentials and avoid submitting information that is not
                  necessary for a particular feature.
                </p>
              }
            />

            <PrivacySection
              number="08"
              title="Third-party services"
              content={
                <p>
                  Some LiveProject features may rely on third-party services
                  such as authentication, analytics, cloud infrastructure,
                  payment providers, communication tools or AI providers.
                  Information processed through those services may be subject
                  to their respective privacy practices and terms.
                </p>
              }
            />

            <PrivacySection
              number="09"
              title="Payments"
              content={
                <p>
                  When paid services are introduced or used, payment details
                  may be processed by approved payment providers. LiveProject
                  should not need to store your complete card or banking
                  credentials directly when a third-party payment provider is
                  handling the transaction.
                </p>
              }
            />

            <PrivacySection
              number="10"
              title="Data retention"
              content={
                <p>
                  We retain information for as long as reasonably necessary to
                  provide the requested service, maintain legitimate business
                  records, protect the platform, resolve disputes and satisfy
                  applicable legal or operational requirements. Retention
                  periods may vary depending on the type and purpose of the
                  information.
                </p>
              }
            />

            <PrivacySection
              number="11"
              title="Your choices"
              content={
                <>
                  <p>
                    Depending on the feature and applicable law, you may have
                    rights to access, update, correct or request deletion of
                    personal information associated with your account.
                  </p>

                  <p>
                    You can also choose what professional information you add to
                    your profile and how much detail you provide beyond what is
                    necessary to use a particular feature.
                  </p>
                </>
              }
            />

            <PrivacySection
              number="12"
              title="Children"
              content={
                <p>
                  LiveProject is intended for professional and career
                  development use. The platform is not designed for children
                  and we do not knowingly seek to collect personal information
                  from children.
                </p>
              }
            />

            <PrivacySection
              number="13"
              title="Policy updates"
              content={
                <p>
                  We may update this privacy policy as LiveProject evolves.
                  When important changes are made, we may provide an appropriate
                  notice through the platform or other communication channels.
                </p>
              }
            />

            <PrivacySection
              number="14"
              title="Contact"
              content={
                <>
                  <p>
                    Questions about this Privacy Policy or how LiveProject
                    handles information can be directed to our team.
                  </p>

                  <button
                    type="button"
                    onClick={() => router.push("/contact")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200"
                  >
                    Contact LiveProject
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              }
            />
          </div>

          {/* Bottom navigation */}
          <div className="mt-16 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                Need help?
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-black">Contact us</span>
                <ArrowRight className="h-4 w-4 text-cyan-300 transition group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => router.push("/terms")}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                Next
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-black">Terms of Service</span>
                <ArrowRight className="h-4 w-4 text-cyan-300 transition group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LiveProject. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="transition hover:text-white"
            >
              Contact
            </button>

            <button
              type="button"
              onClick={() => router.push("/privacy")}
              className="text-white"
            >
              Privacy
            </button>

            <button
              type="button"
              onClick={() => router.push("/terms")}
              className="transition hover:text-white"
            >
              Terms
            </button>

            <button
              type="button"
              onClick={() => router.push("/premium")}
              className="transition hover:text-white"
            >
              Premium
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

function TrustCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#06101d] p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
        {icon}
      </div>

      <h3 className="mt-5 font-black">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-white/40">{description}</p>
    </div>
  );
}

function PrivacySection({
  number,
  title,
  content,
}: {
  number: string;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="flex gap-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] text-xs font-black text-cyan-300">
          {number}
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">
            {title}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-white/50">
            {content}
          </div>
        </div>
      </div>
    </article>
  );
}