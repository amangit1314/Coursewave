"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuthorById, useAuthorArticles, useAuthorCourses } from "@/hooks/useAuthors";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import {
  Loader2,
  ArrowLeft,
  BookOpen,
  GraduationCap,
  User,
} from "lucide-react";

const InstructorPage = () => {
  const params = useParams();
  const instructorId = params?.instructorId as string;

  const { data: author, isPending, isError } = useAuthorById(instructorId);
  const { data: articles } = useAuthorArticles(instructorId);
  const { data: courses } = useAuthorCourses(instructorId);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load instructor profile.</p>
          <Link href="/instructors">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Instructors
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pt-[80px] pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/instructors">
            <Button variant="ghost" size="sm" className="text-zinc-600 dark:text-zinc-400">
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Instructors
            </Button>
          </Link>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
          {author.profileImageUrl ? (
            <Image
              src={author.profileImageUrl}
              alt={author.name}
              width={120}
              height={120}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1
              className={cn(
                "text-3xl font-bold text-zinc-900 dark:text-white mb-2",
                dmSans.className
              )}
            >
              {author.name}
            </h1>
            {author.about && (
              <p className="text-zinc-600 dark:text-zinc-400 mb-4 max-w-xl">
                {author.about}
              </p>
            )}
            <div className="flex gap-3 justify-center sm:justify-start">
              {articles && articles.length > 0 && (
                <Badge variant="outline">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {articles.length} articles
                </Badge>
              )}
              {courses && courses.length > 0 && (
                <Badge variant="outline">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  {courses.length} courses
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        {courses && courses.length > 0 && (
          <section className="mb-10">
            <h2
              className={cn(
                "text-xl font-bold text-zinc-900 dark:text-white mb-4",
                dmSans.className
              )}
            >
              Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all"
                >
                  <CardContent className="p-4">
                    {course.imageUrl && (
                      <div className="relative w-full h-36 rounded-lg overflow-hidden mb-3">
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm line-clamp-2">
                      {course.title}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        {articles && articles.length > 0 && (
          <section>
            <h2
              className={cn(
                "text-xl font-bold text-zinc-900 dark:text-white mb-4",
                dmSans.className
              )}
            >
              Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {articles.map((article) => (
                <Card
                  key={article.id}
                  className="border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all"
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-sm mb-1 line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {(!courses || courses.length === 0) && (!articles || articles.length === 0) && (
          <div className="text-center py-12">
            <p className="text-zinc-500 dark:text-zinc-400">
              This instructor hasn't published any courses or articles yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorPage;
