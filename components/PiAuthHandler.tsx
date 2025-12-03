// components/PiAuthHandler.tsx
"use client";

import { useEffect, useState } from "react";

import { syncPiProfile, type PiUserProfile } from "@/utils/auth";

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

        const { PiNetwork } = (await import("@pinetwork-sdk/client")) as {
          PiNetwork?: any;
        };

        const sdk = PiNetwork ?? (typeof window !== "undefined" ? (window as any).Pi : null);
        if (!sdk) {
          throw new Error("Pi SDK non disponibile nel browser.");
        }

        if (typeof sdk.init === "function") {
          await sdk.init({ version: "2.0", sandbox: true });
        }

        if (typeof sdk.authenticate !== "function") {
          throw new Error("Il client Pi non espone un metodo di autenticazione.");
        }

        const authResult = await sdk.authenticate(["username", "payments"], {
          onIncompletePaymentFound: (payment: unknown) => {
            console.warn("Pagamento incompleto rilevato", payment);
          },
        });

        if (!authResult?.user) {
          throw new Error("Autenticazione Pi non riuscita.");
        }

        const profile: PiUserProfile = {
          uid: authResult.user.uid ?? authResult.user.id ?? "",
          username: authResult.user.username ?? "Pi User",
          accessToken: authResult.accessToken ?? authResult.access_token,
        };

        if (!profile.uid) {
          throw new Error("Identificativo utente Pi mancante.");
        }

        await syncPiProfile(profile);

        if (!active) return;
        setStatus("authenticated");
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError(err instanceof Error ? err.message : "Errore imprevisto durante l'autenticazione.");
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
      {status === "loading" && "Connessione a Pi in corso..."}
      {status === "authenticated" && "Account Pi sincronizzato con Supabase."}
      {status === "error" && error}
    </div>
  );
}
