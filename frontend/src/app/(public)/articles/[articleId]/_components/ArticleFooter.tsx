// "use client";

// import { BlogArticle } from "@/types";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ArrowLeft,
//   ArrowRight,
//   Heart,
//   MessageCircle,
//   Share2,
//   Bookmark
// } from "lucide-react";
// import Link from "next/link";

// interface ArticleFooterProps {
//   article: BlogArticle;
// }

// export function ArticleFooter({ article }: ArticleFooterProps) {
//   return (
//     <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200/50 dark:border-zinc-800/50">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
//         <div className="space-y-8">
//           {/* Engagement Section */}
//           <div className="text-center">
//             <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
//               Did you find this article helpful?
//             </h3>
//             <div className="flex items-center justify-center space-x-4">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-green-200 dark:border-zinc-600"
//               >
//                 <Heart className="h-5 w-5 mr-2" />
//                 Like this article
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-blue-200 dark:border-zinc-600"
//               >
//                 <MessageCircle className="h-5 w-5 mr-2" />
//                 Leave a comment
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 dark:from-zinc-800 dark:to-zinc-700 dark:hover:from-zinc-700 dark:hover:to-zinc-600 border-purple-200 dark:border-zinc-600"
//               >
//                 <Share2 className="h-5 w-5 mr-2" />
//                 Share
//               </Button>
//             </div>
//           </div>

//           {/* Navigation Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-50 to-blue-50 dark:from-zinc-800 dark:to-zinc-700">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
//                   <ArrowLeft className="h-5 w-5 mr-2" />
//                   Previous Article
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-zinc-600 dark:text-zinc-400 mb-4">
//                   Explore more articles in our collection
//                 </p>
//                 <Link href="/articles">
//                   <Button variant="outline" className="w-full">
//                     Browse Articles
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>

//             <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-700">
//               <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center">
//                   <ArrowRight className="h-5 w-5 mr-2" />
//                   Next Steps
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-zinc-600 dark:text-zinc-400 mb-4">
//                   Continue your learning journey
//                 </p>
//                 <Link href="/courses">
//                   <Button variant="outline" className="w-full">
//                     Explore Courses
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Author Call to Action */}
//           <Card className="border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-700">
//             <CardHeader>
//               <CardTitle className="text-xl font-bold text-zinc-900 dark:text-white">
//                 Written by {article.author?.name || "Our Team"}
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-zinc-600 dark:text-zinc-400 mb-4">
//                 {article.author?.shortSummary || "Passionate about sharing knowledge and helping others learn."}
//               </p>
//               <div className="flex items-center space-x-4">
//                 <Link href={`/authors/${article.authorId}`}>
//                   <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
//                     View Profile
//                   </Button>
//                 </Link>
//                 <Button variant="outline">
//                   <Bookmark className="h-4 w-4 mr-2" />
//                   Follow Author
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Footer Links */}
//           <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-8">
//             <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
//               <div className="text-sm text-zinc-600 dark:text-zinc-400">
//                 © 2024 Coursewave. All rights reserved.
//               </div>
//               <div className="flex items-center space-x-6 text-sm">
//                 <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
//                   Privacy Policy
//                 </Link>
//                 <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
//                   Terms of Service
//                 </Link>
//                 <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
//                   Contact Us
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

/// =========================================================================================
"use client";

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

interface BlogArticle {
  authorId: string;
  author?: {
    name: string;
    shortSummary: string;
  };
}

interface ArticleFooterProps {
  article: BlogArticle;
}

export function ArticleFooter({ article }: ArticleFooterProps) {
  return (
    <footer className="bg-zinc-50 dark:bg-gradient-to-br dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 border-t border-zinc-400 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="space-y-10 lg:space-y-12">
          {/* Engagement Section */}
          <div className="text-center space-y-6">
            <h3 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Did you find this helpful?
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button 
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 rounded-xl px-6 lg:px-8 transition-all duration-200 hover:scale-105 font-semibold"
              >
                <Heart className="h-4 w-4 mr-2" />
                Like Article
              </Button>
              <Button 
                size="lg"
                className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black border-0 rounded-xl px-6 lg:px-8 transition-all duration-200 hover:scale-105 font-semibold"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Comment
              </Button>
              <Button 
                size="lg"
                className="bg-purple-500 hover:bg-purple-600 text-white border-0 rounded-xl px-6 lg:px-8 transition-all duration-200 hover:scale-105 font-semibold"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
            <Card className="group border border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-200 hover:border-blue-500 dark:hover:border-blue-400">
              <CardHeader className="border-b-2 border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base lg:text-lg font-bold text-zinc-900 dark:text-white flex items-center tracking-tight">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                  Previous Article
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-zinc-600 dark:text-zinc-400 mb-5 text-sm lg:text-base">
                  Explore more articles in our collection
                </p>
                <Link href="/articles">
                  <Button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black border-0 rounded-xl font-semibold">
                    Browse Articles
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="group border border-zinc-900 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden transition-all duration-200 hover:border-purple-500 dark:hover:border-purple-400">
              <CardHeader className="border-b-2 border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-base lg:text-lg font-bold text-zinc-900 dark:text-white flex items-center tracking-tight">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl mr-3 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <p className="text-zinc-600 dark:text-zinc-400 mb-5 text-sm lg:text-base">
                  Continue your learning journey
                </p>
                <Link href="/courses">
                  <Button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black border-0 rounded-xl font-semibold">
                    Explore Courses
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Author Call to Action */}
          <Card className="border border-zinc-900 dark:border-zinc-800 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                Written by {article.author?.name || "Our Team"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-50 dark:text-blue-100 mb-6 text-base lg:text-lg">
                {article.author?.shortSummary || "Passionate about sharing knowledge and helping others learn."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href={`/authors/${article.authorId}`}>
                  <Button className="bg-white hover:bg-zinc-100 text-zinc-900 border-0 rounded-xl px-6 font-semibold">
                    View Profile
                  </Button>
                </Link>
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl px-6 backdrop-blur-sm font-semibold">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Follow Author
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="border-t-2 border-zinc-200 dark:border-zinc-800 pt-8 lg:pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                © 2024 Coursewave. All rights reserved.
              </div>
              <div className="flex items-center gap-6 lg:gap-8 text-sm font-medium">
                <Link href="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="/contact" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
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