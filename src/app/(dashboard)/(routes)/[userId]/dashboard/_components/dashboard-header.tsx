import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import Notifications from "../../../notifications/page";
import UserAvatar from "@/components/user-avatar";

const DashboardHeader = () => {
  return (
    <div className="flex w-full max-w-7xl items-center justify-between md:mx-8">
      <div className="text-md px-6 text-base font-semibold tracking-tight text-black dark:text-white md:pl-72">
        User Dashboard
      </div>

      <div className="ml-auto flex items-center justify-end gap-x-2">
        <ThemeModeToggle />
        <Notifications />
        <UserAvatar />
      </div>
    </div>
  );
};

export default DashboardHeader;
