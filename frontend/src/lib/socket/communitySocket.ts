import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initCommunitySocket(communityId: string, token: string, callbacks: {
  onInitMessages?: (messages: any[]) => void;
  onNewMessage?: (message: any) => void;
  onReaction?: (messageId: string, reaction: any) => void;
  onPinned?: (message: any) => void;
  onTypingUpdate?: (userId: string, isTyping: boolean) => void;
  onPresenceUpdate?: (userId: string, isOnline: boolean) => void;
}) {
  if (socket) socket.disconnect();

  socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001", {
    auth: { token },
  });

  // Join community room
  socket.emit("joinCommunity", communityId);

  // 1️⃣ Initial message history
  socket.on("messages:init", (messages) => {
    callbacks.onInitMessages?.(messages);
  });

  // 2️⃣ New message (normal or reply)
  socket.on("message:new", (message) => {
    callbacks.onNewMessage?.(message);
  });

  // 3️⃣ Reaction update
  socket.on("message:reaction", ({ messageId, reaction }) => {
    callbacks.onReaction?.(messageId, reaction);
  });

  // 4️⃣ Pin/unpin message
  socket.on("message:pinned", (message) => {
    callbacks.onPinned?.(message);
  });

  // 5️⃣ Typing indicator
  socket.on("typing:update", ({ userId, isTyping }) => {
    callbacks.onTypingUpdate?.(userId, isTyping);
  });

  // 6️⃣ Presence (online/offline)
  socket.on("presence:update", ({ userId, isOnline }) => {
    callbacks.onPresenceUpdate?.(userId, isOnline);
  });

  return socket;
}

export function sendMessage(content: string, communityId: string, replyTo?: string) {
  socket?.emit("sendMessage", { communityId, content, replyTo });
}

export function reactToMessage(communityId: string, messageId: string, emoji: string) {
  socket?.emit("reactToMessage", { communityId, messageId, emoji });
}

export function togglePin(communityId: string, messageId: string, pin: boolean) {
  socket?.emit("togglePinMessage", { communityId, messageId, pin });
}

export function setTyping(communityId: string, isTyping: boolean) {
  socket?.emit("typing", { communityId, isTyping });
}
