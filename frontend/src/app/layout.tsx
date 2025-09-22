/* eslint-disable @typescript-eslint/no-unused-vars */
import "./globals.css";
import type { Metadata } from "next";
import { RootProvider } from "@/providers/root-provider";
import { DM_Sans, Poppins } from "next/font/google";

export const metadata: Metadata = {
  title: "Coursewave",
  description: "Unlock your infinite learning potential with Coursewave.",
  icons: {
    icon: "/courseWaveFaviconColored.ico",
    shortcut: "/courseWaveFaviconColored.ico",
  },
};

export const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins", // Add this line
});

export const dmSans = DM_Sans({
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
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${dmSans.variable}`}>
      <body className="font-poppins" suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}