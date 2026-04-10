"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, ChevronRight, Camera, Upload, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
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
import { supabase } from "@/lib/config/supabase";
import { useUpdateProfile } from "@/hooks/useProfile"; // Import from the correct file

const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  image: z.string(),
  about: z.string().optional(),
});

const EditProfileWidget = () => {
  const { user } = useUserStore();
  const [imageUrl, setImageUrl] = useState(user?.profileImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profileImageUrl || "");
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user?.name || "",
      image: imageUrl,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Upload to Supabase Storage
  const uploadToSupabase = async (file: File) => {
    try {
      setIsUploading(true);

      // Create unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from("avatars") // Make sure this bucket exists in your Supabase project
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      setImageUrl(publicUrl);
      setPreviewUrl(publicUrl);

      toast.success("Image uploaded successfully!");
      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    await uploadToSupabase(selectedFile);
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(user?.profileImageUrl || "");
    setImageUrl(user?.profileImageUrl || "");
  };

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // If there's a selected file that hasn't been uploaded yet, upload it first
      let finalImageUrl = imageUrl;
      if (selectedFile && !imageUrl.includes(selectedFile.name)) {
        const uploadedUrl = await uploadToSupabase(selectedFile);
        if (!uploadedUrl) {
          toast.error("Please upload the image first");
          return;
        }
        finalImageUrl = uploadedUrl;
      }

      updateProfile(
        {
          userName: values.userName,
          profileImageUrl: finalImageUrl,
          about: values.about ?? "", // Add other fields as necessary
        },
        {
          onSuccess: () => {
            console.log("Profile updated successfully!");
            setOpen(false);
            // No need for toast here since it's handled in the hook
          },
          // Error handling is also in the hook
        }
      );
    } catch (err: any) {
      console.log("Error in updating profile: ", err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:shadow-md hover:border-emerald-500/30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                <User className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-sm text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Edit Profile
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Update your profile information
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 group-hover:text-emerald-500 transition-all duration-200" />
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-foreground">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Update your username and profile image
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
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Profile Image
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-center gap-4">
                        {/* Image Preview */}
                        <div className="relative w-32 h-32">
                          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border shadow-lg bg-muted">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="w-16 h-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Remove button */}
                          {selectedFile && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute top-0 right-0 p-1.5 rounded-full bg-destructive text-white shadow-lg hover:bg-destructive/90 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex flex-col gap-3 w-full">
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer transition-all duration-200 bg-muted/50 hover:bg-primary/5 group"
                          >
                            <Camera className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                              {selectedFile ? "Change Image" : "Choose Image"}
                            </span>
                          </label>
                          <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />

                          {selectedFile && (
                            <Button
                              type="button"
                              onClick={handleUpload}
                              disabled={isUploading}
                              className="w-full"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-center text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
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
                    <FormLabel className="text-sm font-semibold text-foreground">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="border-input"
                        placeholder="Enter your username"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      This is your public display name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="about"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-foreground">
                      About
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        className="border-input"
                        placeholder="Write about yourself"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      This is about yourself
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <DialogClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={
                    !isValid || isSubmitting || isUploading || isUpdating
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : isUpdating ? (
                    "Updating..."
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditProfileWidget;
