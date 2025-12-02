"use client";

import { useState } from "react";
import { useIOUS } from "@/components/providers/IOUProvider";

const CATEGORIES = ["Prestito", "Cena", "Spesa", "Regalo", "Altro"] as const;
const CURRENCY_LABELS = { EUR: "€ Euro", USD: "$ Dollar", PI: "π Pi" } as const;

export default function AddIOUForm() {
  const { addIou } = useIOUS();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"credit" | "debit">("credit"); // FIX
  const [category, setCategory] = useState<string>("Prestito");
  const [currency, setCurrency] = useState<"EUR" | "USD" | "PI">("EUR");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !amount) return;

    await addIou({
      name,
      amount: Number(amount),
      currency,
      category,
      type,                 // ORA È CORRETTO
      paid: false,
      date: new Date().toISOString(),
    });

    // Reset campi
    setName("");
    setAmount("");
    setType("credit");
    setCategory("Prestito");
    setCurrency("EUR");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* TYPE */}
      <div className="flex gap-3">
        <button
          type="button"
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            type === "credit"
              ? "bg-emerald-500 text-white shadow"
              : "bg-gray-600 text-gray-300"
          }`}
          onClick={() => setType("credit")}
        >
          <span className="font-black">me</span>
          <br />they owe me
        </button>

        <button
          type="button"
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            type === "debit"
              ? "bg-orange-500 text-white shadow"
              : "bg-gray-600 text-gray-300"
          }`}
          onClick={() => setType("debit")}
        >
          <span className="font-black">I owe them</span>
        </button>
      </div>

      {/* NAME */}
      <div>
        <label className="text-sm font-medium text-gray-300">Name</label>
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white text-black border border-gray-300
                     focus:ring-2 focus:ring-blue-500"
          placeholder="Person or contact name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* AMOUNT */}
      <div>
        <label className="text-sm font-medium text-gray-300">Amount</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          className="w-full px-4 py-3 rounded-xl bg-white text-black border border-gray-300
                     focus:ring-blue-500 focus:ring-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* CURRENCY */}
      <div>
        <label className="text-sm font-medium text-gray-300">Currency</label>
        <div className="flex gap-2">
          {(["EUR", "USD", "PI"] as const).map((cur) => (
            <button
              key={cur}
              type="button"
              className={`flex-1 py-3 rounded-xl transition-all ${
                currency === cur
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-700 text-gray-300"
              }`}
              onClick={() => setCurrency(cur)}
            >
              {CURRENCY_LABELS[cur].split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-sm font-medium text-gray-300">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`px-4 py-2 rounded-full text-xs border transition-all ${
                cat === category
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-gray-700 text-gray-300 border-gray-600"
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
      >
        Add IOU
      </button>
    </form>
  );
}
