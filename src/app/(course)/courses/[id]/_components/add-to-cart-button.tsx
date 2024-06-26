import { Button } from "@/components/ui/button";
import { generateUid } from "@/helpers/id_helper";
import useUserInfo from "@/hooks/use-user-info";
import { useCartStore } from "@/zustand/cartStore";
import { CartItem, Course } from "@prisma/client";
import React from "react";
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
      className={`mt-2 text-center text-white bg-blue-500 w-[26rem] rounded-md hover:bg-blue-700 text-sm  font-semibold m-2 ${isInCart ? "bg-blue-600" : "bg-blue-500"}`}
    >
      {isInCart ? (
        <div className="flex justify-center items-center">
          <HiShoppingCart size={22} /> Remove from cart
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <HiOutlineShoppingCart size={22} /> Add to cart
        </div>
      )}
    </Button>
  );
};
