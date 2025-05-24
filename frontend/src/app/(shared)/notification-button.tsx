/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { useNotificationsStore } from "@/zustand/notificationsStore";
import NotificationItem from "./notifications/notification-item";
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
    (state) => state.clearNotifications
  );

  const [notifications, setNotifications] = React.useState<Notification[]>(
    values && values.length > 0
      ? values
      : [
          {
            id: "1",
            title: "Welcome to Coursewave",
            icon: RiCheckboxCircleLine,
            color: "indigo",
            message:
              "All systems are currently within their default operating ranges.",
            isReaded: false,
          },
          {
            id: "2",
            title: "Explore variety of courses",
            icon: RiCheckboxCircleLine,
            color: "orange",
            message:
              "All systems are currently within their default operating ranges.",
            isReaded: false,
          },
        ]
  );

  console.log("Notifications: ", notifications);
  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* <button
          className="relative h-10 w-10 rounded-md transition-all cursor-pointer duration-200 ease-in-out dark:bg-transparent group dark:group-hover:bg-zinc-800"
          aria-label="Notification"
        >
          <div className="cursor-pointer items-center rounded-md border border-opacity-10 bg-transparent p-3 text-center transition-all duration-200 group-hover:bg-slate-50 dark:group-hover:border-opacity-100 dark:group-hover:bg-zinc-800">
            <IoNotificationsOutline size={16} />
          </div>

          {notifications.length > 0 ? (
            <span className="absolute inset-0 -mr-6 -mt-2 object-right-top">
              <div className="inline-flex items-center rounded-full bg-blue-800 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
                {notifications.length}
              </div>
            </span>
          ) : (
            <div></div>
          )}
        </button> */}

        <div className="relative">
          <button
            className="relative rounded-md transition-all w-10 h-10 duration-200 ease-in-out dark:bg-transparent group dark:hover:border-transparent hover:border-transparent dark:group-hover:bg-blue-600 group-hover:bg-blue-600 group-hover:text-white cursor-pointer"
            aria-label="Notification"
          >
            <div className="cursor-pointer flex items-center justify-center w-full h-full rounded-md border border-opacity-10 bg-transparent transition-all duration-200 group-hover:bg-slate-50 dark:group-hover:border-opacity-100 dark:group-hover:bg-zinc-800">
              <IoNotificationsOutline size={16} />
            </div>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1">
                <div className="inline-flex items-center rounded-full bg-blue-800 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
                  {notifications.length}
                </div>
              </span>
            )}
          </button>
        </div>
      </SheetTrigger>

      <ScrollArea className="h-full max-h-[70vh] bg-white dark:bg-zinc-900">
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
