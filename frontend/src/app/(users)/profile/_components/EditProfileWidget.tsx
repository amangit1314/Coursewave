"use client";

import axios from "axios";
import React from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import "@uploadthing/react/styles.css";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { useUserStore } from "@/zustand/userStore";
import EditProfileImage from "./EditProfileImage";

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

export default EditProfileWidget;