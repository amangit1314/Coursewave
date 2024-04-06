import { Course } from '@prisma/client';
import { create } from 'zustand';

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

interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
}

type Actions = {
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  updateQuantity: (courseId: string, quantity: number) => void;
  clearCart: () => void;
}

const initialState: CartState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

export const useCartStore = create<CartState & Actions>((set, get) => ({
  cartItems: initialState.cartItems,
  totalItems: initialState.totalItems,
  totalPrice: initialState.totalPrice,

  addToCart: (course: Course) => {
    set((state) => {
      const existingItem = state.cartItems.find((item) => item.courseId === course.courseId);

      if (existingItem) {
        // Update quantity of existing item
        const updatedCartItems = state.cartItems.map((item) =>
          item.courseId === course.courseId ? { ...item, quantity: item.quantity + 1 } : item
        );
        return {
          ...state,
          cartItems: updatedCartItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + parseFloat(course.coursePrice!), // Ensure price is a number
        };
      } else {
        // Add new course to cart
        const newCartItem: CartItem = {
          id: Math.random().toString(36).substring(2, 15), // Generate unique ID
          userId: ''/* Your logic to get user ID */,
          courseId: course.courseId,
          courseName: course.courseTitle, // Use courseTitle for cart display
          courseInstructorName: course.courseCreator!, // Use courseCreator for instructor name (optional)
          courseImageUrl: course.courseImage!,
          coursePrice: course.coursePrice!,
          quantity: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        return {
          ...state,
          cartItems: [...state.cartItems, newCartItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + parseFloat(course.coursePrice!), // Ensure price is a number
        };
      }
    });
  },

  removeFromCart: (courseId: string) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.courseId !== courseId),
      totalItems: Math.max(0, state.totalItems - 1), // Prevent negative total items
      totalPrice: Math.max(0, state.totalPrice - parseFloat(get().cartItems.find((item) => item.courseId === courseId)?.coursePrice! || '0')), // Ensure price is a number and handle missing item
    }));
  },

  updateQuantity: (courseId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return set((state) => ({
        ...state,
        cartItems: state.cartItems.filter((item) => item.courseId !== courseId),
        totalItems: Math.max(0, state.totalItems - 1),
        totalPrice: Math.max(0, state.totalPrice - parseFloat(get().cartItems.find((item) => item.courseId === courseId)?.coursePrice! || '0')), // Ensure price is a number and handle missing item
      }));
    }

    set((state) => {
      const updatedCartItems = state.cartItems.map((item) =>
        item.courseId === courseId ? { ...item, quantity } : item
      );
      const updatedTotalPrice = updatedCartItems.reduce((acc, item) => acc + parseFloat(item.coursePrice!) * item.quantity, 0); // Calculate total price

      return {
        ...state,
        cartItems: updatedCartItems,
        totalItems: state.cartItems.length, // Update total items based on remaining items
        totalPrice: updatedTotalPrice,
      };
    });
  },

  clearCart: () => {
    set(() => initialState);
  }
}))