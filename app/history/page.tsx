"use client";

import { useMemo } from "react";
import { useIOUs } from "@/components/providers/IOUProvider";

export default function HistoryPage() {
  const { ious, loading, error, removeIou, refresh } = useIOUs();

  const totals = useMemo(() => {
    const credit = ious
      .filter((iou) => iou.type === "credit")
      .reduce((sum, iou) => sum + iou.amount, 0);
    const debit = ious
      .filter((iou) => iou.type === "debit")
      .reduce((sum, iou) => sum + iou.amount, 0);

    return { credit, debit, balance: credit - debit };
  }, [ious]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare definitivamente questo IOU?"
    );
    if (!confirmed) return;

    await removeIou(id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-200/80">Ledger</p>
          <h1 className="text-3xl font-bold text-white">Storico IOU</h1>
          <p className="text-gray-300 text-sm">Riepilogo chiaro come su IOU Ledger Pro.</p>
        </div>
        <button
          onClick={() => refresh()}
          className="self-start rounded-xl bg-gray-800 border border-gray-700 px-4 py-2 text-sm font-semibold text-white hover:border-amber-400"
        >
          ↻ Aggiorna
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 shadow-lg">
          <p className="text-sm text-emerald-100">Da ricevere</p>
          <p className="text-2xl font-bold text-white">π {totals.credit.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 shadow-lg">
          <p className="text-sm text-rose-100">Da pagare</p>
          <p className="text-2xl font-bold text-white">π {totals.debit.toFixed(2)}</p>
        </div>
        <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 p-4 shadow-lg">
          <p className="text-sm text-amber-100">Saldo</p>
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
        <p className="text-gray-400 text-lg">Nessun IOU registrato.</p>
      )}

      <div className="space-y-4">
        {ious.map((iou) => (
          <div
            key={iou.id}
            className="rounded-2xl border border-gray-700 bg-gray-800/70 p-4 shadow-lg flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold text-lg">{iou.name}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    iou.type === "credit"
                      ? "bg-emerald-500/20 text-emerald-100 border border-emerald-400/50"
                      : "bg-rose-500/20 text-rose-100 border border-rose-400/50"
                  }`}
                >
                  {iou.type === "credit" ? "Da incassare" : "Da pagare"}
                </span>
                {iou.paid && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-100 border border-emerald-400/40 px-2 py-1 text-xs font-semibold">
                    Saldato
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm">{iou.category}</p>
              <p className="text-gray-400 text-xs">
                {new Date(iou.date).toLocaleDateString("it-IT", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap justify-between md:justify-end">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {iou.currency} {iou.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">Aggiornato in tempo reale</p>
              </div>
              <button
                onClick={() => handleDelete(iou.id!)}
                className="rounded-xl bg-transparent border border-rose-500/60 text-rose-100 px-4 py-2 text-sm font-semibold hover:bg-rose-500/20"
              >
                Elimina
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
