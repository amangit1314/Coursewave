import {
  Community,
  CreateCommunityRequest,
  UpdateCommunityRequest,
} from "@/types/community.service.types";
import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";

class CommunitiesService {
  private static instance: CommunitiesService;
  private api = apiManager;

  private constructor() {}

  public static getInstance(): CommunitiesService {
    if (!CommunitiesService.instance) {
      CommunitiesService.instance = new CommunitiesService();
    }
    return CommunitiesService.instance;
  }

  // === CRUD ===
  async getCommunities(
    params?: Record<string, any>
  ): Promise<PaginatedResponse<Community>> {
    const query = new URLSearchParams(params as any).toString();
    return this.api.get<Community[]>(`/communities${query ? `?${query}` : ""}`);
  }

  async getCommunityById(id: string): Promise<ApiResponse<Community>> {
    return this.api.get<Community>(`/communities/${id}`);
  }

  async createCommunity(
    data: CreateCommunityRequest
  ): Promise<ApiResponse<Community>> {
    return this.api.post<Community>("/communities", data);
  }

  async updateCommunity(
    id: string,
    data: UpdateCommunityRequest
  ): Promise<ApiResponse<Community>> {
    return this.api.put<Community>(`/communities/${id}`, data);
  }

  async deleteCommunity(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/communities/${id}`);
  }

  // === Members ===
  async joinCommunity(id: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/communities/${id}/join`);
  }

  async leaveCommunity(id: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/communities/${id}/leave`);
  }

  async getCommunityMembers(
    id: string
  ): Promise<ApiResponse<{ userId: string; username: string }[]>> {
    return this.api.get(`/communities/${id}/members`);
  }

  // === Messages ===
  async getMessages(communityId: string): Promise<ApiResponse<any[]>> {
    return this.api.get(`/communities/${communityId}/messages`);
  }

  async sendMessage(
    communityId: string,
    content: string,
    parentId?: string
  ): Promise<ApiResponse<any>> {
    return this.api.post(`/communities/${communityId}/messages`, {
      content,
      parentId,
    });
  }

  async deleteMessage(
    communityId: string,
    messageId: string
  ): Promise<ApiResponse<void>> {
    return this.api.delete<void>(
      `/communities/${communityId}/messages/${messageId}`
    );
  }
}

export const communitiesService = CommunitiesService.getInstance();
