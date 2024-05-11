import { ThemeModeToggle } from "@/components/themeModeToggle";
import Notifications from "../../../notifications/page";
import UserAvatar from "@/components/user-avatar";

const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center max-w-7xl w-full md:mx-8">
      <div className="md:pl-72 px-6 text-black dark:text-white text-md text-base font-semibold tracking-tight">
        User Dashboard
      </div>

      <div className="ml-auto flex justify-end items-center gap-x-2">
        <ThemeModeToggle />
        <Notifications />
        <UserAvatar />
      </div>
    </div>
  );
};

export default DashboardHeader;