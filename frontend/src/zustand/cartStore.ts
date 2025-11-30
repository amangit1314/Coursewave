"use client";

import { CartItem } from "@/types/cart-item";
import { Course } from "@/types/course-details-api-response";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type Actions = {
  addToCart: (course: Course, userId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
};

const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create<CartState & Actions>()(
  persist(
    (set, get) => ({
      cartItems: initialState.cartItems,
      totalItems: initialState.totalItems,
      totalPrice: initialState.totalPrice,

      addToCart: (course: Course, userId: string) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.courseId === course.id,
          );

          if (existingItem) {
            // Update quantity of existing item
            const updatedCartItems = state.cartItems.map((item) =>
              item.courseId === course.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
            return {
              ...state,
              cartItems: updatedCartItems,
              totalItems: state.totalItems + 1,
              totalPrice:
                state.totalPrice + parseFloat(course.price!.toString()), // Ensure price is a number
            };
          } else {
            const newCartItem: CartItem = {
              id: Math.random().toString(36).substring(2, 15),
              userId: userId,
              courseId: course.id,
              courseName: course.title,
              courseInstructorName: course.instructor.user.name!,
              courseImageUrl: course.imageUrl,
              coursePrice: course.price!.toString(),
              quantity: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            };

            return {
              ...state,
              cartItems: [...state.cartItems, newCartItem],
              totalItems: state.totalItems + 1,
              totalPrice:
                state.totalPrice + parseFloat(course.price!.toString()), // Ensure price is a number
            };
          }
        });
      },

      removeFromCart: (courseId: string) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.courseId !== courseId,
          ),
          totalItems: Math.max(0, state.totalItems - 1), // Prevent negative total items
          totalPrice: Math.max(
            0,
            state.totalPrice -
              parseFloat(
                get().cartItems.find((item) => item.courseId === courseId)
                  ?.coursePrice! || "0",
              ),
          ), // Ensure price is a number and handle missing item
        }));
      },

      clearCart: () => {
        set(() => initialState);
      },
    }),
    {
      name: "Coursewave-Cart-Store",
    },
  ),
);
