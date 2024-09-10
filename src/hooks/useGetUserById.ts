import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

export const useGetUserByAuthorId = (authorId: string) => {
  const fetchUserByAuthorId = async () => {
    const fetchUserByAuthorIdUrl =
      process.env.ENVIRONMENT! === "DEVELOPMENT"
        ? `/api/users/${authorId}`
        : `api/users/${authorId}`;

    const response = await fetch(fetchUserByAuthorIdUrl);

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["userFromAuthorId"],
    queryFn: fetchUserByAuthorId,
    staleTime: 4,
  });

  const user: User = data?.data as User;
  return { user, isLoading, error };
};
