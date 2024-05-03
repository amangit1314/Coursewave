"use client";

import useNotificationsStore from "@/zustand/notificationsStore";
import { Callout } from "@tremor/react";
import { useMemo } from "react";
import { CiBellOn, CiCircleCheck } from "react-icons/ci";
import { RiCheckboxCircleLine } from "react-icons/ri";

type NotificationItemProps = {
  id: string;
  title: string;
  message: string;
  color: "indigo" | "orange" | "emerald" | "yellow" | "red" | string;
  icon: any;
  isReaded: boolean;
};

export default function NotificationItem({
  id,
  title,
  icon,
  color,
  message,
  isReaded,
}: NotificationItemProps) {
  // const readNotification = useNotificationsStore((state) =>
  //   state.readNotification(id)
  // );

  // const isRead = useMemo(() => {
  //   // Access data from store or props to determine read state
  //   return isReaded; // Assuming 'isRead' is a prop
  // }, [isReaded]); // Re-calculate only when 'isRead' prop changes

  return (
    <Callout
      className="mt-4 rounded-xl hover:shadow-md cursor-pointer line-clamp-2"
      title={title ? title : "No critical system data"}
      icon={CiBellOn}
      color={color ? color : "teal"}
      content={
        message
          ? message
          : "All systems are currently within their default operating ranges."
      }
    >
      {message
        ? message
        : "All systems are currently within their default operating ranges."}

      <div className="flex justify-start items-center text-[12px] mt-2 space-x-2 text-white hover:text-blue-600 transition-all duration-300">
        Mark as read <CiCircleCheck size={16} className="ml-1" />
      </div>
    </Callout>
  );
}
