"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { Skeleton } from "@/components/ui/skeleton";

import { ThemeModeToggle } from "../(shared)/ThemeModeToggle";
import Notifications from "../(shared)/NotificationButton";
import UserAvatar from "../(shared)/UserAvatar";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Video, Menu, X, Sidebar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { FaCompass } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";
import { AiOutlineTransaction } from "react-icons/ai";
import { FaBloggerB } from "react-icons/fa";
import { BiBroadcast } from "react-icons/bi";
import { PiChatsTeardropFill } from "react-icons/pi";
import { RiRoadMapLine } from "react-icons/ri";
import { GoProjectTemplate } from "react-icons/go";
import { Orbitron } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { Divider } from "@tremor/react";

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

interface BrowseSessionsLayoutProps {
  children: React.ReactNode;
}

const BrowseSessionsLayout = ({ children }: BrowseSessionsLayoutProps) => {
  const pathname = usePathname();
  const isMeetRoute = pathname.includes('/meet');

  return (
    <div className="h-full min-h-screen dark:bg-zinc-900">
      {/* Header */}
      {/* <SessionsHeader /> */}

      {/* Desktop Sidebar - Hidden on meet routes */}
      {!isMeetRoute && (
        <div className="fixed inset-y-0 z-40 hidden h-full md:flex">
          <Sidebar />
        </div>
      )}
      
      {/* Main Content */}
      <div className={` h-full ${!isMeetRoute ? 'md:pl-64 pt-6' : ''}`}>
        {/* SessionsTabs - Hidden on meet routes */}
        {!isMeetRoute && <SessionsTabs />}
        {children}
      </div>
    </div>
  );
};

const SessionsHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 dark:border-zinc-700 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <MobileSidebar onClose={() => setIsMobileMenuOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Sessions Hub</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Book, join, and manage your sessions</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Book your next session</span>
            </div>
            <ThemeModeToggle />
            <Notifications />
            <SessionsNavbarRoutes />
          </div>

          {/* Mobile Actions */}
          {/* <div className="flex items-center space-x-2 md:hidden">
            <ThemeModeToggle />
            <Notifications />
            <SessionsNavbarRoutes />
          </div> */}
        </div>
      </div>
  );
}

const MobileSidebar = ({ onClose }: { onClose: () => void }) => {
  const { user } = useUserStore();
  const router = useRouter();

  const routes = [
    {
      icon: <MdDashboard size={22} />,
      label: "Dashboard",
      href: `/${user?.id}/dashboard`,
      isLocked: user ? false : true,
    },
    {
      icon: <FaCompass size={22} />,
      label: "Courses",
      href: `/browse`,
      isLocked: false,
    },
    {
      icon: <FaBloggerB size={22} />,
      label: "Articles",
      href: `/articles`,
      isLocked: false,
    },
    {
      icon: <BiBroadcast size={22} />,
      label: "Sessions",
      href: `/browseSessions`,
      isLocked: false,
    },
    {
      icon: <RiRoadMapLine size={22} />,
      label: "Roadmaps",
      href: `/roadmaps`,
      isLocked: false,
    },
    {
      icon: <GoProjectTemplate size={22} />,
      label: "Projects",
      href: `/projects`,
      isLocked: false,
    },
    {
      icon: <PiChatsTeardropFill size={22} />,
      label: "Community Chat",
      href: `/communityChat`,
      isLocked: user ? false : true,
    },
    {
      icon: <AiOutlineTransaction size={22} />,
      label: "Subscription",
      href: `/subscription`,
      isLocked: user ? false : true,
    },
    {
      icon: <FaHandsHelping size={22} />,
      label: "Help & Support",
      href: `/helpAndSupport`,
      isLocked: user ? false : true,
    },
  ];

  const handleRouteClick = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="h-full bg-white dark:bg-zinc-900">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700" style={{ width: "100%", marginLeft: 64 }}>
        <Link href="/browseCourses" className="flex items-center space-x-2">
          <Image
        src="/assets/images/logo/coursewave-favicon-color.png"
        alt="CourseWave Logo"
        width={30}
        height={30}
        priority
          />
          <span className={`${orbitron.className} text-lg font-bold text-blue-500`}>
        CourseWave
          </span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className="p-4">
        <nav className="space-y-2">
          {routes.map((route, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                onClick={() => handleRouteClick(route.href)}
                disabled={route.isLocked}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                  route.isLocked
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="text-gray-500 dark:text-gray-400">{route.icon}</span>
                <span className="font-medium">{route.label}</span>
              </button>
            </motion.div>
          ))}
        </nav>
      </div>
    </div>
  );
};

const SessionsNavbarRoutes = () => {
  const router = useRouter();
  const { user, loadingState } = useUserStore();

  if (loadingState.loading) {
    return <Skeleton className="h-10 w-32 rounded-md" />;
  }

  const gotToSignIn = () => {
    router.push("/login");
  };

  return (
    <>
      {user ? (
        <UserAvatar />
      ) : (
        <Button
          onClick={gotToSignIn}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          Sign In
        </Button>
      )}
    </>
  );
};

const SessionsTabs = () => {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {
      name: "Browse Sessions",
      href: "/sessions/browseSessions",
      icon: Video,
      description: "Discover and book sessions"
    },
    {
      name: "Upcoming",
      href: "/sessions/upcomingSessions",
      icon: Calendar,
      description: "Your scheduled sessions"
    },
    {
      name: "Past Sessions",
      href: "/sessions/pastSessions",
      icon: Clock,
      description: "Session history"
    },
    {
      name: "Book Session",
      href: "/sessions/bookSession",
      icon: Users,
      description: "Schedule new session"
    }
  ];

  return (
    <div className="border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <SessionsHeader />
        {/* <Divider /> */}
        {/* <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.name}
                onClick={() => router.push(tab.href)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav> */}
      </div>
    </div>
  );
};

export default BrowseSessionsLayout;
