import Navbar from "../(browseCourses)/browseCourses/_components/navbar";
import Sidebar from "../(browseCourses)/browseCourses/_components/sidebar";

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <div className="min-h-screen h-full dark:bg-slate-900">
      <div className="max-w-3xl px-[1.5xl] mx-auto items-center h-full">
        {children}
      </div>
    </div>
  );
}
