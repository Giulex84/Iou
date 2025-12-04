"use client";

import React, { useState } from "react";
import { usePi } from "@/components/PiProvider";
import { usePiPayment } from "@/hooks/usePiPayment";

export default function StartPaymentButton() {
  const { Pi, user, initialized, reauthenticate } = usePi();
  const { startPiTestPayment } = usePiPayment();
  const [status, setStatus] = useState<string>("Ready for a Pi test payment.");
  const [isLoading, setIsLoading] = useState(false);

  const startUserToAppPayment = async () => {
    try {
      if (!Pi) {
        setStatus("Pi SDK not available. Open in Pi Browser.");
        return;
      }

      const isPiBrowser =
        typeof navigator !== "undefined"
          ? navigator.userAgent?.toLowerCase().includes("pibrowser")
          : false;

      if (!isPiBrowser) {
        setStatus("Open this page in Pi Browser and sign in to your Pi account.");
        return;
      }

      setIsLoading(true);
      setStatus("Starting Pi test payment…");

      setStatus("Authenticating with Pi for payments…");
      const refreshed = await reauthenticate();
      if (!refreshed) {
        setStatus("Authentication failed. Please try again in Pi Browser.");
        setIsLoading(false);
        return;
      }

      await startPiTestPayment();
      setStatus("Pi SDK payment flow started. Please approve in the Pi Browser.");
    } catch (err: any) {
      console.error("handlePayment error", err);
      setStatus("Error: " + (err?.message ?? "unknown"));
    } finally {
      setIsLoading(false);
    }
  };

  const disabled = !initialized || !Pi || isLoading;

  return (
    <div className="my-6 p-4 border-2 border-yellow-400 bg-black rounded-lg text-white max-w-md mx-auto">
      <h3 className="text-lg font-bold text-yellow-400 mb-2">Pi Test Payment (0.001 π)</h3>

      {user && (
        <p className="text-xs mb-1">
          User: <span className="font-mono">{user.username}</span>
        </p>
      )}

      <p className="text-xs mb-3">Status: {status}</p>

      <button
        onClick={startUserToAppPayment}
        disabled={disabled}
        className={`w-full py-3 px-4 rounded font-bold text-lg ${
          disabled
            ? "bg-gray-600 text-gray-300 cursor-not-allowed"
            : "bg-yellow-500 hover:bg-yellow-600 text-black"
        }`}
      >
        {isLoading
          ? "Processing..."
          : initialized && Pi
          ? "MAKE A TEST PAYMENT"
          : "Initializing..."}
      </button>
    </div>
  );
}
