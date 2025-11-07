"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { dmSans } from "@/lib/config/fonts";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "../common/ThemeModeToggle";
import { Menu, X, ChevronDown, LogIn, Rocket, User } from "lucide-react";

type LandingPageHeaderProps = {
  handleLoginClick: () => void;
  isLoggedIn?: boolean;
  userAvatar?: string;
};

const NAV_LINKS = [
  { name: "Courses", link: "/browse" },
  { name: "Articles", link: "/articles" },
  // { name: "Sessions", link: "/browseSessions" },
  // { name: "Community", link: "/communityChat" },
  { name: "Roadmaps", link: "/roadmaps" },
  { name: "Projects", link: "/projects" },
] as const;

const LandingPageHeader: React.FC<LandingPageHeaderProps> = ({
  handleLoginClick,
  isLoggedIn = false,
  userAvatar,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-screen border-b border-gray-200/50 bg-white/90 backdrop-blur-xl dark:border-gray-800/50 dark:bg-black/90">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* Left section: Logo and Desktop Navigation */}
        <div className="flex justify-start items-center space-x-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex cursor-pointer items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Image
              src="/assets/images/logo/coursewave-favicon-color.png"
              alt="CourseWave Logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8"
            />
            <p className={`${dmSans.className} text-lg font-extrabold capitalize tracking-tight text-blue-500 sm:text-xl`}>
              Coursewave
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-3 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.link}
                href={link.link}
                className={`${dmSans.className} text-sm font-medium text-gray-800 transition-colors duration-200 hover:text-blue-500 dark:text-white dark:hover:text-blue-500`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section: Desktop Actions */}
        <div className="hidden items-center space-x-3 md:flex md:justify-end">
          <ThemeModeToggle />

          {isLoggedIn ? (
            <Link href="/profile">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-dm-sans h-9 w-9 rounded-full p-0 sm:h-10 sm:w-10"
                >
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="User profile"
                      width={32}
                      height={32}
                      className="h-full w-full rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </Button>
              </motion.div>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <motion.div
                  // whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    onClick={handleLoginClick}
                    variant="outline"
                    size="sm"
                    className="font-dm-sans cursor-pointer text-[0.875rem] shadow-none group relative h-[1.125rem] overflow-hidden border border-blue-500 bg-transparent hover:bg-blue-500 text-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:border-transparent dark:hover:bg-blue-600 dark:hover:text-white pl-[0.75rem] pr-[1rem] text-xs font-semibold tracking-wide transition-all duration-300 hover:shadow-lg  sm:h-10 sm:px-5 sm:text-sm"
                  >
                    <LogIn className="h-[0.75rem] w-[0.75rem] transition-transform duration-300" />
                    LOGIN
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-500/0 to-cyan-500/0 transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-cyan-500/10" />
                  </Button>
                </motion.div>
              </Link>

              {/* <Link href="/register" className="hidden sm:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="sm"
                    className="font-dm-sans group relative h-9 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 px-4 text-xs font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 sm:h-10 sm:px-5 sm:text-sm"
                  >
                    <Rocket className="mr-2 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-12" />
                    GET STARTED
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600/0 via-blue-700/0 to-cyan-600/0 transition-all duration-300 group-hover:from-blue-600/20 group-hover:via-blue-700/20 group-hover:to-cyan-600/20" />
                  </Button>
                </motion.div>
              </Link> */}
            </>
          )}
        </div>

        {/* Mobile section: Theme toggle and menu button */}
        <div className="flex items-center space-x-3 md:hidden">
          <ThemeModeToggle />

          <motion.button
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border-2 border-blue-500/20 bg-gradient-to-br from-blue-50 to-cyan-50 transition-all duration-300 hover:border-blue-500 hover:shadow-lg dark:border-blue-400/20 dark:from-blue-950/20 dark:to-cyan-950/20 dark:hover:border-blue-400"
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <X className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <Menu className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-cyan-500/10" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-gray-200/50 bg-white/95 backdrop-blur-xl dark:border-gray-800/50 dark:bg-black/95 lg:hidden"
          >
            <div className="px-4 py-6 sm:px-6">
              {/* Mobile Navigation Links */}
              <nav className="mb-6 space-y-4">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.link}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href={link.link}
                      onClick={closeMobileMenu}
                      className="font-dm-sans block text-base font-medium text-gray-800 transition-colors duration-200 hover:text-blue-500 dark:text-white dark:hover:text-blue-500"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Action Buttons */}
              <div className="space-y-4">
                {isLoggedIn ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: NAV_LINKS.length * 0.08,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href="/profile"
                      className="block w-full"
                      onClick={closeMobileMenu}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button className="font-dm-sans w-full justify-center text-sm font-medium">
                          <User className="mr-2 h-4 w-4" />
                          MY PROFILE
                        </Button>
                      </motion.div>
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: NAV_LINKS.length * 0.08,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href="/login"
                        className="block w-full"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            onClick={handleLoginClick}
                            variant="outline"
                            className="font-dm-sans group relative w-full justify-center border border-blue-500/20 bg-transparent text-sm font-semibold tracking-wide text-blue-600 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 dark:border-blue-400/20 dark:text-blue-400 dark:hover:border-blue-400 dark:hover:bg-blue-950/20"
                          >
                            <LogIn className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            LOGIN
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: (NAV_LINKS.length + 1) * 0.08,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href="/register"
                        className="block w-full"
                        onClick={closeMobileMenu}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button className="font-dm-sans group relative w-full justify-center text-sm bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25">
                            <Rocket className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-12" />
                            GET STARTED
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default LandingPageHeader;
