"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Globe2,
  LockKeyhole,
  LogOut,
  Mail,
  Moon,
  Save,
  ShieldCheck,
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
  accountType?: "professional" | "client";
  firstName?: string;
  lastName?: string;
  organisationName?: string;
  email?: string;
  country?: string;
  website?: string;
};

type Preferences = {
  emailNotifications: boolean;
  projectUpdates: boolean;
  marketingEmails: boolean;
  profileVisibility: "public" | "limited";
  language: string;
  theme: "light" | "system";
};

const defaultPreferences: Preferences = {
  emailNotifications: true,
  projectUpdates: true,
  marketingEmails: false,
  profileVisibility: "public",
  language: "English",
  theme: "light",
};

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

function writeStorage(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Prototype storage.
  }
}

export default function SettingsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [registration, setRegistration] =
    useState<Registration | null>(null);

  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  const [preferences, setPreferences] =
    useState<Preferences>(defaultPreferences);

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [showPasswordPanel, setShowPasswordPanel] =
    useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  useEffect(() => {
    const storedSession = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!storedSession?.loggedIn) {
      router.replace("/register");
      return;
    }

    const storedRegistration = readStorage<Registration | null>(
      "liveproject_registration",
      null
    );

    setSession(storedSession);
    setRegistration(storedRegistration);

    setEmail(storedRegistration?.email || "");
    setCountry(storedRegistration?.country || "");
    setWebsite(storedRegistration?.website || "");

    const storedPreferences = readStorage<Preferences>(
      "liveproject_preferences",
      defaultPreferences
    );

    setPreferences({
      ...defaultPreferences,
      ...storedPreferences,
    });

    setReady(true);
  }, [router]);

  const accountType =
    session?.role ??
    session?.accountType ??
    registration?.accountType ??
    "professional";

  const displayName =
    accountType === "client"
      ? registration?.organisationName || "Business account"
      : [registration?.firstName, registration?.lastName]
          .filter(Boolean)
          .join(" ") || "Professional account";

  const updatePreference = <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setSaved(false);

    const updatedRegistration: Registration = {
      ...(registration || {}),
      email: email.trim(),
      country: country.trim(),
      website: website.trim(),
    };

    setRegistration(updatedRegistration);

    writeStorage(
      "liveproject_registration",
      updatedRegistration
    );

    writeStorage("liveproject_preferences", preferences);

    setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 450);
  };

  const handlePasswordChange = () => {
    setPasswordMessage("");

    if (!currentPassword.trim()) {
      setPasswordMessage("Enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage(
        "Your new password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("Your new passwords do not match.");
      return;
    }

    const storedRegistration = readStorage<
      Registration & { password?: string }
    >("liveproject_registration", {});

    writeStorage("liveproject_registration", {
      ...storedRegistration,
      password: newPassword,
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage(
      "Password updated successfully in this prototype."
    );
  };

  const logout = () => {
    try {
      sessionStorage.removeItem("liveproject_session");
      sessionStorage.removeItem("liveproject_after_auth");
      sessionStorage.removeItem("liveproject_after_upgrade");
    } catch {
      // Continue.
    }

    router.replace("/login");
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading settings...
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
          <div className="mx-auto flex h-[76px] max-w-[1250px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (accountType === "client") {
                    router.push("/business");
                  } else {
                    router.push("/workspace");
                  }
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Account
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Settings
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="hidden text-xs font-bold text-slate-600 sm:inline">
                {session?.plan === "premium"
                  ? "Premium"
                  : "Free account"}
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1250px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid gap-6 xl:grid-cols-[1fr_330px]">
            <form
              onSubmit={saveSettings}
              className="space-y-6"
            >
              {/* Account */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Account
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      {displayName}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Manage your basic account details and contact
                      information.
                    </p>
                  </div>
                </div>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Country
                    </label>

                    <div className="relative">
                      <Globe2
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        value={country}
                        onChange={(event) =>
                          setCountry(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                      Website
                    </label>

                    <input
                      value={website}
                      onChange={(event) =>
                        setWebsite(event.target.value)
                      }
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>
              </section>

              {/* Notifications */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Bell size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Notifications
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Decide what reaches you.
                    </h2>
                  </div>
                </div>

                <div className="mt-7 space-y-3">
                  {[
                    {
                      key: "emailNotifications" as const,
                      title: "Email notifications",
                      description:
                        "Receive important account and workspace updates.",
                    },
                    {
                      key: "projectUpdates" as const,
                      title: "Project updates",
                      description:
                        "Stay informed about applications, project activity and collaboration.",
                    },
                    {
                      key: "marketingEmails" as const,
                      title: "Product updates",
                      description:
                        "Receive occasional LiveProject product announcements and resources.",
                    },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300"
                    >
                      <div>
                        <p className="text-sm font-black text-slate-950">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={preferences[item.key]}
                        onChange={(event) =>
                          setPreferences((current) => ({
                            ...current,
                            [item.key]:
                              event.target.checked,
                          }))
                        }
                        className="h-5 w-5 shrink-0 accent-teal-600"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Privacy */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Privacy
                    </div>

                    <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                      Control your visibility.
                    </h2>
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    {
                      value: "public" as const,
                      title: "Visible",
                      description:
                        "Make your relevant profile information available to the LiveProject ecosystem.",
                    },
                    {
                      value: "limited" as const,
                      title: "Limited",
                      description:
                        "Restrict profile visibility until you interact with a project or opportunity.",
                    },
                  ].map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      onClick={() =>
                        setPreferences((current) => ({
                          ...current,
                          profileVisibility:
                            option.value,
                        }))
                      }
                      className={[
                        "rounded-2xl border p-4 text-left transition",
                        preferences.profileVisibility ===
                        option.value
                          ? "border-teal-300 bg-teal-50/70"
                          : "border-slate-200 bg-white hover:border-slate-300",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-black text-slate-950">
                            {option.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {option.description}
                          </p>
                        </div>

                        <div
                          className={[
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                            preferences.profileVisibility ===
                            option.value
                              ? "border-teal-600 bg-teal-600"
                              : "border-slate-300",
                          ].join(" ")}
                        >
                          {preferences.profileVisibility ===
                            option.value && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Password */}
              <section className="rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <LockKeyhole size={19} />
                    </div>

                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Security
                      </div>

                      <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                        Password
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        Keep your account protected with a strong password.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordPanel((value) => !value)
                    }
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    {showPasswordPanel
                      ? "Close"
                      : "Change password"}
                    <ChevronRight
                      size={14}
                      className={
                        showPasswordPanel
                          ? "rotate-90"
                          : ""
                      }
                    />
                  </button>
                </div>

                {showPasswordPanel && (
                  <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Current password
                      </label>

                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        New password
                      </label>

                      <input
                        type="password"
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                        Confirm new password
                      </label>

                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10"
                      />
                    </div>

                    {passwordMessage && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold text-slate-600">
                        {passwordMessage}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handlePasswordChange}
                      className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                    >
                      Update password
                    </button>
                  </div>
                )}
              </section>

              {saved && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                  <CheckCircle2 size={18} />
                  Your settings have been saved.
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (accountType === "client") {
                      router.push("/business");
                    } else {
                      router.push("/workspace");
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  <ArrowLeft size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {saving ? "Saving..." : "Save settings"}
                  <Save size={16} />
                </button>
              </div>
            </form>

            <aside className="space-y-5">
              <div className="sticky top-[100px] rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <UserRound size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-950">
                      {displayName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {accountType === "client"
                        ? "Business account"
                        : "Professional account"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => router.push("/privacy")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    Privacy policy
                    <ChevronRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/terms")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    Terms of service
                    <ChevronRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/contact")}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                  >
                    Contact LiveProject
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>

              <div className="rounded-[26px] border border-red-100 bg-red-50 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-600 shadow-sm">
                  <LogOut size={18} />
                </div>

                <h3 className="mt-4 text-sm font-black text-red-950">
                  Sign out
                </h3>

                <p className="mt-2 text-xs leading-6 text-red-900/70">
                  Sign out of this LiveProject session on this device.
                </p>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </aside>
          </div>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}