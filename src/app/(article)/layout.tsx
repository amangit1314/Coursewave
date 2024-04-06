"use client";

import Footer from "@/components/LandingPage/footer";
import { usePathname } from "next/navigation";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  const pathname = usePathname();

  // Check if the URL contains "courseContent" directly within "/courses"
  const hideFooter = pathname.includes("courseContent");

  return (
    <div className="min-h-screen h-full dark:bg-zinc-900">
      <div className="h-full">{children}</div>
      {hideFooter ? <div></div> : <Footer />}
    </div>
  );
}
