import Navbar from "@/app/(public)/browse/_components/Navbar";
import Sidebar from "@/app/(public)/browse/_components/Sidebar";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SubscriptionLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="fixed inset-y-0 z-50 h-[64px] w-full">
        <Navbar />
      </div>

      <div
        id="cta-button-sidebar"
        className="fixed inset-y-0 z-50 hidden h-full md:flex"
      >
        <Sidebar />
      </div>

      <div className={"h-full md:pl-64 md:pt-16"}>{children}</div>
    </div>
  );
}
