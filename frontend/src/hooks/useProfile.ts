// hooks/useProfile.ts
import { profileService } from "@/lib/api/services/profileService";
import { useUserStore } from "@/zustand/userStore";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useUpdateProfile() {
  const updateUser = useUserStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    onSuccess: (data) => {
      console.log("Update profile response:", data);

      // Check the actual response structure from your API
      if (data.data?.user) {
        // If your API returns { data: { user: ... } }
        updateUser(data.data.user);
      } else if (data.user) {
        // If your API returns { user: ... } directly
        updateUser(data.user);
      } else {
        // If API returns the updated user object directly
        updateUser(data);
      }

      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      console.error("Error updating profile:", error);
      toast.error(error.message ?? "Failed to update profile");
    },
  });
}

export function contactSupport() {
  const { user } = useUserStore();
  return useMutation({
    mutationFn: (data: any) =>
      profileService.contactSupport({
        ...data,
        userId: user?.id,
      }),
    onSuccess: () => {
      toast.success("Message sent to support successfully!");
    },
    onError: (error: any) => {
      console.error("Error contacting support:", error);
      toast.error(error.message ?? "Failed to contact support");
    },
  });
}