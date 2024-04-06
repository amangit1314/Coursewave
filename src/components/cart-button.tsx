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
import { RatingStars } from "@/app/(course)/courses/_components/rating-stars";
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
          className="relative  rounded-md  transition-all duration-200 ease-in-out dark:bg-transparent dark:hover:bg-zinc-800"
          aria-label="Cart"
        >
          <div className="cursor-pointer rounded-md p-3 text-center items-center bg-transparent hover:bg-slate-50 border dark:hover:bg-zinc-800   border-opacity-10 dark:hover:border-opacity-100 transition-all duration-200">
            <FiShoppingCart size={16} />
          </div>
          <span className="absolute inset-0 object-right-top -mr-6">
            <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-blue-500 text-white">
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
          <div className="space-y-4 md:pr-4 pt-6 h-auto ">
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

          <div className=" py-3 px-6 md:px-0">
            {/* subtotal, items count and total price */}
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p className="dark:text-white">
                Subtotal
                <span className="text-sm ml-1 font-thin text-blue-400">
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
            <div className="flex justify-center items-center mx-auto mt-2">
              <CouponCode />
            </div>

            {/* checkout button */}
            <Link
              href="#"
              className="flex mt-3 items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 text-base font-medium text-white shadow-sm hover:bg-blue-700"
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
              <p className="flex justify-center items-center mx-auto text-red-500 text-sm font-semibold cursor-pointer hover:text-red-red-600 transition-all duration-100">
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
    <div key={id} className="flex justify-start items-center py-auto ">
      {/* image */}
      <Image
        className="h-[4.5rem] md:h-[4.5rem] w-[4.5rem] md:w-[4.5rem] object-cover rounded-md"
        src={image}
        alt=""
        width={72}
        height={72}
        objectFit="cover"
      />

      {/* other data */}
      <div className="ml-4">
        {/* by */}
        <div className="flex justify-between items-center">
          {/* product name */}
          <p className="text-base text-md line-clamp-2 font-semibold tracking-tight leading-5 rounded-sm overflow-clip text-gray-800 dark:text-white">
            {name}
          </p>
          {/* total price according to quanitity */}
          <p className="text-lg text-blue-500 tracking-tight font-bold">
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
          <div className=" hover:shadow-2xl border-slate-300  hover:border-none cursor-pointer hover:text-red-600">
            <p
              className="text-xs text-blue-600 hover:text-indigo-600 transition-all duration-200"
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
    const [isCouponInputVisible, setIsCouponInputVisible] =
      React.useState(false);
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
          className="text-blue-500 font-medium text-sm opacity-50 hover:no-underline  cursor-pointer hover:opacity-100 transition-all duration-100"
        >
          Add a coupon
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-800 dark:text-white font-semibold">
            Enter coupon code below
          </DialogTitle>
          <DialogDescription>
            Enter coupon code below and press apply when you are done. It will
            applied to the course price.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            <Label className="text-left text-gray-800 dark:text-white font-semibold mb-1">
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
        enteredCode ? "flex-col justify-start items-center" : "flex-row"
      } border-t pt-4 border-gray-200 justify-between items-center`}
    >
      {!isCouponInputVisible && (
        <button
          onClick={handleAddCouponClick}
          className="text-blue-500 font-medium text-sm opacity-50 dark:opacity-80 hover:no-underline  cursor-pointer hover:opacity-100 transition-all duration-100"
        >
          Add a coupon
        </button>
      )}
      {isCouponInputVisible && (
        <div className="flex justify-between items-center relative">
          <input
            type="text"
            aria-label="Enter Coupon Code"
            placeholder="Enter code here ..."
            value={enteredCode}
            onChange={handleCodeChange}
            className="mt-2 py-2 text-gray-700 border border-gray-200 rounded-lg pl-4 pr-8"
          />
          <button
            type="submit"
            form="coupon-form"
            className="absolute text-xs bg-blue-300 rounded-lg px-4 font-semibold flex mt-2 text-blue-500 hover:bg-blue-500 hover:text-white items-center justify-center right-0 top-0 bottom-0 mr-4"
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