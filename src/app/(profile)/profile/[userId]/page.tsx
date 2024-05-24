"use client";

import axios from "axios";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Divider, Title } from "@tremor/react";
import { SiGmail } from "react-icons/si";
import { Camera, Pencil } from "lucide-react";
import { RiInstagramFill } from "react-icons/ri";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaGithub, FaSquareXTwitter, FaLinkedinIn } from "react-icons/fa6";
import toast from "react-hot-toast";
import useUserInfo from "@/hooks/use-user-info";
import { ThemeModeToggle } from "@/components/themeModeToggle";
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
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadDropzone } from "@/utils/uploadthing";
import { DialogClose } from "@radix-ui/react-dialog";

const Profile = () => {
  const user = useUserInfo().user;

  return (
    <div className="p-4">
      <div className="overflow-hidden rounded-3xl border border-stroke border-gray-600 shadow-default dark:border-strokedark dark:bg-slate-900 shadow z-20 px-4 pt-6 pb-6 text-center lg:pb-8 xl:pb-11.5 m-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center border border-red-500 font-medium justify-center text-sm text-red-500 px-2 py-1 rounded-md bg-transparent hover:bg-red-600 hover:text-white cursor-pointer transition-all duration-300">
            Logout
          </div>
          <div className="flex items-end justify-end ml-auto">
            <ThemeModeToggle />
          </div>
        </div>

        <ProfileImage />

        <h3 className="flex justify-center items-center mt-4 text-2xl tracking-tight font-bold text-black dark:text-white space-x-2">
          {user ? user.name : "Aman Soni"}
          {/* <Pencil
            size={16}
            className="ut-upload-icon cursor-pointer duration-300 transition-all"
          /> */}
        </h3>

        <div className="flex text-black dark:text-gray-200 justify-center items-center pt-auto space-x-2">
          <div className="flex justify-start items-center">
            <SiGmail size={20} />
            <p className="pl-1.5 text-sm font-normal">
              {user ? user.email : "amansoni@gmail.com"}
            </p>
          </div>
        </div>

        <SwitchToInstructorButton />

        <Divider />

        <AccountSettingsSection />

        <Divider />

        <HelpAndSupportSection />

        <FollowCoursewaveOn />
      </div>
    </div>
  );
};

export default Profile;

const ProfileWithBackground = () => {
  const user = useUserInfo();
  return (
    <div className="relative">
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src={
            user
              ? user.user?.profileImageUrl!
              : "/assets/images/cover/cover-01.png"
          }
          alt="profile cover"
          className="max-h-[230px] h-full max-w-7xl w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          width={970}
          height={200}
        />

        <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
          <label
            htmlFor="cover"
            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-slate-900 py-1 px-2 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
          >
            <input type="file" name="cover" id="cover" className="sr-only" />
            <span>
              <Pencil size={18} />
            </span>
            <span>Edit</span>
          </label>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-[100px] w-[10px]"></div>
        <ProfileImage />
      </div>
    </div>
  );
};

const ProfileImage = () => {
  const user = useUserInfo();

  return (
    <div className="flex items-center mt-8 justify-center">
      <div className="relative max-h-44 max-w-44">
        <Image
          src={
            user
              ? user.user?.profileImageUrl ?? "/assets/images/user/user-01.png"
              : "/assets/images/user/user-02.png"
          }
          width={160}
          height={160}
          className="rounded-full h-[160px] w-[160px] border border-stroke"
          alt="profile"
        />
        <label
          htmlFor="profile"
          className="absolute bottom-0 right-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-white bg-slate-700 hover:bg-opacity-70 sm:bottom-2 sm:right-2"
        >
          <Camera size={18} />
          <input type="file" name="profile" id="profile" className="sr-only" />
        </label>
      </div>
    </div>
  );
};

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
    <UploadDropzone
      endpoint={"profileImageUpdater"}
      onClientUploadComplete={(res: any) => {
        console.log("Uploadthing profile image upload response: ", res);
        console.log("Uploaded profile img url: ", res[0].url);
        setImageUrl(res[0].url);
        setIsEditing(false); // Toggle back to false after upload
        toast.success("Profile Image uploaded successfully ...");
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
    />
  ) : (
    <Image
      src={imageUrl ? imageUrl : "/assets/images/user/user-01.png"}
      width={96}
      height={96}
      className="rounded-full h-[96px] w-[96px] border border-stroke"
      alt="profile"
    />
  );

  return (
    <div className="flex items-center mt-8 justify-center">
      <div className="relative max-h-44 max-w-44">
        {content}
        <label
          htmlFor="profile"
          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-white bg-slate-700 hover:bg-opacity-70 sm:bottom-2 sm:right-2"
          onClick={handleEditClick}
        >
          <Camera size={18} />
        </label>
      </div>
    </div>
  );
};

