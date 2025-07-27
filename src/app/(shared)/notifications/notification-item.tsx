"use client";

import {
  useNotificationsStore,
  Notification,
} from "@/zustand/notificationsStore";
import { CiBellOn, CiCircleCheck, CiTrash } from "react-icons/ci";
import { cn } from "@/lib/utils";

import React from "react";
type NotificationItemProps = Omit<Notification, "icon"> & { icon?: React.ReactNode };

export default function NotificationItem({ icon, ...notification }: NotificationItemProps) {
  const readNotification = useNotificationsStore(
    (state) => state.readNotification
  );
  const removeNotification = useNotificationsStore(
    (state) => state.removeNotification
  );

  const handleMarkAsRead = () => {
    readNotification(notification.id);
  };

  return (
    <div
      className={cn(
        "group relative mt-4 flex flex-col gap-2 rounded-xl border p-4 transition-all duration-300",
        "hover:shadow-lg",
        "dark:bg-zinc-800/50 dark:border-zinc-700",
        notification.isReaded ? "bg-zinc-50/50" : "bg-white",
        notification.isReaded
          ? "border-zinc-100"
          : `border-${notification.color}-100`
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* notification item*/}
          <div
            className={cn(
              "flex p-2 items-center justify-center rounded-full",
              `bg-${notification.color}-100 text-${notification.color}-600`,
              "dark:bg-zinc-700 dark:text-zinc-300"
            )}
          >
            {icon ? icon : <CiBellOn />}
          </div>

          {/* column */}
          <div>
            <h3
              className={cn(
                "text-sm font-medium",
                notification.isReaded ? "text-zinc-600" : "text-zinc-900",
                "dark:text-zinc-200"
              )}
            >
              {notification.title || "No critical system data"}
            </h3>
            <p
              className={cn(
                "mt-1 text-sm",
                notification.isReaded ? "text-zinc-500" : "text-zinc-600",
                "dark:text-zinc-400"
              )}
            >
              {notification.message ||
                "All systems are currently within their default operating ranges."}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 self-end">
        <button
          onClick={() => handleMarkAsRead()}
          className={cn(
            "flex items-center gap-2 text-xs font-medium",
            "transition-colors duration-200",
            notification.isReaded
              ? "text-zinc-400 hover:text-zinc-600"
              : "text-blue-500 hover:text-blue-600",
            "dark:text-zinc-400 dark:hover:text-zinc-300"
          )}
        >
          {notification.isReaded ? "Marked as read" : "Mark as read"}
          <CiCircleCheck
            className={cn(
              "h-4 w-4",
              notification.isReaded ? "text-zinc-400" : "text-blue-500"
            )}
          />
        </button>
        <button
          onClick={() => removeNotification(notification.id)}
          className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          Remove
          <CiTrash />
        </button>
      </div>
    </div>
  );
}
