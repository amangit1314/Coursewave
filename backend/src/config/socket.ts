import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../config/prisma";
import { verifySocketToken } from "../core/middleware/verifySocketToken";
import { ReactionType } from "@prisma/client";
import { slugify } from "../core/utils/slugify";
import { SOCKET_EVENTS } from "./constants";
import { env, features } from "./config";

interface ServerSocket extends Socket {
  data: {
    userId: string;
    name?: string;
  };
}

// Track which communities each socket has joined (for disconnect cleanup)
const socketRooms = new Map<string, Set<string>>();

// Shared include for message queries
const messageInclude = {
  sender: { select: { id: true, name: true, profileImageUrl: true } },
  reactions: { include: { user: { select: { id: true, name: true } } } },
  replies: { select: { id: true } },
  parentMessage: {
    select: {
      id: true,
      content: true,
      sender: { select: { id: true, name: true } },
    },
  },
} as const;

export function initSocket(server: HttpServer) {
  const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    env.FRONTEND_URL_PROD,
  ].filter(Boolean) as string[];

  const io = new SocketIOServer(server, {
    cors: {
      origin: features.isDev ? "*" : allowedOrigins,
      credentials: true,
    },
  });

  io.use(verifySocketToken);

  io.on("connection", (socket: ServerSocket) => {
    const { userId } = socket.data;
    socketRooms.set(socket.id, new Set());

    // ---------------- JOIN COMMUNITY ----------------
    socket.on(SOCKET_EVENTS.JOIN, async (communityId: string) => {
      try {
        socket.join(`community:${communityId}`);
        socketRooms.get(socket.id)?.add(communityId);

        // Update member online status
        await prisma.communityMember.updateMany({
          where: { userId, communityId },
          data: { isOnline: true },
        });

        // Send last 50 messages
        const messages = await prisma.message.findMany({
          where: { communityId },
          include: messageInclude,
          orderBy: { createdAt: "asc" },
          take: 50,
        });

        socket.emit(SOCKET_EVENTS.INIT_MESSAGES, messages);

        // Broadcast presence
        io.to(`community:${communityId}`).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
          userId,
          isOnline: true,
        });
      } catch (err) {
        socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to join community" });
      }
    });

    // ---------------- SEND MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.SEND,
      async (payload: {
        communityId: string;
        content: string;
        parentId?: string;
        attachments?: { type: string; url: string; name: string; size?: string }[];
      }) => {
        try {
          const { communityId, content, parentId, attachments } = payload;
          if (!content?.trim() && !attachments?.length) return;

          const message = await prisma.message.create({
            data: {
              communityId,
              senderId: userId,
              content: content?.trim() || "",
              slug: slugify(`msg_${userId}_${Date.now()}`),
              parentId: parentId || null,
              attachments: attachments || undefined,
            },
            include: messageInclude,
          });

          // Update community last active
          await prisma.community.update({
            where: { id: communityId },
            data: { lastActiveAt: new Date() },
          });

          io.to(`community:${communityId}`).emit(SOCKET_EVENTS.NEW_MESSAGE, message);
        } catch (err) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to send message" });
        }
      }
    );

    // ---------------- EDIT MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.EDIT,
      async (payload: { communityId: string; messageId: string; content: string }) => {
        try {
          const { communityId, messageId, content } = payload;
          if (!content?.trim()) return;

          // Verify sender owns the message
          const existing = await prisma.message.findUnique({
            where: { id: messageId },
            select: { senderId: true },
          });
          if (!existing || existing.senderId !== userId) {
            socket.emit(SOCKET_EVENTS.ERROR, { message: "Cannot edit this message" });
            return;
          }

          const updated = await prisma.message.update({
            where: { id: messageId },
            data: { content: content.trim(), updatedAt: new Date() },
            include: messageInclude,
          });

          io.to(`community:${communityId}`).emit(SOCKET_EVENTS.MESSAGE_EDITED, updated);
        } catch (err) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to edit message" });
        }
      }
    );

    // ---------------- DELETE MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.DELETE,
      async (payload: { communityId: string; messageId: string }) => {
        try {
          const { communityId, messageId } = payload;

          // Verify sender owns the message OR is admin/moderator
          const [message, member] = await Promise.all([
            prisma.message.findUnique({
              where: { id: messageId },
              select: { senderId: true },
            }),
            prisma.communityMember.findUnique({
              where: { userId_communityId: { userId, communityId } },
              select: { role: true },
            }),
          ]);

          if (!message) return;
          const isOwner = message.senderId === userId;
          const isMod = member?.role === "ADMIN" || member?.role === "MODERATOR";
          if (!isOwner && !isMod) {
            socket.emit(SOCKET_EVENTS.ERROR, { message: "Cannot delete this message" });
            return;
          }

          await prisma.message.delete({ where: { id: messageId } });

          io.to(`community:${communityId}`).emit(SOCKET_EVENTS.MESSAGE_DELETED, {
            messageId,
            deletedBy: userId,
          });
        } catch (err) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to delete message" });
        }
      }
    );

    // ---------------- REACT TO MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.REACT,
      async (payload: { communityId: string; messageId: string; type: ReactionType }) => {
        try {
          const { communityId, messageId, type } = payload;

          // Toggle reaction: remove if exists, create if not
          const existing = await prisma.reaction.findUnique({
            where: { messageId_userId_type: { messageId, userId, type } },
          });

          if (existing) {
            await prisma.reaction.delete({ where: { id: existing.id } });
          } else {
            await prisma.reaction.create({
              data: { type, messageId, userId },
            });
          }

          // Fetch all reactions for this message to broadcast the full state
          const reactions = await prisma.reaction.findMany({
            where: { messageId },
            include: { user: { select: { id: true, name: true } } },
          });

          io.to(`community:${communityId}`).emit(SOCKET_EVENTS.REACTION, {
            messageId,
            reactions,
          });
        } catch (err) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to react" });
        }
      }
    );

    // ---------------- PIN / UNPIN MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.PIN,
      async (payload: { communityId: string; messageId: string; pin: boolean }) => {
        try {
          const { communityId, messageId, pin } = payload;

          if (pin) {
            await prisma.pinnedMessage.create({
              data: { communityId, messageId, pinnedByUserId: userId },
            });
          } else {
            await prisma.pinnedMessage.delete({ where: { messageId } });
          }

          const updatedMessage = await prisma.message.findUnique({
            where: { id: messageId },
            include: messageInclude,
          });

          io.to(`community:${communityId}`).emit(SOCKET_EVENTS.PINNED, {
            message: updatedMessage,
            isPinned: pin,
            pinnedBy: userId,
          });
        } catch (err) {
          socket.emit(SOCKET_EVENTS.ERROR, { message: "Failed to pin message" });
        }
      }
    );

    // ---------------- TYPING INDICATOR ----------------
    socket.on(
      SOCKET_EVENTS.TYPING,
      ({ communityId, isTyping }: { communityId: string; isTyping: boolean }) => {
        socket.to(`community:${communityId}`).emit(SOCKET_EVENTS.TYPING_UPDATE, {
          userId,
          name: socket.data.name,
          isTyping,
        });
      }
    );

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", async () => {
      const rooms = socketRooms.get(socket.id);
      if (rooms) {
        for (const communityId of rooms) {
          // Set member offline
          await prisma.communityMember.updateMany({
            where: { userId, communityId },
            data: { isOnline: false },
          }).catch(() => {}); // Don't crash on disconnect errors

          io.to(`community:${communityId}`).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
            userId,
            isOnline: false,
          });
        }
        socketRooms.delete(socket.id);
      }
    });
  });

  return io;
}
