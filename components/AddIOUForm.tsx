"use client";

import { useState } from "react";
import { useIOUs } from "@/components/providers/IOUProvider";

export default function AddIOUForm() {
  const { addIou } = useIOUs();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"OWE" | "OWED">("OWED");
  const [involvedParty, setInvolvedParty] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!description || !amount || !involvedParty) return;

    await addIou({
      description,
      amount: Number(amount),
      transaction_type: type,
      involved_party: involvedParty,
      is_settled: false,
    });

    setDescription("");
    setAmount("");
    setType("OWED");
    setInvolvedParty("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div className="flex gap-3">
        <button
          type="button"
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            type === "OWED"
              ? "bg-emerald-500 text-white shadow"
              : "bg-gray-600 text-gray-300"
          }`}
          onClick={() => setType("OWED")}
        >
          <span className="font-black">I am owed</span>
          <br />Keep
        </button>

        <button
          type="button"
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            type === "OWE"
              ? "bg-orange-500 text-white shadow"
              : "bg-gray-600 text-gray-300"
          }`}
          onClick={() => setType("OWE")}
        >
          <span className="font-black">I owe</span>
          <br />Pay
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Description</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white text-black border border-gray-300 focus:ring-2 focus:ring-blue-500"
          placeholder="What is this IOU for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Amount (π)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          className="w-full px-4 py-3 rounded-xl bg-white text-black border border-gray-300 focus:ring-blue-500 focus:ring-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-300">Involved party</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white text-black border border-gray-300 focus:ring-blue-500 focus:ring-2"
          placeholder="Who is this with?"
          value={involvedParty}
          onChange={(e) => setInvolvedParty(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
      >
        Add IOU
      </button>
    </form>
  );
}
