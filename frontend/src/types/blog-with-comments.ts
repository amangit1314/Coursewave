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
