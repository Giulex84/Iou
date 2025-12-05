// components/PiAuthHandler.tsx
"use client";

import { useEffect, useState } from "react";

import { usePi } from "@/components/PiProvider";

import { syncPiProfile, type PiUserProfile } from "@/utils/auth";

type PiSDK = {
  init?: (options: { version: string; sandbox?: boolean }) => Promise<void> | void;
  authenticate?: (
    scopes: string[],
    onIncompletePaymentFound?: (payment: unknown) => void
  ) => Promise<{ user?: { uid?: string; id?: string; username?: string }; accessToken?: string; access_token?: string }>;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export default function PiAuthHandler() {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const { Pi, initialized, piBrowser, piReady } = usePi();

  useEffect(() => {
    let active = true;

    const authenticate = async () => {
      try {
        setStatus("loading");
        setError(null);

        let sdk: PiSDK | null =
          Pi ?? (typeof window !== "undefined" ? ((window as any).Pi as PiSDK | null) ?? null : null);
        const inPiBrowser = piBrowser || typeof sdk === "object";

        if (!inPiBrowser) {
          throw new Error("Please open the app in Pi Browser to use the Pi SDK.");
        }

        const startedAt = Date.now();
        while (active && Date.now() - startedAt < 12000) {
          sdk =
            Pi ??
            (typeof window !== "undefined" ? ((window as any).Pi as PiSDK | null) ?? null : null);

          if (sdk && piReady && typeof sdk.authenticate === "function") break;

          await new Promise((resolve) => setTimeout(resolve, 300));
        }

        if (!sdk || !piReady || typeof sdk.authenticate !== "function") {
          throw new Error(
            "Pi SDK is still initializing. Please stay on this page in Pi Browser."
          );
        }

        const authResult = await sdk.authenticate(
          ["username", "payments"],
          (payment: unknown) => {
            console.warn("Incomplete payment detected", payment);
          }
        );

        if (!authResult?.user) {
          throw new Error("Pi authentication failed.");
        }

        const profile: PiUserProfile = {
          uid: authResult.user.uid ?? authResult.user.id ?? "",
          username: authResult.user.username ?? "Pi User",
          accessToken: authResult.accessToken ?? authResult.access_token,
        };

        if (!profile.uid) {
          throw new Error("Missing Pi user identifier.");
        }

        await syncPiProfile(profile);

        if (!active) return;
        setStatus("authenticated");
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Unexpected error during authentication."
        );
        setStatus("error");
      }
    };

    if (initialized) void authenticate();

    return () => {
      active = false;
    };
  }, [Pi, initialized, piBrowser, piReady]);

  if (status === "idle") return null;

  return (
    <div className="rounded-md bg-gray-800/50 p-3 text-sm text-gray-200">
      {status === "loading" && "Connecting to Pi..."}
      {status === "authenticated" && "Pi account synced with Supabase."}
      {status === "error" && error}
    </div>
  );
}
