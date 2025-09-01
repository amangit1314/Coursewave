import { projectsService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectsService.getProjects();
      console.log("API Response:", response); // Still keep for confirmation
      return response || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  return { data, error, isLoading, isFetching, refetch, isError };
};
