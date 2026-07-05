import {
  Community,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  CommunityMember,
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
    return this.api.patch<Community>(`/communities/${id}`, data);
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

  async getCommunityMembers(id: string): Promise<ApiResponse<CommunityMember[]>> {
    return this.api.get<CommunityMember[]>(`/communities/${id}/members`);
  }

  async updateMemberRole(
    communityId: string,
    userId: string,
    role: "MODERATOR" | "MEMBER"
  ): Promise<ApiResponse<CommunityMember>> {
    return this.api.patch<CommunityMember>(
      `/communities/${communityId}/members/${userId}/role`,
      { role }
    );
  }

  async kickMember(communityId: string, userId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/communities/${communityId}/members/${userId}`);
  }

  // === Messages ===
  async deleteMessage(
    communityId: string,
    messageId: string
  ): Promise<ApiResponse<void>> {
    return this.api.delete<void>(
      `/communities/${communityId}/messages/${messageId}`
    );
  }

  // === Attachments ===
  async uploadAttachment(
    communityId: string,
    file: File
  ): Promise<{ type: "image" | "file"; url: string; name: string; size: string }> {
    const response = await this.api.upload<{
      type: "image" | "file";
      url: string;
      name: string;
      size: string;
    }>(`/communities/${communityId}/upload`, file);
    return response.data;
  }
}

export const communitiesService = CommunitiesService.getInstance();
