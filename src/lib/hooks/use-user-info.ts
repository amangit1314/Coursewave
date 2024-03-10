import { useQuery } from "react-query";
import { User } from "@prisma/client";

const useUserInfo = () => {
  const { isLoading, error, data } = useQuery("user", async () => {
    const url = "https://localhost:3000/api/auth/me";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to get user info");
    }

    return await response.json();
  }, {
    staleTime: 4, // Keep cached data even if stale
    onSuccess: (data) => {
      // Optionally handle successful updates here
      console.log("User information fetched successfully:", data);
    },
  },);

  const user: User = data?.data; // Extract the user data or set as null if no data

  return { user, isLoading, error };
};

export default useUserInfo;
