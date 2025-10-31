import { BlogComment } from "./blog-comment";

export type BlogWithComments = {
  id: string;
  title: string;
  shortDescription: string | null;
  content: string;
  estimatedReadingTime: string;
  clapsCount: number;
  authorId: string;
  categoryName: string | null;
  thumbnailUrl: string | null;
  isRecommended: boolean;
  comments: BlogComment[];
  createdAt: Date | null;
  updatedAt: Date | null;
};


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