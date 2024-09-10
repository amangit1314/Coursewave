"use client";

import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { useNotificationsStore } from "@/zustand/notificationsStore";
import NotificationItem from "./notifications/notification-item";

type Notification = {
  id: string;
  title: string;
  message?: string;
  color: "indigo" | "orange" | "emerald" | "yellow" | "red";
  icon: any;
  isReaded: boolean;
};

export default function Notifications() {
  const values = useNotificationsStore((state) => state.notifications);
  const setValues = useNotificationsStore((state) => state.setNotification);

  const clearValues = useNotificationsStore(
    (state) => state.clearNotifications,
  );

  const [notifications, setNotifications] = React.useState<Notification[]>(
    values ?? [
      {
        title: "Welcome to Coursewave",
        icon: RiCheckboxCircleLine,
        color: "indigo",
        message:
          "All systems are currently within their default operating ranges.",
        isReaded: false,
      },
      {
        title: "Explore variety of courses",
        icon: RiCheckboxCircleLine,
        color: "orange",
        message:
          "All systems are currently within their default operating ranges.",
        isReaded: false,
      },
    ],
  );

  console.log("Notifications: ", notifications);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative h-10 w-10 rounded-md transition-all duration-200 ease-in-out dark:bg-transparent dark:hover:bg-zinc-800"
          aria-label="Notification"
        >
          <div className="cursor-pointer items-center rounded-md border border-opacity-10 bg-transparent p-3 text-center transition-all duration-200 hover:bg-slate-50 dark:hover:border-opacity-100 dark:hover:bg-zinc-800">
            <IoNotificationsOutline size={16} />
          </div>

          {/* length of unread notification */}
          {notifications.length > 0 ? (
            <span className="absolute inset-0 -mr-6 object-right-top">
              <div className="inline-flex items-center rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
                {notifications.length}
              </div>
            </span>
          ) : (
            <div></div>
          )}
        </button>
      </SheetTrigger>

      <ScrollArea className="h-full max-h-[70vh]">
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              All your notifications will appear here.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            {notifications.length ? (
              <div>
                {notifications.map((notification: Notification, index: any) => {
                  return (
                    <div key={index}>
                      <NotificationItem
                        id={index}
                        title={notification.title}
                        icon={notification.icon}
                        color={notification.color}
                        message={
                          notification.message ?? "Default notification message"
                        }
                        isReaded={false}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <SheetFooter>
            {notifications.length > 0 ? (
              <Button
                type="submit"
                color="red"
                onClick={clearValues}
                className="font-semibold text-white dark:text-black"
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
