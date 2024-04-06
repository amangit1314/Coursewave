import { useQuery } from "@tanstack/react-query";
import { db } from "../lib/db";

const useEnrolledCourses = (userId: string) => {
  const fetchEnrolledCourses = async () => {
    const enrollments = await db.enrollment.findMany({
      where: {
        userId: userId,
      },
    });

    return enrollments;
  };

  return useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: fetchEnrolledCourses,
    staleTime: 4,
  });
};

export default useEnrolledCourses;
