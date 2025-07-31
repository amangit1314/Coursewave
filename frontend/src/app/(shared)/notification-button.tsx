"use client";

import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  useNotificationsStore,
  Notification,
} from "@/zustand/notificationsStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import NotificationItem from "./notifications/notification-item";
import { BellRing, X } from "lucide-react";
import { CiBellOn } from "react-icons/ci";

export default function Notifications() {
  const notifications = useNotificationsStore((state) => state.notifications);

  const clearNotifications = useNotificationsStore(
    (state) => state.clearNotifications
  );

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isReaded
  );

  console.log("Notifications: ", notifications);

  // Icon map for string keys
  const iconMap: Record<string, React.ComponentType<any>> = {
    BellRing,
    X,
  };

  return (
    <Sheet>
      {/* Bell Icon */}
      <SheetTrigger asChild>
        <div className="relative">
          <button
            className="relative rounded-md transition-all w-10 h-10 duration-200 ease-in-out dark:bg-transparent group dark:hover:border-transparent hover:border-transparent dark:group-hover:bg-blue-600 group-hover:bg-blue-600 group-hover:text-white cursor-pointer"
            aria-label="Notification"
          >
            <div className="cursor-pointer flex items-center justify-center w-full h-full rounded-md border border-opacity-10 bg-transparent transition-all duration-200 group-hover:bg-slate-50 dark:group-hover:border-opacity-100 dark:group-hover:bg-zinc-800">
              <IoNotificationsOutline size={16} />
            </div>
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1">
                <div className="inline-flex items-center rounded-full bg-blue-800 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
                  {unreadNotifications.length}
                </div>
              </span>
            )}
          </button>
        </div>
      </SheetTrigger>

      {/* Notifications Sheet */}
      <ScrollArea className="h-full max-h-[70vh] bg-white dark:bg-zinc-900">
        <SheetContent className="bg-white dark:bg-zinc-900 overflow-y-scroll">
          {/* Notification Content Header */}
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              All your notifications will appear here.
            </SheetDescription>
          </SheetHeader>

          {/* Notifications List */}
          <div className="py-4">
            {notifications.length ? (
              <div>
                {notifications.map(
                  (notification: Notification, index: number) => {
                    return (
                      <div key={notification.id}>
                        <NotificationItem
                          id={notification.id}
                          title={notification.title}
                          icon={
                            iconMap[notification.icon]
                              ? React.createElement(iconMap[notification.icon])
                              : React.createElement(CiBellOn)
                          }
                          color={notification.color}
                          message={
                            notification.message ??
                            "Default notification message"
                          }
                          isReaded={notification.isReaded}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                  <img src="/assets/illustrations/no-notifications.webp" alt="No Notifications" className="w-32 h-32 mb-4 mx-auto" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    No notifications for now
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* clear notifications */}
          <SheetFooter>
            {notifications.length > 0 ? (
              <Button
                type="submit"
                color="red"
                onClick={clearNotifications}
                className="flex bottom-2 left-0 right-0 justify-center items-center mx-auto font-semibold text-black dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-all duration-200 cursor-pointer"
              >
                Clear Notifications
              </Button>
            ) : (
              <div></div>
            )}
          </SheetFooter>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
}
