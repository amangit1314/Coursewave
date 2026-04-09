"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { ThemeModeToggle } from "../../components/common/ThemeModeToggle";
import Notifications from "../../components/common/NotificationButton";
import UserAvatar from "../../components/common/UserAvatar";
import Sidebar from "@/app/(public)/browse/_components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Video,
  Menu,
  Search,
  CalendarDays,
} from "lucide-react";
import { motion } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";

interface SessionsLayoutProps {
  children: React.ReactNode;
}

const SessionsLayout = ({ children }: SessionsLayoutProps) => {
  const pathname = usePathname();
  const isMeetRoute = pathname.includes("/meet");

  return (
    <div className="h-full min-h-screen dark:bg-zinc-950 bg-gray-50">
      {/* Desktop Sidebar - Hidden on meet routes */}
      {!isMeetRoute && (
        <div className="fixed inset-y-0 z-40 hidden h-full md:flex">
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className={`h-full ${!isMeetRoute ? "md:pl-64" : ""}`}>
        {!isMeetRoute && <SessionsNav />}
        {children}
      </div>
    </div>
  );
};

const SessionsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabs = [
    {
      name: "Browse",
      href: "/browseSessions",
      icon: Search,
    },
    {
      name: "My Sessions",
      href: "/mySessions",
      icon: CalendarDays,
    },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <div className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <Sidebar />
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white leading-tight">
                  Sessions
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeModeToggle />
            <Notifications />
            {user ? (
              <UserAvatar />
            ) : (
              <Button
                onClick={() => router.push("/login")}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Tab navigation */}
        <nav className="-mb-px flex gap-1 overflow-x-auto scrollbar-hide pb-0">
          {tabs.map((tab) => {
            const active = isActive(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
                {active && (
                  <motion.div
                    layoutId="sessions-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default SessionsLayout;
