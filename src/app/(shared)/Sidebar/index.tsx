import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Orbitron, Poppins } from "next/font/google";
import { 
  Home,
  BookOpen,
  GraduationCap,
  Users,
  MessageSquare,
  FileText,
  Settings,
  HelpCircle,
  BarChart3,
  X,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-expanded");
      return stored ? stored === "true" : true;
    }
    return true;
  });

  // Handle click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // Handle Escape key
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  // Handle sidebar state in localStorage
  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    document.documentElement.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/courses", icon: BookOpen, label: "Courses" },
    { href: "/learning", icon: GraduationCap, label: "My Learning" },
    { href: "/community", icon: Users, label: "Community" },
    { href: "/messages", icon: MessageSquare, label: "Messages" },
    { href: "/articles", icon: FileText, label: "Articles" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const bottomMenuItems = [
    { href: "/settings", icon: Settings, label: "Settings" },
    { href: "/help", icon: HelpCircle, label: "Help & Support" },
  ];

  return (
    <aside
      ref={sidebar}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col",
        "transform transition-transform duration-300 ease-in-out",
        "bg-gradient-to-br from-white via-gray-50 to-gray-100",
        "dark:from-gray-900 dark:via-gray-800 dark:to-gray-900",
        "border-r border-gray-200 dark:border-gray-800",
        "lg:static lg:translate-x-0",
        !sidebarOpen && "-translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link
          href="/browseCourses"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20">
            <Image
              src="/courseWaveFaviconColored.png"
              alt="CourseWave Logo"
              width={24}
              height={24}
              className="brightness-0 invert"
              priority
            />
          </div>
          <span className={cn(
            orbitron.className,
            "text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700",
            "dark:from-white dark:to-gray-300"
          )}>
            CourseWave
          </span>
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 lg:hidden transition-colors duration-200"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <nav className="space-y-6">
          <div>
            <h3 className={cn(
              poppins.className,
              "px-3 text-xs font-semibold uppercase tracking-wider",
              "text-gray-500 dark:text-gray-400"
            )}>
              Menu
            </h3>
            <ul className="mt-3 space-y-1">
              {menuItems.map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2",
                      "text-sm font-medium transition-colors duration-150",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      pathname === href
                        ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-150",
                      pathname === href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
                    )} />
                    <span className={poppins.className}>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={cn(
              poppins.className,
              "px-3 text-xs font-semibold uppercase tracking-wider",
              "text-gray-500 dark:text-gray-400"
            )}>
              Support
            </h3>
            <ul className="mt-3 space-y-1">
              {bottomMenuItems.map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2",
                      "text-sm font-medium transition-colors duration-150",
                      "hover:bg-gray-100 dark:hover:bg-gray-800",
                      pathname === href
                        ? "bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300",
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors duration-150",
                      pathname === href
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400"
                    )} />
                    <span className={poppins.className}>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
