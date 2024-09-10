import React from "react";
import { Button } from "@/components/ui/button";
import { useUserInfo } from "@/hooks/useUserInfo";
import { useCartStore } from "@/zustand/cartStore";
import { CartItem, Course } from "@prisma/client";
import { generateUid } from "@/helpers/id-helper";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";

export const AddToCartButton = ({ course }: { course: Course }) => {
  const user = useUserInfo();
  const cartItemId = generateUid();

  const [isInCart, setIsInCart] = React.useState(false);
  const { addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart } =
    useCartStore();

  const cartItemToAdd: CartItem = {
    id: `cart_${cartItemId}`,
    userId: user.user?.id,
    courseId: course?.courseId,
    courseName: course?.courseTitle,
    courseInstructorName: course?.instructorName ?? "",
    courseImageUrl: course?.courseImage ?? "./assets/images/images1.jpg",
    coursePrice: course?.coursePrice!,
    quantity: 1,
    createdAt: null,
    updatedAt: null,
  };

  const toggleIsInCart = () => {
    if (isInCart) {
      handleRemoveFromCart(course?.courseId!);
    } else {
      handleAddToCart(course!, user.user?.id!);
      setIsInCart(!isInCart);
    }
  };

  return (
    <Button
      onClick={toggleIsInCart}
      size="sm"
      color="blue"
      className={`m-2 mt-2 w-[26rem] rounded-md bg-blue-500 text-center text-sm font-semibold text-white hover:bg-blue-700 ${isInCart ? "bg-blue-600" : "bg-blue-500"}`}
    >
      {isInCart ? (
        <div className="flex items-center justify-center">
          <HiShoppingCart size={22} /> Remove from cart
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <HiOutlineShoppingCart size={22} /> Add to cart
        </div>
      )}
    </Button>
  );
};
