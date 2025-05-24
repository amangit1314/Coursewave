/* eslint-disable @typescript-eslint/no-unused-vars */
import './globals.css'
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { RootProvider } from "@/providers/root-provider";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coursewave",
  description: "Unlock your infinite learning potential with Coursewave.",
  icons: {
    icon: "/courseWaveFaviconColored.ico",
    shortcut: "/courseWaveFaviconColored.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
