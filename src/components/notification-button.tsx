import { IoNotificationsOutline } from "react-icons/io5";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";
import { Callout } from "@tremor/react";
import { RiCheckboxCircleLine } from "react-icons/ri";

export default function Notifications() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="relative  rounded-md  transition-all duration-200 ease-in-out dark:bg-transparent dark:hover:bg-zinc-800"
          aria-label="Notification"
        >
          <div className="cursor-pointer rounded-md p-3 text-center items-center bg-transparent hover:bg-slate-50 border dark:hover:bg-zinc-800   border-opacity-10 dark:hover:border-opacity-100 transition-all duration-200">
            <IoNotificationsOutline size={16} />
          </div>
          <span className="absolute inset-0 object-right-top -mr-6">
            <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-semibold leading-4 bg-blue-500 text-white">
              6
            </div>
          </span>
        </button>
      </SheetTrigger>
      <ScrollArea>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              All your notifications will appear here.
            </SheetDescription>
          </SheetHeader>

          <div className="py-4">
            <NotificationItem />
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button
                type="submit"
                color="red"
                className="text-white font-semibold"
              >
                Clear Notifications
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </ScrollArea>
    </Sheet>
  );
}

 function NotificationItem({ title, icon, color, content }: any) {
  return (
    <Callout
      className="mt-4"
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
