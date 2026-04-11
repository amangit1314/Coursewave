import { prisma } from "../../config/prisma";
import { AppError } from "../../core/middleware/errorHandler";

export const getAllCommunities = async () => {
  return prisma.community.findMany({
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
};

export const getCommunityById = async (communityId: string) => {
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
    throw new AppError("Community not found", 404);
  }

  return community;
};

export const createCommunity = async (
  title: string,
  description: string,
  categoryId: string,
  isPublic: boolean,
  tags: string[],
  userId: string
) => {
  return prisma.community.create({
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
};

export const joinCommunity = async (communityId: string, userId: string) => {
  const community = await prisma.community.findUnique({
    where: { id: communityId },
  });

  if (!community) {
    throw new AppError("Community not found", 404);
  }

  const existingMember = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });

  if (existingMember) {
    throw new AppError("User is already a member of this community", 409);
  }

  return prisma.communityMember.create({
    data: {
      userId,
      communityId,
      role: "MEMBER",
    },
  });
};

export const getCommunityMessages = async (
  communityId: string,
  userId: string
) => {
  const isMember = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });

  if (!isMember) {
    throw new AppError(
      "Access denied. You are not a member of this community.",
      403
    );
  }

  return prisma.message.findMany({
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
};

export const deleteMessage = async (
  communityId: string,
  messageId: string,
  moderatorId: string
) => {
  await prisma.message.delete({
    where: { id: messageId, communityId },
  });

  await prisma.moderationLog.create({
    data: {
      communityId,
      moderatorId,
      action: "MESSAGE_DELETED",
      targetMessageId: messageId,
      reason: "Message deleted by moderator",
    },
  });

  return null;
};

export const sendMessage = async (
  communityId: string,
  userId: string,
  content: string,
  parentId?: string
) => {
  const isMember = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });

  if (!isMember) {
    throw new AppError(
      "Access denied. You are not a member of this community.",
      403
    );
  }

  const slug = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  return prisma.message.create({
    data: {
      slug,
      content,
      senderId: userId,
      communityId,
      ...(parentId && { parentId }),
    },
    include: {
      sender: {
        select: { id: true, name: true, profileImageUrl: true },
      },
    },
  });
};

export const leaveCommunity = async (
  communityId: string,
  userId: string
) => {
  const member = await prisma.communityMember.findUnique({
    where: { userId_communityId: { userId, communityId } },
  });

  if (!member) {
    throw new AppError(
      "You are not a member of this community.",
      404
    );
  }

  await prisma.communityMember.delete({
    where: { userId_communityId: { userId, communityId } },
  });

  return null;
};
