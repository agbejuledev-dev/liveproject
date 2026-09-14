"use client";

export default function PremiumLoading() {
  return (
    <main className="min-h-screen bg-[#071f1f]">
      <div className="mx-auto max-w-7xl animate-pulse px-5 py-16 lg:px-8">
        <div className="h-6 w-28 rounded-lg bg-white/10" />
        <div className="mt-7 h-16 w-[650px] max-w-full rounded-xl bg-white/10" />
        <div className="mt-4 h-5 w-[520px] max-w-full rounded-lg bg-white/10" />

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-7">
          <div className="h-8 w-40 rounded-lg bg-white/10" />
          <div className="mt-5 h-20 rounded-2xl bg-white/10" />

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-32 rounded-2xl bg-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}