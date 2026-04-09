"use client";

import { Footer } from "@/components/landing-page/footer";
import { usePathname } from "next/navigation";

interface ArticleLayoutProps {
  children: React.ReactNode;
}

export default function ArticleLayout({ children }: ArticleLayoutProps) {
  const pathname = usePathname();

  // Check if the URL contains "courseContent" directly within "/courses"
  const hideFooter = pathname === "/articles" || pathname.endsWith("/edit");

  return (
    <div className="h-screen flex flex-col dark:bg-zinc-900">
      <div className="flex-1">{children}</div>
      {hideFooter ? <div></div> : <Footer />}
    </div>
  );
}
