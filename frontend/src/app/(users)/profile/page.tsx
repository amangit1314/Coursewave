"use client";

import axios from "axios";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  Settings,
  Trash2,
  LogOut,
  User,
  Mail,
  Globe,
  Users,
  Award,
  HelpCircle,
  Share2,
  ChevronRight,
  Crown,
  Zap,
  Heart,
  Bell,
  Lock,
} from "lucide-react";
import { SiGmail } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { FaGithub, FaSquareXTwitter, FaLinkedinIn } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
// import { useUserInfo } from "@/hooks/useUserInfo";
import "@uploadthing/react/styles.css";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormDescription,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadDropzone } from "@/lib/utils/uploadthing";
import { DialogClose } from "@radix-ui/react-dialog";
import { ThemeModeToggle } from "@/app/(shared)/ThemeModeToggle";
import { useRouter } from "next/navigation";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { PiSignOut, PiStudentFill } from "react-icons/pi";
import { useUserStore } from "@/zustand/userStore";

const Profile = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const { instructor } = useInstructorInfo(user?.id || "");

  console.log("User in profile: ", user);

  // Check if user is an instructor
  const isInstructor = user?.roles?.includes("INSTRUCTOR") || false;

  const handleBecomeInstructor = async () => {
    if (!user?.id) {
      toast.error("User not found. Please log in again.");
      return;
    }

    const token = localStorage.getItem("coursewave_access_token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5002/api/profile/${user.id}/become-instructor`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Congratulations! You are now an instructor.");
      router.push(`/profile/${user.id}`);
    } catch (error: any) {
      console.error("Error becoming instructor:", error);
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

  // Mock user stats for demonstration
  const userStats = {
    coursesEnrolled: 12,
    certificatesEarned: 8,
    totalHours: 156,
    averageRating: 4.8,
    streakDays: 23,
    level: "Advanced",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <Toaster />

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
                user?.profileImageUrl
                  ? user?.profileImageUrl
                  : "https://github.com/shadcn.png"
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
                  <AvatarImage
                    src={
                      user?.profileImageUrl || "https://github.com/shadcn.png"
                    }
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-1 bg-blue-500 text-white sm:-bottom-2 -right-2 sm:-right-2 h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0"
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
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full bg-gray-200 dark:bg-zinc-800">
              <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="truncate">
                {user?.email || "user@example.com"}
              </span>
            </div>

            {/* <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full bg-gray-200 dark:bg-zinc-800">
              <Calendar className="h-4 w-4 flex-shrink-0 text-primary" />
              <span> Date Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4">
          {/* Left Column - Stats & Quick Actions */}
          <div className="space-y-4">
            {/* User Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-blue-500" />
                    Learning Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="text-center p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                        {userStats.coursesEnrolled}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-600/70 dark:text-blue-400/70">
                        Courses
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                      <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                        {userStats.certificatesEarned}
                      </div>
                      <div className="text-xs sm:text-sm text-green-600/70 dark:text-green-400/70">
                        Certificates
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                      <div className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                        {userStats.totalHours}h
                      </div>
                      <div className="text-xs sm:text-sm text-purple-600/70 dark:text-purple-400/70">
                        Hours
                      </div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                      <div className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                        {userStats.streakDays}
                      </div>
                      <div className="text-xs sm:text-sm text-orange-600/70 dark:text-orange-400/70">
                        Day Streak
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <span className="font-medium">Level</span>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-0"
                    >
                      {userStats.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className={`w-full cursor-pointer flex items-center gap-2 justify-start overflow-hidden whitespace-nowrap text-ellipsis ${!isInstructor ? "hover:bg-blue-600 hover:text-white dark:hover:text-white dark:text-white cursor-pointer transition-all duration-200" : ""}`}
                    style={{ minWidth: 0 }}
                    onClick={
                      !isInstructor
                        ? handleBecomeInstructor
                        : () => {
                            if (instructor?.userId) {
                              router.push(
                                `/instructor/${instructor.userId}/analytics`
                              );
                            } else {
                              toast.error(
                                "Instructor profile not found. Please contact support."
                              );
                            }
                          }
                    }
                  >
                    {!isInstructor ? (
                      <>
                        <PiStudentFill className="h-4 w-4 flex-shrink-0 mr-2" />
                        <span className="truncate">Become Instructor</span>
                      </>
                    ) : (
                      <>
                        <Users className="h-4 w-4 flex-shrink-0 mr-2" />
                        <span className="truncate">Instructor Dashboard</span>
                      </>
                    )}
                  </Button>

                  {/* <Button
                    variant="outline"
                    className={`w-full justify-start ${!isInstructor ? 'hover:bg-blue-600 hover:text-white dark:hover:text-white dark:text-white cursor-pointer transition-all duration-200' : ''}`}
                    onClick={!isInstructor ? handleBecomeInstructor : () => {
                      if (instructor?.id) {
                        router.push(`/instructor/${instructor.id}/analytics`);
                      } else {
                        toast.error(
                          "Instructor profile not found. Please contact support."
                        );
                      }
                    }}
                  >
                    <PiSignOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button> */}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Center & Right Columns - Settings & Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
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
                  {/* <NotificationsSettingsWidget /> */}
                </CardContent>
              </Card>
            </motion.div>

            {/* Help & Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-green-500" />
                    Help & Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      {
                        icon: (
                          <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ),
                        title: "About CourseWave",
                        description: "Learn more about us",
                        bg: "bg-green-100 dark:bg-green-900/30",
                        text: "text-green-600 dark:text-green-400",
                      },
                      {
                        icon: (
                          <Share2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        ),
                        title: "Share App",
                        description: "Share with friends",
                        bg: "bg-purple-100 dark:bg-purple-900/30",
                        text: "text-purple-600 dark:text-purple-400",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className={`p-2 rounded-lg ${item.bg} flex-shrink-0`}
                          >
                            {item.icon}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-medium text-zinc-900 dark:text-white truncate">
                              {item.title}
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-500" />
                    Follow CourseWave
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center gap-4">
                    <Link
                      href="#"
                      className="p-2 text-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white hover:scale-110 transition-transform"
                    >
                      <RiInstagramFill size={20} />
                    </Link>
                    <Link
                      href="#"
                      className="p-2 text-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:scale-110 transition-transform"
                    >
                      <FaSquareXTwitter size={20} />
                    </Link>
                    <Link
                      href="#"
                      className="p-2 text-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-110 transition-transform"
                    >
                      <FaLinkedinIn size={20} />
                    </Link>
                    <Link
                      href="#"
                      className="p-2 text-center rounded-full bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:scale-110 transition-transform"
                    >
                      <FaGithub size={20} />
                    </Link>
                  </div>
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

const EditProfileImage = ({
  imageUrl,
  setImageUrl,
}: {
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const content = isEditing ? (
    <div className="w-full max-w-md mx-auto">
      <UploadDropzone
        endpoint={"profileImageUpdater"}
        onClientUploadComplete={(res: any) => {
          console.log("Uploadthing profile image upload response: ", res);
          console.log("Uploaded profile img url: ", res[0].url);
          setImageUrl(res[0].url);
          setIsEditing(false);
          toast.success("Profile Image uploaded successfully!");
        }}
        onUploadError={(error: Error) => {
          toast.error(`${error?.message}`);
        }}
      />
    </div>
  ) : (
    <div className="flex justify-center">
      <Image
        src={imageUrl ? imageUrl : "/assets/images/user/user-01.png"}
        width={96}
        height={96}
        className="border-stroke h-24 w-24 rounded-full border object-cover"
        alt="profile"
      />
    </div>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {content}
        <Button
          size="sm"
          variant="outline"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0 bg-white dark:bg-zinc-800 shadow-md"
          onClick={handleEditClick}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  image: z.string(),
});

const EditProfileWidget = () => {
  const { user } = useUserStore();
  const [imageUrl, setImageUrl] = React.useState(user?.profileImageUrl || "");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user?.name || "",
      image: imageUrl,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.put(`api/profile/${user?.id}/`, {
        newUserName: values.userName,
        newProfileImageUrl: imageUrl,
      });
      console.log("Form Values: ", values);
      console.log("Response data after updating profile: ", response);
      toast.success("Profile data saved successfully!");
    } catch (err: any) {
      console.log("Error in updating profile: ", err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
              <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-zinc-900 dark:text-white truncate">
                Edit Profile
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                Update your profile information
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] top-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-950 dark:text-white text-center">
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-center">
            Make changes to your username and profile image. Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-zinc-800 dark:text-gray-100">
                    Profile Image
                  </FormLabel>
                  <FormControl>
                    <EditProfileImage
                      imageUrl={imageUrl}
                      setImageUrl={setImageUrl}
                    />
                  </FormControl>
                  <FormDescription className="text-center">
                    Click the camera icon to edit your profile image
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium text-zinc-800 dark:text-gray-100">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      className="border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800"
                      placeholder="Enter your username"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const changePasswordFormSchema = z.object({
  oldPassword: z.string().min(6, "Password must be at least 6 characters"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

const ChangePasswordWidget = () => {
  const { user } = useUserStore();

  const form = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
    try {
      const response = await axios.patch(
        `api/profile/${user?.id}/changePassword`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }
      );
      console.log("Response data after changing password: ", response);
      toast.success("Password changed successfully!");
      form.reset();
    } catch (err: any) {
      console.log("Error in updating password: ", err.message);
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 flex-shrink-0">
              <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-zinc-900 dark:text-white truncate">
                Change Password
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                Update your password
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] top-8">
        <DialogHeader>
          <DialogTitle className="text-zinc-950 dark:text-white text-center">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-center">
            Update your account password. Make sure to use a strong password.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800 dark:text-white">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isSubmitting}
                      placeholder="Enter current password"
                      className="bg-white dark:bg-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-800 dark:text-white">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isSubmitting}
                      placeholder="Enter new password"
                      className="bg-white dark:bg-zinc-800"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 6 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAccountWidget = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const [open, setOpen] = useState(false); // ✅ manual control

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`api/profile/${user?.id}`);
      toast.success("Account deleted successfully");
      setOpen(false);
      router.push("/auth/login");
    } catch (err: any) {
      console.log("Error deleting account: ", err.message);
      toast.error(err.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div
          onClick={() => setOpen(true)}
          className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 flex-shrink-0">
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-zinc-900 dark:text-white truncate">
                Delete Account
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                Permanently delete your account
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[500px] max-h-[30vh] bottom-8 right-8 space-y-0">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center items-center space-x-4">
          <button
            className="border-stroke cursor-pointer text-sm font-medium dark:text-white px-2 py-1 rounded-md"
            onClick={() => setOpen(false)} // ✅ closes the dialog
          >
            Cancel
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 cursor-pointer text-sm font-medium text-white px-3 py-1.5 rounded-md"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// const NotificationsSettingsWidget = () => {
//   return (
//     <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors cursor-pointer">
//       <div className="flex items-center gap-3 overflow-hidden">
//         <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
//           <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//         </div>
//         <div className="overflow-hidden">
//           <p className="font-medium text-zinc-900 dark:text-white truncate">
//             Notifications
//           </p>
//           <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
//             Manage your notifications
//           </p>
//         </div>
//       </div>
//       <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
//     </div>
//   );
// };
