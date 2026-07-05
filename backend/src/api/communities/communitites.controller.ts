import { Request, Response } from "express";
import * as communitiesService from "./communities.service";
import {
  asyncHandler,
  sendSuccess,
  AppError,
} from "../../core/middleware/errorHandler";

const requireUserId = (req: Request): string => {
  const userId = req.user?.id;
  if (!userId) throw new AppError("Unauthorized", 401);
  return userId;
};

export const getAllCommunities = asyncHandler(
  async (_req: Request, res: Response) => {
    const communities = await communitiesService.getAllCommunities();
    sendSuccess(res, communities, "Communities fetched successfully");
  }
);

export const getCommunityById = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const community = await communitiesService.getCommunityById(communityId);
    sendSuccess(res, community, "Community fetched successfully");
  }
);

export const createCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, description, categoryId, isPublic, tags } = req.body;
    const userId = requireUserId(req);

    const community = await communitiesService.createCommunity(
      title,
      description,
      categoryId,
      isPublic,
      tags,
      userId
    );
    sendSuccess(res, community, "Community created successfully", 201);
  }
);

export const joinCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = requireUserId(req);

    const member = await communitiesService.joinCommunity(communityId, userId);
    sendSuccess(res, member, "Joined community successfully");
  }
);

export const getCommunityMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = requireUserId(req);

    const messages = await communitiesService.getCommunityMessages(
      communityId,
      userId
    );
    sendSuccess(res, messages, "Messages fetched successfully");
  }
);

export const getCommunityMembers = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = requireUserId(req);

    const members = await communitiesService.getCommunityMembers(
      communityId,
      userId
    );
    sendSuccess(res, members, "Members fetched successfully");
  }
);

export const updateCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const { title, description, tags, isPublic } = req.body;

    const community = await communitiesService.updateCommunity(communityId, {
      title,
      description,
      tags,
      isPublic,
    });
    sendSuccess(res, community, "Community updated successfully");
  }
);

export const deleteCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    await communitiesService.deleteCommunity(communityId);
    sendSuccess(res, null, "Community deleted successfully");
  }
);

export const updateMemberRole = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, userId: targetUserId } = req.params;
    const actingUserId = requireUserId(req);
    const { role } = req.body;

    if (role !== "MODERATOR" && role !== "MEMBER") {
      throw new AppError('Role must be "MODERATOR" or "MEMBER"', 400);
    }

    const member = await communitiesService.updateMemberRole(
      communityId,
      actingUserId,
      targetUserId,
      role
    );
    sendSuccess(res, member, "Member role updated successfully");
  }
);

export const kickMember = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, userId: targetUserId } = req.params;
    const actingUserId = requireUserId(req);
    const actingRole = (req as any).communityRole as "ADMIN" | "MODERATOR";

    await communitiesService.kickMember(
      communityId,
      actingUserId,
      actingRole,
      targetUserId
    );
    sendSuccess(res, null, "Member removed successfully");
  }
);

export const deleteMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, messageId } = req.params;
    const moderatorId = requireUserId(req);

    await communitiesService.deleteMessage(communityId, messageId, moderatorId);
    sendSuccess(res, null, "Message deleted successfully");
  }
);

export const sendMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = requireUserId(req);
    const { content, parentId } = req.body;

    if (!content || !content.trim()) {
      throw new AppError("Message content cannot be empty", 400);
    }

    const message = await communitiesService.sendMessage(
      communityId,
      userId,
      content,
      parentId
    );
    sendSuccess(res, message, "Message sent successfully", 201);
  }
);

export const leaveCommunity = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId } = req.params;
    const userId = requireUserId(req);

    await communitiesService.leaveCommunity(communityId, userId);
    sendSuccess(res, null, "Left community successfully");
  }
);
