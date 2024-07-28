import { useQuery } from "@tanstack/react-query";
import { Instructor } from "@prisma/client";

const useInstructorInfo = (instructorId: string) => {
  const fetchInstructorInfo = async () => {
    const response = await fetch(`api/instructor/${instructorId}`);

    if (!response.ok) {
      console.log('Error in fetching instructor info in use-instructor-info.ts ...')
    }

    const data = await response.json();
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["instructor"],
    queryFn: fetchInstructorInfo,
    staleTime: 4,
  });

  const instructor: Instructor = data?.data! as Instructor;
  console.log("Instructor Info in the useInstructorInfo hook", instructor);

  return { instructor, isLoading, error };
};

export default useInstructorInfo;
