"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Settings, LogOut, Mail, Globe, Crown } from "lucide-react";
import { RiInstagramFill } from "react-icons/ri";
import { FaGithub, FaSquareXTwitter, FaLinkedinIn } from "react-icons/fa6";
import toast from "react-hot-toast";
import "@uploadthing/react/styles.css";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { useRouter } from "next/navigation";
import DeleteAccountWidget from "./_components/DeleteAccountWidget";
import ChangePasswordWidget from "./_components/ChangePasswordWidget";
import EditProfileWidget from "./_components/EditProfileWidget";
import { useUserStore } from "@/zustand/userStore";
import { useBecomeInstructor } from "@/hooks/useAccount";
import QuickActions from "./_components/QuickActions";
import { IMAGES } from "@/constants/images";

const Profile = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const becomeInstructor = useBecomeInstructor();

  // Check if user is an instructor
  const isInstructor = user?.roles?.includes("INSTRUCTOR") || false;

  const handleBecomeInstructor = async () => {
    if (!user?.id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    try {
      await becomeInstructor.mutateAsync({
        bio: user?.about || "",
        expertise: [],
      });
      toast.success("Congratulations! You are now an instructor.");
      router.push(`/profile/${user.id}`);
    } catch (error: any) {
      if (error.response?.status === 402) {
        toast.success("You are already an instructor. Redirecting...");
        router.push(`/profile/${user.id}`);
        return;
      }
      toast.error(
        error.response?.data?.message ||
          "Failed to become an instructor. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-8xl md:my-8 rounded-xl overflow-hidden p-4">
        {/* Header with Cover Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative mb-16 sm:mb-20 md:mb-24"
        >
          {/* Cover Image */}
          <div className="relative h-24 md:h-32 w-full">
            <Image
              src={
                // user?.profileImageUrl
                //   ? user?.profileImageUrl
                //   : 
                  IMAGES.FALLBACK_IMAGE
              }
              alt="Profile cover"
              fill
              className="object-cover rounded-xl sm:rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl sm:rounded-2xl" />

            {/* Header Actions */}
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2 sm:gap-3">
              <ThemeModeToggle />
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 p-4 cursor-pointer backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm flex items-center gap-2"
                onClick={() => router.push("/auth/logout")}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Profile Info Overlay */}
          <div className="absolute -bottom-12 sm:top-16 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8">
            <div className="flex justify-center items-center gap-4">
              {/* Profile Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 border-4 border-white dark:border-zinc-800 shadow-lg">
                  {user?.profileImageUrl ? (
                    <AvatarImage
                      src={user?.profileImageUrl || IMAGES.DEFAULT_AVATAR}
                      alt={user?.name || "User"}
                    />
                  ) : (
                    <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 bg-blue-500 text-white sm:bottom-1 -right-2 sm:right-1.5 h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0"
                  variant="secondary"
                >
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <div className="flex-1 min-w-0 text-black dark:text-white mb-4">
          {/* Username and instructor badge */}
          <div className="flex flex-row justify-center items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {user?.name || "User Name"}
            </h1>
            {isInstructor && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 flex-shrink-0 w-fit">
                <Crown className="h-3 w-3 mr-1" />
                Instructor
              </Badge>
            )}
          </div>

          {/* User bio */}
          <p className="text-sm sm:text-base lg:text-lg dark:text-white text-center mb-2 sm:mb-3 line-clamp-2">
            {user?.about ??
              `Full Stack Developer & Course Creator. Helping aspiring developers
            learn the skills they need to succeed in the tech industry.`}
          </p>

          {/* user other info */}
          <div className="flex justify-center mx-auto flex-wrap gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
              <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 lg:gap-4">
          {/* Center & Right Columns - Settings & Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border border-border shadow-sm bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-500" />
                    Account Settings
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 gap-4">
                  <EditProfileWidget />
                  <ChangePasswordWidget />
                  <DeleteAccountWidget />
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Follow Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border border-border shadow-sm bg-card overflow-hidden">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                      <Globe className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      Follow CourseWave
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 flex items-center justify-center gap-5 flex-wrap">
                  {[
                    {
                      href: "#",
                      color: "from-pink-500 to-red-500",
                      icon: <RiInstagramFill size={22} />,
                      label: "Instagram",
                    },
                    {
                      href: "#",
                      color: "from-blue-500 to-blue-600",
                      icon: <FaSquareXTwitter size={22} />,
                      label: "Twitter",
                    },
                    {
                      href: "#",
                      color: "from-blue-600 to-blue-700",
                      icon: <FaLinkedinIn size={22} />,
                      label: "LinkedIn",
                    },
                    {
                      href: "#",
                      color: "from-gray-700 to-gray-800",
                      icon: <FaGithub size={22} />,
                      label: "GitHub",
                    },
                  ].map((social, idx) => (
                    <Link
                      key={idx}
                      href={social.href}
                      aria-label={`Follow us on ${social.label}`}
                      className={`p-3 rounded-full bg-gradient-to-r ${social.color} text-white shadow-md 
            hover:shadow-${social.color.split(" ")[1]}-500/40 
            hover:scale-110 focus:ring-2 focus:ring-offset-2 focus:ring-${social.color.split(" ")[1]}-400 
            transition-all duration-300 ease-out`}
                    >
                      {social.icon}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
