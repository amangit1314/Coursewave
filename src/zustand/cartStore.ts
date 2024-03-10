import { CartItem } from '@prisma/client';
import { create } from 'zustand';

type Cart = {
  // cartId: string
  // userId: string
  cartItems: CartItem[]
  count: () => number;
  add: (cartItem: CartItem) => void,
  remove: (cartItemId: string) => void,
  removeAll: () => void
}

export const useCartStore = create<Cart>((set, get) => ({
  // cartId: '',
  // userId: '',
  cartItems: [] as CartItem[],
  count: () => {
    const { cartItems } = get();
    if (cartItems.length)
      return cartItems.map(item => item.quantity).reduce((prev, curr) => prev + curr);
    return 0;
  },
  add: (cartItem: CartItem) => {
    const { cartItems } = get();
    const updatedCart = updateCart(cartItem, cartItems)
    set({ cartItems: updatedCart });
  },
  remove: (cartItemId: string) => {
    const { cartItems } = get();
    const updatedCart = removeCart(cartItemId, cartItems);
    set({ cartItems: updatedCart });
  },
  removeAll: () => set({ cartItems: [] }),
}));

function updateCart(item: CartItem, cart: CartItem[]): CartItem[] {
  const cartItem = { ...item, count: 1 } as CartItem;

  const productOnCart = cart.map(item => item.id).includes(item.id);

  if (!productOnCart) cart.push(cartItem)
  else {
    return cart.map(item => {
      if (item.id === item.id)
        return { ...item, count: item.quantity + 1 } as CartItem;
      return item
    })
  }

  return cart;
}

function removeCart(cartItemId: string, cartItems: CartItem[]): CartItem[] {
  return cartItems.map(item => {
    if (item.id === cartItemId)
      return { ...item, count: item.quantity - 1 }
    return item;
  }).filter(item => {
    return item.quantity;
  });
}