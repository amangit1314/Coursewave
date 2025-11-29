/* eslint-disable @typescript-eslint/no-unused-vars */
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { RootProvider } from "@/providers/root-provider";
import { poppins } from "@/lib/config/fonts";
import { Toaster } from "react-hot-toast";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Coursewave - Unlock Your Learning Potential",
    template: "%s | Coursewave",
  },
  description: "Unlock your infinite learning potential with Coursewave. Access courses, articles, and interactive learning experiences.",
  keywords: ["online courses", "learning platform", "education", "e-learning", "tutorials", "articles"],
  authors: [{ name: "Coursewave" }],
  creator: "Coursewave",
  publisher: "Coursewave",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Coursewave - Unlock Your Learning Potential',
    description: 'Unlock your infinite learning potential with Coursewave.',
    siteName: 'Coursewave',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coursewave - Unlock Your Learning Potential',
    description: 'Unlock your infinite learning potential with Coursewave.',
  },
  icons: {
    icon: "/courseWaveFaviconColored.ico",
    shortcut: "/courseWaveFaviconColored.ico",
    apple: "/courseWaveFaviconColored.ico",
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <Toaster />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
