"use client";

import React, { useState } from "react";
import { usePi } from "@/components/PiProvider";

export default function StartPaymentButton() {
  const { Pi, user, initialized } = usePi();
  const [status, setStatus] = useState<string>("Ready for a test payment.");
  const [serverPaymentId, setServerPaymentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!Pi) {
      setStatus("Pi SDK not available. Open in Pi Browser.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("Creating payment on the server...");

      // 1️⃣ CREATE THE PAYMENT ON THE SERVER
      const initRes = await fetch("/api/pi/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1,
          memo: "Test payment (IOU)",
          metadata: { reason: "test_payment" },
        }),
      });

      const initJson = await initRes.json();

      if (!initRes.ok || !initJson.ok) {
        console.error("initiate-payment error:", initJson);
        setStatus(`initiate-payment error: ${JSON.stringify(initJson)}`);
        setIsLoading(false);
        return;
      }

      const newServerPaymentId = initJson.serverPaymentId;
      setServerPaymentId(newServerPaymentId);

      // DATA FOR PI SDK
      const paymentData = {
        amount: 1,
        memo: "Test payment (IOU)",
        metadata: { serverPaymentId: newServerPaymentId },
      };

      // PI SDK CALLBACKS
      const callbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log("➡️ onReadyForServerApproval", paymentId);
          setStatus("Server approving payment...");

          const res = await fetch("/api/pi/approve-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId,
            }),
          });

          const json = await res.json();
          if (!res.ok || !json.ok) {
            console.error("Approval error:", json);
            setStatus("Error during payment approval.");
          } else {
            setStatus("Approved! Waiting for Pi to complete...");
          }
        },

        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log("➡️ onReadyForServerCompletion", paymentId, txid);
          setStatus("Completing on the server...");

          const res = await fetch("/api/pi/complete-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });

          const json = await res.json();
          if (!res.ok || !json.ok) {
            console.error("Completion error:", json);
            setStatus("Error during completion.");
          } else {
            setStatus("Payment completed ✅");
            alert("Test payment completed!");
          }

          setIsLoading(false);
        },

        onCancel: () => {
          setStatus("Payment cancelled by user.");
          setIsLoading(false);
        },

        onError: (err: any) => {
          console.error("❌ Pi error:", err);
          setStatus("Payment error.");
          setIsLoading(false);
        },
      };

      // 2️⃣ START THE PAYMENT IN PI SDK
      await Pi.createPayment(paymentData, callbacks);
    } catch (err: any) {
      console.error("handlePayment error", err);
      setStatus("Error: " + (err?.message ?? "unknown"));
      setIsLoading(false);
    }
  };

  const disabled = !initialized || !Pi || isLoading;

  return (
    <div className="my-6 p-4 border-2 border-yellow-400 bg-black rounded-lg text-white max-w-md mx-auto">
      <h3 className="text-lg font-bold text-yellow-400 mb-2">Pi Test Payment (1 π)</h3>

      {user && (
        <p className="text-xs mb-1">
          User: <span className="font-mono">{user.username}</span>
        </p>
      )}

      {serverPaymentId && (
        <p className="text-[10px] text-gray-400 mb-1">
          serverPaymentId:{" "}
          <span className="font-mono break-all">{serverPaymentId}</span>
        </p>
      )}

      <p className="text-xs mb-3">Status: {status}</p>

      <button
        onClick={handlePayment}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded font-bold text-lg ${
          disabled
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        {isLoading
          ? "Processing..."
          : initialized
          ? "TEST PAYMENT (1 π)"
          : "Initializing..."}
      </button>
    </div>
  );
}
