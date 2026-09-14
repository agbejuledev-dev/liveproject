"use client";

export default function UKJobBoardLoading() {
  return (
    <main className="min-h-screen bg-[#f6f9f9]">
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-10 lg:px-8">
        <div className="h-6 w-40 rounded-lg bg-slate-200" />
        <div className="mt-5 h-12 w-[520px] max-w-full rounded-xl bg-slate-200" />

        <div className="mt-7 grid gap-3 md:grid-cols-4">
          <div className="h-12 rounded-xl bg-white" />
          <div className="h-12 rounded-xl bg-white" />
          <div className="h-12 rounded-xl bg-white" />
          <div className="h-12 rounded-xl bg-white" />
        </div>

        <div className="mt-7 space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-[2rem] border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    </main>
  );
}