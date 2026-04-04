"use client";

import { generateUid } from "@/lib/helpers/id-helper";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "./safe-storage";
import { BellRing, X } from "lucide-react";

export type Notification = {
  id: string;
  title: string;
  message?: string;
  color: "indigo" | "orange" | "emerald" | "yellow" | "red";
  icon: string; // icon is now a string key, not a component
  isReaded: boolean;
};

type State = {
  notifications: Notification[];
  loading: boolean;
  error?: string | null;
};

type Actions = {
  setNotification: (title: string, message?: string) => void;
  readNotification: (notificationId: string) => void;
  removeNotification: (notificationId: string) => void;
  clearNotifications: () => void;
};

export const useNotificationsStore = create<State & Actions>()(
  persist(
    (set) => ({
      notifications: [],
      loading: false,
      error: null,
      setNotification: (title: string, message?: string) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              id: generateUid(),
              title,
              message,
              color: "emerald",
              icon: "BellRing", // use string key for icon
              isReaded: false,
            },
          ],
        })),
      removeNotification: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== notificationId
          ),
        })),
      readNotification: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isReaded: true }
              : notification
          ),
        })),
      clearNotifications: () => set(() => ({ notifications: [] })),
    }),

    {
      name: "Coursewave-Notification-Store",
      storage: safeLocalStorage,
    }
  )
);
