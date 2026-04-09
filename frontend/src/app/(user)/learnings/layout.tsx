"use client";

import React from "react";

interface LearningsLayoutProps {
  children: React.ReactNode;
}

export default function LearningsLayout({ children }: LearningsLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-black">
      {children}
    </div>
  );
}
