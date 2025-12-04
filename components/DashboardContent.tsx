"use client";

export default function DashboardContent() {
  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="rounded-3xl border border-purple-400/40 bg-gradient-to-br from-purple-900 via-[#3b275a] to-[#0b0718] p-6 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2">IOU Hub</h1>
          <p className="text-gray-200/90">
            Welcome! Add new IOUs or review your history with a fresh, Pi-inspired interface.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href="/add"
            className="block rounded-2xl bg-amber-400 text-gray-900 p-5 text-center font-semibold shadow-lg shadow-amber-500/40 transition hover:-translate-y-0.5"
          >
            ➕ Add IOU
          </a>

          <a
            href="/history"
            className="block rounded-2xl bg-gray-800 border border-purple-400/40 text-white p-5 text-center font-semibold shadow-lg transition hover:border-amber-300 hover:-translate-y-0.5"
          >
            📄 IOU History
          </a>
        </div>
      </div>
    </div>
  );
}
