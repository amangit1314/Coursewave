"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import LandingPageHeader from "@/components/LandingPage/header";
import { ThemeProvider } from "@/providers/theme-provider";
import { GlobalQueryClientProvider } from "@/providers/query-client-provider";
import { usePathname, useRouter } from "next/navigation";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

// Fix for metadata, should be a default export object
const metadata: Metadata = {
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
  const router = useRouter();
  const pathname = usePathname();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const [hideSidebar, setHideSidebar] = useState(false);

  useEffect(() => {
    // Update the sidebar visibility based on the current path
    setHideSidebar(
      !!pathname.match(/courses\/enrolledCourses\/(undefined|null)/),
    );
  }, [pathname]);

  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalQueryClientProvider>
            <div className="dark:bg-zinc-800">
              {/* {!hideSidebar && (
                <LandingPageHeader handleLoginClick={handleLoginClick} />
              )} */}
              {children}
            </div>
          </GlobalQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
