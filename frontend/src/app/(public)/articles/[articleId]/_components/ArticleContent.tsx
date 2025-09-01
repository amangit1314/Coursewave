"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BlogArticle } from "@/types";
import ArticleAuthorInfo from "./ArticleAuthorInfo";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Clock, 
  Calendar,
  BookOpen
} from "lucide-react";

interface ArticleContentProps {
  article: BlogArticle;
}

export function ArticleContent({ article }: ArticleContentProps) {
  // Parse markdown content
  const parseContent = (content: string) => {
    if (!content) return [];
    
    return content.split('\\n').map((paragraph, index) => {
      const trimmed = paragraph.trim();
      
      if (!trimmed) return { type: 'spacing', key: index };
      
      // Headers
      if (trimmed.startsWith('# ')) {
        return {
          type: 'h1',
          content: trimmed.substring(2),
          key: index
        };
      }
      if (trimmed.startsWith('## ')) {
        return {
          type: 'h2',
          content: trimmed.substring(3),
          key: index
        };
      }
      if (trimmed.startsWith('### ')) {
        return {
          type: 'h3',
          content: trimmed.substring(4),
          key: index
        };
      }
      
      // Regular paragraphs
      return {
        type: 'p',
        content: trimmed,
        key: index
      };
    });
  };

  const contentBlocks = parseContent(article.content || '');

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
        <Image
          src={article.coverImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80"}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Article Header */}
      <div className="p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(article.createdAt || Date.now()).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {article.readTime && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} min read</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <BookOpen className="h-4 w-4" />
              <span>Getting Started</span>
            </div>
          </div>

          {/* Author Info */}
          <ArticleAuthorInfo
            authorId={article.authorId || ""}
            authorProfileImageUrl={article.author?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
            authorName={article.author?.name || "Unknown Author"}
            estimatedReadingTime={article.readTime?.toString() || "5"}
            articleCreatedAtDate={article.createdAt?.toString() || new Date().toISOString()}
          />

          <Separator className="my-6" />

          {/* Engagement Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
                <Eye className="h-4 w-4" />
                <span className="text-sm">{article._count?.views || 0}</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{article._count?.likes || 0}</span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-400">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{article._count?.comments || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Article Content */}
      <div className="px-6 sm:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-lg max-w-none prose-zinc dark:prose-invert prose-headings:text-zinc-900 dark:prose-headings:text-white prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-strong:text-zinc-900 dark:prose-strong:text-white"
        >
          {contentBlocks.map((block) => {
            switch (block.type) {
              case 'h1':
                return (
                  <h1 key={block.key} className="text-3xl font-bold text-zinc-900 dark:text-white mb-6 mt-8 first:mt-0">
                    {block.content}
                  </h1>
                );
              case 'h2':
                return (
                  <h2 key={block.key} className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 mt-8">
                    {block.content}
                  </h2>
                );
              case 'h3':
                return (
                  <h3 key={block.key} className="text-xl font-bold text-zinc-900 dark:text-white mb-3 mt-6">
                    {block.content}
                  </h3>
                );
              case 'p':
                return (
                  <p key={block.key} className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300 mb-6">
                    {block.content}
                  </p>
                );
              case 'spacing':
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