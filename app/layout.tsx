import "./globals.css";
import type { ReactNode } from "react";
import type { Viewport, Metadata } from "next";

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
      <body className="min-h-screen bg-gray-900 text-white antialiased">
        <PiProvider>
          <IOUProvider>{children}</IOUProvider>
        </PiProvider>
      </body>
    </html>
  );
}
