import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";

const fetchUser = async () => {
  // Get the auth token from localStorage
  const authToken = typeof window !== "undefined" 
    ? localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    : null;

  if (!authToken) {
    throw new Error("No authentication token found");
  }

  // Call the backend server directly
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';
  const response = await fetch(`${backendUrl}/api/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      throw new Error("Authentication failed - please log in again");
    }
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error(`Failed to get user info: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || "Failed to get user info");
  }

  return data;
};

export const useUserInfo = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 4 * 60 * 1000, // 4 minutes
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error.message.includes("Authentication failed") || error.message.includes("No authentication token")) {
        return false;
      }
      return failureCount < 3;
    },
    refetchOnWindowFocus: false,
    enabled: typeof window !== "undefined" && !!(localStorage.getItem("authToken") || sessionStorage.getItem("authToken")),
  });

  const user: User = data?.data as User;

  return { user, isLoading, error };
};
