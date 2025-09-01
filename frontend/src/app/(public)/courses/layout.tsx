import { Poppins } from "next/font/google";

interface CourseLayoutProps {
  children: React.ReactNode;
}

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function CourseLayout({ children }: CourseLayoutProps) {
  return (
    <div className="h-full min-h-screen w-full dark:bg-zinc-900">
      <div className="h-full">
        <div className={poppins.className}>{children}</div>
      </div>
    </div>
  );
}
