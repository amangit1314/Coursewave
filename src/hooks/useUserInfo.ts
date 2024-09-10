import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";

const fetchUser = async () => {
  const url =
    process.env.ENVIRONMENT! === "DEVELOPMENT" ? "/api/auth/me" : "api/auth/me";

  const response = await fetch("/api/auth/me");

  if (!response.ok) {
    console.error(
      "Failed to get user info in use-user-info in response not ok case ...",
    );
  }

  return await response.json();
};

export const useUserInfo = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 4,
  });

  const user: User = data?.data as User;

  return { user, isLoading, error };
};
