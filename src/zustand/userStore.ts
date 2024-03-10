import { User } from '@prisma/client';
import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  setUser: (newUser: User) => set({ user: newUser }),
}));
