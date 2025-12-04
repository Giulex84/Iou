// components/PiProvider.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
} from "react";

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
  const initCalledRef = useRef(false);

  const isPiBrowser =
    typeof navigator !== "undefined" && /pibrowser/i.test(navigator.userAgent);

  const runAuthentication = async (sdk: any) => {
    if (!sdk) return null;
    if (!isPiBrowser) {
      setUser(null);
      return null;
    }

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

    let cancelled = false;

    const waitForPiSdk = () =>
      new Promise<any | null>((resolve) => {
        if (window.Pi) return resolve(window.Pi);

        // Ensure the SDK script exists even if Next.js hydration skipped it for some reason.
        const existingScript = document.querySelector(
          'script[src="https://sdk.minepi.com/pi-sdk.js"]'
        );
        if (!existingScript) {
          const script = document.createElement("script");
          script.src = "https://sdk.minepi.com/pi-sdk.js";
          script.async = true;
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
        }

        const timeout = window.setTimeout(() => resolve(null), 10000);
        const poll = window.setInterval(() => {
          if (window.Pi) {
            window.clearTimeout(timeout);
            window.clearInterval(poll);
            resolve(window.Pi);
          }
        }, 150);
      });

    const setupPi = async () => {
      const sdk = await waitForPiSdk();
      if (!sdk || cancelled) {
        setInitialized(true);
        return;
      }

      try {
        const sandboxFlag =
          process.env.NEXT_PUBLIC_PI_SANDBOX !== "false" ? true : false;
        if (!initCalledRef.current) {
          await sdk.init({
            version: "2.0",
            sandbox: sandboxFlag,
          });
          initCalledRef.current = true;
        }
        if (!sdk.authenticate || !sdk.createPayment) {
          throw new Error("Pi SDK is loaded but missing required methods.");
        }
        setPi(sdk);
        await runAuthentication(sdk);
      } catch (err) {
        console.error("Pi SDK initialization failed", err);
      } finally {
        if (!cancelled) setInitialized(true);
      }
    };

    void setupPi();

    return () => {
      cancelled = true;
    };
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
