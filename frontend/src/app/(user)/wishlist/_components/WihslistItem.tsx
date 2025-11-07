"use client";

import React from "react";
import Image from "next/image";
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
} from "lucide-react";

// Hooks
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";

import { UseMutateFunction } from "@tanstack/react-query";
import { CartItem } from "@/lib/api/services/cartService";

type Props = {
  item: any;
  index: number;
  isInCart: (courseId: string) => boolean | undefined;
  addingToCart: boolean;
  addToCart: UseMutateFunction<CartItem, unknown, string, unknown>;
};

const WishlistItem = (props: Props) => {
  const { item, index, isInCart, addingToCart, addToCart } = props;
  const { mutate: removeFromWishlist, isPending: removing } =
    useRemoveFromWishlist();

  return (
    <Card
      key={item.id}
      className="border-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-[1.02]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardContent className="p-0">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.imageUrl || "/placeholder_course.jpg"}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {(item.discount ?? 0) > 0 && (
            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold">
              <Zap className="w-3 h-3 mr-1" />
              {item.discount ?? 0}% OFF
            </Badge>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
            <Award className="w-3 h-3 text-yellow-400" />
            <span className="text-white text-xs font-semibold">Bestseller</span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFromWishlist(item.id)}
              className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-red-500 backdrop-blur-sm hover:scale-110 transition-all"
              disabled={removing}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="mb-3">
            <h3
              className={cn(
                "font-bold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                dmSans.className
              )}
            >
              {item.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-1.5">
              <span
                className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold"
                style={{ display: "inline-flex" }}
              >
                {item.instructor?.user.name?.charAt(0) || "?"}
              </span>
              By {item.instructor?.user.name || "Unknown Instructor"}
            </p>
          </div>

          {/* Course Stats */}
          <div className="flex flex-wrap gap-3 mb-4">
            {item.duration && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900">
                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                  {item.duration} min
                </span>
              </div>
            )}
            {item.averageRating && (
              <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900">
                <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                  {item.averageRating}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-900">
              <TrendingUp className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                Trending
              </span>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent",
                  dmSans.className
                )}
              >
                ${item.dealPrice || item.price}
              </span>
              {item.price && item.dealPrice && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  ${item.price}
                </span>
              )}
            </div>

            <Button
              onClick={() => addToCart(item.id)}
              className={cn(
                "whitespace-nowrap rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 relative overflow-hidden group/btn",
                isInCart(item.id)
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              )}
              disabled={isInCart(item.id) || addingToCart}
            >
              {isInCart(item.id) ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  In Cart
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WishlistItem;