import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export interface SocketCallbacks {
  onInitMessages?: (messages: any[]) => void;
  onNewMessage?: (message: any) => void;
  onMessageEdited?: (message: any) => void;
  onMessageDeleted?: (data: { messageId: string; deletedBy: string }) => void;
  onReaction?: (data: { messageId: string; reactions: any[] }) => void;
  onPinned?: (data: { message: any; isPinned: boolean; pinnedBy: string }) => void;
  onTypingUpdate?: (data: { userId: string; name?: string; isTyping: boolean }) => void;
  onPresenceUpdate?: (data: { userId: string; isOnline: boolean }) => void;
  onError?: (data: { message: string }) => void;
}

export function initCommunitySocket(
  communityId: string,
  token: string,
  callbacks: SocketCallbacks
) {
  if (socket) socket.disconnect();

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api")
    .replace(/\/api\/?$/, "");

  socket = io(baseUrl, {
    auth: { token },
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    socket?.emit("joinCommunity", communityId);
  });

  socket.on("messages:init", (messages) => callbacks.onInitMessages?.(messages));
  socket.on("message:new", (message) => callbacks.onNewMessage?.(message));
  socket.on("message:edited", (message) => callbacks.onMessageEdited?.(message));
  socket.on("message:deleted", (data) => callbacks.onMessageDeleted?.(data));
  socket.on("message:reaction", (data) => callbacks.onReaction?.(data));
  socket.on("message:pinned", (data) => callbacks.onPinned?.(data));
  socket.on("typing:update", (data) => callbacks.onTypingUpdate?.(data));
  socket.on("presence:update", (data) => callbacks.onPresenceUpdate?.(data));
  socket.on("error:message", (data) => callbacks.onError?.(data));

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function sendMessage(
  communityId: string,
  content: string,
  parentId?: string,
  attachments?: { type: string; url: string; name: string; size?: string }[]
) {
  socket?.emit("sendMessage", { communityId, content, parentId, attachments });
}

export function editMessage(communityId: string, messageId: string, content: string) {
  socket?.emit("editMessage", { communityId, messageId, content });
}

export function deleteMessage(communityId: string, messageId: string) {
  socket?.emit("deleteMessage", { communityId, messageId });
}

export function reactToMessage(communityId: string, messageId: string, type: string) {
  socket?.emit("reactToMessage", { communityId, messageId, type });
}

export function togglePin(communityId: string, messageId: string, pin: boolean) {
  socket?.emit("togglePinMessage", { communityId, messageId, pin });
}

export function setTyping(communityId: string, isTyping: boolean) {
  socket?.emit("typing", { communityId, isTyping });
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
