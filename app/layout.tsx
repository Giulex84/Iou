import "./globals.css";
import type { ReactNode } from "react";
import type { Viewport, Metadata } from "next";
import Script from "next/script";

import PiProvider from "@/components/PiProvider";
import IOUProvider from "@/components/providers/IOUProvider";

export const metadata: Metadata = {
  title: "IOU",
  description: "Track and manage your IOUs across currencies.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="pi-sdk"
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-screen bg-gray-900 text-white antialiased">
        <PiProvider>
          <IOUProvider>{children}</IOUProvider>
        </PiProvider>
      </body>
    </html>
  );
}
