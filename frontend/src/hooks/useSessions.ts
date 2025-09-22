import { sessionService } from "@/lib/api/services/sessionsService";
import { Session } from "@/types/sessions.services.types";
import { useQuery } from "@tanstack/react-query";

const fetchSessions = async (): Promise<Session[]> => {
  try {
    const response = await sessionService.getSessions();
    console.log("Raw API Response:", response);

    if (!response) {
      console.error("No response received from API");
      return [];
    }

    if (!response.success) {
      console.error("API returned unsuccessful response:", response);
      return [];
    }

    if (!response.data) {
      console.error("No data in API response:", response);
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    return [];
  }
};

export const useSessions = () => {
  const { data, error, isLoading } = useQuery<Session[], Error>({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    staleTime: 4,
    retry: 1, // Only retry once on failure
  });

  return {
    sessions: data || [],
    error,
    isLoading,
  };
};
