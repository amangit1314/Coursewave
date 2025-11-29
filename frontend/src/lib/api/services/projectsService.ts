import { ApiResponse, PaginatedResponse } from "../api-manager";
import ApiManager from "../api-manager";
import { Project, ProjectDetails } from "@/types/project";

export interface CreateProjectRequest {
  title: string;
  description?: string;
  courseId: string;
  thumbnailUrl?: string;
  deadline?: Date;
  maxSubmissions?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPublic?: boolean;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  tags?: string[];
  prerequisites?: string[];
  technologies?: string[];
  learningOutcomes?: string[];
  resources?: string[];
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  deadline?: Date;
  maxSubmissions?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPublic?: boolean;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  tags?: string[];
  prerequisites?: string[];
  technologies?: string[];
  learningOutcomes?: string[];
  resources?: string[];
}

class ProjectsService {
  private static instance: ProjectsService;
  private api = ApiManager.getInstance();

  private constructor() { }

  public static getInstance(): ProjectsService {
    if (!ProjectsService.instance) {
      ProjectsService.instance = new ProjectsService();
    }
    return ProjectsService.instance;
  }

  async getProjects(params?: Record<string, any>): Promise<PaginatedResponse<Project> | Project[]> {
    return this.api.get<Project[]>(`/projects`, { params });
  }

  async getProjectById(id: string): Promise<ApiResponse<ProjectDetails>> {
    const response = this.api.get<ProjectDetails>(`/projects/${id}`);
    console.log("Response of project by id: ", JSON.stringify(response));
    return response;
  }

  async createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    return this.api.post<Project>(`/projects`, data);
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    return this.api.put<Project>(`/projects/${id}`, data);
  }

  async deleteProject(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/projects/${id}`);
  }

  async submitProject(projectId: string, submissionUrl: string): Promise<ApiResponse<any>> {
    return this.api.post(`/projects/${projectId}/submissions`, { submissionUrl });
  }

  async getProjectSubmissions(projectId: string): Promise<ApiResponse<any>> {
    return this.api.get(`/projects/${projectId}/submissions`);
  }

  async getSubmissionFeedback(projectId: string, submissionId: string): Promise<ApiResponse<any>> {
    return this.api.get(`/projects/${projectId}/submissions/${submissionId}/feedbacks`);
  }

  async giveSubmissionFeedback(
    projectId: string,
    submissionId: string,
    feedbackText: string
  ): Promise<ApiResponse<any>> {
    return this.api.post(`/projects/submissions/feedback`, { projectId, submissionId, feedbackText });
  }
}

export const projectsService = ProjectsService.getInstance();
