// src/services/cartService.ts

import {apiManager} from "../api-manager";

// src/services/types/cart.types.ts

export interface CartUserMini {
  name: string;
  profileImageUrl?: string | null;
}

export interface CartInstructorMini {
  user: CartUserMini;
}

export interface CartCourse {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  price: number;
  discount: number;
  dealPrice: number;
  averageRating?: number | null;
  description?: string;
  duration?: number | null;
  instructor?: CartInstructorMini | null;
}

export interface CartItem {
  id: string;
  courseId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  // Nested model with all necessary details for display
  Course: CartCourse;
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  CartItem: CartItem[];
}


export const cartService = {
  // Fetch entire cart for current user
  async getCart(): Promise<Cart> {
    const res = await apiManager.get<Cart>("/cart");
    return res.data;
  },

  // Add a course to cart. Returns CartItem just added (with Course details)
  async addToCart(courseId: string): Promise<CartItem> {
    const res = await apiManager.post<CartItem>("/cart/items", { courseId });
    return res.data;
  },

  // Remove a course from cart. Returns void/null
  async removeFromCart(courseId: string): Promise<void> {
    await apiManager.delete(`/cart/items/${courseId}`);
  },

  // Clear user's entire cart. Returns void/null
  async clearCart(): Promise<void> {
    await apiManager.delete("/cart");
  }
};

export default cartService;
