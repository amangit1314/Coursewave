import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Enrollment, Purchase } from "@prisma/client";
import axios from "axios";

const useCheckCourseIsPurchased = (userId: string, courseId: string) => {
  const fetchIsCourseAlreadyPurchased = async () => {
    const response = await fetch(
      `/api/courses/${courseId}/alreadyPurchased?userId=${userId}`, {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get course info from /api/courses/${courseId}/alreadyPurchased`);
    }

    return await response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["courseIsPurchased", userId, courseId],
    queryFn: fetchIsCourseAlreadyPurchased,
    staleTime: 4 * 60 * 1000, // 4 minutes
  });

  const courseIsPurchased: boolean = data?.data?.hasPurchased ?? false;
  const enrollment: Enrollment = data?.data?.enrollment ?? null;
  const purchase: Purchase = data?.data?.purchase ?? null;

  return { courseIsPurchased, enrollment, purchase, error, isLoading };
};

export default useCheckCourseIsPurchased;
