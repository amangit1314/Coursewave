"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User, BookOpen, FileText, MoreVertical, Plus, Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import {
  useAuthorById,
  useAuthorArticles,
  useAuthorCourses,
} from "@/hooks/useAuthors";
import { useFollowUnfollowAuthor, useCheckFollowingStatus } from "@/hooks/useArticles";
import { useUserStore } from "@/zustand/userStore";
import { ReportAuthorDialog } from "./_components/ReportAuthorDialog";
import toast from "react-hot-toast";

const AuthorPage = () => {
  const params = useParams<{ id: string }>();
  const authorId = params?.id;
  const { user } = useUserStore();

  // Fetch author info
  const { data: author, isLoading: isAuthorLoading, error: authorError } = useAuthorById(authorId);
  const { data: articles = [], isLoading: isArticlesLoading } = useAuthorArticles(authorId);
  const { data: courses = [], isLoading: isCoursesLoading } = useAuthorCourses(authorId);

  // Follow logic
  const { data: followingStatus } = useCheckFollowingStatus(authorId || "");
  const { mutate: followUnfollow, isPending: isFollowPending } = useFollowUnfollowAuthor();

  const isFollowing = followingStatus?.isFollowing ?? false;

  // Pagination for articles
  const [showAllArticles, setShowAllArticles] = useState(false);
  const displayedArticles = showAllArticles ? articles : articles.slice(0, 3);

  const handleFollowToggle = () => {
    if (!user) {
      toast.error("Please login to follow authors");
      return;
    }
    if (!authorId) return;

    followUnfollow(authorId, {
      onSuccess: (data) => {
        toast.success(data.message ?? "");
      },
      onError: () => {
        toast.error("Failed to update follow status");
      }
    });
  };

  if (isAuthorLoading) {
    return <div className="min-h-[300px] flex items-center justify-center">Loading author...</div>;
  }
  if (!author || authorError) {
    return <div className="min-h-[300px] flex items-center justify-center text-red-500">Author not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-zinc-900 dark:to-zinc-800/50">
      {/* Header Section */}
      <div className="relative">
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white dark:border-zinc-800 shadow-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                    {author.profileImageUrl ? (
                      <Image
                        src={author.profileImageUrl}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-zinc-800 rounded-full" />
                </div>
              </div>

              {/* Author Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className={`${dmSans.className} text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white mb-2`}>
                      {author.name}
                    </h1>

                    {/* Expertise/skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(author.instructorProfile?.expertise ?? []).map((skill: any, idx: number) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-0 text-xs px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {/* Add stats if available */}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleFollowToggle}
                      disabled={isFollowPending}
                      className={cn(
                        "px-6 rounded-xl transition-all duration-200",
                        isFollowing
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      )}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="rounded-xl">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <ReportAuthorDialog authorId={authorId || ""} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {author.instructorProfile?.bio || author.about || "No bio yet."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="bg-white dark:bg-zinc-800 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <TabsTrigger
              value="articles"
              className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Articles ({articles.length})
            </TabsTrigger>
            {courses.length > 0 && (
              <TabsTrigger
                value="courses"
                className="rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Courses ({courses.length})
              </TabsTrigger>
            )}
          </TabsList>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            {isArticlesLoading ? (
              <div>Loading articles...</div>
            ) : (
              <div className="grid gap-6">
                {displayedArticles.map((article: any) => (
                  <Card
                    key={article.id}
                    className="border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-zinc-500 dark:text-zinc-400">
                              {(article.publishedAt && new Date(article.publishedAt).toLocaleDateString()) || ""}
                            </span>
                          </div>
                          <h3
                            className={`${dmSans.className} text-lg font-semibold text-zinc-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer`}
                          >
                            {article.title}
                          </h3>
                          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Show More/Less Button */}
            {articles.length > 3 && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => setShowAllArticles((v) => !v)}
                  className="rounded-xl"
                >
                  {showAllArticles ? "Show Less Articles" : `Show All Articles (${articles.length})`}
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Courses Tab */}
          {courses.length > 0 && (
            <TabsContent value="courses" className="space-y-6">
              {isCoursesLoading ? (
                <div>Loading courses...</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {courses.map((course: any) => (
                    <Card
                      key={course.id}
                      className="border-zinc-200 dark:border-zinc-700 hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 overflow-hidden"
                    >
                      <div className="flex">
                        {course.imageUrl && (
                          <div className="w-24 h-24 relative flex-shrink-0">
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4 flex-1">
                          <h4
                            className={`${dmSans.className} font-semibold text-zinc-900 dark:text-white mb-1 line-clamp-2`}
                          >
                            {course.title}
                          </h4>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default AuthorPage;
