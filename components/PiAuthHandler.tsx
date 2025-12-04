// components/PiAuthHandler.tsx
"use client";

import { useEffect, useState } from "react";

import { syncPiProfile, type PiUserProfile } from "@/utils/auth";

type PiSDK = {
  init?: (options: { version: string; sandbox?: boolean }) => Promise<void> | void;
  authenticate?: (
    scopes: string[],
    options: { onIncompletePaymentFound?: (payment: unknown) => void }
  ) => Promise<{ user?: { uid?: string; id?: string; username?: string }; accessToken?: string; access_token?: string }>;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "error";

export default function PiAuthHandler() {
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const authenticate = async () => {
      try {
        setStatus("loading");
        setError(null);

        const isPiBrowser =
          typeof window !== "undefined" && typeof navigator !== "undefined"
            ? navigator.userAgent?.toLowerCase().includes("pibrowser")
            : false;

        const sdk: PiSDK | null = typeof window !== "undefined" ? ((window as any).Pi as PiSDK) : null;
        if (!sdk || !isPiBrowser) {
          throw new Error("Please open the app in Pi Browser to use the Pi SDK.");
        }

        if (typeof sdk.init === "function") {
          await sdk.init({ version: "2.0", sandbox: true });
        }

        if (typeof sdk.authenticate !== "function") {
          throw new Error("The Pi client does not expose an authentication method.");
        }

        const authResult = await sdk.authenticate(["username", "payments"], {
          onIncompletePaymentFound: (payment: unknown) => {
            console.warn("Pagamento incompleto rilevato", payment);
          },
        });

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

    void authenticate();

    return () => {
      active = false;
    };
  }, []);

  if (status === "idle") return null;

  return (
    <div className="rounded-md bg-gray-800/50 p-3 text-sm text-gray-200">
      {status === "loading" && "Connecting to Pi..."}
      {status === "authenticated" && "Pi account synced with Supabase."}
      {status === "error" && error}
    </div>
  );
}
