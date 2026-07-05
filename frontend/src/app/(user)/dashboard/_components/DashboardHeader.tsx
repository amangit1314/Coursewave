import InstructorButton from "@/components/InstructorButton";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import UserAvatar from "@/components/common/UserAvatar";
import Notifications from "../notifications/page";

const DashboardHeader = () => {
  return (
    <div className="flex w-full max-w-7xl items-center justify-between md:mx-8">
      <div className="text-md px-6 text-base font-semibold tracking-tight text-foreground md:pl-72">
        User Dashboard
      </div>

      <div className="ml-auto flex items-center justify-end gap-x-2">
        {/* <InstructorButton /> */}
        <ThemeModeToggle />
        <Notifications />
        <UserAvatar />
      </div>
    </div>
  );
};

export default DashboardHeader;
