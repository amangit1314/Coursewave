// interface LearningsLayoutProps {
//   children: React.ReactNode;
// }

// export default function LearningsLayout({ children }: LearningsLayoutProps) {
//   return (
//     <div className="h-full min-h-screen dark:bg-zinc-900">
//       <div className="mx-auto h-full max-w-3xl items-center px-[1.5xl]">
//         {children}
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, FileText, Notebook, Video, ListChecks } from "lucide-react";

interface LearningsLayoutProps {
  children: React.ReactNode;
}

export default function LearningsLayout({ children }: LearningsLayoutProps) {
  return (
    <div className="min-h-screen w-full dark:bg-zinc-900">
      <div className="mx-auto flex h-full max-w-7xl flex-col lg:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:w-72 lg:border-r lg:border-b-0">
          <Tabs defaultValue="chapters" className="w-full">
            <TabsList className="flex w-full flex-row justify-around lg:flex-col lg:items-stretch lg:gap-2 lg:px-4 lg:py-6">
              <TabsTrigger value="chapters" className="flex items-center gap-2">
                <BookOpen size={16} /> Chapters
              </TabsTrigger>
              <TabsTrigger value="resources" className="flex items-center gap-2">
                <FileText size={16} /> Resources
              </TabsTrigger>
              <TabsTrigger value="notes" className="flex items-center gap-2">
                <Notebook size={16} /> Notes
              </TabsTrigger>
            </TabsList>

            {/* Sidebar Tab Content */}
            <div className="hidden lg:block">
              <TabsContent value="chapters" className="p-4">
                {/* Example chapter list */}
                <ul className="space-y-2">
                  <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    📺 Chapter 1: Introduction
                  </li>
                  <li className="cursor-pointer rounded-md px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    📺 Chapter 2: Core Concepts
                  </li>
                </ul>
              </TabsContent>
              <TabsContent value="resources" className="p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Downloadable resources will appear here.
                </p>
              </TabsContent>
              <TabsContent value="notes" className="p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Your saved notes will appear here.
                </p>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 bg-zinc-50 px-4 py-6 dark:bg-zinc-900 lg:px-8">
          <div className="space-y-8">
            {/* Top Section: Video/Quiz */}
            <section className="w-full rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
              <div className="flex items-center gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-700">
                <Video size={18} className="text-blue-500" />
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                  Chapter Video
                </h2>
              </div>
              <div className="mt-4 aspect-video w-full rounded-md bg-zinc-200 dark:bg-zinc-700">
                {/* Embed video player */}
              </div>
            </section>

            {/* Chapter Description */}
            <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
              <h3 className="mb-2 text-base font-semibold text-zinc-800 dark:text-white">
                Description
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                This chapter introduces the fundamentals of the course. You'll
                learn the basics and prepare for deeper concepts.
              </p>
            </section>

            {/* AI Summary */}
            <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-zinc-800 dark:text-white">
                <ListChecks size={16} className="text-green-500" />
                AI Summary
              </h3>
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                🔹 Key takeaway 1  
                🔹 Key takeaway 2  
                🔹 Key takeaway 3
              </p>
            </section>

            {/* Notes */}
            <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
              <h3 className="mb-2 text-base font-semibold text-zinc-800 dark:text-white">
                Notes
              </h3>
              <textarea
                placeholder="Write your notes here..."
                className="w-full rounded-md border border-zinc-300 bg-transparent p-2 text-sm text-zinc-800 dark:border-zinc-700 dark:text-white"
                rows={4}
              />
            </section>

            {/* Resources */}
            <section className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
              <h3 className="mb-2 text-base font-semibold text-zinc-800 dark:text-white">
                Resources
              </h3>
              <ul className="list-inside list-disc text-sm text-blue-600 dark:text-blue-400">
                <li>
                  <a href="#">Download PDF Notes</a>
                </li>
                <li>
                  <a href="#">Reference Article</a>
                </li>
              </ul>
            </section>

            {/* Inject children */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
