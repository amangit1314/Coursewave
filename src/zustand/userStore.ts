import { Course, User } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  user: User | null;
  savedCourses: Course[];
  token: string | null;
  loading: boolean;
  error: String | null;
};

type UserActions = {
  loginUser: (user: User) => Promise<void>;
  logOutUser: (userId: string) => Promise<void>;
  setUser: (user: User) => void;
  saveCourse: (course: Course) => Promise<void>;
  verifyEmail: () => Promise<void>;
  updateUserProfile: (
    userId: string,
    newUserName: string,
    newProfileImage: string
  ) => Promise<void>;
  becomeInstructor: (userId: string) => Promise<void>;
  updatePassword: (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
};

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      user: null,
      savedCourses: [],
      token: null,
      loading: false,
      error: null,
      loginUser: async (user: User) => {},
      logOutUser: async (userId: string) => {},
      setUser: (user: User) => {
        set({ user });
      },
      saveCourse: async (course: Course) => {},
      verifyEmail: async () => {},
      updateUserProfile: async (
        userId: string,
        newUserName: string,
        newProfileImage: string
      ) => {
        set({ loading: true, error: null });
        try {
          const response = await fetch(`/api/profile/${userId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              newUserName: newUserName,
              newProfileImageUrl: newProfileImage,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update profile ...");
          }

          const updatedUser = await response.json();
          set({ user: updatedUser, loading: false });
        } catch (error: any) {
          console.error("Error updating profile:", error);
          set({ loading: false, error: error.message });
        }
      },
      becomeInstructor: async (userId: string) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch("/api/becomeInstructor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: userId }),
          });

          if (!response.ok) {
            throw new Error("Failed to make user an instructor ...");
          }

          const updatedUser = await response.json();
          set({ user: updatedUser, loading: false });
        } catch (error: any) {
          console.error("Error making user an instructor:", error);
          set({ loading: false, error: error.message });
        }
      },
      updatePassword: async (
        userId: string,
        oldPassword: string,
        newPassword: string
      ) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(
            `/api/profile/${userId}/changePassword`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                oldPassword: oldPassword,
                newPassword: newPassword,
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to make user an instructor ...");
          }

          const updatedUser = await response.json();

          set({ user: updatedUser.data, loading: false });
        } catch (error: any) {
          console.error("Error making user an instructor:", error);
          set({ loading: false, error: error.message });
        }
      },
      deleteAccount: async (userId: string) => {
        set({ loading: true, error: null });

        try {
          const response = await fetch(`/api/profile/${userId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          });

          if (!response.ok) {
            throw new Error("Failed to delete user ...");
          }

          const updatedUser = await response.json();

          set({ user: updatedUser.data, loading: false });
        } catch (error: any) {
          console.error("Error making user an instructor:", error);
          set({ loading: false, error: error.message });
        }
      },
    }),
    { name: "Coursewave-User-Store", getStorage: () => localStorage }
  )
);
