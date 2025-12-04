"use client";

import { useMemo } from "react";
import { useIOUs } from "@/components/providers/IOUProvider";

export default function HistoryPage() {
  const { ious, loading, error, removeIou, refresh, togglePaid } = useIOUs();

  const totals = useMemo(() => {
    const owedToMe = ious
      .filter((iou) => iou.transaction_type === "OWED")
      .reduce((sum, iou) => sum + iou.amount, 0);
    const iOwe = ious
      .filter((iou) => iou.transaction_type === "OWE")
      .reduce((sum, iou) => sum + iou.amount, 0);

    return { owedToMe, iOwe, balance: owedToMe - iOwe };
  }, [ious]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this IOU?"
    );
    if (!confirmed) return;

    await removeIou(id);
  };

  const handleToggleSettled = async (id: string, isSettled: boolean) => {
    await togglePaid(id, !isSettled);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-200/80">Overview</p>
          <h1 className="text-3xl font-bold text-white">IOU History</h1>
          <p className="text-gray-300 text-sm">
            Clean, Pi-styled tracking of everything you owe and are owed.
          </p>
        </div>
        <button
          onClick={() => refresh()}
          className="self-start rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 shadow-lg">
          <p className="text-sm text-emerald-100">I Am Owed</p>
          <p className="text-2xl font-bold text-white">π {totals.owedToMe.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 shadow-lg">
          <p className="text-sm text-rose-100">I Owe</p>
          <p className="text-2xl font-bold text-white">π {totals.iOwe.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 shadow-lg">
          <p className="text-sm text-amber-100">Balance</p>
          <p className="text-2xl font-bold text-white">π {totals.balance.toFixed(2)}</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-20 rounded-xl bg-gray-800/70 border border-gray-700 animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-400 bg-red-900/30 border border-red-800 rounded-lg p-3">
          {error}
        </p>
      )}

      {!loading && !ious.length && (
        <p className="text-gray-400 text-lg">No IOUs recorded yet.</p>
      )}

      <div className="space-y-4">
        {ious.map((iou) => (
          <div
            key={iou.id}
            className="rounded-2xl border border-purple-500/30 bg-black/40 p-4 shadow-xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-lg">{iou.description}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    iou.transaction_type === "OWED"
                      ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/50"
                      : "bg-rose-500/20 text-rose-100 border border-rose-400/50"
                  }`}
                >
                  {iou.transaction_type === "OWED" ? "I Am Owed" : "I Owe"}
                </span>
                {iou.is_settled && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/40 px-2 py-1 text-xs font-semibold">
                    Settled
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm">With: {iou.involved_party}</p>
              <p className="text-gray-400 text-xs">
                {new Date(iou.created_at ?? Date.now()).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">π {iou.amount.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Synced with Supabase</p>
              </div>
              <button
                onClick={() => handleToggleSettled(iou.id!, iou.is_settled)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                  iou.is_settled
                    ? "bg-emerald-500/20 border-emerald-300 text-emerald-50"
                    : "bg-gray-800/70 border-gray-600 text-gray-200 hover:border-amber-300"
                }`}
              >
                {iou.is_settled ? "Mark Unsettled" : "Mark Settled"}
              </button>
              <button
                onClick={() => handleDelete(iou.id!)}
                className="rounded-xl bg-transparent border border-rose-500/60 text-rose-100 px-4 py-2 text-sm font-semibold hover:bg-rose-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
