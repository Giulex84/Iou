"use client";

import StartPaymentButton from "@/components/StartPaymentButton";

export default function PaymentPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-[#120b24] via-[#2b1a3f] to-[#0b0718] p-8 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,193,61,0.16),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(90,61,140,0.25),transparent_40%)]" />
        <div className="relative space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-100/70">Step 10</p>
          <h1 className="text-3xl font-bold text-white">Make a Test Payment</h1>
          <p className="text-sm text-amber-50/90 max-w-3xl">
            Start a Pi user-to-app payment for compliance. This flow uses the Pi Browser SDK, calls your server to approve and
            complete the transaction, and charges a small 0.001 π test amount.
          </p>
        </div>
      </div>

      <StartPaymentButton />
    </div>
  );
}
