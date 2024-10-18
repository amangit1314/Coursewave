import { generateUid } from "@/helpers/id-helper";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BellRing, X } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message?: string;
  color: "indigo" | "orange" | "emerald" | "yellow" | "red";
  icon: any;
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
  clearNotifications: () => Promise<void>;
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
              icon: BellRing,
              isReaded: false,
            },
          ],
        })),
      readNotification: (notificationId: string) =>
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, isReaded: true }
              : notification,
          ),
        })),
      clearNotifications: async () => set((state) => ({ notifications: [] })),
    }),

    {
      name: "Coursewave-Notification-Store",
      getStorage: () => ({
        setItem: (...args) => window.localStorage.setItem(...args),
        removeItem: (...args) => window.localStorage.removeItem(...args),
        getItem: async (...args) =>
          new Promise((resolve) => {
            if (typeof window === "undefined") {
              resolve(null);
            } else {
              setTimeout(() => {
                resolve(window.localStorage.getItem(...args));
              }, 0);
            }
          }),
      }),
    },
  ),
);
