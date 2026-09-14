export default function PaymentCancelledPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-6 text-white flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-500/15">
          <span className="text-3xl text-slate-300">
            ×
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold">
          Payment cancelled
        </h1>

        <p className="mt-3 text-slate-400">
          No payment was completed.
          Your account has not been upgraded.
        </p>

        <button
          type="button"
          onClick={() => {
            window.location.href =
              "/checkout";
          }}
          className="mt-8 rounded-xl bg-white px-6 py-3 font-semibold text-slate-950"
        >
          Return to Premium
        </button>
      </div>
    </main>
  );
}
