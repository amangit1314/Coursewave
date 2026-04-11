"use client";

import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useCartStore } from "@/zustand/cartStore";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemCard } from "./CartItemCard";
import { CartCouponCode } from "./CartCouponCode";

interface CartItem {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  courseInstructorName?: string;
  courseImageUrl?: string;
  coursePrice: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartButton = () => {
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <button
            className="relative w-10 h-10 rounded-md transition-all duration-200 ease-in-out dark:bg-transparent group dark:hover:border-transparent hover:border-transparent dark:group-hover:bg-blue-600 group-hover:bg-blue-600 group-hover:text-white cursor-pointer"
            aria-label="Cart"
          >
            <div className="flex items-center justify-center w-full h-full rounded-md border border-opacity-10 bg-transparent transition-all duration-200 group-hover:bg-slate-50 dark:group-hover:border-opacity-100 dark:group-hover:bg-zinc-800">
              <FiShoppingCart size={16} />
            </div>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1">
                <div className="inline-flex items-center rounded-full bg-blue-800 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
                  {cartItems.length}
                </div>
              </span>
            )}
          </button>
        </div>
      </SheetTrigger>

      <ScrollArea>
        <SheetContent className="bg-white dark:bg-zinc-900">
          <SheetHeader>
            <SheetTitle>My Orders</SheetTitle>
          </SheetHeader>

          <div className="h-auto space-y-4 pt-6 md:pr-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item: CartItem) => (
                <CartItemCard
                  key={item.courseId}
                  id={item.courseId}
                  image={item.courseImageUrl!}
                  name={item.courseName!}
                  price={item.coursePrice!}
                  instructorName={item.courseInstructorName!}
                  quantity={item.quantity}
                  removeFromCart={() => {
                    removeFromCart(item.courseId);
                  }}
                />
              ))
            ) : (
              <p>Such empty, Add something to your cart</p>
            )}
          </div>

          <div className="px-6 py-3 md:px-0">
            <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
              <p>
                Subtotal
                <span className="ml-1 text-sm font-thin text-blue-400">
                  [{totalItems} items]
                </span>
              </p>
              <p className="dark:text-blue-500">${totalPrice}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            <div className="mx-auto mt-2 flex items-center justify-center">
              <CartCouponCode />
            </div>

            <Link
              href="#"
              className="mt-3 flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 text-base font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Checkout
            </Link>

            <div className="mt-2 flex justify-center text-center text-sm text-gray-500">
              <p>
                or
                <SheetClose
                  type="button"
                  className="ml-2 font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue Browsing
                  <span aria-hidden="true"> &rarr;</span>
                </SheetClose>
              </p>
            </div>
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <p className="hover:text-red-600 mx-auto flex cursor-pointer items-center justify-center text-sm font-semibold text-red-500 transition-all duration-100">
                Clear Cart
              </p>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
};

export default CartButton;
