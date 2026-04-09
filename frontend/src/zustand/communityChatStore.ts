"use client";

import { create } from "zustand";

// Raw message shape from the backend (Prisma response)
export interface ServerMessage {
  id: string;
  communityId: string;
  senderId: string;
  content: string | null;
  attachments: { type: string; url: string; name: string; size?: string }[] | null;
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
  parentId: string | null;
  sender: { id: string; name: string | null; profileImageUrl: string | null };
  reactions: {
    id: string;
    type: string;
    userId: string;
    user: { id: string; name: string | null };
  }[];
  replies: { id: string }[];
  parentMessage: {
    id: string;
    content: string | null;
    sender: { id: string; name: string | null };
  } | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string | null;
  content: string;
  attachments: { type: string; url: string; name: string; size?: string }[];
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  isPinned: boolean;
  parentId: string | null;
  replyTo: { id: string; senderName: string; content: string } | null;
  reactions: { type: string; users: { id: string; name: string }[] }[];
  replyCount: number;
}

interface TypingUser {
  userId: string;
  name: string;
}

interface OnlineUser {
  userId: string;
  isOnline: boolean;
}

interface CommunityChatState {
  messages: ChatMessage[];
  replyingTo: ChatMessage | null;
  editingMessage: ChatMessage | null;
  typingUsers: TypingUser[];
  onlineUsers: OnlineUser[];
  showEmojiPicker: boolean;
  showReactionPicker: string | null;
  showPinnedPanel: boolean;
  showOnlineUsers: boolean;
  messageInput: string;
  quickReactions: string[];
}

interface CommunityChatActions {
  // Message management
  setMessages: (msgs: ServerMessage[]) => void;
  addMessage: (msg: ServerMessage) => void;
  updateMessage: (msg: ServerMessage) => void;
  removeMessage: (messageId: string) => void;

  // Reactions
  setReactions: (messageId: string, reactions: ServerMessage["reactions"]) => void;

  // Pin
  setPinned: (messageId: string, isPinned: boolean) => void;
  togglePinMessage: (messageId: string) => void;

  // Reply / Edit
  setReplyingTo: (msg: ChatMessage | null) => void;
  setEditingMessage: (msg: ChatMessage | null) => void;

  // Typing
  setTypingUser: (userId: string, name: string, isTyping: boolean) => void;

  // Presence
  setUserPresence: (userId: string, isOnline: boolean) => void;

  // UI
  setShowEmojiPicker: (v: boolean) => void;
  setShowReactionPicker: (id: string | null) => void;
  setShowPinnedPanel: (v: boolean) => void;
  setShowOnlineUsers: (v: boolean) => void;
  setMessageInput: (v: string) => void;

  // Reset
  reset: () => void;
}

// Transform server message to chat message
function toChat(msg: ServerMessage): ChatMessage {
  // Group reactions by type
  const reactionMap = new Map<string, { id: string; name: string }[]>();
  for (const r of msg.reactions) {
    const users = reactionMap.get(r.type) || [];
    users.push({ id: r.userId, name: r.user.name || "Unknown" });
    reactionMap.set(r.type, users);
  }

  return {
    id: msg.id,
    senderId: msg.senderId,
    senderName: msg.sender.name || "Unknown",
    senderAvatar: msg.sender.profileImageUrl,
    content: msg.content || "",
    attachments: (msg.attachments as ChatMessage["attachments"]) || [],
    createdAt: new Date(msg.createdAt),
    updatedAt: new Date(msg.updatedAt),
    isEdited: msg.createdAt !== msg.updatedAt,
    isPinned: msg.isPinned || false,
    parentId: msg.parentId,
    replyTo: msg.parentMessage
      ? {
          id: msg.parentMessage.id,
          senderName: msg.parentMessage.sender.name || "Unknown",
          content: msg.parentMessage.content || "",
        }
      : null,
    reactions: Array.from(reactionMap, ([type, users]) => ({ type, users })),
    replyCount: msg.replies.length,
  };
}

const initialState: CommunityChatState = {
  messages: [],
  replyingTo: null,
  editingMessage: null,
  typingUsers: [],
  onlineUsers: [],
  showEmojiPicker: false,
  showReactionPicker: null,
  showPinnedPanel: false,
  showOnlineUsers: false,
  messageInput: "",
  quickReactions: ["👍", "❤️", "😄", "🎉", "👏", "🔥", "💯", "🚀"],
};

export const useCommunityChatStore = create<CommunityChatState & CommunityChatActions>(
  (set) => ({
    ...initialState,

    setMessages: (msgs) => set({ messages: msgs.map(toChat) }),

    addMessage: (msg) =>
      set((s) => ({
        messages: [...s.messages, toChat(msg)],
      })),

    updateMessage: (msg) =>
      set((s) => ({
        messages: s.messages.map((m) => (m.id === msg.id ? toChat(msg) : m)),
        editingMessage: null,
      })),

    removeMessage: (messageId) =>
      set((s) => ({
        messages: s.messages.filter((m) => m.id !== messageId),
      })),

    setReactions: (messageId, reactions) =>
      set((s) => {
        const reactionMap = new Map<string, { id: string; name: string }[]>();
        for (const r of reactions) {
          const users = reactionMap.get(r.type) || [];
          users.push({ id: r.userId, name: r.user.name || "Unknown" });
          reactionMap.set(r.type, users);
        }
        const grouped = Array.from(reactionMap, ([type, users]) => ({ type, users }));
        return {
          messages: s.messages.map((m) =>
            m.id === messageId ? { ...m, reactions: grouped } : m
          ),
          showReactionPicker: null,
        };
      }),

    setPinned: (messageId, isPinned) =>
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, isPinned } : m
        ),
      })),

    togglePinMessage: (messageId) =>
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
        ),
      })),

    setReplyingTo: (msg) => set({ replyingTo: msg, editingMessage: null }),
    setEditingMessage: (msg) =>
      set({
        editingMessage: msg,
        replyingTo: null,
        messageInput: msg?.content || "",
      }),

    setTypingUser: (userId, name, isTyping) =>
      set((s) => ({
        typingUsers: isTyping
          ? [...s.typingUsers.filter((u) => u.userId !== userId), { userId, name }]
          : s.typingUsers.filter((u) => u.userId !== userId),
      })),

    setUserPresence: (userId, isOnline) =>
      set((s) => {
        const exists = s.onlineUsers.find((u) => u.userId === userId);
        if (exists) {
          return {
            onlineUsers: s.onlineUsers.map((u) =>
              u.userId === userId ? { ...u, isOnline } : u
            ),
          };
        }
        return { onlineUsers: [...s.onlineUsers, { userId, isOnline }] };
      }),

    setShowEmojiPicker: (v) => set({ showEmojiPicker: v }),
    setShowReactionPicker: (id) => set({ showReactionPicker: id }),
    setShowPinnedPanel: (v) => set({ showPinnedPanel: v }),
    setShowOnlineUsers: (v) => set({ showOnlineUsers: v }),
    setMessageInput: (v) => set({ messageInput: v }),

    reset: () => set(initialState),
  })
);
