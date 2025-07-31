// src/services/article.service.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5002/api";

export const articleService = {
  async getArticles() {
    const response = await axios.get(`${API_BASE_URL}/blogs`, {
      headers: {
        access_token: "coursewave_access_token",
      },
    });
    return response.data;
  },

  async getArticleById(articleId: string) {
    const response = await axios.get(`${API_BASE_URL}/blogs/${articleId}`, {
      headers: {
        access_token: "coursewave_access_token",
      },
    });
    console.log("Api hit for get article");
    console.log("Fetched article:", response.data);
    return response.data;
  },

  async createArticle(
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string,
    authorId: string
  ) {
    const response = await axios.post(
      `${API_BASE_URL}/blogs`,
      {
        title,
        content,
        thumbnailUrl,
        estimatedReadingTime,
        authorId,
      },
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async updateArticle(
    articleId: string,
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string
  ) {
    const response = await axios.put(
      `${API_BASE_URL}/blogs/${articleId}`,
      {
        title,
        content,
        thumbnailUrl,
        estimatedReadingTime,
      },
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async deleteArticle(articleId: string) {
    const response = await axios.delete(
      `${API_BASE_URL}/blogs/${articleId}`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async getArticleComments(articleId: string) {
    const response = await axios.get(
      `${API_BASE_URL}/blogs/${articleId}/comments`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async addComment(articleId: string, content: string, authorId: string) {
    const response = await axios.post(
      `${API_BASE_URL}/blogs/${articleId}/comments`,
      { content, authorId },
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async updateComment(commentId: string, content: string) {
    const response = await axios.put(
      `${API_BASE_URL}/comments/${commentId}`,
      { content },
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async deleteComment(commentId: string) {
    const response = await axios.delete(
      `${API_BASE_URL}/comments/${commentId}`,
      {
        headers: {
          access_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },
};