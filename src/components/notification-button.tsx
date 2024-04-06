import { IoNotificationsOutline } from "react-icons/io5";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Callout } from "@tremor/react";
import { RiCheckboxCircleLine } from "react-icons/ri";
import React from "react";

type NotificationItemProps = {
  title: string;
  icon: any;
  color: string;
  content: string;
};

export default function Notifications() {
  const [notifications, setNotifications] = React.useState<
    NotificationItemProps[]
  >([
    {
      title: "Welcome to Coursewave",
      icon: RiCheckboxCircleLine,
      color: "indigo",
      content:
        "All systems are currently within their default operating ranges.",
    },
    {
      title: "Explore variety of courses",
      icon: RiCheckboxCircleLine,
      color: "orange",
      content:
        "All systems are currently within their default operating ranges.",
    },
  ]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative h-10 w-10 rounded-md transition-all duration-200 ease-in-out dark:bg-transparent dark:hover:bg-zinc-800"
          aria-label="Notification"
        >
          <div className="cursor-pointer rounded-md p-3 text-center items-center bg-transparent hover:bg-slate-50 border dark:hover:bg-zinc-800 border-opacity-10 dark:hover:border-opacity-100 transition-all duration-200">
            <IoNotificationsOutline size={16} />
          </div>

          {/* length of unread notification */}
          {notifications.length > 0 ? (
            <span className="absolute inset-0 object-right-top -mr-6">
              <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-blue-500 text-white">
                {notifications.length}
              </div>
            </span>
          ) : (
            <div></div>
          )}
        </button>
      </SheetTrigger>
      <ScrollArea className="max-h-[70vh] h-full">
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              All your notifications will appear here.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            {notifications ? (
              <div>
                {notifications.map(
                  (notification: NotificationItemProps, index: any) => {
                    return (
                      <div key={index}>
                        <NotificationItem
                          title={notification.title}
                          icon={notification.icon}
                          color={notification.color}
                          content={notification.content}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <SheetFooter>
            {/* <SheetClose asChild> */}

            {notifications.length > 0 ? (
              <Button
                type="submit"
                color="red"
                onClick={clearNotifications}
                className="text-white font-semibold dark:text-black"
              >
                Clear Notifications
              </Button>
            ) : (
              <div></div>
            )}
            {/* </SheetClose> */}
          </SheetFooter>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
}

function NotificationItem({
  title,
  icon,
  color,
  content,
}: NotificationItemProps) {
  return (
    <Callout
      className="mt-4 rounded-xl hover:shadow-md cursor-pointer line-clamp-2"
      title={title ? title : "No critical system data"}
      icon={icon ? icon : RiCheckboxCircleLine}
      color={color ? color : "teal"}
    >
      {content
        ? content
        : "All systems are currently within their default operating ranges."}
    </Callout>
  );
}
