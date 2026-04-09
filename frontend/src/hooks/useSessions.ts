import { sessionService } from "@/lib/api/services/sessionsService";
import { Session } from "@/types/session";
import { useQuery } from "@tanstack/react-query";

const fetchSessions = async (): Promise<Session[]> => {
  const response = await sessionService.getSessions();
  if (!response?.success || !response.data) {
    return [];
  }
  return response.data;
};

export const useSessions = () => {
  const { data, error, isLoading } = useQuery<Session[], Error>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 4 * 60 * 1000,
    retry: 1,
  });

  return {
    sessions: data || [],
    error,
    isLoading,
  };
};
