import { projectsService } from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  const {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await projectsService.getProjects();
      console.log("API Response:", response); // Still keep for confirmation
      return response || [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  return { data, error, isLoading, isFetching, refetch, isError };
};


// import { projectsService } from "@/lib/api/services";
// import { useQuery } from "@tanstack/react-query";
// import { Project } from "@/types/project";

// export const useProjects = () => {
//   const {
//     data: rawData,
//     error,
//     isLoading,
//     isFetching,
//     refetch,
//     isError,
//   } = useQuery({
//     queryKey: ["projects"],
//     queryFn: async () => {
//       const response = await projectsService.getProjects();
//       // response could be PaginatedResponse<Project> OR Project[]
//       console.log("API Response:", response);
//       return response || { data: [] }; // ensure default shape for destructuring below
//     },
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     refetchOnMount: true,
//     retry: 1,
//   });

//   // Normalize data shape to always get an array
//   let projects: Project[] = [];
//   if (Array.isArray(rawData)) {
//     projects = rawData;
//   } else if (rawData && Array.isArray(rawData.data)) {
//     projects = rawData.data;
//   }

//   return { projects, error, isLoading, isFetching, refetch, isError };
// };
