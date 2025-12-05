// components/PiProvider.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  useMemo,
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
  piBrowser: boolean;
  piReady: boolean;
  reauthenticate: () => Promise<{ user: any; accessToken: string } | null>;
}

const PiContext = createContext<PiContextValue>({
  Pi: null,
  user: null,
  initialized: false,
  piBrowser: false,
  piReady: false,
  reauthenticate: async () => null,
});

const sdkScriptSrc = "https://sdk.minepi.com/pi-sdk.js";

const detectPiBrowser = () => {
  if (typeof navigator === "undefined") return false;

  const ua = navigator.userAgent?.toLowerCase?.() ?? "";
  const userAgentHint = /pibrowser/.test(ua) || ua.includes("pi browser");

  const brandHints = (navigator as any).userAgentData?.brands ?? [];
  const brandMatches = Array.isArray(brandHints)
    ? brandHints.some((brand: any) => /pibrowser/i.test(brand?.brand ?? ""))
    : false;

  const hasReactNativeBridge =
    typeof window !== "undefined" &&
    typeof (window as any).ReactNativeWebView !== "undefined";

  const piNamespacePresent =
    typeof window !== "undefined" && typeof window.Pi === "object";

  // Some Samsung WebView builds strip UA hints; keep the check lenient if we
  // already see the RN bridge or Pi namespace.
  return (
    userAgentHint ||
    brandMatches ||
    piNamespacePresent ||
    (hasReactNativeBridge && /samsung/i.test(ua))
  );
};

export default function PiProvider({ children }: { children: ReactNode }) {
  const [pi, setPi] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [piBrowser, setPiBrowser] = useState(false);
  const [piReady, setPiReady] = useState(false);
  const initCalledRef = useRef(false);

  const runAuthentication = async (
    sdk: any
  ): Promise<{ user: any; accessToken: string } | null> => {
    if (!sdk || typeof sdk?.authenticate !== "function") return null;

    setAuthenticating(true);
    try {
      const scopes = ["username", "payments"];
      const authResult = await sdk.authenticate(
        scopes,
        (payment: unknown) => {
          console.warn("Incomplete payment detected", payment);
        }
      );

      const accessToken = authResult?.accessToken ?? authResult?.access_token;
      const user = authResult?.user ?? null;

      if (!user || !accessToken) {
        throw new Error("Pi authentication did not return a user or access token.");
      }

      setUser(user);
      return { user, accessToken };
    } catch (err) {
      console.error("Pi authenticate error:", err);
      setUser(null);
      return null;
    } finally {
      setAuthenticating(false);
    }
  };

  const waitForPiSdk = () =>
    new Promise<any | null>((resolve) => {
      if (typeof window === "undefined") return resolve(null);

      let resolved = false;
      const finish = (sdk: any | null) => {
        if (resolved) return;
        resolved = true;
        cleanup();
        resolve(sdk);
      };

      const ensureScript = () => {
        const existingScript = document.querySelector(`script[src="${sdkScriptSrc}"]`);
        if (existingScript) return;
        const script = document.createElement("script");
        script.src = sdkScriptSrc;
        script.async = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      };

      const cleanup = () => {
        window.removeEventListener("pi_activated", activatedListener);
        window.clearInterval(pollId);
        window.clearTimeout(timeoutId);
      };

      const activatedListener = () => finish(window.Pi ?? null);

      ensureScript();

      const pollId = window.setInterval(() => {
        if (window.Pi) finish(window.Pi);
        else ensureScript();
      }, 250);

      window.addEventListener("pi_activated", activatedListener);

      const timeoutId = window.setTimeout(() => finish(window.Pi ?? null), 20000);
    });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    const setupPi = async () => {
      const inferredPiBrowser = detectPiBrowser();
      setPiBrowser(inferredPiBrowser);

      const sdk = await waitForPiSdk();
      if (cancelled) return;

      const sdkPresent = Boolean(sdk);

      if (!sdkPresent) {
        setPi(null);
        setPiReady(false);
        if (!inferredPiBrowser) {
          setInitialized(true);
        }
        return;
      }

      try {
        const sandboxFlag =
          process.env.NEXT_PUBLIC_PI_SANDBOX !== "false" ? true : false;

        if (!initCalledRef.current && typeof sdk?.init === "function") {
          await sdk.init({
            version: "2.0",
            sandbox: sandboxFlag,
          });
          initCalledRef.current = true;
        }

        const ready = Boolean(sdk?.authenticate && sdk?.createPayment);
        setPiReady(ready);

        if (!ready) {
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
      value={useMemo(
        () => ({
          Pi: pi,
          user,
          initialized: initialized && !authenticating,
          piBrowser: piBrowser || Boolean(pi),
          piReady,
          reauthenticate: () => (pi ? runAuthentication(pi) : Promise.resolve(null)),
        }),
        [pi, user, initialized, authenticating, piBrowser, piReady]
      )}
    >
      {children}
    </PiContext.Provider>
  );
}

export function usePi() {
  return useContext(PiContext);
}
