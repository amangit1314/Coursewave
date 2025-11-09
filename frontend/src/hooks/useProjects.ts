import {
  CreateProjectRequest,
  UpdateProjectRequest,
  projectsService,
} from "@/lib/api/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Project } from "@/types/project";
import { ApiResponse, PaginatedResponse } from "@/lib/api/api-manager";

import { useMemo } from "react";

export const useProjects = (params?: Record<string, any>) => {
  const { data, error, isLoading, isFetching, refetch, isError } = useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const response = await projectsService.getProjects(params);
      if (Array.isArray(response)) return response;
      if (response && "data" in response) return response.data;
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  // ✅ Memoize the projects array
  const projects = useMemo(() => data ?? [], [data]);

  return { projects, error, isLoading, isFetching, refetch, isError };
};

// 🧩 Hook: Fetch project details by ID
export const useProjectDetails = (projectId?: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await projectsService.getProjectById(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
};

// 🧩 Hook: Create a new project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProjectRequest) =>
      projectsService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// 🧩 Hook: Update a project by ID
export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Project>, Error, UpdateProjectRequest>({
    mutationFn: (data) => projectsService.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

// 🧩 Hook: Delete a project by ID
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectId: string) => projectsService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// 🧩 Hook: Submit a project
interface SubmitProjectArgs {
  projectId: string;
  submissionUrl: string;
}

export const useSubmitProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, submissionUrl }: SubmitProjectArgs) =>
      projectsService.submitProject(projectId, submissionUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// 🧩 Hook: Get submissions for a project
export const useProjectSubmissions = (projectId?: string) => {
  return useQuery({
    queryKey: ["projectSubmissions", projectId],
    queryFn: async () => {
      if (!projectId) throw new Error("Project ID is required");
      const response = await projectsService.getProjectSubmissions(projectId);
      return response.data;
    },
    enabled: !!projectId,
  });
};

// 🧩 Hook: Get feedback for a specific submission
export const useSubmissionFeedback = (
  projectId?: string,
  submissionId?: string
) => {
  return useQuery({
    queryKey: ["submissionFeedback", projectId, submissionId],
    queryFn: async () => {
      if (!projectId || !submissionId)
        throw new Error("Project ID and Submission ID are required");
      const response = await projectsService.getSubmissionFeedback(
        projectId,
        submissionId
      );
      return response.data;
    },
    enabled: !!projectId && !!submissionId,
  });
};

// 🧩 Hook: Give feedback on a project submission
interface GiveSubmissionFeedbackArgs {
  projectId: string;
  submissionId: string;
  feedbackText: string;
}

export const useGiveSubmissionFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      submissionId,
      feedbackText,
    }: GiveSubmissionFeedbackArgs) =>
      projectsService.giveSubmissionFeedback(
        projectId,
        submissionId,
        feedbackText
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
