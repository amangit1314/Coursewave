import Navbar from "../browse/_components/Navbar";
import Sidebar from "../browse/_components/Sidebar";

interface SubscriptionLayoutProps {
  children: React.ReactNode;
}

export default function SubscriptionLayout({
  children,
}: SubscriptionLayoutProps) {
  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      <div className="h-[60px] md:pl-56 fixed inset-y-0 w-full z-50 ">
        <Navbar />
      </div>
      <div className="fixed inset-y-0 z-50 hidden h-full md:flex">
        <Sidebar />
      </div>
      <div className="h-full md:pl-64 md:pt-10">{children}</div>
    </div>
  );
}
