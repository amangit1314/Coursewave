import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { prisma } from "../config/prisma";
import { verifySocketToken } from "../core/middleware/verifySocketToken";
// import redis from "./redis";
import { ReactionType } from "@prisma/client"; // ✅ Import your enum
import { slugify } from "../core/utils/slugify";
import { SOCKET_EVENTS } from "./constants";

interface ServerSocket extends Socket {
  data: {
    userId: string;
    name?: string;
  };
}

export function initSocket(server: HttpServer) {
  const io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });

  io.use(verifySocketToken);

  io.on("connection", (socket: ServerSocket) => {
    const { userId } = socket.data;

    // ---------------- JOIN COMMUNITY ----------------
    socket.on(SOCKET_EVENTS.JOIN, async (communityId: string) => {
      socket.join(`community:${communityId}`);
      // await redis.sadd(`community:${communityId}:onlineUsers`, userId);

      // Send last 50 messages
      const messages = await prisma.message.findMany({
        where: { communityId },
        include: {
          sender: { select: { id: true, name: true, profileImageUrl: true } },
          reactions: true,
          replies: true,
          parentMessage: {
            select: {
              id: true,
              content: true,
              sender: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
        take: 50,
      });

      socket.emit(SOCKET_EVENTS.INIT_MESSAGES, messages);

      io.to(`community:${communityId}`).emit(SOCKET_EVENTS.PRESENCE_UPDATE, {
        userId,
        isOnline: true,
      });
    });

    // ---------------- SEND MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.SEND,
      async ({
        communityId,
        content,
        parentId,
        attachments,
      }: {
        communityId: string;
        content: string;
        parentId?: string;
        attachments?: any; // JSON structure for attachments
      }) => {
        const message = await prisma.message.create({
          data: {
            communityId,
            senderId: userId,
            content,
            slug: slugify(`message_${userId}_${Date.now()}`),
            parentId: parentId || null,
            attachments: attachments || null,
          },
          include: {
            sender: { select: { id: true, name: true, profileImageUrl: true } },
            reactions: true,
            replies: true,
            parentMessage: {
              select: {
                id: true,
                content: true,
                sender: { select: { name: true } },
              },
            },
          },
        });

        io.to(`community:${communityId}`).emit(
          SOCKET_EVENTS.NEW_MESSAGE,
          message
        );
      }
    );

    // ---------------- REACT TO MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.REACT,
      async ({
        communityId,
        messageId,
        type,
      }: {
        communityId: string;
        messageId: string;
        type: ReactionType;
      }) => {
        const reaction = await prisma.reaction.create({
          data: {
            type,
            messageId,
            userId,
          },
        });

        io.to(`community:${communityId}`).emit(SOCKET_EVENTS.REACTION, {
          messageId,
          reaction,
        });
      }
    );

    // ---------------- PIN / UNPIN MESSAGE ----------------
    socket.on(
      SOCKET_EVENTS.PIN,
      async ({
        communityId,
        messageId,
        pin,
      }: {
        communityId: string;
        messageId: string;
        pin: boolean;
      }) => {
        if (pin) {
          // Create a new pinned message entry
          await prisma.pinnedMessage.create({
            data: {
              communityId,
              messageId,
              pinnedByUserId: userId,
            },
          });
        } else {
          // Remove the pinned message entry
          await prisma.pinnedMessage.delete({
            where: { messageId },
          });
        }

        const updatedMessage = await prisma.message.findUnique({
          where: { id: messageId },
          include: {
            sender: { select: { id: true, name: true, profileImageUrl: true } },
          },
        });

        io.to(`community:${communityId}`).emit(
          SOCKET_EVENTS.PINNED,
          updatedMessage
        );
      }
    );

    // ---------------- TYPING INDICATOR ----------------
    socket.on(
      SOCKET_EVENTS.TYPING,
      ({
        communityId,
        isTyping,
      }: {
        communityId: string;
        isTyping: boolean;
      }) => {
        socket
          .to(`community:${communityId}`)
          .emit(SOCKET_EVENTS.TYPING_UPDATE, {
            userId,
            isTyping,
          });
      }
    );

    // ---------------- DISCONNECT ----------------
    socket.on("disconnect", async () => {
      // const keys = await redis.keys("community:*:onlineUsers");
      // for (const key of keys) {
      //   if (await redis.sismember(key, userId)) {
      //     await redis.srem(key, userId);
      //     const communityId = key.split(":")[1];
      //     io.to(`community:${communityId}`).emit(
      //       SOCKET_EVENTS.PRESENCE_UPDATE,
      //       {
      //         userId,
      //         isOnline: false,
      //       }
      //     );
      //   }
      // }
    });
  });

  return io;
}
