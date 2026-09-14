"use client";

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ExternalLink,
  GitBranch,
  Globe2,
  Mail,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

type Profile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  bio?: string;
  careerTrack?: string;
  experienceLevel?: string;
  currentStatus?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  skills?: string[];
  workPreference?: string[];
  opportunities?: string[];
};

type Session = {
  loggedIn?: boolean;
  plan?: "free" | "premium";
  role?: string;
  accountType?: string;
};

const PROFILE_STORAGE_KEY = "liveproject_profile";
const AVATAR_STORAGE_KEY = "liveproject_profile_avatar";

function readStorage<T>(key: string): T | null {
  try {
    const value = sessionStorage.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readLocalStorage(key: string): string {
  try {
    return localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxSize = 640;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Could not process image."));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };

      image.onerror = () => reject(new Error("Could not load image."));
      image.src = String(reader.result);
    };

    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [avatar, setAvatar] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const liveSession = readStorage<Session>("liveproject_session");

    const onboarding = readStorage<Profile>("liveproject_onboarding");

    const storedProfile = readStorage<Profile>(PROFILE_STORAGE_KEY);

    const registration = readStorage<{
      firstName?: string;
      lastName?: string;
      email?: string;
      country?: string;
    }>("liveproject_registration");

    const combinedProfile: Profile = {
      ...(registration || {}),
      ...(onboarding || {}),
      ...(storedProfile || {}),
    };

    setSession(liveSession || { loggedIn: true, plan: "free" });
    setProfile(combinedProfile);
    setBioDraft(combinedProfile.bio || "");
    setAvatar(readLocalStorage(AVATAR_STORAGE_KEY));

    try {
      sessionStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(combinedProfile),
      );
    } catch {
      // Ignore storage failures.
    }
  }, []);

  const fullName = useMemo(() => {
    if (!profile) return "Your Name";

    const name = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();

    return name || "Your Name";
  }, [profile]);

  const initials = useMemo(() => {
    if (!fullName || fullName === "Your Name") {
      return "LP";
    }

    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, [fullName]);

  const isPremium = session?.plan === "premium";

  const skills = profile?.skills || [];

  function saveProfile(nextProfile: Profile) {
    setProfile(nextProfile);

    try {
      sessionStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(nextProfile),
      );

      const existingOnboarding = readStorage<Profile>("liveproject_onboarding");

      sessionStorage.setItem(
        "liveproject_onboarding",
        JSON.stringify({
          ...(existingOnboarding || {}),
          ...nextProfile,
        }),
      );
    } catch {
      // Ignore storage failures.
    }
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPhotoError("");

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setPhotoError("Please choose an image smaller than 8MB.");
      return;
    }

    setSavingPhoto(true);

    try {
      const compressed = await compressImage(file);

      localStorage.setItem(AVATAR_STORAGE_KEY, compressed);
      setAvatar(compressed);
    } catch {
      setPhotoError("We couldn't save that image. Please try another one.");
    } finally {
      setSavingPhoto(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function removePhoto() {
    try {
      localStorage.removeItem(AVATAR_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }

    setAvatar("");
    setShowRemoveConfirm(false);
  }

  function saveBio() {
    saveProfile({
      ...(profile || {}),
      bio: bioDraft.trim(),
    });

    setEditingBio(false);
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f7f8fa] px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="h-[420px] animate-pulse rounded-2xl bg-white ring-1 ring-gray-200" />
            <div className="h-[320px] animate-pulse rounded-2xl bg-white ring-1 ring-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#172033]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#e7e9ed] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#667085] transition hover:bg-[#f4f5f7] hover:text-[#172033]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="text-[15px] font-bold tracking-[-0.02em] text-[#172033]">
            Profile
          </div>

          <button
            type="button"
            onClick={() => router.push("/settings")}
            className="rounded-lg border border-[#dfe3e8] bg-white px-3.5 py-2 text-sm font-semibold text-[#344054] transition hover:bg-[#f8f9fb]"
          >
            Settings
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main profile */}
          <section className="min-w-0 space-y-6">
            {/* Profile header */}
            <div className="overflow-hidden rounded-2xl border border-[#e4e7ec] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
              <div className="h-28 bg-[#16243a] sm:h-36" />

              <div className="px-5 pb-6 sm:px-7">
                <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#edf1f5] shadow-md sm:h-32 sm:w-32">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={`${fullName} profile`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-[#526173]">
                            {initials}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={savingPhoto}
                        className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#172033] text-white shadow-sm transition hover:bg-[#26354c] disabled:opacity-50"
                        aria-label="Change profile photo"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>

                    <div className="pb-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#172033]">
                          {fullName}
                        </h1>

                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf3] px-2.5 py-1 text-[11px] font-bold text-[#027a48]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Profile
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-[#667085]">
                        {profile.careerTrack || "Professional"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe3e8] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] transition hover:bg-[#f8f9fb]"
                    >
                      <UserRound className="h-4 w-4" />
                      {avatar ? "Change photo" : "Add photo"}
                    </button>

                    {avatar && (
                      <button
                        type="button"
                        onClick={() => setShowRemoveConfirm(true)}
                        className="inline-flex items-center justify-center rounded-lg border border-[#f2d7d7] px-3 py-2.5 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff8f8]"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {photoError && (
                  <p className="mt-4 text-sm font-medium text-[#b42318]">
                    {photoError}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#667085]">
                  {profile.country && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {profile.country}
                    </span>
                  )}

                  {profile.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </span>
                  )}

                  {profile.experienceLevel && (
                    <span className="inline-flex items-center gap-1.5">
                      <BriefcaseBusiness className="h-4 w-4" />
                      {profile.experienceLevel}
                    </span>
                  )}

                  {profile.currentStatus && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      {profile.currentStatus}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm font-semibold text-[#344054] hover:bg-[#f8f9fb]"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                      LinkedIn
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm font-semibold text-[#344054] hover:bg-[#f8f9fb]"
                    >
                      <GitBranch className="h-4 w-4" />
                      GitHub
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}

                  {profile.portfolio && (
                    <a
                      href={profile.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e4e7ec] px-3 py-2 text-sm font-semibold text-[#344054] hover:bg-[#f8f9fb]"
                    >
                      <Globe2 className="h-4 w-4" />
                      Portfolio
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* About */}
            <section className="rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.03)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.02em]">
                    About
                  </h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    A concise introduction to your professional profile.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingBio((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#dfe3e8] px-3 py-2 text-sm font-semibold text-[#344054] hover:bg-[#f8f9fb]"
                >
                  {editingBio ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Pencil className="h-4 w-4" />
                  )}
                  {editingBio ? "Cancel" : "Edit"}
                </button>
              </div>

              {editingBio ? (
                <div className="mt-5">
                  <textarea
                    value={bioDraft}
                    onChange={(event) => setBioDraft(event.target.value)}
                    rows={6}
                    maxLength={600}
                    placeholder="Write a concise professional introduction..."
                    className="w-full resize-none rounded-xl border border-[#d0d5dd] bg-white px-4 py-3 text-sm leading-6 text-[#172033] outline-none transition placeholder:text-[#98a2b3] focus:border-[#1677ff] focus:ring-2 focus:ring-[#1677ff]/10"
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[#98a2b3]">
                      {bioDraft.length}/600
                    </span>

                    <button
                      type="button"
                      onClick={saveBio}
                      className="rounded-lg bg-[#172033] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#253650]"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[#475467]">
                  {profile.bio ||
                    "Add a short professional introduction explaining what you do, the type of work you are interested in, and the value you bring."}
                </p>
              )}
            </section>

            {/* Skills */}
            <section className="rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.03)] sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.02em]">
                    Skills
                  </h2>
                  <p className="mt-1 text-sm text-[#667085]">
                    Skills demonstrated through learning and project work.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#dfe3e8] px-3 py-2 text-sm font-semibold text-[#344054] hover:bg-[#f8f9fb]"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </button>
              </div>

              {skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-[#dfe3e8] bg-[#fafafa] px-3.5 py-2 text-sm font-semibold text-[#344054]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-dashed border-[#d0d5dd] px-5 py-8 text-center">
                  <p className="text-sm font-semibold text-[#344054]">
                    No skills added yet
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/onboarding")}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#1677ff]"
                  >
                    <Plus className="h-4 w-4" />
                    Add skills
                  </button>
                </div>
              )}
            </section>

            {/* Experience Passport */}
            <section className="rounded-2xl border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_8px_rgba(16,24,40,0.03)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold tracking-[-0.02em]">
                    Experience Passport
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-[#667085]">
                    Your verified record of practical work, skills and
                    professional evidence.
                  </p>
                </div>

                <Award className="h-5 w-5 text-[#667085]" />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#e4e7ec] bg-[#fafafa] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
                    Projects
                  </p>
                  <p className="mt-2 text-2xl font-bold">0</p>
                  <p className="mt-1 text-xs text-[#667085]">
                    Verified projects
                  </p>
                </div>

                <div className="rounded-xl border border-[#e4e7ec] bg-[#fafafa] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
                    Certificates
                  </p>
                  <p className="mt-2 text-2xl font-bold">0</p>
                  <p className="mt-1 text-xs text-[#667085]">
                    Earned certificates
                  </p>
                </div>

                <div className="rounded-xl border border-[#e4e7ec] bg-[#fafafa] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
                    Recommendations
                  </p>
                  <p className="mt-2 text-2xl font-bold">0</p>
                  <p className="mt-1 text-xs text-[#667085]">
                    Professional recommendations
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/experience-passport")}
                className="mt-5 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#1677ff]"
              >
                View Experience Passport
                <ExternalLink className="h-4 w-4" />
              </button>
            </section>
          </section>

          {/* Right rail */}
          <aside className="space-y-6">
            {/* Premium */}
            {isPremium ? (
              <section className="rounded-2xl border border-[#d7dee8] bg-[#172033] p-6 text-white shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
                      Account
                    </p>
                    <h3 className="font-bold">Premium Member</h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-white/65">
                  Your Premium account is active. You have access to
                  LiveProject&apos;s advanced career tools and opportunities.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/premium-dashboard")}
                  className="mt-5 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  Open Premium Dashboard
                </button>
              </section>
            ) : (
              <section className="rounded-2xl border border-[#dbe3ee] bg-white p-6 shadow-[0_4px_16px_rgba(16,24,40,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172033]">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#98a2b3]">
                      Upgrade
                    </p>
                    <h3 className="font-bold text-[#172033]">
                      Switch to Premium
                    </h3>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-6 text-[#667085]">
                  Unlock the full project library, deeper feedback, certificates,
                  recommendations, UK opportunities and advanced career tools.
                </p>

                <button
                  type="button"
                  onClick={() => router.push("/premium")}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#172033] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#26354c]"
                >
                  View Premium
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </button>

                <p className="mt-3 text-center text-xs text-[#98a2b3]">
                  Upgrade securely through the Premium checkout.
                </p>
              </section>
            )}

            {/* Career profile */}
            <section className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_8px_rgba(16,24,40,0.03)]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#172033]">
                  Career profile
                </h3>

                <button
                  type="button"
                  onClick={() => router.push("/onboarding")}
                  className="text-xs font-bold text-[#1677ff]"
                >
                  Edit
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
                    Career track
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {profile.careerTrack || "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
                    Experience
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {profile.experienceLevel || "Not selected"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
                    Work preference
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#344054]">
                    {profile.workPreference?.length
                      ? profile.workPreference.join(", ")
                      : "Not selected"}
                  </p>
                </div>
              </div>
            </section>

            {/* Profile completeness */}
            <section className="rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-[0_2px_8px_rgba(16,24,40,0.03)]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#172033]">
                  Profile completeness
                </h3>
                <span className="text-sm font-bold text-[#172033]">
                  {Math.min(
                    100,
                    [
                      fullName !== "Your Name",
                      Boolean(profile.bio),
                      Boolean(avatar),
                      Boolean(profile.careerTrack),
                      skills.length > 0,
                      Boolean(profile.linkedin),
                      Boolean(profile.github || profile.portfolio),
                    ].filter(Boolean).length * 14
                  )}
                  %
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eef0f3]">
                <div
                  className="h-full rounded-full bg-[#172033] transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      [
                        fullName !== "Your Name",
                        Boolean(profile.bio),
                        Boolean(avatar),
                        Boolean(profile.careerTrack),
                        skills.length > 0,
                        Boolean(profile.linkedin),
                        Boolean(profile.github || profile.portfolio),
                      ].filter(Boolean).length * 14
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-[#667085]">
                A complete profile gives employers better context when reviewing
                your verified experience.
              </p>

              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg text-sm font-bold text-[#1677ff]"
              >
                Complete profile
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </section>
          </aside>
        </div>
      </div>

      {/* Remove photo confirmation */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#101828]/35 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#e4e7ec] bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-[#172033]">
              Remove profile photo?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#667085]">
              Your profile will return to the default initials until you upload
              another photo.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRemoveConfirm(false)}
                className="rounded-lg border border-[#dfe3e8] px-4 py-2.5 text-sm font-semibold text-[#344054]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={removePhoto}
                className="rounded-lg bg-[#b42318] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#912018]"
              >
                Remove photo
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}