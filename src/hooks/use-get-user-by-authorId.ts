
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";


const useGetUserByAuthorId = (authorId: string) => {
    const fetchUserByAuthorId = async () => {
        const response = await fetch(`/api/users/${authorId}`);
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

    const user: User = data?.data;
    return { user, isLoading, error };
};

export default useGetUserByAuthorId;
