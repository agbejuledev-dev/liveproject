"use client";

export default function WorkspaceLoading() {
  return (
    <main className="min-h-screen bg-[#f6f9f9]">
      <div className="flex min-h-screen animate-pulse">
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
          <div className="h-9 w-36 rounded-xl bg-slate-200" />

          <div className="mt-8 space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-10 rounded-xl bg-slate-100"
              />
            ))}
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-5 py-8 lg:px-8">
          <div className="h-8 w-48 rounded-lg bg-slate-200" />
          <div className="mt-4 h-5 w-96 max-w-full rounded-lg bg-slate-200" />

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-[1.5rem] border border-slate-200 bg-white"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 rounded-[1.8rem] border border-slate-200 bg-white"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}