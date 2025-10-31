// types/comment.ts
export interface Comment {
  id: string;
  articleId: string;
  parentId: string | null;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface CommentFormData {
  content: string;
  parentId?: string | null;
}