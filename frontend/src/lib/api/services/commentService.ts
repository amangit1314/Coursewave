// lib/api/services/commentService.ts

import { apiManager } from "../api-manager";

export const commentService = {
  async getComments(articleId: string) {
    const response = await apiManager.get(`/blogs/${articleId}/comments`);
    return response.data;
  },

  async addComment(articleId: string, content: string, parentId?: string) {
    const response = await apiManager.post(`/blogs/${articleId}/comments`, {
      content,
      parentId: parentId || null,
    });
    return response.data;
  },

  async updateComment(articleId: string, commentId: string, content: string) {
    const response = await apiManager.put(
      `/blogs/${articleId}/comments/${commentId}`,
      {
        content,
      }
    );
    return response.data;
  },

  async deleteComment(articleId: string, commentId: string) {
    await apiManager.delete(`/blogs/${articleId}/comments/${commentId}`);
  },

  async toggleLike(articleId: string, commentId: string) {
    const response = await apiManager.post(
      `/blogs/${articleId}/comments/${commentId}/like`
    );
    return response.data;
  },
};
