import { courseService } from "@/lib/api/services/courseService";
import { useQuery, useMutation } from "@tanstack/react-query";

// Enrollment status hook
export function useAlreadyPurchased(courseId: string, userId: string) {
  return useQuery({
    queryKey: ["enrollment-status", courseId, userId],
    queryFn: async () => {
      const response = await courseService.checkAlreadyPurchased(courseId);
      return response.data; // { purchased: boolean }
    },
    enabled: !!courseId && !!userId, // Only run when both available
  });
}

// Enrollment/checkout mutation hook
export function useCheckoutCourse() {
  return useMutation({
    mutationFn: async ({
      courseId,
      userId,
    }: {
      courseId: string;
      userId: string;
    }) => {
      const response = await courseService.checkoutCourse(courseId, userId);
      return response;
    },
  });
}
