"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

//* Shadcn ui components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

//* tremor icons
import { Button, Callout } from "@tremor/react";
import { RiCoupon3Line } from "react-icons/ri";
import { FaShare } from "react-icons/fa6";
import toast from "react-hot-toast";
import { dmSans } from "@/lib/config/fonts";
import { cn } from "@/lib/utils/utils";

export const ApplyCouponCode = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:scale-105 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 group">
          <RiCoupon3Line className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span className={dmSans.className}>Coupon</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-0 shadow-2xl dark:bg-zinc-900 rounded-2xl backdrop-blur-sm">
        <DialogHeader className="space-y-3">
          <DialogTitle className={cn("font-bold text-gray-900 dark:text-white text-xl", dmSans.className)}>
            Apply Coupon Code
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Enter your coupon code below to get a discount on this course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <Label className={cn("text-sm font-semibold text-gray-700 dark:text-gray-300", dmSans.className)}>
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              placeholder="Enter coupon code..."
              className="w-full rounded-xl border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 transition-colors duration-300 py-6 text-base"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className={cn(
              "w-full bg-gradient-to-r from-blue-600 cursor-pointer to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-xl py-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0",
              dmSans.className
            )}
          >
            Apply Coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};