"use client";

import React, { useMemo, useState } from "react";
import { useIOUs } from "@/components/providers/IOUProvider";

const categories = [
  "Personale",
  "Lavoro",
  "Famiglia",
  "Eventi",
  "Altro",
];

export default function AddPage() {
  const { addIou, loading, error } = useIOUs();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"credit" | "debit">("credit");
  const [currency, setCurrency] = useState("PI");
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const isValid = useMemo(
    () => Boolean(name && amount !== "" && Number(amount) > 0),
    [name, amount]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    await addIou({
      name,
      amount: Number(amount),
      currency,
      category,
      type,
      paid: false,
      date,
    });

    setName("");
    setAmount("");
    setCategory(categories[0]);
    setType("credit");
    setCurrency("PI");
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-2xl bg-gradient-to-br from-purple-900/70 via-gray-900 to-black border border-purple-700/40 shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-200/80">Nuovo movimento</p>
            <h1 className="text-3xl font-bold text-white mt-1">Aggiungi IOU</h1>
            <p className="text-gray-300 mt-1 text-sm">
              Inserisci i dati come su IOU Ledger Pro: importo, tipo di movimento e categoria.
            </p>
          </div>
          <span className="px-4 py-2 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold border border-amber-500/30">
            Linee guida Pi Network
          </span>
        </div>

        {error && (
          <p className="text-red-400 bg-red-900/30 border border-red-800 rounded-lg p-3 mt-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-1">Descrizione</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              placeholder="Es. Prestito cena di gruppo"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Importo</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
              placeholder="0.00"
              min={0}
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Valuta</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
            >
              <option value="PI">Pi (π)</option>
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollari ($)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("credit")}
                className={`rounded-xl px-4 py-3 text-center border transition-colors ${
                  type === "credit"
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-50"
                    : "bg-gray-800/70 border-gray-700 text-gray-300"
                }`}
              >
                Devo ricevere
              </button>
              <button
                type="button"
                onClick={() => setType("debit")}
                className={`rounded-xl px-4 py-3 text-center border transition-colors ${
                  type === "debit"
                    ? "bg-rose-500/20 border-rose-400 text-rose-50"
                    : "bg-gray-800/70 border-gray-700 text-gray-300"
                }`}
              >
                Devo pagare
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800/70 px-4 py-3 text-white focus:border-amber-400 focus:ring-2 focus:ring-amber-400/40"
            />
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
            <p className="text-sm text-gray-400">
              I dati vengono salvati immediatamente nel ledger: niente bozze, niente confusione.
            </p>
            <button
              type="submit"
              disabled={loading || !isValid}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 text-gray-900 font-semibold px-5 py-3 shadow-lg shadow-amber-500/30 disabled:bg-gray-600 disabled:text-gray-300"
            >
              {loading ? "Salvataggio..." : "Salva IOU"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
