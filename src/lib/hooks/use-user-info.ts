import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";

const fetchUser = async () => {
  // https://localhost:3000
  const url = "/api/auth/me";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to get user info ...");
  }

  return await response.json();
};

const useUserInfo = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 4, // Keep cached data even if stale
  });

  const user: User = data?.data; // Extract the user data or set as null if no data

  return { user, isLoading, error };
};

export default useUserInfo;
