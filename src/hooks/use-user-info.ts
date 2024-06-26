import { useQuery } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { absoluteUrl } from "../utils/utils";

const fetchUser = async () => {
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
    staleTime: 4,
  });

  const user: User = data?.data;

  return { user, isLoading, error };
};

export default useUserInfo;
