"use client";

import React from "react";
import { Button } from "@tremor/react";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import toast from "react-hot-toast";
import { useUserStore } from "@/zustand/userStore";
import { useCartStore } from "@/zustand/cartStore";
import { Course } from "@/types/course-details-api-response";
import { useAlreadyPurchased } from "@/hooks/useCheckout";

export const AddToCartButton = ({ course }: { course: Course }) => {
  const { user } = useUserStore();
  const [isInCart, setIsInCart] = React.useState(false);
  const { addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart } =
    useCartStore();

  const { data: enrollmentData, isLoading: checking } = useAlreadyPurchased(
    course.id,
    user?.id || ""
  );

  const alreadyEnrolled = enrollmentData?.isEnrolled;

  // Check for cart state on mount if needed
  React.useEffect(() => {
    setIsInCart(false); // Update with real cart logic if needed
  }, [course?.id]);

  const toggleIsInCart = () => {
    if (!user?.id) {
      toast.error("Please login to add courses to cart.");
      return;
    }
    if (isInCart) {
      handleRemoveFromCart(course?.id);
      toast.success(`Removed "${course?.title}" from cart`);
      setIsInCart(false);
    } else {
      handleAddToCart(course, user?.id);
      toast.success(`Added "${course?.title}" to cart`);
      setIsInCart(true);
    }
  };

  if (alreadyEnrolled) {
    return null;
  }

  return (
    <Button
      onClick={toggleIsInCart}
      disabled={!user?.id}
      size="lg"
      className={`
        w-full
        ${
          isInCart
            ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-green-500/30 focus:ring-green-400"
            : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-blue-500/30 focus:ring-blue-400"
        }
        text-white font-semibold py-2 px-6
        rounded-xl
        shadow-xl hover:shadow-2xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        relative overflow-hidden
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 shadow-inner">
          {isInCart ? (
            <HiShoppingCart className="h-3 w-3 text-green-100" />
          ) : (
            <HiOutlineShoppingCart className="h-3 w-3 text-blue-100" />
          )}
        </span>
        <span className="tracking-wide text-sm font-bold drop-shadow-sm">
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </span>
      </span>
    </Button>
  );
};
