import { communitiesService } from "@/lib/api/services/communitiesService";
import { useQuery } from "@tanstack/react-query";

export const useCommunities = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const response = await communitiesService.getCommunities();
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
