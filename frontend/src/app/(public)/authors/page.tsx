
"use client";

import React from "react";
import { useAuthors } from "@/hooks/useAuthors";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";

export default function AuthorPage() {
  const { data: authors, isLoading, error } = useAuthors();

  if (isLoading) {
    return (
      <div className="max-w-7xl overflow-x-hidden px-10 py-8">
        <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
          Authors
        </p>
        <p className="text-base text-zinc-600 dark:text-gray-300">
          Browse authors and their articles
        </p>
        <div className="my-8 grid grid-cols-2 gap-8 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl overflow-x-hidden px-10 py-8">
        <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
          Authors
        </p>
        <p className="my-8 text-zinc-600 dark:text-gray-300">
          Failed to load authors. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl overflow-x-hidden px-10 py-8">
      <p className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-white">
        Authors
      </p>
      <p className="text-base text-zinc-600 dark:text-gray-300">
        Browse authors and their articles
      </p>

      <div>
        {authors && authors.length > 0 ? (
          <div className="my-8 grid grid-cols-2 gap-8 md:grid-cols-3">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.slug}`}
                className="group flex flex-col items-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-6 transition-shadow hover:shadow-lg"
              >
                <div className="relative h-20 w-20 mb-4 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-700">
                  {author.profileImageUrl ? (
                    <Image
                      src={author.profileImageUrl}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-zinc-400">
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {author.name}
                </h3>
                {author.about && (
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 text-center line-clamp-2">
                    {author.about}
                  </p>
                )}
                <div className="mt-3 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  {author.authoredBlogs && author.authoredBlogs.length > 0 && (
                    <span>{author.authoredBlogs.length} articles</span>
                  )}
                  {author.instructorProfile?.courses &&
                    author.instructorProfile.courses.length > 0 && (
                      <span>
                        {author.instructorProfile.courses.length} courses
                      </span>
                    )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="my-8 text-zinc-600 dark:text-gray-300">
            No authors found yet.
          </div>
        )}
      </div>
    </div>
  );
}
