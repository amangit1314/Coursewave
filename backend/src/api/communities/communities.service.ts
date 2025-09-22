import { prisma } from "../../config/prisma";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getAllCommunities = async (): Promise<ServiceResponse> => {
  try {
    const communities = await prisma.community.findMany({
      where: { isPublic: true },
      include: {
        category: true,
        members: {
          select: {
            user: {
              select: { id: true, name: true, profileImageUrl: true },
            },
            role: true,
            joinedAt: true,
            isOnline: true,
          },
        },
      },
      orderBy: { lastActiveAt: "desc" },
    });

    return {
      success: true,
      data: communities,
      message: "Communities fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("ERROR in getAllCommunities:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch communities",
      status: 500,
    };
  }
};

export const getCommunityById = async (
  communityId: string
): Promise<ServiceResponse> => {
  try {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        category: true,
        members: {
          select: {
            user: {
              select: { id: true, name: true, profileImageUrl: true },
            },
            role: true,
            joinedAt: true,
          },
        },
      },
    });

    if (!community) {
      return {
        success: false,
        message: "Community not found",
        status: 404,
      };
    }

    return {
      success: true,
      data: community,
      message: "Community fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("ERROR in getCommunityById:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch community",
      status: 500,
    };
  }
};

export const createCommunity = async (
  title: string,
  description: string,
  categoryId: string,
  isPublic: boolean,
  tags: string[],
  userId: string
): Promise<ServiceResponse> => {
  try {
    const newCommunity = await prisma.community.create({
      data: {
        title,
        description,
        categoryId,
        isPublic,
        tags,
        members: {
          create: {
            userId,
            role: "ADMIN",
          },
        },
      },
    });

    return {
      success: true,
      data: newCommunity,
      message: "Community created successfully",
      status: 201,
    };
  } catch (error: any) {
    console.error("ERROR in createCommunity:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to create community",
      status: 500,
    };
  }
};

export const joinCommunity = async (
  communityId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    const community = await prisma.community.findUnique({
      where: { id: communityId },
    });

    if (!community) {
      return {
        success: false,
        message: "Community not found",
        status: 404,
      };
    }

    // Check if user is already a member
    const existingMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });

    if (existingMember) {
      return {
        success: false,
        message: "User is already a member of this community",
        status: 400,
      };
    }

    const member = await prisma.communityMember.create({
      data: {
        userId,
        communityId,
        role: "MEMBER",
      },
    });

    return {
      success: true,
      data: member,
      message: "Joined community successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("ERROR in joinCommunity:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to join community",
      status: 500,
    };
  }
};

export const getCommunityMessages = async (
  communityId: string,
  userId: string
): Promise<ServiceResponse> => {
  try {
    // Check if user is a member of the community
    const isMember = await prisma.communityMember.findUnique({
      where: { userId_communityId: { userId, communityId } },
    });

    if (!isMember) {
      return {
        success: false,
        message: "Access denied. You are not a member of this community.",
        status: 403,
      };
    }

    const messages = await prisma.message.findMany({
      where: { communityId },
      include: {
        sender: {
          select: { id: true, name: true, profileImageUrl: true },
        },
        reactions: true,
      },
      orderBy: { createdAt: "asc" },
      take: 50,
    });

    return {
      success: true,
      data: messages,
      message: "Messages fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("ERROR in getCommunityMessages:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch messages",
      status: 500,
    };
  }
};

export const deleteMessage = async (
  communityId: string,
  messageId: string,
  moderatorId: string
): Promise<ServiceResponse> => {
  try {
    await prisma.message.delete({
      where: { id: messageId, communityId },
    });

    // Log the moderation action
    await prisma.moderationLog.create({
      data: {
        communityId,
        moderatorId,
        action: "MESSAGE_DELETED",
        targetMessageId: messageId,
        reason: "Message deleted by moderator",
      },
    });

    return {
      success: true,
      message: "Message deleted successfully",
      status: 200,
    };
  } catch (error: any) {
    console.error("ERROR in deleteMessage:", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete message",
      status: 500,
    };
  }
};
