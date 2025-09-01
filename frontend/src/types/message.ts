export interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  reactions: { emoji: string; count: number }[];
  replyTo?: {
    id: string;
    sender: string;
    content: string;
  };
  attachments?: {
    type: "image" | "file";
    url: string;
    name: string;
    size?: string;
  }[];
  isPinned?: boolean;
  pinnedBy?: string;
  pinnedAt?: Date;
}