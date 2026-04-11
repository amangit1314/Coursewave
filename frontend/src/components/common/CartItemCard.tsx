"use client";

import React from "react";
import Image from "next/image";

interface CartItemCardProps {
  id: string;
  image: string;
  name: string;
  price: any;
  instructorName: string;
  quantity: number;
  removeFromCart: () => void;
}

export const CartItemCard = ({
  id,
  image,
  name,
  price,
  instructorName,
  quantity,
  removeFromCart,
}: CartItemCardProps) => {
  const totalPrice = quantity * price;

  return (
    <div key={id} className="py-auto flex items-center justify-start">
      <Image
        className="h-[4.5rem] w-[4.5rem] rounded-md object-cover md:h-[4.5rem] md:w-[4.5rem]"
        src={image}
        alt=""
        width={72}
        height={72}
        objectFit="cover"
      />

      <div className="ml-4">
        <div className="flex items-center justify-between">
          <p className="line-clamp-2 overflow-clip rounded-sm text-base font-semibold leading-5 tracking-tight text-gray-800 dark:text-white">
            {name}
          </p>
          <p className="text-lg font-bold tracking-tight text-blue-500">
            ${totalPrice}
          </p>
        </div>

        <div className="flex">
          <div className="cursor-pointer border-slate-300 hover:border-none hover:text-red-600 hover:shadow-2xl">
            <p
              className="text-xs text-blue-600 transition-all duration-200 hover:text-indigo-600"
              onClick={removeFromCart}
            >
              Remove
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
