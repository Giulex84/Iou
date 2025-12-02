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
}

const PiContext = createContext<PiContextValue>({
  Pi: null,
  user: null,
  initialized: false,
});

export default function PiProvider({ children }: { children: ReactNode }) {
  const [pi, setPi] = useState<any | null>(null);
  const [user, useUser] = useState<any | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const setupPi = async () => {
      if (!window.Pi) return;

      window.Pi.init({
        version: "2.0",
        sandbox: true,
      });

      try {
        const scopes = ["payments"];
        window.Pi.authenticate(scopes, (authResult: any) => {
          useUser(authResult ? authResult.user : null);
        });
      } catch (err) {
        console.error("Pi authenticate error", err);
      }

      setPi(window.Pi);
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
    <PiContext.Provider value={{ Pi: pi, user, initialized }}>
      {children}
    </PiContext.Provider>
  );
}

export function usePi() {
  return useContext(PiContext);
}
