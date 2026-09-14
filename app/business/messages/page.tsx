// app/business/messages/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CheckCheck,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Search,
  Send,
  UserPlus,
  Users,
  X,
} from "lucide-react";

type Session = {
  loggedIn?: boolean;
  role?: "professional" | "client";
  accountType?: "professional" | "client";
};

type Conversation = {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  projectTitle?: string;
  lastMessage?: string;
  updatedAt?: string;
  unread?: number;
  online?: boolean;
};

type Message = {
  id: string;
  conversationId: string;
  sender: "business" | "other";
  text: string;
  createdAt: string;
  read?: boolean;
};

const fallbackConversations: Conversation[] = [];

const fallbackMessages: Message[] = [];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeMessages(messages: Message[]) {
  try {
    sessionStorage.setItem(
      "liveproject_business_messages",
      JSON.stringify(messages)
    );
  } catch {
    // Prototype storage.
  }
}

function writeConversations(conversations: Conversation[]) {
  try {
    sessionStorage.setItem(
      "liveproject_business_conversations",
      JSON.stringify(conversations)
    );
  } catch {
    // Prototype storage.
  }
}

export default function BusinessMessagesPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(
    []
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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

    const storedConversations = readStorage<Conversation[]>(
      "liveproject_business_conversations",
      fallbackConversations
    );

    const storedMessages = readStorage<Message[]>(
      "liveproject_business_messages",
      fallbackMessages
    );

    setConversations(
      Array.isArray(storedConversations)
        ? storedConversations
        : []
    );

    setMessages(
      Array.isArray(storedMessages) ? storedMessages : []
    );

    if (storedConversations.length > 0) {
      setSelectedConversationId(storedConversations[0].id);
    }

    setReady(true);
  }, [router]);

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const searchable = [
        conversation.name,
        conversation.role,
        conversation.projectTitle,
        conversation.lastMessage,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(term);
    });
  }, [conversations, search]);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) =>
          conversation.id === selectedConversationId
      ) || null,
    [conversations, selectedConversationId]
  );

  const selectedMessages = useMemo(
    () =>
      messages.filter(
        (message) =>
          message.conversationId === selectedConversationId
      ),
    [messages, selectedConversationId]
  );

  const selectConversation = (id: string) => {
    setSelectedConversationId(id);
    setShowMobileChat(true);

    const nextConversations = conversations.map(
      (conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              unread: 0,
            }
          : conversation
    );

    setConversations(nextConversations);
    writeConversations(nextConversations);
  };

  const sendMessage = () => {
    const text = messageText.trim();

    if (!text || !selectedConversation) {
      return;
    }

    const newMessage: Message = {
      id: `message-${Date.now()}`,
      conversationId: selectedConversation.id,
      sender: "business",
      text,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };

    const nextMessages = [...messages, newMessage];

    setMessages(nextMessages);
    writeMessages(nextMessages);
    setMessageText("");

    const nextConversations = conversations.map(
      (conversation) =>
        conversation.id === selectedConversation.id
          ? {
              ...conversation,
              lastMessage: text,
              updatedAt: newMessage.createdAt,
            }
          : conversation
    );

    setConversations(nextConversations);
    writeConversations(nextConversations);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7fbfa]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
          Loading messages...
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
          <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/business")}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:text-slate-950"
                aria-label="Back to business dashboard"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-teal-700">
                  Business workspace
                </div>

                <h1 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                  Messages
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/business/talent")}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <UserPlus size={16} />
              <span className="hidden sm:inline">
                Find professionals
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section className="mb-6 rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-teal-800">
                  <MessageSquare size={13} />
                  Direct communication
                </div>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  Keep conversations close to the work.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Communicate with professionals, project collaborators and
                  future team members without leaving your business workspace.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-3">
                  <div className="text-lg font-black text-slate-950">
                    {conversations.length}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Conversations
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-3">
                  <div className="text-lg font-black text-slate-950">
                    {conversations.reduce(
                      (total, conversation) =>
                        total + (conversation.unread || 0),
                      0
                    )}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
                    Unread
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.06)]">
            <div className="grid min-h-[650px] lg:grid-cols-[360px_1fr]">
              {/* Conversations */}
              <aside
                className={[
                  "border-r border-slate-200 bg-white",
                  showMobileChat ? "hidden lg:block" : "block",
                ].join(" ")}
              >
                <div className="border-b border-slate-200 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                        Inbox
                      </p>

                      <h3 className="mt-1 text-lg font-black text-slate-950">
                        Conversations
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => router.push("/business/talent")}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 transition hover:bg-teal-100"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>

                  <div className="relative mt-4">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                      placeholder="Search conversations..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-medium outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>

                <div className="max-h-[570px] overflow-y-auto p-2">
                  {filteredConversations.length === 0 ? (
                    <div className="p-7 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                        <MessageSquare size={20} />
                      </div>

                      <p className="mt-4 text-sm font-black text-slate-950">
                        No conversations yet
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Start by discovering professionals or contacting
                        someone from your project pipeline.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          router.push("/business/talent")
                        }
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white"
                      >
                        Discover professionals
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  ) : (
                    filteredConversations.map(
                      (conversation) => {
                        const active =
                          conversation.id ===
                          selectedConversationId;

                        return (
                          <button
                            key={conversation.id}
                            type="button"
                            onClick={() =>
                              selectConversation(
                                conversation.id
                              )
                            }
                            className={[
                              "flex w-full gap-3 rounded-2xl p-3 text-left transition",
                              active
                                ? "bg-teal-50"
                                : "hover:bg-slate-50",
                            ].join(" ")}
                          >
                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                              {conversation.avatar ||
                                conversation.name[0]?.toUpperCase() ||
                                "P"}

                              {conversation.online && (
                                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-black text-slate-950">
                                  {conversation.name}
                                </p>

                                {conversation.updatedAt && (
                                  <span className="shrink-0 text-[9px] font-medium text-slate-400">
                                    {conversation.updatedAt}
                                  </span>
                                )}
                              </div>

                              <p className="mt-0.5 truncate text-[10px] font-semibold text-teal-700">
                                {conversation.role ||
                                  "Professional"}
                              </p>

                              {conversation.projectTitle && (
                                <p className="mt-1 truncate text-[10px] text-slate-400">
                                  {conversation.projectTitle}
                                </p>
                              )}

                              <p className="mt-1 truncate text-xs text-slate-500">
                                {conversation.lastMessage ||
                                  "Start the conversation"}
                              </p>
                            </div>

                            {(conversation.unread || 0) > 0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-700 px-1.5 text-[9px] font-black text-white">
                                {conversation.unread}
                              </span>
                            )}
                          </button>
                        );
                      }
                    )
                  )}
                </div>
              </aside>

              {/* Chat */}
              <section
                className={[
                  "flex min-h-[650px] flex-col bg-[#fbfdfc]",
                  showMobileChat ? "flex" : "hidden lg:flex",
                ].join(" ")}
              >
                {!selectedConversation ? (
                  <div className="flex flex-1 items-center justify-center p-8 text-center">
                    <div>
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                        <MessageSquare size={28} />
                      </div>

                      <h3 className="mt-5 text-xl font-black text-slate-950">
                        Select a conversation
                      </h3>

                      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Choose a conversation from your inbox to view
                        messages and continue the discussion.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
                      <div className="flex min-w-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setShowMobileChat(false)
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 lg:hidden"
                        >
                          <ArrowLeft size={16} />
                        </button>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-black text-white">
                          {selectedConversation.name[0]?.toUpperCase() ||
                            "P"}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="truncate text-sm font-black text-slate-950">
                              {selectedConversation.name}
                            </h3>

                            {selectedConversation.online && (
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                          </div>

                          <p className="truncate text-xs text-slate-500">
                            {selectedConversation.role ||
                              "Professional"}
                          </p>

                          {selectedConversation.projectTitle && (
                            <p className="truncate text-[10px] font-semibold text-teal-700">
                              {selectedConversation.projectTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowInfo((value) => !value)}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-950"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </div>
                    </div>

                    {showInfo && (
                      <div className="border-b border-slate-200 bg-white px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-50 px-3 py-1.5 text-[10px] font-bold text-slate-500">
                            {selectedConversation.role ||
                              "Professional"}
                          </span>

                          {selectedConversation.projectTitle && (
                            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-[10px] font-bold text-teal-700">
                              {selectedConversation.projectTitle}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                      {selectedMessages.length === 0 ? (
                        <div className="flex h-full min-h-[420px] items-center justify-center text-center">
                          <div>
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                              <MessageSquare size={23} />
                            </div>

                            <h4 className="mt-4 text-base font-black text-slate-950">
                              Start the conversation
                            </h4>

                            <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                              Discuss the project, clarify expectations and
                              decide on the best next step.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mx-auto flex max-w-3xl flex-col gap-4">
                          {selectedMessages.map((message) => {
                            const isBusiness =
                              message.sender === "business";

                            return (
                              <div
                                key={message.id}
                                className={[
                                  "flex",
                                  isBusiness
                                    ? "justify-end"
                                    : "justify-start",
                                ].join(" ")}
                              >
                                <div
                                  className={[
                                    "max-w-[82%] rounded-2xl px-4 py-3 shadow-sm",
                                    isBusiness
                                      ? "rounded-br-md bg-slate-950 text-white"
                                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700",
                                  ].join(" ")}
                                >
                                  <p className="whitespace-pre-wrap text-sm leading-6">
                                    {message.text}
                                  </p>

                                  <div
                                    className={[
                                      "mt-2 flex items-center gap-1.5 text-[9px]",
                                      isBusiness
                                        ? "text-slate-400"
                                        : "text-slate-400",
                                    ].join(" ")}
                                  >
                                    <span>{message.createdAt}</span>

                                    {isBusiness &&
                                      message.read && (
                                        <CheckCheck size={12} />
                                      )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
                      <div className="mx-auto flex max-w-3xl items-end gap-2">
                        <button
                          type="button"
                          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Paperclip size={17} />
                        </button>

                        <textarea
                          value={messageText}
                          onChange={(event) =>
                            setMessageText(event.target.value)
                          }
                          onKeyDown={handleKeyDown}
                          placeholder="Write a message..."
                          rows={1}
                          className="max-h-36 min-h-10 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium leading-6 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-500/10"
                        />

                        <button
                          type="button"
                          onClick={sendMessage}
                          disabled={!messageText.trim()}
                          className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Send message"
                        >
                          <Send size={16} />
                        </button>
                      </div>

                      <p className="mx-auto mt-2 max-w-3xl text-[9px] text-slate-400">
                        Press Enter to send • Shift + Enter for a new line
                      </p>
                    </div>
                  </>
                )}
              </section>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2 text-teal-300">
                  <BriefcaseBusiness size={17} />
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    Collaboration
                  </span>
                </div>

                <h3 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
                  Keep communication attached to the work.
                </h3>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Use conversations to clarify project expectations, coordinate
                  teams and move promising professionals toward real work.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/business/projects")}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5"
              >
                View projects
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          <div className="h-10" />
        </div>
      </div>
    </main>
  );
}