import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Enrollment, Purchase } from "@prisma/client";

const useCheckCourseIsPurchased = (userId: string, courseId: string) => {
  const fetchIsCourseAlreadyPurchased = async () => {
    const courseAlreadyPurchasedUrl = absoluteUrl(`/api/courses/${courseId}/alreadyPurchased`);
    const response = await fetch(courseAlreadyPurchasedUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ userId: userId })
    });

    if (!response.ok) {
      throw new Error(`Failed to get course info from ${courseAlreadyPurchasedUrl} ...`);
    }

    return await response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["courseIsPurchased"],
    queryFn: fetchIsCourseAlreadyPurchased,
    staleTime: 4,
  });

  const courseIsPurchased: boolean = data?.data!.hasPurchased;
  const enrollment: Enrollment = data?.data.enrollment!;
  const purchase: Purchase = data?.data.purchase!;

  return { courseIsPurchased, enrollment, purchase, error, isLoading };
};

export default useCheckCourseIsPurchased;