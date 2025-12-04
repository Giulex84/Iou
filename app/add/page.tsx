"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useIOUs } from "@/components/providers/IOUProvider";

export default function AddPage() {
  const router = useRouter();
  const { addIou, loading, error } = useIOUs();

  const [description, setDescription] = useState("");
  const [involvedParty, setInvolvedParty] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [transactionType, setTransactionType] = useState<"OWE" | "OWED">(
    "OWED"
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const isValid = useMemo(
    () =>
      Boolean(
        description.trim() &&
          involvedParty.trim() &&
          amount !== "" &&
          Number(amount) > 0
      ),
    [amount, description, involvedParty]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await addIou({
        description: description.trim(),
        involved_party: involvedParty.trim(),
        amount: Number(amount),
        transaction_type: transactionType,
        is_settled: false,
      });

      setShowSuccess(true);
      setDescription("");
      setInvolvedParty("");
      setAmount("");
      setTransactionType("OWED");

      setTimeout(() => {
        router.push("/history");
      }, 900);
    } catch {
      // errors handled by provider
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="relative overflow-hidden rounded-3xl border border-purple-400/30 bg-gradient-to-br from-purple-900 via-[#3b275a] to-[#0b0718] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,193,61,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(90,61,140,0.25),transparent_40%)]" />
        <div className="relative p-6 md:p-8 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-purple-200/80">New entry</p>
              <h1 className="text-3xl font-bold text-white mt-1">Add IOU</h1>
              <p className="text-gray-200/90 mt-2 text-sm md:max-w-2xl">
                Capture who owes what with a clean, Pi-inspired look. Set whether you owe or are owed, add a short description, and keep your ledger perfectly aligned with Supabase.
              </p>
            </div>
            <div className="rounded-2xl bg-amber-400/20 border border-amber-300/40 px-4 py-2 text-amber-100 text-sm font-semibold shadow-lg shadow-amber-500/20">
              Pi-first styling
            </div>
          </div>

          {error && (
            <p className="text-red-200 bg-red-900/40 border border-red-700 rounded-xl p-3">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-semibold text-purple-100">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-2xl border border-purple-500/40 bg-black/30 px-4 py-3 text-white placeholder:text-purple-200/50 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/50"
                placeholder="e.g. Dinner split, project expense, small loan"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-purple-100">Amount (π)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-2xl border border-purple-500/40 bg-black/30 px-4 py-3 text-white placeholder:text-purple-200/50 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/50"
                placeholder="0.00"
                min={0}
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-purple-100">Involved party</label>
              <input
                type="text"
                value={involvedParty}
                onChange={(e) => setInvolvedParty(e.target.value)}
                className="w-full rounded-2xl border border-purple-500/40 bg-black/30 px-4 py-3 text-white placeholder:text-purple-200/50 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/50"
                placeholder="Who is this IOU with?"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-purple-100 mb-2">Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTransactionType("OWED")}
                  className={`rounded-2xl px-4 py-3 text-left border transition-all shadow-lg ${
                    transactionType === "OWED"
                      ? "bg-emerald-500/20 border-emerald-300 text-emerald-50 shadow-emerald-500/30"
                      : "bg-black/30 border-purple-500/30 text-purple-100/80"
                  }`}
                >
                  <p className="text-sm font-semibold">I Am Owed</p>
                  <p className="text-xs opacity-80">Someone owes me this amount</p>
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType("OWE")}
                  className={`rounded-2xl px-4 py-3 text-left border transition-all shadow-lg ${
                    transactionType === "OWE"
                      ? "bg-rose-500/20 border-rose-300 text-rose-50 shadow-rose-500/30"
                      : "bg-black/30 border-purple-500/30 text-purple-100/80"
                  }`}
                >
                  <p className="text-sm font-semibold">I Owe</p>
                  <p className="text-xs opacity-80">I need to pay this amount</p>
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
              <p className="text-sm text-purple-100/80">
                Data is saved instantly to your ledger—no drafts, just clear records that match Supabase.
              </p>
              <button
                type="submit"
                disabled={loading || !isValid}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 text-gray-900 font-semibold px-6 py-3 shadow-lg shadow-amber-500/40 transition hover:-translate-y-0.5 disabled:bg-gray-600 disabled:text-gray-300"
              >
                {loading ? "Saving..." : "Save IOU"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto max-w-sm rounded-2xl bg-emerald-600 text-white shadow-2xl shadow-emerald-500/40 px-4 py-3 border border-emerald-300/60 animate-[fade-in_0.3s_ease-out]">
          <p className="font-semibold">IOU saved</p>
          <p className="text-sm text-emerald-50">Redirecting to history to keep everything in sync.</p>
        </div>
      )}
    </div>
  );
}
