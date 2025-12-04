"use client";

import type { IOU } from "@/lib/types";
import { useIOUs } from "@/components/providers/IOUProvider";

const currencySymbol = "π";

export default function IouCard({ iou }: { iou: IOU }) {
  const { setSettlement } = useIOUs();

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border shadow transition-all">
      <p className="flex justify-between items-start gap-3">
        <span className="text-xl font-bold text-gray-900 truncate">
          {iou.description}
        </span>
        <span className="text-xl font-bold text-gray-900">
          {currencySymbol} {iou.amount.toFixed(2)}
        </span>
      </p>

      <p className="text-xs text-gray-500">
        {iou.transaction_type === "OWED" ? "owes me" : "I owe"}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-2">
        <span className="text-gray-500 text-xs">With: {iou.involved_party}</span>
        <span className="text-gray-400">
          {new Date(iou.created_at ?? Date.now()).toLocaleDateString()}
        </span>
        {iou.is_settled && (
          <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs">
            Paid
          </span>
        )}
      </div>

      <button
        className={`mt-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
          iou.is_settled
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        onClick={() => setSettlement(iou.id!, !iou.is_settled)}
      >
        {iou.is_settled ? "Mark Unpaid" : "Mark Paid"}
      </button>
    </div>
  );
}
