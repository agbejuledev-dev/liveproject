// app/contact/page.tsx

"use client";

import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      return;
    }

    setSubmitting(true);

    window.setTimeout(() => {
      const existing = JSON.parse(
        sessionStorage.getItem("liveproject_contact_messages") || "[]"
      );

      sessionStorage.setItem(
        "liveproject_contact_messages",
        JSON.stringify([
          ...existing,
          {
            ...form,
            submittedAt: new Date().toISOString(),
          },
        ])
      );

      setSubmitting(false);
      setSubmitted(true);

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 700);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#06101d] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-10rem] h-[32rem] w-[32rem] rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute right-[-12rem] top-[20%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-[30%] h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
      </div>

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
            onClick={() => router.push("/premium")}
            className="hidden items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-[#06101d] transition hover:-translate-y-0.5 hover:bg-cyan-200 sm:inline-flex"
          >
            Explore Premium
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <section className="relative z-10">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              Contact LiveProject
            </div>

            <h1 className="mt-7 max-w-2xl text-5xl font-black tracking-[-0.055em] sm:text-6xl">
              Let&apos;s build a better
              <span className="block text-cyan-300">career ecosystem.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/55">
              Have a question, partnership idea, business opportunity or
              feedback? Tell us what you&apos;re working on and the LiveProject
              team will get back to you.
            </p>

            <div className="mt-10 space-y-4">
              <ContactInfo
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value="hello@liveproject.com"
              />

              <ContactInfo
                icon={<MessageSquare className="h-5 w-5" />}
                label="For partnerships"
                value="partnerships@liveproject.com"
              />

              <ContactInfo
                icon={<Phone className="h-5 w-5" />}
                label="Support"
                value="Available through LiveProject"
              />

              <ContactInfo
                icon={<MapPin className="h-5 w-5" />}
                label="Platform"
                value="Global · Built for professionals worldwide"
              />
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.035] p-6">
              <p className="text-sm font-black text-white">
                What can you contact us about?
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  "Business partnerships",
                  "Project collaboration",
                  "Mentorship",
                  "Platform support",
                  "Career opportunities",
                  "Feedback & suggestions",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-white/55"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-cyan-300">
                  Send a message
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Tell us what you need.
                </h2>

                <p className="mt-2 text-sm leading-6 text-white/45">
                  We&apos;ll review your message and respond as soon as possible.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-3xl border border-emerald-300/15 bg-emerald-300/[0.06] p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-400/10">
                    <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black">
                    Message received.
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/50">
                    Thanks for reaching out to LiveProject. Your message has
                    been recorded successfully.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-7 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-black text-white transition hover:bg-white/[0.08]"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Name"
                      value={form.name}
                      onChange={(value) => updateField("name", value)}
                      placeholder="Your name"
                    />

                    <Field
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(value) => updateField("email", value)}
                      placeholder="you@example.com"
                    />
                  </div>

                  <Field
                    label="Subject"
                    value={form.subject}
                    onChange={(value) => updateField("subject", value)}
                    placeholder="What would you like to discuss?"
                  />

                  <div>
                    <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
                      Message
                    </label>

                    <textarea
                      value={form.message}
                      onChange={(event) =>
                        updateField("message", event.target.value)
                      }
                      rows={7}
                      placeholder="Tell us how we can help..."
                      className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !form.name.trim() ||
                      !form.email.trim() ||
                      !form.subject.trim() ||
                      !form.message.trim()
                    }
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-cyan-300 px-6 py-4 text-sm font-black text-[#04111c] transition hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs leading-5 text-white/30">
                    By submitting this form, you agree that LiveProject may
                    use your information to respond to your enquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3">
          <MiniCard
            title="Professionals"
            description="Questions about projects, career development, Premium or verified experience."
            action="Explore Projects"
            onClick={() => router.push("/projects")}
          />

          <MiniCard
            title="Businesses"
            description="Discuss real-world projects, talent access, partnerships and hiring."
            action="Contact Partnerships"
            onClick={() =>
              setForm((current) => ({
                ...current,
                subject: "Business partnership enquiry",
              }))
            }
          />

          <MiniCard
            title="Mentors"
            description="Interested in mentoring professionals and helping people build stronger careers?"
            action="Start a Conversation"
            onClick={() =>
              setForm((current) => ({
                ...current,
                subject: "Mentor partnership enquiry",
              }))
            }
          />
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LiveProject. All rights reserved.</p>

          <div className="flex flex-wrap gap-5">
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

function Field({
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
      <label className="text-xs font-black uppercase tracking-[0.14em] text-white/45">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.03]"
      />
    </div>
  );
}

function ContactInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
        {icon}
      </div>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-white/70">{value}</p>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  description,
  action,
  onClick,
}: {
  title: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:bg-white/[0.05]">
      <h3 className="text-lg font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-white/45">
        {description}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan-300 transition hover:text-cyan-200"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}