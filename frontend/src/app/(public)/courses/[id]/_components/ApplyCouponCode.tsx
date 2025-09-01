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

export const ApplyCouponCode = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
          <RiCoupon3Line className="h-4 w-4" />
          <span>Coupon</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-gray-800 dark:text-white">
            Apply Coupon Code
          </DialogTitle>
          <DialogDescription>
            Enter your coupon code below to get a discount on this course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              placeholder="Enter coupon code..."
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            Apply Coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
