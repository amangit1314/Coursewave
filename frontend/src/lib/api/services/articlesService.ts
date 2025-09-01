import ApiManager from "../api-manager";

export const articleService = {
    /// ====================================== ARTICLES ==================================
  async getArticles() {
    const response = await ApiManager.getInstance().get(`/blogs`);
    console.log("Get Articles response:", response.data);
    return response.data;
  },

  async getArticleById(articleId: string) {
    const response = await ApiManager.getInstance().get(`/blogs/${articleId}`);
    console.log(`GET Article with id: ${articleId} Response:`, response.data);
    return response.data;
  },

  async getArticleBySlug(slug: string) {
    const response = await ApiManager.getInstance().get(`/blogs/${slug}`);
    console.log(`GET Article with slug: ${slug} Response:`, response.data);
    return response.data;
  },

  async createArticle(
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string,
    authorId: string
  ) {
    const response = await ApiManager.getInstance().post(`/blogs`, {
      title,
      content,
      thumbnailUrl,
      estimatedReadingTime,
      authorId,
    });
    return response.data;
  },

  async updateArticle(
    articleId: string,
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string
  ) {
    const response = await ApiManager.getInstance().put(`/blogs/${articleId}`, {
      title,
      content,
      thumbnailUrl,
      estimatedReadingTime,
    });
    return response.data;
  },

  async deleteArticle(articleId: string) {
    const response = await ApiManager.getInstance().delete(
      `/blogs/${articleId}`
    );
    return response.data;
  },

   /// ====================================== ARTICLE COMMENTS ==================================
  

  async getArticleComments(articleId: string) {
    const response = await ApiManager.getInstance().get(
      `/blogs/${articleId}/comments`
    );
    return response.data;
  },

  async addComment(articleId: string, content: string, authorId: string) {
    const response = await ApiManager.getInstance().post(
      `/blogs/${articleId}/comments`,
      { content, authorId }
    );
    return response.data;
  },

  async updateComment(commentId: string, content: string) {
    const response = await ApiManager.getInstance().put(
      `/comments/${commentId}`,
      { content }
    );
    return response.data;
  },

  async deleteComment(commentId: string) {
    const response = await ApiManager.getInstance().delete(
      `/comments/${commentId}`
    );
    return response.data;
  },

  /// ====================================== SAVED ARTICLES ==================================
  // get saved articles for the loggedin user wihtout id
  async getSavedArticles() {
    const response = await ApiManager.getInstance().get(
      `/users/saved-articles`
    );
    console.log("Get Saved Articles response:", response.data);
    return response.data;
  },

  async saveArticle(articleId: string) {
    const response = await ApiManager.getInstance().post(
      `/users/saved-articles/${articleId}`
    );
    return response.data;
  },

  async unsaveArticle(articleId: string) {
    const response = await ApiManager.getInstance().delete(
      `/users/saved-articles/${articleId}`
    );
    return response.data;
  },

  async getCreatedArticles(userId: string) {
    console.log("Fetching created articles for user:", userId);

    // Check if auth token is available
    const authToken =
      typeof window !== "undefined"
        ? localStorage.getItem("coursewave_access_token") ||
          sessionStorage.getItem("coursewave_access_token")
        : null;

    console.log("Auth token available:", !!authToken);
    console.log(
      "Auth token value:",
      authToken ? `${authToken.substring(0, 20)}...` : "null"
    );

    console.log("API URL:", `/api/users/${userId}/articles`);

    try {
      const response = await ApiManager.getInstance().get(
        `/users/${userId}/articles`
      );
      console.log("Created articles response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching created articles:", error);
      throw error;
    }
  },
};

/**
 * export const articleService = {
  async getArticles() {
    const response = await ApiManager.getInstance().get("/articles");
    return response.data;
  },

  async createArticle(articleData: {
    title: string;
    content: string;
    thumbnailUrl: string | null;
    estimatedReadingTime: string;
    authorId: string;
  }) {
    const response = await ApiManager.getInstance().post(
      "/articles",
      articleData
    );
    return response.data;
  },

  async updateArticle(
    articleId: string,
    updates: {
      title?: string;
      content?: string;
      thumbnailUrl?: string | null;
      estimatedReadingTime?: string;
    }
  ) {
    const response = await ApiManager.getInstance().put(
      `/articles/${articleId}`,
      updates
    );
    return response.data;
  },

  async saveArticle(userId: string, articleId: string) {
    const response = await ApiManager.getInstance().post(
      `/users/${userId}/saved-articles`,
      {
        articleId,
      }
    );
    return response.data;
  },

  async unsaveArticle(userId: string, articleId: string) {
    const response = await ApiManager.getInstance().delete(
      `/users/${userId}/saved-articles/${articleId}`
    );
    return response.data;
  },

  async getCreatedArticles(userId: string) {
    console.log("Fetching created articles for user:", userId);

    // Check if auth token is available
    const authToken =
      typeof window !== "undefined"
        ? localStorage.getItem("coursewave_access_token") ||
          sessionStorage.getItem("coursewave_access_token")
        : null;

    console.log("Auth token available:", !!authToken);
    console.log(
      "Auth token value:",
      authToken ? `${authToken.substring(0, 20)}...` : "null"
    );

    console.log("API URL:", `/api/users/${userId}/articles`);

    try {
      const response = await ApiManager.getInstance().get(
        `/api/users/${userId}/articles`
      );
      console.log("Created articles response:", response);
      return response.data;
    } catch (error) {
      console.error("Error fetching created articles:", error);
      throw error;
    }
  },
};
 */
