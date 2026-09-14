"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Settings2,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type TeamMember = {
  id: string;
  name: string;
  role: string;
  email?: string;
  avatar?: string;
  status?: "active" | "pending";
};

type BusinessTeam = {
  id: string;
  name: string;
  description?: string;
  projectId?: string;
  projectTitle?: string;
  members: TeamMember[];
  createdAt?: string;
};

type BusinessProject = {
  id: string;
  title?: string;
};

const sampleTeams: BusinessTeam[] = [];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeTeams(teams: BusinessTeam[]) {
  try {
    sessionStorage.setItem(
      "liveproject_business_teams",
      JSON.stringify(teams)
    );
  } catch {
    // Prototype storage.
  }
}

export default function BusinessTeamsPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [teams, setTeams] = useState<BusinessTeam[]>([]);
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [query, setQuery] = useState("");
  const [selectedTeam, setSelectedTeam] =
    useState<BusinessTeam | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamProjectId, setTeamProjectId] = useState("");

  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Professional");

  useEffect(() => {
    const session = readStorage<Session | null>(
      "liveproject_session",
      null
    );

    if (!session?.loggedIn) {
      router.replace("/register");
      return;
    }

    const role = session.role ?? session.accountType;

    if (role === "professional") {
      router.replace("/workspace");
      return;
    }

    const onboarding = readStorage(
      "liveproject_client_onboarding",
      null
    );

    if (!onboarding) {
      router.replace("/business-onboarding");
      return;
    }

    const storedTeams = readStorage<BusinessTeam[]>(
      "liveproject_business_teams",
      sampleTeams
    );

    const storedProjects = readStorage<BusinessProject[]>(
      "liveproject_business_projects",
      []
    );

    setTeams(Array.isArray(storedTeams) ? storedTeams : []);
    setProjects(Array.isArray(storedProjects) ? storedProjects : []);
    setReady(true);
  }, [router]);

  const filteredTeams = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return teams;
    }

    return teams.filter((team) => {
      const searchable = [
        team.name,
        team.description,
        team.projectTitle,
        ...team.members.map((member) => member.name),
        ...team.members.map((member) => member.role),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(search);
    });
  }, [teams, query]);

  const totalMembers = useMemo(
    () =>
      teams.reduce(
        (total, team) => total + team.members.length,
        0
      ),
    [teams]
  );

  const createTeam = () => {
    const cleanName = teamName.trim();

    if (!cleanName) {
      return;
    }

    const selectedProject = projects.find(
      (project) => project.id === teamProjectId
    );

    const newTeam: BusinessTeam = {
      id: `team-${Date.now()}`,
      name: cleanName,
      description: teamDescription.trim(),
      projectId: selectedProject?.id,
      projectTitle: selectedProject?.title,
      members: [],
      createdAt: new Date().toLocaleDateString(),
    };

    const next = [newTeam, ...teams];

    setTeams(next);
    writeTeams(next);

    setTeamName("");
    setTeamDescription("");
    setTeamProjectId("");
    setShowCreate(false);
    setSelectedTeam(newTeam);
  };

  const inviteMember = () => {
    if (!selectedTeam || !inviteName.trim() || !inviteEmail.trim()) {
      return;
    }

    const member: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "pending",
    };

    const next = teams.map((team) =>
      team.id === selectedTeam.id
        ? {
            ...team,
            members: [...team.members, member],
          }
        : team
    );

    setTeams(next);
    writeTeams(next);

    const updatedTeam = next.find(
      (team) => team.id === selectedTeam.id
    );

    setSelectedTeam(updatedTeam || null);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Professional");
    setShowInvite(false);
  };

  const removeMember = (teamId: string, memberId: string) => {
    const next = teams.map((team) =>
      team.id === teamId
        ? {
            ...team,
            members: team.members.filter(
              (member) => member.id !== memberId
            ),
          }
        : team
    );

    setTeams(next);
    writeTeams(next);

    const updatedTeam = next.find(
      (team) => team.id === teamId
    );

    setSelectedTeam(updatedTeam || null);
  };

  const deleteTeam = (teamId: string) => {
    const next = teams.filter((team) => team.id !== teamId);

    setTeams(next);
    writeTeams(next);

    setSelectedTeam(null);
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading teams...
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
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,118,110,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Teams
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Create team</span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <Users size={13} />
                  Collaboration
                </div>

                <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.03em] text-slate-950 sm:text-4xl">
                  Build focused teams around meaningful project work.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                  Organise professionals around business projects, invite
                  collaborators and keep the right people connected to each
                  opportunity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-xl font-black text-slate-950">
                    {teams.length}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Teams
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                  <div className="text-xl font-black text-slate-950">
                    {totalMembers}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Members
                  </div>
                </div>

                <div className="col-span-2 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 sm:col-span-1">
                  <div className="text-xl font-black text-slate-950">
                    {projects.length}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Projects
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search teams, projects or members..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
              />
            </div>
          </section>

          <div className="mt-7">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
              Your teams
            </p>

            <h3 className="mt-1 text-xl font-black tracking-tight text-slate-950">
              {filteredTeams.length}{" "}
              {filteredTeams.length === 1 ? "team" : "teams"}
            </h3>
          </div>

          <section className="mt-4">
            {filteredTeams.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm sm:p-14">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                  <Users size={24} />
                </div>

                <h3 className="mt-5 text-lg font-black text-slate-950">
                  {teams.length === 0
                    ? "No teams yet."
                    : "No teams match your search."}
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  {teams.length === 0
                    ? "Create your first project team and start bringing the right professionals together."
                    : "Try another search term or clear your current search."}
                </p>

                {teams.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <Plus size={16} />
                    Create your first team
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredTeams.map((team) => (
                  <article
                    key={team.id}
                    className="group rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                          <Users size={20} />
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-black tracking-tight text-slate-950">
                            {team.name}
                          </h3>

                          <p className="mt-1 text-xs font-semibold text-teal-700">
                            {team.projectTitle || "Independent team"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedTeam(team)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-950"
                      >
                        <Settings2 size={16} />
                      </button>
                    </div>

                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
                      {team.description ||
                        "No team description has been added yet."}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 5).map((member) => (
                          <div
                            key={member.id}
                            title={member.name}
                            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-950 text-[10px] font-black text-white"
                          >
                            {member.name[0]?.toUpperCase() || "P"}
                          </div>
                        ))}

                        {team.members.length > 5 && (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-black text-slate-500">
                            +{team.members.length - 5}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-500">
                          {team.members.length}{" "}
                          {team.members.length === 1
                            ? "member"
                            : "members"}
                        </span>

                        <button
                          type="button"
                          onClick={() => setSelectedTeam(team)}
                          className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 transition hover:text-teal-800"
                        >
                          Manage
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-300">
                  <BriefcaseBusiness size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Project collaboration
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Create a team around the work that matters.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Start with a project, bring the right people together and
                  keep responsibilities clear throughout delivery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                Create a team
                <Plus size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close create team modal"
            onClick={() => setShowCreate(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  New team
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Create a project team
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start a team and invite professionals as your project
                  develops.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Team name
                </label>

                <input
                  value={teamName}
                  onChange={(event) =>
                    setTeamName(event.target.value)
                  }
                  placeholder="e.g. Product Launch Team"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Project
                </label>

                <select
                  value={teamProjectId}
                  onChange={(event) =>
                    setTeamProjectId(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                >
                  <option value="">
                    Select a project
                  </option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title || "Untitled project"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Description
                </label>

                <textarea
                  value={teamDescription}
                  onChange={(event) =>
                    setTeamDescription(event.target.value)
                  }
                  placeholder="What is this team responsible for?"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={createTeam}
              disabled={!teamName.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create team
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Team Drawer */}
      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close team manager"
            onClick={() => setSelectedTeam(null)}
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
          />

          <aside className="relative h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur-xl">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Team management
                </div>

                <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                  {selectedTeam.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTeam(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-teal-700 shadow-sm">
                    <Users size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-950">
                      {selectedTeam.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedTeam.projectTitle ||
                        "Independent team"}
                    </p>
                  </div>
                </div>

                {selectedTeam.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {selectedTeam.description}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                      Team members
                    </div>

                    <h3 className="mt-1 text-lg font-black text-slate-950">
                      {selectedTeam.members.length}{" "}
                      {selectedTeam.members.length === 1
                        ? "member"
                        : "members"}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowInvite(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800"
                  >
                    <UserPlus size={14} />
                    Invite
                  </button>
                </div>

                {selectedTeam.members.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-7 text-center">
                    <UserPlus className="mx-auto text-slate-300" size={26} />

                    <p className="mt-3 text-sm font-bold text-slate-700">
                      No members yet
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Invite professionals to start building your team.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-2">
                    {selectedTeam.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                            {member.name[0]?.toUpperCase() || "P"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-950">
                              {member.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {member.role}
                            </p>

                            {member.status === "pending" && (
                              <span className="mt-1 inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-amber-700">
                                Invitation pending
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeMember(
                              selectedTeam.id,
                              member.id
                            )
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${member.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedTeam.projectId) {
                      router.push(
                        `/business/projects/${selectedTeam.projectId}`
                      );
                    } else {
                      router.push("/business/projects");
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                >
                  View project
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => deleteTeam(selectedTeam.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
                >
                  <Trash2 size={15} />
                  Delete team
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && selectedTeam && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close invite modal"
            onClick={() => setShowInvite(false)}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg rounded-[26px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Invite collaborator
                </div>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  Add a professional
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Send an invitation to join{" "}
                  <strong>{selectedTeam.name}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Name
                </label>

                <input
                  value={inviteName}
                  onChange={(event) =>
                    setInviteName(event.target.value)
                  }
                  placeholder="Professional name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Email
                </label>

                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(event) =>
                    setInviteEmail(event.target.value)
                  }
                  placeholder="professional@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-[0.12em] text-slate-500">
                  Role
                </label>

                <select
                  value={inviteRole}
                  onChange={(event) =>
                    setInviteRole(event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                >
                  <option>Professional</option>
                  <option>Project Manager</option>
                  <option>Product Owner</option>
                  <option>Scrum Master</option>
                  <option>Business Analyst</option>
                  <option>Developer</option>
                  <option>Designer</option>
                  <option>QA</option>
                  <option>Data Professional</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={inviteMember}
              disabled={!inviteName.trim() || !inviteEmail.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Send invitation
              <Mail size={16} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}