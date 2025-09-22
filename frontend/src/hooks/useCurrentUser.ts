// hooks/useCurrentUser.ts
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/lib/api/services";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => profileService.getProfile(),
  });
}
