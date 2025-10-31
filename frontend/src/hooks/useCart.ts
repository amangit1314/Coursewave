// src/hooks/useCart.ts

import cartService, { Cart, CartItem } from "@/lib/api/services/cartService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CART_KEY = ["cart"];

/**
 * Fetch the cart for the current user.
 * Returns: { id, userId, createdAt, updatedAt, CartItem: CartItem[] }
 */
export function useCart() {
  return useQuery<Cart>({
    queryKey: CART_KEY,
    queryFn: cartService.getCart,
    staleTime: 3 * 60 * 1000,
  });
}

/**
 * Add a course to the cart. After a successful add, refetch the cart.
 * Returns: CartItem (the item just added)
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation<CartItem, unknown, string>({
    mutationFn: (courseId: string) => cartService.addToCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

/**
 * Remove a course from the cart. After a successful remove, refetch the cart.
 * Returns: void
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: (courseId: string) => cartService.removeFromCart(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}

/**
 * Clear the user's entire cart. After a successful clear, refetch the cart.
 * Returns: void
 */
export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, void>({
    mutationFn: cartService.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
    },
  });
}
