"use client";

import React, { useState } from "react";
import { useIOUs } from "@/components/providers/IOUProvider";

export default function AddPage() {
  const { addIou, loading, error } = useIOUs();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [debtor, setDebtor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !debtor) return;

    await addIou(
      {
        title,
        amount: Number(amount),
        debtor,
        paid: false,
        created_at: new Date().toISOString(),
      },
      crypto.randomUUID()
    );

    // Reset campi
    setTitle("");
    setAmount("");
    setDebtor("");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Aggiungi IOU</h1>

      {error && (
        <p className="text-red-500 text-center mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium mb-1">Titolo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Es. Prestito, Cena, Biglietti..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Importo</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            placeholder="Es. 20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Debitore</label>
          <input
            type="text"
            value={debtor}
            onChange={(e) => setDebtor(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Nome o persona"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:bg-gray-400"
        >
          {loading ? "Salvataggio..." : "Aggiungi IOU"}
        </button>
      </form>
    </div>
  );
}
