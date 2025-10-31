"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BlogArticle } from "@/types";
import ArticleAuthorInfo from "./ArticleAuthorInfo";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Calendar,
  BookOpen,
} from "lucide-react";
import { IMAGES } from "@/constants/images";

interface ArticleContentProps {
  article: BlogArticle;
}

export function ArticleContent({ article }: ArticleContentProps) {
  // Parse markdown content
  const parseContent = (content: string) => {
    if (!content) return [];

    return content.split("\\n").map((paragraph, index) => {
      const trimmed = paragraph.trim();

      if (!trimmed) return { type: "spacing", key: index };

      // Headers
      if (trimmed.startsWith("# ")) {
        return {
          type: "h1",
          content: trimmed.substring(2),
          key: index,
        };
      }
      if (trimmed.startsWith("## ")) {
        return {
          type: "h2",
          content: trimmed.substring(3),
          key: index,
        };
      }
      if (trimmed.startsWith("### ")) {
        return {
          type: "h3",
          content: trimmed.substring(4),
          key: index,
        };
      }

      // Regular paragraphs
      return {
        type: "p",
        content: trimmed,
        key: index,
      };
    });
  };

  const contentBlocks = parseContent(article.content || "");

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-900 dark:border-zinc-800 overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-[32rem] w-full overflow-hidden">
        
        <Image
          src={
            article.coverImage ||
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"
          }
          alt={article.title ?? "No image available"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6">
          <Badge className="bg-white/95 dark:bg-zinc-900/95 text-zinc-900 dark:text-white border border-zinc-900 dark:border-white backdrop-blur-sm px-4 py-2 text-sm font-bold rounded-full">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            Getting Started
          </Badge>
        </div>
      </div>

      {/* Article Header */}
      <div className="p-6 sm:p-8 lg:p-10 border-b-2 border-zinc-100 dark:border-zinc-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-zinc-900 dark:text-white leading-[1.1] tracking-tight">
            {article.title}
          </h1>
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
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

            {article.readTime && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                <Clock className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {Math.ceil(article.readTime / 60)} min read
                </span>
              </div>
            )}
          </div>

          {/* Author Info */}  
          <ArticleAuthorInfo
            authorId={article?.authorId ?? ""}
            authorProfileImageUrl={
              article?.author?.profileImageUrl ?? IMAGES.SAMPLE_PERSON_1
            }
            authorName={article?.author?.name ?? "Unknown"}
            estimatedReadingTime={article?.readTime?.toString() ?? "N/A"}
            articleCreatedAtDate={article?.createdAt?.toString() ?? "Unknown"}
            blogId={article?.id} // Add this line
          />
          
          {/* Engagement Stats */}
          {/* <div className="flex items-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Eye className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {article._count?.views || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Heart className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {article._count?.BlogLike || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <MessageCircle className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                {article._count?.comments || 0}
              </span>
            </div>
          </div> */}
        </motion.div>
      </div>

      {/* Article Content */}
      <div className="px-6 sm:px-8 lg:px-12 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none prose-zinc dark:prose-invert"
        >
          {contentBlocks.map((block) => {
            switch (block.type) {
              case "h1":
                return (
                  <h1
                    key={block.key}
                    className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-6 mt-12 first:mt-0 tracking-tight"
                  >
                    {block.content}
                  </h1>
                );
              case "h2":
                return (
                  <h2
                    key={block.key}
                    className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-5 mt-10 tracking-tight"
                  >
                    {block.content}
                  </h2>
                );
              case "h3":
                return (
                  <h3
                    key={block.key}
                    className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8 tracking-tight"
                  >
                    {block.content}
                  </h3>
                );
              case "p":
                return (
                  <p
                    key={block.key}
                    className="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6"
                  >
                    {block.content}
                  </p>
                );
              case "spacing":
                return <div key={block.key} className="h-4" />;
              default:
                return null;
            }
          })}
        </motion.div>
      </div>
    </article>
  );
}
