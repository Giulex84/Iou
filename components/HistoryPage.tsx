"use client";

import HistoryContent from "@/components/HistoryContent";

export default function HistoryPage() {
  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Storico IOUs</h1>
      <HistoryContent />
    </div>
  );
}
