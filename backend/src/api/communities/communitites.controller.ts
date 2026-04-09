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

export const deleteMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { communityId, messageId } = req.params;
    const moderatorId = requireUserId(req);

    await communitiesService.deleteMessage(communityId, messageId, moderatorId);
    sendSuccess(res, null, "Message deleted successfully");
  }
);
