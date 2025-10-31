/* eslint-disable @typescript-eslint/no-unused-vars */

// 'use client';

import "./globals.css";
import type { Metadata } from "next";
import { RootProvider } from "@/providers/root-provider";
import { DM_Sans, Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import CurrencyDetector from "@/components/CurrencyDetector";

export const metadata: Metadata = {
  title: "Coursewave",
  description: "Unlock your infinite learning potential with Coursewave.",
  icons: {
    icon: "/courseWaveFaviconColored.png",
    shortcut: "/courseWaveFaviconColored.png",
  },
};

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins", // Add this line
});

const dmSans = DM_Sans({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans", // Add this line
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${poppins.variable} ${dmSans.variable}`}
    >
      <body className="font-poppins" suppressHydrationWarning>
        {/* <RootProvider>{children}</RootProvider> */}
        <RootProvider>
          <CurrencyDetector />
          {children}
          <Toaster position="top-right" />
        </RootProvider>
      </body>
    </html>
  );
}
