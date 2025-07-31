import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AiOutlineDelete } from "react-icons/ai";

const Cart = () => {
  return (
    <div className="max-w-8xl flex flex-col justify-between p-[4rem]">
      <div className="flex w-full justify-between pb-4 pt-2 text-lg font-medium">
        <div className="text-xl font-semibold">Cart Items</div>
        <div className="rounded-full bg-blue-400 p-2 text-xs font-extrabold text-blue-900">
          1
        </div>
      </div>

      <div className="flex w-full justify-between rounded-xl">
        <div className="flex w-full max-w-5xl flex-col overflow-auto rounded-xl bg-slate-950 p-2">
          <CartItem />
          <CartItem />
          <CartItem />
        </div>

        <div className="ml-4 w-full max-w-3xl rounded-xl bg-slate-400">
          Checkout
        </div>
      </div>
    </div>
  );
};

export default Cart;

const CartItem = () => {
  return (
    <div className="w-5xl my-2 flex h-[6rem] rounded-xl bg-slate-100 shadow-lg dark:bg-slate-700">
      <Image
        className="relative h-[6rem] w-[8rem] rounded-bl-xl rounded-tl-xl bg-slate-700"
        src="/images1.jpg"
        alt="Next.js Logo"
        width={128}
        height={96}
        style={{
          objectFit: "cover",
        }}
        priority
      />

      <div className="ml-4 flex justify-between">
        <div className="py-auto flex flex-col justify-center px-4">
          {/* course name */}
          <div className="line-clamp-2 w-full max-w-2xl text-ellipsis text-sm dark:text-gray-300">
            Master Full Stack
          </div>

          {/* course price */}
          <div className="text-lg font-semibold dark:text-gray-100">299 $</div>
        </div>

        {/*  */}
        <div className="py-auto my-2 ml-40 flex justify-center">
          {/* <div className='justify-center my-auto flex flex-col text-blue-500 dark:text-white p-2 rounded-xl border border-gray-500 font-bold ml-4 text-sm'>x1</div> */}
          <div className="pointer-events-auto my-auto flex cursor-pointer flex-col justify-center rounded-full bg-gray-950 p-2 text-red-500">
            <AiOutlineDelete size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};
