import { Enrollment } from "@/types/user-enrollments-api-response";
import { useQuery } from "@tanstack/react-query";

export const useCheckCourseIsPurchased = (userId: string, courseId: string) => {
  const fetchIsCourseAlreadyPurchased = async () => {
    const isCourseAlreadyPurchasedUrl =
      process.env.ENVIRONMENT! === "DEVELOPMENT"
        ? `/api/courses/${courseId}/alreadyPurchased?userId=${userId}`
        : `api/courses/${courseId}/alreadyPurchased?userId=${userId}`;

    const response = await fetch(isCourseAlreadyPurchasedUrl, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get course info from /api/courses/${courseId}/alreadyPurchased`,
      );
    }

    return await response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["courseIsPurchased", userId, courseId],
    queryFn: fetchIsCourseAlreadyPurchased,
    staleTime: 4 * 60 * 1000,
  });

  const courseIsPurchased: boolean = !!(data?.data?.hasPurchased ?? false);
  const enrollment: Enrollment = data?.data?.enrollment! as Enrollment;
  const purchase = data?.data?.purchase!;

  return { courseIsPurchased, enrollment, purchase, error, isLoading };
};
