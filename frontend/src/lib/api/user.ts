import ApiManager from "./api-manager";
import { User } from "@prisma/client";

export const authService = {
  async login(email: string, password: string) {
    // const response = await ApiManager.getInstance().post("/auth/login",
    const url = "http://localhost:5002/api/auth/login";
    const response = await ApiManager.getInstance().post(url, {
      email,
      password,
    });

    // Set the tokens after successful login
    if (response.data.accessToken) {
      ApiManager.setAuthToken(response.data.accessToken);
    }
    if (response.data.refreshToken) {
      // Store refresh token as needed
      ApiManager.setAuthToken(response.data.refreshToken);
    }

    return response.data;
  },

  async logout(userId: string) {
    try {
      await ApiManager.getInstance().post("/auth/logout", { userId });
    } finally {
      // Clear tokens on logout
      ApiManager.clearTokens();
    }
  },

  async verifyEmail(token: string) {
    const response = await ApiManager.getInstance().post("/auth/verify-email", {
      token,
    });
    return response.data;
  },
};

export const userService = {
  async updateProfile(
    userId: string,
    updates: { newUserName?: string; newProfileImage?: string }
  ) {
    const response = await ApiManager.getInstance().put(
      `/profile/${userId}`,
      updates
    );
    return response.data;
  },

  async becomeInstructor(userId: string) {
    const response = await ApiManager.getInstance().post("/become-instructor", {
      userId,
    });
    return response.data;
  },

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ) {
    const response = await ApiManager.getInstance().put(
      `/profile/${userId}/change-password`,
      {
        oldPassword,
        newPassword,
      }
    );
    return response.data;
  },

  async deleteAccount(userId: string) {
    const response = await ApiManager.getInstance().delete(
      `/profile/${userId}`
    );
    // Clear tokens after account deletion
    ApiManager.clearTokens();
    return response.data;
  },

  async getEnrolledCourses(userId: string) {
    console.log("Fetching enrolled courses for user:", userId);
    console.log("BASE URL:", "http://localhost:5002/api");
    console.log("API URL:", `/users/${userId}/enrollments`);
    const response = await ApiManager.getInstance().get(
      `/users/${userId}/enrollments`
      // `/users/enrollments`
    );
    return response.data;
  },
};

export const courseService = {
  async saveCourse(userId: string, courseId: string) {
    const response = await ApiManager.getInstance().post(
      `/users/${userId}/saved-courses`,
      {
        courseId,
      }
    );
    return response.data;
  },

  async addToWishlist(userId: string, courseId: string) {
    const response = await ApiManager.getInstance().post(
      `/users/${userId}/wishlist`,
      { courseId }
    );
    return response.data;
  },

  async removeFromWishlist(userId: string, courseId: string) {
    const response = await ApiManager.getInstance().delete(
      `/users/${userId}/wishlist/${courseId}`
    );
    return response.data;
  },

  async getCourseInfo(courseId: string) {
    const response = await ApiManager.getInstance().get(`/courses/${courseId}`);
    return response.data;
  },
};

export const articleService = {
  async getArticles() {
    const response = await ApiManager.getInstance().get("/articles");
    return response.data;
  },

  async getCreatedArticles(userId: string) {
    const response = await ApiManager.getInstance().get(
      `/users/${userId}/articles`
    );
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
};

// Utility function to set tokens (can be called after login)
export const setApiTokens = (accessToken: string, authToken: string) => {
  ApiManager.setAccessToken(accessToken);
  ApiManager.setAuthToken(authToken);
};
