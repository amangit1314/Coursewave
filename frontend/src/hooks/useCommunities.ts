import { communitiesService } from "@/lib/api/services/communitiesService";
import { Community } from "@/types/community";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCommunities = () => {
  const { data, error, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const response = await communitiesService.getCommunities();
      return response || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  return { data, error, isLoading, isFetching, refetch, isError };
};

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

export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    }) => {
      const response = await communitiesService.createCommunity({
        name: data.title,
        description: data.description,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communityId: string) => {
      const response = await communitiesService.joinCommunity(communityId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (communityId: string) => {
      const response = await communitiesService.leaveCommunity(communityId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

export const useCommunityMessages = (communityId: string) => {
  return useQuery({
    queryKey: ["community-messages", communityId],
    queryFn: async () => {
      const response = await communitiesService.getMessages(communityId);
      return response.data || [];
    },
    enabled: !!communityId,
    staleTime: 30 * 1000,
    refetchInterval: 15 * 1000,
    retry: 1,
  });
};

export const useSendMessage = (communityId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { content: string; parentId?: string }) => {
      const response = await communitiesService.sendMessage(
        communityId,
        data.content,
        data.parentId
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["community-messages", communityId],
      });
    },
  });
};
