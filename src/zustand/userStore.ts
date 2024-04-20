import { User } from '@prisma/client';
import {create} from 'zustand';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const useUserStore = create((set) => ({
  ...initialState,

  // Set user state
  setUser: (user: User) => set({ user }),

  // Update user profile
  updateUserProfile: async (data: any, onSuccess: any, onError: any) => {
    set({ loading: true, error: null });
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      set({ user: updatedUser, loading: false });
      onSuccess?.(updatedUser);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      set({ loading: false, error: error.message });
      onError?.(error.message);
    }
  },

  // Check if user is an instructor
  isInstructor: () => {
    // return Boolean(initialState.user?.isInstructor);
  },

  // Make user an instructor (if not already)
  makeUserInstructor: async (onSuccess: any, onError: any) => {
    if (!initialState.user) {
      onError?.('User not found');
      return;
    }

    // if (initialState.user.isInstructor) {
    //   onSuccess?.('User is already an instructor');
    //   return;
    // }

    set({ loading: true, error: null });
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/make-instructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({ userId: initialState.user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to make user an instructor');
      }

      const updatedUser = await response.json();
      set({ user: updatedUser, loading: false });
      onSuccess?.(updatedUser);
    } catch (error: any) {
      console.error('Error making user an instructor:', error);
      set({ loading: false, error: error.message });
      onError?.(error.message);
    }
  },

  // Update user password (replace with your actual logic)
  updatePassword: async (data: any, onSuccess: any, onError: any) => {
    set({ loading: true, error: null });
    try {
      // Replace this with your password update logic
      console.log('Password update not implemented. Replace with your logic.');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error updating password:', error);
      set({ loading: false, error: error.message });
      onError?.(error.message);
    }
  },
}));
