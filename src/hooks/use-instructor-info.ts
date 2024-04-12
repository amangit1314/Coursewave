import { useQuery } from "@tanstack/react-query";
import { absoluteUrl } from "../lib/utils";

const useInstructorInfo = (instructorId: string) => {
  const fetchInstructorInfo = async () => {
    const instructorUrl = absoluteUrl(`/api/instructor/${instructorId}`);
    const instructorResponse = await fetch(instructorUrl);

    if (!instructorResponse.ok) {
      throw new Error(`Failed to get instructor info from ${instructorUrl}`);
    }

    return await instructorResponse.json();
  }

  return useQuery({
    queryKey: ["instructor"],
    queryFn: fetchInstructorInfo,
    staleTime: 4,
  });
};

export default useInstructorInfo;