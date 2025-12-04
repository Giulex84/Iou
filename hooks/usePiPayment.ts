"use client";

import { useCallback } from "react";
import { usePi } from "@/components/PiProvider";

export function usePiPayment() {
  const { Pi } = usePi();

  const startPiTestPayment = useCallback(async () => {
    if (!Pi) throw new Error("Pi SDK not initialized");

    const paymentData = {
      amount: 0.001,
      memo: "IOU Hub Test Payment",
      metadata: { reason: "dev-checklist" },
    };

    const paymentCallbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        const res = await fetch("/api/payments/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to approve Pi payment: ${error?.error ?? res.statusText}`
          );
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        const res = await fetch("/api/payments/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to complete Pi payment: ${error?.error ?? res.statusText}`
          );
        }
      },
      onCancel: (paymentId: string) => {
        console.warn("Pi payment cancelled", paymentId);
      },
      onError: (error: unknown, payment: unknown) => {
        console.error("Pi payment error", error, payment);
      },
    };

    return Pi.createPayment(paymentData, paymentCallbacks);
  }, [Pi]);

  return { startPiTestPayment };
}
