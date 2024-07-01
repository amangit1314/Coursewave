import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Enrollment, Purchase } from "@prisma/client";
import axios from "axios";

const useCheckCourseIsPurchased = (userId: string, courseId: string) => {
  const fetchIsCourseAlreadyPurchased = async () => {
    const response = await axios.post(
      `api/courses/${courseId}/alreadyPurchased`,
      {
        userId,
      }
    );

    if (!response.data.success) {
      throw new Error(
        `Failed to get course info from ${`api/courses/${courseId}/areadyPurchased`}`
      );
    }

    return response.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["courseIsPurchased"],
    queryFn: fetchIsCourseAlreadyPurchased,
    staleTime: 4,
  });

  const courseIsPurchased: boolean = data?.data!.hasPurchased;
  console.log("Is already purchased: ", courseIsPurchased);
  const enrollment: Enrollment = data?.data.enrollment!;
  const purchase: Purchase = data?.data.purchase!;

  return { courseIsPurchased, enrollment, purchase, error, isLoading };
};

export default useCheckCourseIsPurchased;
