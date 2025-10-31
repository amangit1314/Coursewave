import {
  PlatformStats,
  Review,
  statsService,
} from "@/lib/api/services/statsService";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const usePlatformStats = (
  options?: Omit<UseQueryOptions<PlatformStats, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<PlatformStats, Error>({
    queryKey: ["platform", "stats"],
    queryFn: () => statsService.getPlatformStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    ...options,
  });
};

export const usePlatformTestimonails = (
  limit?: number,
  options?: Omit<UseQueryOptions<Review[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Review[], Error>({
    queryKey: ["reviews", "landing", limit],
    queryFn: () => statsService.getLandingReviews(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    ...options,
  });
};
