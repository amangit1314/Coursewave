// src/services/wishlistService.ts

import { Course } from "@/types/course";
import {apiManager} from "../api-manager";

export interface Wishlist {
  id: string;
  userId: string;
  courses: Course[];
}

export const wishlistService = {
  // Get user's wishlist
  async getWishlist(): Promise<Course[]> {
    const res = await apiManager.get<Course[]>("/wishlist");
    return res.data;
  },

  // Add a course to wishlist
  async addToWishlist(courseId: string): Promise<Course[]> {
    const res = await apiManager.post<Course[]>("/wishlist/items", { courseId });
    return res.data;
  },

  // Remove a course from wishlist
  async removeFromWishlist(courseId: string): Promise<Course[]> {
    const res = await apiManager.delete<Course[]>(`/wishlist/courses/${courseId}`);
    return res.data;
  },

  // Check if a course is in wishlist
  async checkWishlistStatus(courseId: string): Promise<boolean> {
    const res = await apiManager.get<{ saved: boolean }>(`/wishlist/check/${courseId}`);
    return res.data?.saved ?? false;
  },

  // Get count of courses in wishlist
  async getWishlistCount(): Promise<number> {
    const res = await apiManager.get<{ count: number }>("/wishlist/count");
    return res.data?.count ?? 0;
  },

  // Clear wishlist
  async clearWishlist(): Promise<Course[]> {
    const res = await apiManager.delete<Course[]>("/wishlist/clear");
    return res.data;
  }
};

export default wishlistService;
