"use client";

import { useCallback } from "react";
import { usePi } from "@/components/PiProvider";

export function usePiPayment() {
  const { Pi, piReady } = usePi();

  const startPiTestPayment = useCallback(async () => {
    if (!Pi || !piReady || typeof Pi.createPayment !== "function") {
      throw new Error("Pi SDK not initialized or not ready for payments");
    }

    const paymentData = {
      amount: 0.001,
      memo: "IOU Hub Test Payment",
      metadata: { reason: "dev-checklist" },
    };

    const paymentCallbacks = {
      onReadyForServerApproval: async (paymentId: string) => {
        const res = await fetch("/api/pi/approve-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, serverPaymentId: paymentId }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to approve Pi payment: ${error?.error ?? res.statusText}`
          );
        }
      },
      onReadyForServerCompletion: async (paymentId: string, txid: string) => {
        const res = await fetch("/api/pi/complete-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, txid, serverPaymentId: paymentId }),
        });

        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          throw new Error(
            `Failed to complete Pi payment: ${error?.error ?? res.statusText}`
          );
        }
      },
      onCancel: async (paymentId: string) => {
        console.warn("Pi payment cancelled", paymentId);
        await fetch("/api/pi/cancel-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId }),
        }).catch(() => null);
      },
      onError: (error: unknown, payment: unknown) => {
        console.error("Pi payment error", error, payment);
      },
    };

    return Pi.createPayment(paymentData, paymentCallbacks);
  }, [Pi, piReady]);

  return { startPiTestPayment };
}
