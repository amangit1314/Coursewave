"use client";


import { create } from "zustand";
import { Message } from "@/types/message";
import { OnlineUser } from "@/types/online-user";

interface CommunityChatState {
  messages: Message[];
  replyingTo: Message | null;
  isTyping: boolean;
  isAdmin: boolean;
  showEmojiPicker: boolean;
  showReactionPicker: string | null;
  showPinnedMessages: boolean;
  showPinnedPanel: boolean;
  showOnlineUsers: boolean;
  onlineUsers: OnlineUser[];
  onlineCount: number;
  quickReactions: string[];
  messageInput: string;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setReplyingTo: (msg: Message | null) => void;
  setIsTyping: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setShowEmojiPicker: (value: boolean) => void;
  setShowReactionPicker: (id: string | null) => void;
  setShowPinnedMessages: (value: boolean) => void;
  setShowPinnedPanel: (value: boolean) => void;
  setShowOnlineUsers: (value: boolean) => void;
  setOnlineUsers: (users: OnlineUser[]) => void;
  setOnlineCount: (count: number) => void;
  setMessageInput: (value: string) => void;

  addReaction: (messageId: string, emoji: string) => void;
  togglePinMessage: (messageId: string) => void;
  handleFileUpload: (file: File) => void;
}

export const useCommunityChatStore = create<CommunityChatState>((set, get) => ({
  messages: [],
  replyingTo: null,
  isTyping: false,
  isAdmin: false,
  showEmojiPicker: false,
  showReactionPicker: null,
  showPinnedMessages: false,
  showPinnedPanel: false,
  showOnlineUsers: false,
  onlineUsers: [],
  onlineCount: 0,
  quickReactions: ["👍", "❤️", "😄", "🎉", "👏", "🔥", "💯", "🚀"],
  messageInput: "",

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setReplyingTo: (msg) => set({ replyingTo: msg }),
  setIsTyping: (value) => set({ isTyping: value }),
  setIsAdmin: (value) => set({ isAdmin: value }),
  setShowEmojiPicker: (value) => set({ showEmojiPicker: value }),
  setShowReactionPicker: (id) => set({ showReactionPicker: id }),
  setShowPinnedMessages: (value) => set({ showPinnedMessages: value }),
  setShowPinnedPanel: (value) => set({ showPinnedPanel: value }),
  setShowOnlineUsers: (value) => set({ showOnlineUsers: value }),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setOnlineCount: (count) => set({ onlineCount: count }),
  setMessageInput: (value) => set({ messageInput: value }),

  addReaction: (messageId, emoji) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id !== messageId) return msg;
        const existing = msg.reactions.find((r) => r.emoji === emoji);
        if (existing) {
          return {
            ...msg,
            reactions: msg.reactions.map((r) =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        }
        return { ...msg, reactions: [...msg.reactions, { emoji, count: 1 }] };
      }),
      showReactionPicker: null,
    })),

  togglePinMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.map((msg) => {
        if (msg.id !== messageId) return msg;
        return msg.isPinned
          ? { ...msg, isPinned: false, pinnedBy: undefined, pinnedAt: undefined }
          : { ...msg, isPinned: true, pinnedBy: "You", pinnedAt: new Date() };
      }),
    })),

  handleFileUpload: (file) => {
    const fileUrl = URL.createObjectURL(file);

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      content: `Shared ${file.name}`,
      timestamp: new Date(),
      isCurrentUser: true,
      reactions: [],
      attachments: [
        {
          type: file.type.startsWith("image/") ? "image" : "file",
          url: fileUrl,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        },
      ],
    };

    set((state) => ({ messages: [...state.messages, newMessage] }));

    setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
  },
}));
