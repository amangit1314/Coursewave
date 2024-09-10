"use client";

import { useNotificationsStore } from "@/zustand/notificationsStore";
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
      className="mt-4 line-clamp-2 cursor-pointer rounded-xl hover:shadow-md"
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

      <div className="mt-2 flex items-center justify-start space-x-2 text-[12px] text-white transition-all duration-300 hover:text-blue-600">
        Mark as read <CiCircleCheck size={16} className="ml-1" />
      </div>
    </Callout>
  );
}
