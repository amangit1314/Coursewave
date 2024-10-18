import Sidebar from "../(courses)/browse/_components/sidebar";

interface HelpAndSupportLayoutProps {
  children: React.ReactNode;
}

export default function HelpAndSupportLayout({
  children,
}: HelpAndSupportLayoutProps) {
  return (
    <div className="h-full dark:bg-zinc-900">
      {/* <div className="h-[60px] md:pl-56 fixed inset-y-0 w-full z-50 ">
            <Navbar />
        </div> */}
      <div className="fixed inset-y-0 z-50 hidden h-full md:flex">
        <Sidebar />
      </div>
      <div className="h-full md:pl-64">{children}</div>
    </div>
  );
}
