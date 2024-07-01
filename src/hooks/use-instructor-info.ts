import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../utils/utils";
import { Instructor } from "@prisma/client";

const useInstructorInfo = (instructorId: string) => {
  const fetchInstructorInfo = async () => {
    const instructorUrl = 
    // process.env.ENVIRONMENT === 'DEVELOPMENT' ?
   (`api/instructor/${instructorId}`)
      // : (`api/instructor/${instructorId}`);

    const instructorResponse = await fetch(instructorUrl);

    if (!instructorResponse.ok) {
      throw new Error(`Failed to get instructor info from ${instructorUrl}`);
    }

    return await instructorResponse.json();
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["instructor"],
    queryFn: fetchInstructorInfo,
    staleTime: 4,
  });

  const instructor: Instructor = data?.data!;
  console.log('Instructor Info in the useInstructorInfo hook', instructor);

  return { instructor, isLoading, error };
};

export default useInstructorInfo;