const formSchema = z.object({
  userName: z.string(),
  image: z.string(),
});

const EditProfileWidget = () => {
  const user = useUserInfo();

  const [imageUrl, setImageUrl] = React.useState(user.user?.profileImageUrl!);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user.user?.name!,
      image: imageUrl,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await axios
      .put(`api/profile/${user.user?.id}/`, {
        newUserName: values.userName,
        newProfileImageUrl: imageUrl,
      })
      .then((response) => {
        console.log("Form Values: ", values);
        console.log("Response data after creating course: ", response);
        toast.success("Profile data saved successfully ...");
      })
      .catch((err: any) => {
        console.log("Error in updating profile: ", err.message);
        toast.error(`Error: ${err.message}`);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600  hover:rounded-lg p-2 hover:text-white transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Edit Profile </p>
          <MdOutlineKeyboardArrowRight />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] w-full">
        <DialogHeader>
          <DialogTitle className="text-zinc-950 dark:text-white">
            Edit Profile
          </DialogTitle>
          <DialogDescription>
            Make changes in your username and image here. Click save when youre
            done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <div>
                  <FormItem className="mt-8">
                    <FormLabel className="my-4 text-base text-zinc-800 dark:text-gray-100 tracking-tight font-medium">
                      Edit profile image
                    </FormLabel>
                    <FormControl>
                      <EditProfileImage
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                      />
                      {/* <Input
                        disabled={isSubmitting}
                        className="bg-transparent border-gray-700 dark:border-gray-400 "
                        placeholder="i.e. 'Full Stack Bootcamp', etc..."
                        {...field}
                      /> */}
                    </FormControl>
                    <FormDescription className="">
                      Edit your profile image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <div>
                  <FormItem className="mt-8">
                    <FormLabel className="my-4 text-base text-zinc-800 dark:text-gray-100  tracking-tight font-medium">
                      Edit username
                    </FormLabel>
                    <FormControl>
                      {/* <EditProfileImage
                        imageUrl={imageUrl}
                        setImageUrl={setImageUrl}
                      /> */}
                      <Input
                        id="newUsername"
                        disabled={isSubmitting}
                        className="bg-transparent border-gray-700 dark:border-gray-400 "
                        placeholder={user.user?.name!}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      Edit your username
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save changes
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const SwitchToInstructorButton = () => {
  const user = useUserInfo().user;

  const isInstructor = user?.isInstructor!;

  const setInstructor = async () => {
    try {
      await axios.post(`/api/profile/${user?.id}/becomeInstructor`);
      toast.success("You are now instructor ✔️ ");
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  return (
    <button
      onClick={setInstructor}
      className="my-3 p-2 cursor-pointer font-bold text-blue-500 hover:bg-blue-700 hover:rounded-lg hover:p-2  rounded-lg hover:text-white transition-all duration-200"
    >
      {isInstructor ? "Switch to instructor view" : "Become Instructor"}
    </button>
  );
};

const AccountSettingsSection = () => {
  return (
    <div className="flex mt-4 space-y-5 flex-col items-start">
      <p className="text-md text-base font-semibold px-1 text-black  dark:text-white">
        Account Settings
      </p>

      <div className="flex group flex-col  space-y-2 max-w-7xl w-full  ">
        {/* <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 dark:hover:bg-blue-600 hover:text-white hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Edit Profile Data</p>
          <MdOutlineKeyboardArrowRight />
        </div> */}
        <EditProfileWidget />
        {/* <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600 hover:text-white hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Change Password</p>
          <MdOutlineKeyboardArrowRight />
        </div> */}
        <ChangePasswordWidget />
        {/* <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600  hover:rounded-lg p-2 hover:text-white transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Delete Account</p>
          <MdOutlineKeyboardArrowRight />
        </div> */}
        <DeleteAccountWidget />
        {/* <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600  hover:rounded-lg p-2 hover:text-white transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Notifications</p>
          <MdOutlineKeyboardArrowRight />
        </div> */}
      </div>
    </div>
  );
};

const changePasswordFormSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

const ChangePasswordWidget = () => {
  const user = useUserInfo();

  const form = useForm({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof changePasswordFormSchema>) => {
    await axios
      .patch(`api/profile/${user.user?.id}/changePassword`, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      })
      .then((response) => {
        console.log("Form Values: ", values);
        console.log("Response data after changing password: ", response);
        toast.success("User password changed successfully 👮🔒🥳 ...");
      })
      .catch((err: any) => {
        console.log("Error in updating profile: ", err.message);
        toast.error(`Error: ${err.message}`);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-emerald-400 dark:hover:from-emerald-600 hover:via-green-400 hover:to-emerald-400 dark:hover:bg-emerald-600 hover:text-white hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm text-zinc-950 dark:text-white">
            Change Password{" "}
          </p>
          <MdOutlineKeyboardArrowRight />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-zinc-950 dark:text-white">
            Change Password
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400">
            Make changes in your password here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem className="mt-8 space-y-1">
                  <FormLabel className="text-right text-zinc-800 dark:text-white font-medium tracking-tight">
                    Current Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="oldPassword"
                      disabled={isSubmitting}
                      placeholder="Enter your current password ..."
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="">
                    Enter your current password to verify ...
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <div>
                  <FormItem className="mt-8 space-y-1">
                    <FormLabel className="text-right text-zinc-800 dark:text-white font-medium tracking-tight">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="newPassword"
                        disabled={isSubmitting}
                        placeholder="Confirm your password ..."
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="">
                      Enter new password to update to ...
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <DialogFooter className="flex justify-start space-x-4 items-center">
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="hover:bg-green-600 hover:text-white overflow-hidden"
              >
                Save changes
              </Button>

              <DialogClose>
                <Button className="bg-black text-white hover:bg-red-600">
                  Cancle
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteAccountWidget = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-red-400 dark:hover:from-red-600 hover:via-pink-400 hover:to-red-400 dark:hover:bg-red-600 hover:text-white hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Delete Account</p>
          <MdOutlineKeyboardArrowRight />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-end items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 text-white">
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const HelpAndSupportSection = () => {
  return (
    <div className="mt-4 flex flex-col space-y-5 items-start">
      <p className="text-md text-base font-semibold px-1 text-black  dark:text-white">
        Help and Support
      </p>
      <div className="flex flex-col space-y-2 max-w-7xl w-full">
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600 hover:text-white  hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">About CourseWave</p>
          <MdOutlineKeyboardArrowRight />
        </div>
        <div className="flex justify-between items-center cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 dark:hover:from-blue-600 hover:via-indigo-400 hover:to-sky-400 hover:bg-blue-600 hover:text-white  hover:rounded-lg p-2 transition-all duration-200 text-gray-800 dark:text-gray-200">
          <p className="text-sm">Share App </p>
          <MdOutlineKeyboardArrowRight />
        </div>
      </div>
    </div>
  );
};

const FollowCoursewaveOn = () => {
  return (
    <div className="mt-8">
      <h4 className="mb-2 text-sm font-normal text-black dark:text-white">
        Follow <span className="text-blue-500 font-bold">CourseWave</span> on
      </h4>
      <div className="flex items-center justify-center gap-3.5">
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <RiInstagramFill size={20} />
        </Link>
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <FaSquareXTwitter size={20} />
        </Link>
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <FaLinkedinIn size={20} />
        </Link>
        <Link href="#" className="hover:text-blue-500" aria-label="social-icon">
          <FaGithub size={20} />
        </Link>
      </div>
    </div>
  );
};
