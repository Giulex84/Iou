// app/page.tsx
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import DashboardContent from "@/components/DashboardContent";

export default function Page() {
  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <DashboardContent />
    </div>
  );
}
