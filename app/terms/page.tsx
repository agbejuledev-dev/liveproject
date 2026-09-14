// app/terms/page.tsx

"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Gavel,
  Globe2,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101d] text-white">
      {/* Ambient effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -right-40 top-[18%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
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
            <FileText className="h-8 w-8 text-cyan-300" />
          </div>

          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
            <Gavel className="h-3.5 w-3.5" />
            Terms of Service
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-[-0.055em] sm:text-6xl">
            Clear rules for a
            <span className="block text-cyan-300">
              professional ecosystem.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/50">
            These Terms of Service explain the rules that apply when you use
            LiveProject, participate in projects, create professional
            information, access Premium features or interact with other users.
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
            icon={<UserCheck className="h-5 w-5" />}
            title="Use the platform responsibly"
            description="Provide truthful information and use LiveProject for legitimate professional development."
          />

          <TrustCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Respect other users"
            description="Professional collaboration requires respect, honesty and appropriate behaviour."
          />

          <TrustCard
            icon={<Globe2 className="h-5 w-5" />}
            title="Global community"
            description="LiveProject serves professionals, businesses and mentors across different countries."
          />
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="space-y-6">
            <TermsSection
              number="01"
              title="Acceptance of these Terms"
              content={
                <p>
                  By creating an account, accessing LiveProject or using any
                  LiveProject service, you agree to these Terms of Service and
                  our Privacy Policy. If you do not agree, you should not use
                  the platform.
                </p>
              }
            />

            <TermsSection
              number="02"
              title="Eligibility"
              content={
                <p>
                  You must provide accurate information and meet any age or
                  legal requirements applicable to the services you use. You
                  are responsible for ensuring that your participation in
                  LiveProject is lawful in your country.
                </p>
              }
            />

            <TermsSection
              number="03"
              title="Your account"
              content={
                <>
                  <p>
                    You are responsible for maintaining the accuracy of your
                    account information and protecting your login credentials.
                  </p>

                  <p>
                    You should not share your account, impersonate another
                    person, create deceptive accounts or use another user&apos;s
                    account without permission.
                  </p>
                </>
              }
            />

            <TermsSection
              number="04"
              title="Professional information"
              content={
                <p>
                  Information you provide about your education, skills,
                  professional experience, career history, portfolio,
                  achievements or project work should be accurate and not
                  intentionally misleading. LiveProject may restrict or remove
                  information that appears fraudulent, deceptive or harmful to
                  the integrity of the platform.
                </p>
              }
            />

            <TermsSection
              number="05"
              title="Projects and participation"
              content={
                <>
                  <p>
                    LiveProject may provide real-world, simulated or
                    structured professional projects. Project availability,
                    requirements, timelines and participation rules may vary.
                  </p>

                  <p>
                    You are responsible for completing work honestly and
                    respecting any project instructions, confidentiality
                    requirements and applicable intellectual-property
                    obligations.
                  </p>
                </>
              }
            />

            <TermsSection
              number="06"
              title="Project submissions and verification"
              content={
                <>
                  <p>
                    Project submissions may be reviewed by project
                    administrators, clients, mentors or other authorised
                    reviewers depending on the project.
                  </p>

                  <p>
                    Verification, approval or certification depends on the
                    applicable requirements being satisfied. LiveProject does
                    not guarantee that every submitted project will be
                    approved, certified or accepted by an external employer.
                  </p>
                </>
              }
            />

            <TermsSection
              number="07"
              title="Client and business responsibilities"
              content={
                <p>
                  Businesses and clients using LiveProject must provide
                  legitimate project information, communicate professionally
                  and respect applicable laws, agreements and intellectual
                  property rights. Clients must not use the platform to
                  facilitate unlawful activity, fraud, harassment or deceptive
                  employment practices.
                </p>
              }
            />

            <TermsSection
              number="08"
              title="Mentors and project administrators"
              content={
                <p>
                  Mentors, trainers and project administrators are expected to
                  act professionally, provide accurate guidance and avoid
                  misleading claims about qualifications, employment or
                  outcomes.
                </p>
              }
            />

            <TermsSection
              number="09"
              title="Acceptable use"
              content={
                <>
                  <p>You must not use LiveProject to:</p>

                  <ul>
                    <li>Commit fraud or intentionally deceive another user.</li>
                    <li>
                      Upload malware, malicious code or content intended to
                      compromise the platform.
                    </li>
                    <li>
                      Harass, threaten, abuse or discriminate against other
                      users.
                    </li>
                    <li>
                      Attempt to gain unauthorized access to accounts,
                      systems or data.
                    </li>
                    <li>
                      Misrepresent LiveProject, another organisation or another
                      individual.
                    </li>
                    <li>
                      Circumvent access controls, payment controls or other
                      platform security measures.
                    </li>
                  </ul>
                </>
              }
            />

            <TermsSection
              number="10"
              title="Intellectual property"
              content={
                <>
                  <p>
                    LiveProject and its visual identity, software, platform
                    design, original content, branding and associated
                    technology are owned by LiveProject or its licensors unless
                    otherwise stated.
                  </p>

                  <p>
                    Your own original work remains yours unless a separate
                    agreement provides otherwise. Project-specific ownership
                    or licensing requirements may apply where a client or
                    organisation provides project terms.
                  </p>
                </>
              }
            />

            <TermsSection
              number="11"
              title="User content"
              content={
                <p>
                  By submitting content to LiveProject, you give LiveProject
                  the permissions reasonably necessary to host, process,
                  display and operate that content as part of the feature you
                  use. You remain responsible for ensuring that your content
                  does not violate another person&apos;s rights or applicable
                  law.
                </p>
              }
            />

            <TermsSection
              number="12"
              title="AI-powered features"
              content={
                <>
                  <p>
                    LiveProject may provide AI-powered assistance including
                    career guidance, project recommendations, CV analysis,
                    interview preparation and other professional tools.
                  </p>

                  <p>
                    AI output may contain errors or incomplete information.
                    You remain responsible for evaluating AI-generated
                    information before relying on it for professional,
                    financial, legal or career decisions.
                  </p>
                </>
              }
            />

            <TermsSection
              number="13"
              title="Premium services"
              content={
                <>
                  <p>
                    Certain LiveProject features may require a paid Premium
                    plan. Premium access is granted only after successful
                    payment confirmation through the applicable payment
                    process.
                  </p>

                  <p>
                    Premium benefits may evolve as the platform develops.
                    Access may be subject to fair-use limits, technical
                    availability and applicable feature requirements.
                  </p>
                </>
              }
            />

            <TermsSection
              number="14"
              title="Payments and refunds"
              content={
                <p>
                  Paid services may be processed by third-party payment
                  providers. Payment terms, prices, renewal rules and refund
                  conditions will be presented at the point of purchase or in
                  the applicable checkout flow. Any chargeback or payment
                  dispute must be handled through the applicable payment
                  process and may affect account access where a transaction
                  cannot be verified.
                </p>
              }
            />

            <TermsSection
              number="15"
              title="Third-party services"
              content={
                <p>
                  LiveProject may integrate with third-party providers for
                  authentication, hosting, payments, AI, communications,
                  analytics or other functionality. Those services may be
                  governed by separate terms and policies.
                </p>
              }
            />

            <TermsSection
              number="16"
              title="Availability and changes"
              content={
                <p>
                  We may add, modify, suspend or discontinue features as
                  LiveProject develops. We aim to maintain a reliable service
                  but do not guarantee that every feature will always be
                  available or uninterrupted.
                </p>
              }
            />

            <TermsSection
              number="17"
              title="Suspension or termination"
              content={
                <p>
                  LiveProject may suspend or terminate an account or restrict
                  access where necessary to protect the platform, users,
                  project integrity, security or legal compliance, including
                  where these Terms are violated.
                </p>
              }
            />

            <TermsSection
              number="18"
              title="No guaranteed employment outcome"
              content={
                <>
                  <p>
                    LiveProject helps professionals build practical experience,
                    evidence and career readiness. It does not guarantee a job,
                    interview, salary, promotion, visa, sponsorship or other
                    employment outcome.
                  </p>

                  <p>
                    Recommendations, job matches and career tools are designed
                    to support your decision-making and do not constitute a
                    promise of employment.
                  </p>
                </>
              }
            />

            <TermsSection
              number="19"
              title="Disclaimers"
              content={
                <p>
                  LiveProject is provided on an evolving platform basis. To the
                  extent permitted by applicable law, we do not guarantee that
                  information, project availability, AI output or external
                  opportunities will always be complete, accurate, current or
                  suitable for your particular circumstances.
                </p>
              }
            />

            <TermsSection
              number="20"
              title="Limitation of liability"
              content={
                <p>
                  To the extent permitted by applicable law, LiveProject will
                  not be responsible for indirect, incidental, consequential or
                  special losses arising from your use of the platform or
                  reliance on external opportunities, project outcomes,
                  third-party services or AI-generated information.
                </p>
              }
            />

            <TermsSection
              number="21"
              title="Changes to these Terms"
              content={
                <p>
                  We may update these Terms from time to time as LiveProject
                  evolves. Continued use of the platform after an updated
                  version becomes effective means you accept the revised
                  Terms, subject to any rights available under applicable law.
                </p>
              }
            />

            <TermsSection
              number="22"
              title="Contact"
              content={
                <>
                  <p>
                    Questions about these Terms can be sent to the LiveProject
                    team.
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
              onClick={() => router.push("/privacy")}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                Previous
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-black">Privacy Policy</span>
                <ArrowRight className="h-4 w-4 text-cyan-300 transition group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition hover:-translate-y-1 hover:bg-white/[0.05]"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/30">
                Need help?
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-black">Contact LiveProject</span>
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
              className="transition hover:text-white"
            >
              Privacy
            </button>

            <button
              type="button"
              onClick={() => router.push("/terms")}
              className="text-white"
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

function TermsSection({
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