"use client";

import React from "react";

interface LearningsLayoutProps {
  children: React.ReactNode;
}

export default function LearningsLayout({ children }: LearningsLayoutProps) {
  return (
    <div className="min-h-screen w-full dark:bg-zinc-900">
      <div className="mx-auto flex h-full max-w-7xl flex-col lg:flex-row">
        <main className="flex-1 bg-zinc-50 dark:bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}
