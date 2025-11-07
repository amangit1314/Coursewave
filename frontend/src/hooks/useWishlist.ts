// src/hooks/useWishlist.ts

import wishlistService from "@/lib/api/services/wishlistService";
import { Course } from "@/types/course";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query keys
const WISHLIST_KEY = ["wishlist"];
const STATUS_KEY = (courseId: string) => ["wishlist-status", courseId];
const COUNT_KEY = ["wishlist-count"];

// Fetch the wishlist
export function useWishlist() {
  return useQuery<Course[]>({
    queryKey: WISHLIST_KEY,
    queryFn: wishlistService.getWishlist,
    staleTime: 3 * 60 * 1000,
  });
}

// Add a course to wishlist
export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => wishlistService.addToWishlist(courseId),
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      queryClient.invalidateQueries({ queryKey: COUNT_KEY });
    },
  });
}

// Remove a course from wishlist
// export function useRemoveFromWishlist() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (courseId: string) =>
//       wishlistService.removeFromWishlist(courseId),
//     onSuccess: (data) => {
//       queryClient.setQueryData(WISHLIST_KEY, data);
//       queryClient.invalidateQueries({ queryKey: COUNT_KEY });
//     },
//   });
// }

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) =>
      wishlistService.removeFromWishlist(courseId),
    // Optimistic update: item disappears instantly from list
    onMutate: async (courseId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });

      // Snapshot of previous wishlist
      const previous = queryClient.getQueryData<Course[]>(WISHLIST_KEY);

      // Optimistically update list in cache (remove item by id)
      queryClient.setQueryData<Course[]>(WISHLIST_KEY, (old = []) =>
        old.filter((item) => item.id !== courseId)
      );

      // Optimistically update count in cache
      queryClient.setQueryData<number>(COUNT_KEY, (old = 0) =>
        Math.max((old ?? 1) - 1, 0)
      );

      // Return rollback data for error handling (optional)
      return { previous };
    },
    // When server returns, replace list with fresh data & refetch count
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      queryClient.invalidateQueries({
        queryKey: COUNT_KEY,
        refetchType: "active",
      });
    },
    // If failed, rollback optimistic update
    onError: (err, courseId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(WISHLIST_KEY, context.previous);
      }
      queryClient.invalidateQueries({
        queryKey: COUNT_KEY,
        refetchType: "active",
      });
    },
    // Optionally refetch on settle
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: WISHLIST_KEY,
        refetchType: "active",
      });
      queryClient.invalidateQueries({
        queryKey: COUNT_KEY,
        refetchType: "active",
      });
    },
  });
}

// Check if a specific course is in wishlist
export function useCheckWishlistStatus(courseId?: string) {
  return useQuery<boolean>({
    queryKey: STATUS_KEY(courseId || ""),
    queryFn: () => wishlistService.checkWishlistStatus(courseId!),
    enabled: !!courseId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get total wishlist count
export function useWishlistCount() {
  return useQuery<number>({
    queryKey: COUNT_KEY,
    queryFn: wishlistService.getWishlistCount,
    staleTime: 2 * 60 * 1000,
  });
}

// Clear wishlist
export function useClearWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishlistService.clearWishlist,
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      queryClient.invalidateQueries({ queryKey: COUNT_KEY });
    },
  });
}
