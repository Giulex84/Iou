"use client";

import { useIOUs } from "@/components/providers/IOUProvider";
import IouCard from "@/components/IouCard";

export default function HistoryContent() {
  const { ious, loading, error } = useIOUs();

  if (loading) {
    return <p className="text-gray-400">Loading IOUs...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }

  if (!ious.length) {
    return <p className="text-gray-400 text-lg">No IOUs recorded yet.</p>;
  }

  return (
    <div className="space-y-4 mt-6">
      {ious.map((iou) => (
        <IouCard key={iou.id} iou={iou} />
      ))}
    </div>
  );
}
