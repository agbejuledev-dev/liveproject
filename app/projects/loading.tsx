"use client";

export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-[#f6f9f9]">
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-10 lg:px-8">
        <div className="h-6 w-28 rounded-lg bg-slate-200" />
        <div className="mt-5 h-12 w-96 max-w-full rounded-xl bg-slate-200" />
        <div className="mt-4 h-5 w-[520px] max-w-full rounded-lg bg-slate-200" />

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white"
            >
              <div className="h-40 bg-slate-200" />
              <div className="space-y-4 p-5">
                <div className="h-5 w-32 rounded bg-slate-200" />
                <div className="h-6 w-4/5 rounded bg-slate-200" />
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-10 w-full rounded-xl bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}