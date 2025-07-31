import axios from "axios";

// Determine base URL based on environment
const BASE_URL = process.env.NODE_ENV === "development" ? "/api" : "api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;

export const fetchUserEnrolledCourses = async (userId: string) => {
  try {
    const response = await apiClient.get(`/profile/${userId}/enrolledCourses`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user enrolled courses:", error);
    throw new Error("Failed to fetch user enrolled courses");
  }
};

// const fetchCreatedArticles = async () => {
//   const response = await fetch(`/api/profile/${userId}/createdArticles`);
//   if (!response.ok) {
//     console.log("Failed to fetch user created articles ...");
//   }
//   return await response.json();
// };
// const {
//   data: createdArticles,
//   isLoading: isCreatedArticlesLoading,
//   error: createdArticlesError,
// } = useQuery({
//   queryKey: ["createdArticles"],
//   queryFn: fetchCreatedArticles,
//   staleTime: 4,
// });
