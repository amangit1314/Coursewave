import Navbar from "../(browseCourses)/browseCourses/_components/navbar";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";

interface WriteArticleLayoutProps {
  children: React.ReactNode;
}

export default function WriteArticleLayout({
  children,
}: WriteArticleLayoutProps) {
  return (
    <div className="dark:bg-zinc-9500 h-full min-h-screen">
      <div className="fixed inset-y-0 z-50 h-[60px] w-full">
        <Navbar />
      </div>
      {/* <div className="hidden md:flex h-full fixed inset-y-0 z-50">
        <Sidebar />
      </div> */}
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-start">
        {children}
      </div>
    </div>
  );
}
