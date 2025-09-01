// import { User } from "@prisma/client";
// import { useQuery } from "@tanstack/react-query";

// export const useGetUserByAuthorId = (authorId: string) => {
//   const fetchUserByAuthorId = async () => {
//     const fetchUserByAuthorIdUrl =
//       process.env.ENVIRONMENT! === "DEVELOPMENT"
//         ? `/api/users/${authorId}`
//         : `api/users/${authorId}`;

//     const response = await fetch(fetchUserByAuthorIdUrl);

//     if (!response.ok) {
//       throw new Error(await response.text());
//     }
//     return response.json();
//   };

//   const { isLoading, error, data } = useQuery({
//     queryKey: ["userFromAuthorId"],
//     queryFn: fetchUserByAuthorId,
//     staleTime: 4,
//   });

//   const user: User = data?.data as User;
//   return { user, isLoading, error };
// };

import ApiManager from "@/lib/api/api-manager";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// const API_BASE_URL =
//   process.env.ENVIRONMENT === "DEVELOPMENT"
//     ? "http://localhost:5002/api"
//     : "https://your-production-url.com"; // replace with your actual prod URL

const API_BASE_URL = "http://localhost:5002/api";

export const useGetUserByAuthorId = (authorId: string) => {
  const fetchUserByAuthorId = async () => {
    console.log("Fetching user by authorId:", authorId);
    const url = `${API_BASE_URL}/users/${authorId}`;

    const response = await ApiManager.getInstance().post(
      url

      // {
      //   headers: {
      //     access_token: "coursewave_access_token",
      //   },
      // }
    );

    return response.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["userFromAuthorId", authorId],
    queryFn: fetchUserByAuthorId,
    staleTime: 4 * 1000,
  });

  const user: User = data?.data as User;
  return { user, isLoading, error };
};
