import Navbar from "../(browseCourses)/browseCourses/_components/navbar";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";

interface WriteArticleLayoutProps {
  children: React.ReactNode;
}

export default function WriteArticleLayout({ children }: WriteArticleLayoutProps) {
  return (
    <div className="min-h-screen h-full dark:bg-zinc-9500">
      <div className="h-[60px] fixed inset-y-0 w-full z-50 ">
        <Navbar />
      </div>
      {/* <div className="hidden md:flex h-full fixed inset-y-0 z-50">
        <Sidebar />
      </div> */}
      <div className="flex justify-start items-center max-w-7xl w-full mx-auto h-full">{children}</div>
    </div>
  );
}
