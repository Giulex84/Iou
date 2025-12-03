// app/page.tsx
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import DashboardContent from "@/components/DashboardContent";
import PiAuthHandler from "@/components/PiAuthHandler";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <PiAuthHandler />
        <DashboardContent />
      </div>
    </div>
  );
}
