// hooks/useArticleById.ts
import { useQuery } from "@tanstack/react-query";
import { communitiesService } from "@/lib/api/services/communitiesService";
import { Community } from "@/types/community";

export const useCommunityById = (communityId: string) => {
  return useQuery<Community | null>({
    queryKey: ["community", communityId],
    queryFn: async () => {
      const response = await communitiesService.getCommunityById(communityId);
      const community = Array.isArray(response.data)
        ? response.data[0]
        : response.data;
      return community || null;
    },
    enabled: !!communityId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};
