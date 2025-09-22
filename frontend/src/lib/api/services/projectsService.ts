// import ApiManager from "../api-manager";

// export const projectsService = {
//   async getProjects() {
//     const response = await ApiManager.getInstance().get(`/projects`);
//     console.log("Get Projects response:", response.data);
//     return response.data;
//   },
// };


import { ApiResponse, PaginatedResponse } from "../api-manager";
import ApiManager from "../api-manager";
import { Project } from "@/types/project";

// Example types — adjust to your schema
// export interface Project {
//   id: string;
//   name: string;
//   description?: string;
//   status: "active" | "archived" | "pending";
//   createdAt: string;
//   updatedAt: string;
// }

export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: "active" | "archived" | "pending";
}

class ProjectsService {
  private static instance: ProjectsService;
  private api = ApiManager.getInstance();

  private constructor() {}

  public static getInstance(): ProjectsService {
    if (!ProjectsService.instance) {
      ProjectsService.instance = new ProjectsService();
    }
    return ProjectsService.instance;
  }

  // -----------------------
  // CRUD Methods
  // -----------------------

  async getProjects(params?: Record<string, any>): Promise<PaginatedResponse<Project>> {
    return this.api.get<Project[]>(`/projects`, { params });
  }

  async getProjectById(id: string): Promise<ApiResponse<Project>> {
    return this.api.get<Project>(`/projects/${id}`);
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
}

export const projectsService = ProjectsService.getInstance();
