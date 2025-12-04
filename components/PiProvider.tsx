// components/PiProvider.tsx
"use client";

import { useEffect, useState, createContext, useContext, type ReactNode } from "react";

declare global {
  interface Window {
    Pi?: any;
  }
}

interface PiContextValue {
  Pi: any | null;
  user: any | null;
  initialized: boolean;
  reauthenticate: () => Promise<any>;
}

const PiContext = createContext<PiContextValue>({
  Pi: null,
  user: null,
  initialized: false,
  reauthenticate: async () => null,
});

export default function PiProvider({ children }: { children: ReactNode }) {
  const [pi, setPi] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  const runAuthentication = async (sdk: any) => {
    if (!sdk) return null;

    setAuthenticating(true);
    try {
      const scopes = ["username", "payments"];
      const authResult = await sdk.authenticate(
        scopes,
        (payment: unknown) => {
          console.warn("Incomplete payment detected", payment);
        }
      );

      setUser(authResult ? authResult.user : null);
      return authResult ?? null;
    } catch (err) {
      console.error("Pi authenticate error:", err);
      setUser(null);
      return null;
    } finally {
      setAuthenticating(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setupPi = async () => {
      if (!window.Pi) return;

      window.Pi.init({
        version: "2.0",
        sandbox: true,
      });

      setPi(window.Pi);
      await runAuthentication(window.Pi);
      setInitialized(true);
    };

    if (window.Pi) {
      setupPi();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => {
      setupPi();
    };
    document.head.appendChild(script);
  }, []);

  return (
    <PiContext.Provider
      value={{
        Pi: pi,
        user,
        initialized: initialized && !authenticating,
        reauthenticate: () => (pi ? runAuthentication(pi) : Promise.resolve(null)),
      }}
    >
      {children}
    </PiContext.Provider>
  );
}

export function usePi() {
  return useContext(PiContext);
}
