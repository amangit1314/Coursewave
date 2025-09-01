"use client";

import { BlogArticle } from "@/types";
// import { ArticleAuthorCard } from "./article-author-card";
// import { MoreFromAuthor } from "./more-from-author";
// import { RecommendedFromCoursewave } from "./recommended-from-coursewave";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleSidebarProps {
  article: BlogArticle;
}

export function ArticleSidebar({ article }: ArticleSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Article Stats */}
      <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
            Article Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
              <Eye className="h-4 w-4" />
              <span className="text-sm">
                {article._count?.views || 0} views
              </span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
              <Heart className="h-4 w-4" />
              <span className="text-sm">
                {article._count?.likes || 0} likes
              </span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">
                {article._count?.comments || 0} comments
              </span>
            </div>
            <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {`${Math.ceil(article.readTime / 60)}
              `}{" "}
                min read
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {new Date(article.createdAt || Date.now()).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-blue-200 dark:border-zinc-600"
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save Article
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-green-200 dark:border-zinc-600"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Article
          </Button>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            >
              Getting Started
            </Badge>
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
            >
              Tutorial
            </Badge>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            >
              Beginner
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Author Card */}
      {/* <ArticleAuthorCard
        authorId={article.authorId || ""}
        authorImage={article.author?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
        authorName={article.author?.name || "Unknown Author"}
        authorBio={article.author?.shortSummary || "Passionate writer sharing knowledge and insights."}
        authorFollowers={0}
        haveAlreadyFollowed={false}
      /> */}

      {/* More from Author */}
      {/* <MoreFromAuthor authorId={article.authorId || ""} /> */}

      {/* Recommended Articles */}
      {/* <RecommendedFromCoursewave /> */}
    </div>
  );
}
