import { Request, Response } from 'express';
import * as communitiesService from './communities.service';

export const getAllCommunities = async (req: Request, res: Response) => {
  try {
    const result = await communitiesService.getAllCommunities();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const getCommunityById = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const result = await communitiesService.getCommunityById(communityId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const createCommunity = async (req: Request, res: Response) => {
  try {
    const { title, description, categoryId, isPublic, tags } = req.body;
    const userId = req.user!.id;
    
    const result = await communitiesService.createCommunity(
      title,
      description,
      categoryId,
      isPublic,
      tags,
      userId
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const joinCommunity = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const userId = req.user!.id;
    
    const result = await communitiesService.joinCommunity(communityId, userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const getCommunityMessages = async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const userId = req.user!.id;
    
    const result = await communitiesService.getCommunityMessages(communityId, userId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { communityId, messageId } = req.params;
    const moderatorId = req.user!.id;
    
    const result = await communitiesService.deleteMessage(communityId, messageId, moderatorId);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Internal Server Error'
    });
  }
};