import React from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/zustand/cartStore";

import { generateUid } from "@/lib/helpers/id-helper";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";
import { CourseWithOtherFields } from "@/types/course-with-other-fields";
import { Course } from "@/types/course-details-api-response";
import { CartItem } from "@/types/cart-item";
import { useUserStore } from "@/zustand/userStore";

export const AddToCartButton = ({ course }: { course: Course }) => {
  const { user } = useUserStore();
  const cartItemId = generateUid();

  const [isInCart, setIsInCart] = React.useState(false);
  const { addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart } =
    useCartStore();

  const cartItemToAdd: CartItem = {
    id: `cart_${cartItemId}`,
    userId: user?.id ?? "",
    courseId: course?.id,
    courseName: course?.title,
    courseInstructorName: course?.instructor?.user?.name ?? "",
    courseImageUrl: course?.imageUrl ?? "./assets/images/images1.jpg",
    coursePrice: course?.price!.toString(),
    quantity: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const toggleIsInCart = () => {
    if (isInCart) {
      handleRemoveFromCart(course?.id!);
    } else {
      // const adaptedCourse = {
      //   ...course,
      //   categories: course.categories.map((category) => ({
      //     id: category.id,
      //     name: category.name,
      //   })),
      // };
      const adaptedCourse = {
        ...course,
        categories: course.categories.map((category) =>
          typeof category === "string" ? category : category
        ),
      };
      handleAddToCart(adaptedCourse, user?.id!);
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
