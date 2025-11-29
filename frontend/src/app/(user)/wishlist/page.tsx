"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";
import {
  Heart,
  Clock,
  Star,
  ShoppingCart,
  Trash2,
  Zap,
  Sparkles,
  Award,
  TrendingUp,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

// Hooks
import {
  useWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
  useWishlistCount,
} from "@/hooks/useWishlist";
import { useCart, useAddToCart } from "@/hooks/useCart";
import { useUserStore } from "@/zustand/userStore";
import toast from "react-hot-toast";
import { UseMutateFunction } from "@tanstack/react-query";
import { CartItem } from "@/lib/api/services/cartService";
import WishlistItem from "./_components/WihslistItem";

const WishlistPage: React.FC = () => {
  const router = useRouter();
  const { user } = useUserStore();

  // Wishlist hooks
  const { data: wishlist = [], isLoading, isError } = useWishlist();

  const { mutate: clearWishlist } = useClearWishlist();
  const { data: wishlistCount } = useWishlistCount();

  // Cart hooks for in-cart status & add to cart
  const { data: cart } = useCart();
  const { mutate: addToCart, isPending: addingToCart } = useAddToCart();

  // Utility to check if course is in cart
  const isInCart = (courseId: string) =>
    cart?.CartItem?.some((item: any) => item.courseId === courseId);

  // "Move All to Cart" logic
  const moveAllToCart = () => {
    wishlist.forEach((course) => {
      if (!isInCart(course.id)) addToCart(course.id);
    });
  };

  React.useEffect(() => {
    if (!user || !user.id) {
      toast.error("Please login to access wishlist");
      router.replace("/login");
    }
  }, [user, router]);

  if (!user || !user.id) {
    // toast.error("Please login to access wishlist");
    // router.push( = "/login";

    // Optional: simple loading state while redirecting
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
        <p>Redirecting to login...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your wishlist...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Failed to load wishlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 py-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/5 dark:bg-purple-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 px-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 relative">
          <div className="flex items-center justify-start gap-4">
            {/* Back Button */}
            <Link href="/browse" className="cursor-pointer">
              <Button
                variant="ghost"
                size="sm"
                className="group relative h-11 w-11 rounded-2xl bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border border-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <IoMdArrowRoundBack className="relative h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="sr-only">Back to browse</span>
              </Button>
            </Link>

            {/* Title & Count */}
            <div className="flex flex-row justify-start items-center space-x-2 text-center">
              <div className="inline-flex items-center gap-2">
                <h1
                  className={cn(
                    "text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent",
                    dmSans.className
                  )}
                >
                  Wishlist
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-base flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-800 px-3 py-1 rounded-full border border-gray-200 dark:border-zinc-700 shadow-sm">
                  <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {wishlistCount ?? wishlist.length}
                  </span>
                  <span>{wishlist.length === 1 ? "course" : "courses"}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Add All to Cart Button */}
          {wishlist.length > 0 && (
            <Button
              onClick={moveAllToCart}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Add All to Cart
            </Button>
          )}
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlist.map((item, index) => (
            <WishlistItem
              key={index}
              item={item}
              index={index}
              isInCart={isInCart}
              addingToCart={addingToCart}
              addToCart={addToCart}
            />
          ))}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <Card className="border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl text-center py-20 max-w-2xl mx-auto mt-12">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-950 dark:to-pink-950 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-12 w-12 text-red-500" fill="currentColor" />
              </div>
              <h3
                className={cn(
                  "text-2xl font-bold text-gray-900 dark:text-white mb-3",
                  dmSans.className
                )}
              >
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start building your learning journey! Save courses you're
                interested in and come back to them later.
              </p>
              <div className="flex gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Browse Courses
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-gray-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all hover:scale-105 px-8 py-6 text-lg font-semibold"
                >
                  View Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
