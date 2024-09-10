"use client";

import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useCartStore } from "@/zustand/cartStore";
import RatingStars from "@/app/(course)/courses/_components/rating-stars";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";

interface CartItem {
  id: string; // Unique identifier for cart item
  userId: string;
  courseId: string; // Reference to the Course model
  courseName: string;
  courseInstructorName?: string; // Optional instructor name
  courseImageUrl?: string; // Optional image URL
  coursePrice: string; // String representation of price
  quantity: number; // Quantity of the item in the cart
  createdAt: Date;
  updatedAt: Date;
}

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice, totalItems } = useCartStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative rounded-md transition-all duration-200 ease-in-out dark:bg-transparent dark:hover:bg-zinc-800"
          aria-label="Cart"
        >
          <div className="cursor-pointer items-center rounded-md border border-opacity-10 bg-transparent p-3 text-center transition-all duration-200 hover:bg-slate-50 dark:hover:border-opacity-100 dark:hover:bg-zinc-800">
            <FiShoppingCart size={16} />
          </div>
          <span className="absolute inset-0 -mr-6 object-right-top">
            <div className="inline-flex items-center rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
              {cartItems.length > 0 ? cartItems.length : 0}
            </div>
          </span>
        </button>
      </SheetTrigger>

      <ScrollArea>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Orders</SheetTitle>
            {/* <SheetDescription>
              All your cart items will appear here.
            </SheetDescription> */}
          </SheetHeader>

          {/* Cart items list */}
          <div className="h-auto space-y-4 pt-6 md:pr-4">
            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item: CartItem) => (
                <CartItem
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

          {/* coupon code */}
          {/* <div className="flex justify-center items-center mx-auto mt-2">
            <CouponCode />
          </div> */}

          <div className="px-6 py-3 md:px-0">
            {/* subtotal, items count and total price */}
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p className="dark:text-white">
                Subtotal
                <span className="ml-1 text-sm font-thin text-blue-400">
                  [{totalItems} items]
                </span>
              </p>

              {/* total price */}
              <p className="dark:text-blue-500">${totalPrice}</p>
            </div>

            {/* text (shipping and taxes calculated on checkout ) */}
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>

            {/* coupon code */}
            <div className="mx-auto mt-2 flex items-center justify-center">
              <CouponCode />
            </div>

            {/* checkout button */}
            <Link
              href="#"
              className="mt-3 flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 text-base font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Checkout
            </Link>

            {/* continue shopping */}
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
              <p className="hover:text-red-red-600 mx-auto flex cursor-pointer items-center justify-center text-sm font-semibold text-red-500 transition-all duration-100">
                Clear Cart
              </p>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
};

export default Cart;

type CartItemProps = {
  id: string;
  image: string;
  name: string;
  price: any;
  instructorName: string;
  quantity: number;
  removeFromCart: any;
};

const CartItem = ({
  id,
  image,
  name,
  price,
  instructorName,
  quantity,
  removeFromCart,
}: CartItemProps) => {
  const totalPrice = quantity * price;

  return (
    <div key={id} className="py-auto flex items-center justify-start">
      {/* image */}
      <Image
        className="h-[4.5rem] w-[4.5rem] rounded-md object-cover md:h-[4.5rem] md:w-[4.5rem]"
        src={image}
        alt=""
        width={72}
        height={72}
        objectFit="cover"
      />

      {/* other data */}
      <div className="ml-4">
        {/* by */}
        <div className="flex items-center justify-between">
          {/* product name */}
          <p className="text-md line-clamp-2 overflow-clip rounded-sm text-base font-semibold leading-5 tracking-tight text-gray-800 dark:text-white">
            {name}
          </p>
          {/* total price according to quanitity */}
          <p className="text-lg font-bold tracking-tight text-blue-500">
            ${totalPrice}
          </p>
        </div>

        {/* <div className="flex justify-start items-center text-sm">
          <RatingStars courseStarRatings={4.6} />
        </div> */}

        {/* <p className="text-xs font-thin tracking-tight rounded-sm overflow-clip">
          By: {instructorName}
        </p> */}

        {/* quantity and delete from cart stuff */}
        <div className="flex">
          {/* delete from cart button */}
          <div className="cursor-pointer border-slate-300 hover:border-none hover:text-red-600 hover:shadow-2xl">
            <p
              className="text-xs text-blue-600 transition-all duration-200 hover:text-indigo-600"
              onClick={removeFromCart}
            >
              Remove
            </p>
            {/* <RiDeleteBin7Line
              onClick={removeFromCart}
              size={18}
              className="text-blue-500"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

function AppyCouponCode() {
  const [isCouponInputVisible, setIsCouponInputVisible] = React.useState(false);
  const [enteredCode, setEnteredCode] = React.useState("");

  const handleAddCouponClick = () => {
    setIsCouponInputVisible(true);
  };

  const handleCodeChange = (event: any) => {
    setEnteredCode(event!.target!.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault(); // Prevent default form submission
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          // onClick={handleAddCouponClick}
          className="cursor-pointer text-sm font-medium text-blue-500 opacity-50 transition-all duration-100 hover:no-underline hover:opacity-100"
        >
          Add a coupon
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-gray-800 dark:text-white">
            Enter coupon code below
          </DialogTitle>
          <DialogDescription>
            Enter coupon code below and press apply when you are done. It will
            applied to the course price.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            <Label className="mb-1 text-left font-semibold text-gray-800 dark:text-white">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              className="col-span-3"
              value={enteredCode}
              onChange={handleCodeChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddCouponClick}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CouponCode() {
  const [isCouponInputVisible, setIsCouponInputVisible] = React.useState(false);
  const [enteredCode, setEnteredCode] = React.useState("");

  const handleAddCouponClick = () => {
    setIsCouponInputVisible(true);
  };

  const handleCodeChange = (event: any) => {
    setEnteredCode(event!.target!.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault(); // Prevent default form submission
  };

  return (
    <div
      className={`flex ${
        enteredCode ? "flex-col items-center justify-start" : "flex-row"
      } items-center justify-between border-t border-gray-200 pt-4`}
    >
      {!isCouponInputVisible && (
        <button
          onClick={handleAddCouponClick}
          className="cursor-pointer text-sm font-medium text-blue-500 opacity-50 transition-all duration-100 hover:no-underline hover:opacity-100 dark:opacity-80"
        >
          Add a coupon
        </button>
      )}
      {isCouponInputVisible && (
        <div className="relative flex items-center justify-between">
          <input
            type="text"
            aria-label="Enter Coupon Code"
            placeholder="Enter code here ..."
            value={enteredCode}
            onChange={handleCodeChange}
            className="mt-2 rounded-lg border border-gray-200 py-2 pl-4 pr-8 text-gray-700"
          />
          <button
            type="submit"
            form="coupon-form"
            className="absolute bottom-0 right-0 top-0 mr-4 mt-2 flex items-center justify-center rounded-lg bg-blue-300 px-4 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Apply
          </button>
          <form
            id="coupon-form"
            onSubmit={handleSubmit}
            className="hidden"
          ></form>
        </div>
      )}
      {enteredCode && (
        <p className="mt-2">
          Entered code: <span className="text-blue-500">{enteredCode}</span>
        </p>
      )}
    </div>
  );
}
