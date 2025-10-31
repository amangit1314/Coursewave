"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";

// Icons
import {
  Shield,
  CheckCircle2,
  Lock,
  Zap,
  Clock,
  Users,
  Star,
} from "lucide-react";

interface CheckoutSummaryProps {
  items: Array<{
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    instructor: string;
    duration: string;
    students: number;
    rating: number;
  }>;
  appliedCoupon?: {
    code: string;
    discount: number;
  } | null;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  items,
  appliedCoupon,
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const discount = appliedCoupon
    ? (subtotal * appliedCoupon.discount) / 100
    : 0;
  const total = subtotal - discount;

  return (
    <Card className="border-0 shadow-2xl dark:bg-zinc-900 sticky top-24">
      <CardContent className="p-6">
        <h2
          className={cn(
            "text-2xl font-bold text-gray-900 dark:text-white mb-6",
            dmSans.className
          )}
        >
          Order Summary
        </h2>

        {/* Course List */}
        <div className="space-y-4 mb-6">
          <h3
            className={cn(
              "font-semibold text-gray-900 dark:text-white",
              dmSans.className
            )}
          >
            {items.length} {items.length === 1 ? "Course" : "Courses"}
          </h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  By {item.instructor}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{item.duration}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{item.rating}</span>
                </div>
              </div>
              <div className="text-right ml-4">
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${item.price}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="text-gray-400 line-through text-sm block">
                    ${item.originalPrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <Separator className="mb-6" />

        {/* Pricing Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>Discount ({appliedCoupon.code})</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="text-xs text-gray-500 text-center">
            All prices in USD
          </div>
        </div>

        {/* Checkout Button */}
        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold shadow-lg">
          <Lock className="h-5 w-5 mr-2" />
          Complete Checkout
          <Zap className="h-5 w-5 ml-2" />
        </Button>

        {/* Trust Indicators */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm">
                30-Day Money-Back Guarantee
              </p>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                Full refund if you're not satisfied
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>Secure SSL encryption</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 text-green-500" />
            <span>
              Join{" "}
              {items
                .reduce((sum, item) => sum + item.students, 0)
                .toLocaleString()}
              + students
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 text-center">
            We accept:
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-xs">
              Visa
            </Badge>
            <Badge variant="outline" className="text-xs">
              Mastercard
            </Badge>
            <Badge variant="outline" className="text-xs">
              PayPal
            </Badge>
            <Badge variant="outline" className="text-xs">
              Stripe
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
