import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/lib/api/services";
import { useUserStore } from "@/zustand/userStore";
import { ChangePasswordData } from "@/types/profile.service.types";

type BecomeInstructorPayload = {
  bio: string;
  expertise: string[];
  socialLinks?: Record<string, string>;
};

export function useBecomeInstructor() {
  const updateUser = useUserStore((s) => s.updateUser); // top-level hook

  return useMutation({
    mutationFn: (data: BecomeInstructorPayload) =>
      profileService.becomeInstructor(data),
    onSuccess: (response) => {
      // response returns updated user or instructor entity
      if (response?.user) {
        updateUser(response.user); // safe
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordData) =>
      profileService.changePassword(data.currentPassword, data.newPassword),
  });
}

export function useDeleteAccount() {
  const logoutStore = useUserStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password: string) => profileService.deleteAccount(password),
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
    },
  });
}

export function useUpdateProfile() {
  const updateUser = useUserStore((s) => s.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    onSuccess: (data) => {
      updateUser(data.user); // todo: verify this
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
}

export const useEnrolledCourses = () => {
  const fetchEnrolledCourses = async () => {
    const enrollments = await profileService.getEnrolledCourses();
    console.log("Enrolled courses response:", JSON.stringify(enrollments));
    return enrollments || [];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolledCourses,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  return { data, isLoading, error };
};
