import { userService } from "@/lib/api/services";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (id: string) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["userFromId", id],
    queryFn: async () => {
      const response = await userService.getUserById(id);
      return response;
    },
    staleTime: 4 * 1000,
    enabled: !!id,
  });

  const user: User = data as User;
  return { user, isLoading, error };
};
