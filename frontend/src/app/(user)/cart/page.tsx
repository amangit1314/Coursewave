"use client";

import React, { useState } from "react";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";

import {
  Trash2,
  Heart,
  Clock,
  Shield,
  CheckCircle2,
  Tag,
  ShoppingCart,
  ArrowRight,
  X,
  Star,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

// Cart hooks (types match updated backend)
import {
  useCart,
  useRemoveFromCart,
  useClearCart,
  useAddToCart,
} from "@/hooks/useCart";
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from "@/hooks/useWishlist";
import Link from "next/link";
import { IoMdArrowRoundBack } from "react-icons/io";

// Optional: get coupon data from API/server in future for production
const availableCoupons = [
  { code: "WELCOME20", discount: 20, description: "20% off on all courses" },
  { code: "STUDENT15", discount: 15, description: "15% off for students" },
  { code: "SUMMER25", discount: 25, description: "25% off summer special" },
  { code: "FIRST10", discount: 10, description: "10% off first purchase" },
];

const CartPage = () => {
  // Load cart reactively
  const { data: cart, isPending, isError } = useCart();
  const { mutate: removeFromCart, isPending: removing } = useRemoveFromCart();
  const { mutate: clearCart, isPending: clearing } = useClearCart();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const { data: wishlistItems } = useWishlist();

  const isInWishlist = (courseId: string) =>
    wishlistItems?.some((item) => item.id === courseId) ?? false;

  // Coupon UI state (handled locally)
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<
    (typeof availableCoupons)[0] | null
  >(null);
  const [couponError, setCouponError] = useState("");

  // Core items come from cart's CartItem[]
  const items = cart?.CartItem ?? [];

  // Calculate subtotal using dealPrice if available, otherwise price
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      ((item.Course.dealPrice && item.Course.dealPrice > 0
        ? item.Course.dealPrice
        : item.Course.price) || 0),
    0
  );
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const total = subtotal - discount;

  // Coupon logic
  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code === couponCode.toUpperCase()
    );
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  // Remove from cart - use CartItem.courseId (not CartItem.id)
  const handleRemove = (courseId: string) => {
    removeFromCart(courseId);
  };

  // Wishlist logic (optimistic for now)
  const handleToggleWishlist = (courseId: string, wishlisted: boolean) => {
    if (wishlisted) {
      removeFromWishlist(courseId);
    } else {
      addToWishlist(courseId);
    }
  };

  const getInstructorName = (item: (typeof items)[number]) =>
    item.Course?.instructor?.user?.name || "";

  if (isPending)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-muted-foreground font-medium">
            Loading your cart...
          </p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-zinc-950 dark:via-blue-950/20 dark:to-indigo-950/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-semibold">
            Failed to load cart
          </p>
        </div>
      </div>
    );

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
              <div className="inline-flex items-center gap-2 ">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div> */}
                <h1
                  className={cn(
                    "text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent",
                    dmSans.className
                  )}
                >
                   Cart
                </h1>
              </div>
              <p className="text-muted-foreground text-base flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-card px-3 py-1 rounded-full border border-border shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  <span className="font-semibold text-foreground">
                    {items.length}
                  </span>
                  <span>{items.length === 1 ? "course" : "courses"}</span>
                </span>
              </p>
            </div>
          </div>

          {/* Clear Cart Button */}
          {items.length > 0 && (
            <Button
              onClick={() => clearCart()}
              variant="outline"
              className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 flex items-center gap-2"
              disabled={clearing}
            >
              <Trash2 size={18} />
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <Card
                key={item.id}
                className="border-0 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative flex-shrink-0 w-full sm:w-52 h-36 rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={item.Course.imageUrl || "/placeholder_course.jpg"}
                        alt={item.Course.title || "Course"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      {item.Course.discount > 0 && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg px-3 py-1 text-xs font-bold">
                          <Zap className="w-3 h-3 mr-1" />
                          {item.Course.discount}% OFF
                        </Badge>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1">
                        <Award className="w-3 h-3 text-yellow-400" />
                        <span className="text-white text-xs font-semibold">
                          Bestseller
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className={cn(
                            "font-bold text-lg text-foreground line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
                            dmSans.className
                          )}
                        >
                          {item.Course.title}
                        </h3>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleToggleWishlist(
                                item.Course.id,
                                isInWishlist(item.Course.id)
                              )
                            }
                            className="h-9 w-9 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all hover:scale-110"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(item.Course.id)}
                            className="h-9 w-9 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all hover:scale-110"
                            disabled={removing}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                          {getInstructorName(item).charAt(0)}
                        </div>
                        By {getInstructorName(item)}
                      </p>

                      {/* Enhanced stats */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {item.Course.duration && (
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900">
                            <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                              {item.Course.duration} min
                            </span>
                          </div>
                        )}
                        {item.Course.averageRating && (
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 px-3 py-1.5 rounded-full border border-yellow-100 dark:border-yellow-900">
                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
                              {item.Course.averageRating}
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

                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent",
                            dmSans.className
                          )}
                        >
                          $
                          {item.Course.dealPrice && item.Course.dealPrice > 0
                            ? item.Course.dealPrice
                            : item.Course.price}
                        </span>
                        {item.Course.discount > 0 && (
                          <span className="text-lg text-muted-foreground/70 line-through">
                            ${item.Course.price}
                          </span>
                        )}
                        {item.Course.discount > 0 && (
                          <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border-0">
                            Save $
                            {(
                              item.Course.price -
                              (item.Course.dealPrice || item.Course.price)
                            ).toFixed(2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty State */}
            {items.length === 0 && (
              <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-xl text-center py-20">
                <CardContent>
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <ShoppingCart className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3
                    className={cn(
                      "text-2xl font-bold text-foreground mb-3",
                      dmSans.className
                    )}
                  >
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Discover amazing courses and start your learning journey
                    today!
                  </p>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Browse Courses
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Checkout Summary */}
          <div className="space-y-6">
            <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-2xl sticky top-24 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              <CardContent className="p-6">
                <h2
                  className={cn(
                    "text-xl font-bold text-foreground mb-6 flex items-center gap-2",
                    dmSans.className
                  )}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>
                      Subtotal ({items.length}{" "}
                      {items.length === 1 ? "course" : "courses"})
                    </span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        Discount ({appliedCoupon.discount}%)
                      </span>
                      <span className="font-semibold">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-4 border border-green-200 dark:border-green-900">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                          <Tag className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-green-700 dark:text-green-300">
                            {appliedCoupon.code}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {appliedCoupon.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeCoupon}
                        className="h-8 w-8 p-0 rounded-full text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {!appliedCoupon && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-foreground mb-2 block">
                      Have a coupon code?
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Input
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 rounded-xl border-border focus:border-blue-500 dark:focus:border-blue-500"
                      />
                      <Button
                        onClick={applyCoupon}
                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        Apply
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        {couponError}
                      </p>
                    )}
                  </div>
                )}

                <div className="mb-6">
                  <h3
                    className={cn(
                      "font-semibold text-foreground mb-3 flex items-center gap-2",
                      dmSans.className
                    )}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    Available Coupons
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {availableCoupons.map((coupon) => (
                      <div
                        key={coupon.code}
                        className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-zinc-800 dark:to-blue-950/30 rounded-xl hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 cursor-pointer transition-all border border-border hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg "
                        onClick={() => {
                          setCouponCode(coupon.code);
                          applyCoupon();
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                              <Tag className="h-3 w-3 text-white" />
                            </div>
                            <span className="font-bold text-foreground">
                              {coupon.code}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {coupon.description}
                          </p>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg px-3 py-1 font-bold">
                          {coupon.discount}% OFF
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all hover:scale-[1.02] relative overflow-hidden group"
                  disabled={items.length === 0}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </Button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <Shield className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="font-medium">
                      Secure payment processing
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">
                      30-day money-back guarantee
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
              <CardContent className="p-6">
                <h3
                  className={cn(
                    "font-semibold text-foreground mb-4 flex items-center gap-2",
                    dmSans.className
                  )}
                >
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  You might also like
                </h3>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-2 border-border hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all hover:scale-[1.02] font-semibold"
                >
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
