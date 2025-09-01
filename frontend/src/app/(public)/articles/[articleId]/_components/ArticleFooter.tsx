"use client";

import { BlogArticle } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Heart, 
  MessageCircle, 
  Share2,
  Bookmark
} from "lucide-react";
import Link from "next/link";

interface ArticleFooterProps {
  article: BlogArticle;
}

export function ArticleFooter({ article }: ArticleFooterProps) {
  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200/50 dark:border-zinc-800/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Engagement Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Did you find this article helpful?
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-green-200 dark:border-zinc-600"
              >
                <Heart className="h-5 w-5 mr-2" />
                Like this article
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-blue-200 dark:border-zinc-600"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Leave a comment
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-purple-200 dark:border-zinc-600"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-50 to-blue-50 dark:from-zinc-800 dark:to-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous Article
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Explore more articles in our collection
                </p>
                <Link href="/articles">
                  <Button variant="outline" className="w-full">
                    Browse Articles
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  Continue your learning journey
                </p>
                <Link href="/courses">
                  <Button variant="outline" className="w-full">
                    Explore Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Author Call to Action */}
          <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-700">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                Written by {article.author?.name || "Our Team"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {article.author?.shortSummary || "Passionate about sharing knowledge and helping others learn."}
              </p>
              <div className="flex items-center space-x-4">
                <Link href={`/authors/${article.authorId}`}>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                    View Profile
                  </Button>
                </Link>
                <Button variant="outline">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Follow Author
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                © 2024 Coursewave. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 