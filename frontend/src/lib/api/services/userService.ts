import ApiManager from "../api-manager";

export interface UpdateProfileRequest {
  newUserName?: string;
  newProfileImage?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface BecomeInstructorRequest {
  userId: string;
}

export class UserService {
  private static instance: UserService;
  private apiManager: ApiManager;

  private constructor() {
    this.apiManager = ApiManager.getInstance();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async updateProfile(
    userId: string,
    updates: UpdateProfileRequest
  ): Promise<any> {
    const response = await this.apiManager.put(`/profile/${userId}`, updates);
    return response.data;
  }

  // TODO: verify
  async becomeInstructor(userId: string): Promise<any> {
    const response = await this.apiManager.post("/become-instructor", {
      userId,
    });
    return response.data;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<any> {
    const response = await this.apiManager.put(`/users/change-password`, {
      currentPassword: oldPassword,
      newPassword,
    });
    return response.data;
  }

  async deleteAccount(userId: string): Promise<any> {
    const response = await this.apiManager.delete(`/users`);
    // Clear tokens after account deletion
    ApiManager.clearTokens();
    return response.data;
  }

  async getEnrolledCourses() // userId: string
  : Promise<any> {
    const response = await this.apiManager.get(`/users/enrollments`);
    return response.data;
  }

  // TODO: verify
  async getUserById(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}`);
    return response.data;
  }

  // TODO: verify
  async getUserProfile(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}`);
    return response.data;
  }

  // TODO: verify
  async getUserSubscription(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/getUserSubscription`
    );
    return response.data;
  }

  // TODO: verify
  async getUserPreferences(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/preferences`
    );
    return response.data;
  }

  // TODO: verify
  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    const response = await this.apiManager.put(
      `/profile/${userId}/preferences`,
      preferences
    );
    return response.data;
  }

  // TODO: verify
  async getSavedArticles(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/savedArticles`
    );
    return response.data;
  }

  async getCreatedArticles(): Promise<any> {
    const response = await this.apiManager.get(`/users/articles`);
    return response.data;
  }

  // TODO: verify
  async getScheduledSessions(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/scheduledSessions`
    );
    return response.data;
  }

  // TODO: verify
  async getWishlist(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}/wishlist`);
    return response.data;
  }

  // TODO: verify
  async addToWishlist(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.post(`/users/${userId}/wishlist`, {
      courseId,
    });
    return response.data;
  }

  // TODO: verify
  async removeFromWishlist(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.delete(
      `/users/${userId}/wishlist/${courseId}`
    );
    return response.data;
  }

  // TODO: verify
  async saveArticle(userId: string, articleId: string): Promise<any> {
    const response = await this.apiManager.post(
      `/users/${userId}/saved-articles`,
      { articleId }
    );
    return response.data;
  }

  // TODO: verify
  async unsaveArticle(userId: string, articleId: string): Promise<any> {
    const response = await this.apiManager.delete(
      `/users/${userId}/saved-articles/${articleId}`
    );
    return response.data;
  }

  // TODO: verify
  async saveCourse(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.post(
      `/users/${userId}/saved-courses`,
      { courseId }
    );
    return response.data;
  }

  // TODO: verify
  async removeSavedCourse(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.delete(
      `/users/${userId}/saved-courses/${courseId}`
    );
    return response.data;
  }

  // TODO: verify
  async getSavedCourses(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/users/${userId}/saved-courses`
    );
    return response.data;
  }

  // TODO: verify
  // order related methods getOrders
  async getOrders(): Promise<any> {
    const response = await this.apiManager.get(`/users/me/orders`);
    return response.data;
  }
}

export const setApiTokens = (accessToken: string, authToken: string) => {
  ApiManager.setAccessToken(accessToken);
  ApiManager.setAuthToken(authToken);
};

// Export singleton instance
export const userService = UserService.getInstance();

/**
 * import { ApiManager } from "./api-manager";

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

  async becomeInstructor(userId: string, bio?: string, expertise?: string[], socialLinks?: JSON[]) {
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

  async getEnrolledCourses(
    // userId: string
  ) {
    // console.log("Fetching enrolled courses for user:", userId);
    
    // Validate userId before making API call
    // if (!userId || userId === 'null' || userId === 'undefined') {
    //   console.warn("Invalid userId provided to getEnrolledCourses:", userId);
    //   throw new Error("Invalid user ID provided");
    // }
    
    // Check if auth token is available
    const authToken = typeof window !== "undefined" 
      ? localStorage.getItem("coursewave_access_token") || sessionStorage.getItem("coursewave_access_token")
      : null;
    
    console.log("Auth token available:", !!authToken);
    console.log("Auth token value:", authToken ? `${authToken.substring(0, 20)}...` : "null");
    
    console.log("BASE URL:", "http://localhost:5002");
    console.log("API URL:", `/api/profile/enrolledCourses`);
    
    try {
      const response = await ApiManager.getInstance().get(
        `/api/profile/enrolledCourses`
      );
      console.log("Enrolled courses response:", JSON.stringify(response));
      return response.data;
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      throw error;
    }
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
    const authToken = typeof window !== "undefined" 
      ? localStorage.getItem("coursewave_access_token") || sessionStorage.getItem("coursewave_access_token")
      : null;
    
    console.log("Auth token available:", !!authToken);
    console.log("Auth token value:", authToken ? `${authToken.substring(0, 20)}...` : "null");
    
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

// Utility function to set tokens (can be called after login)
export const setApiTokens = (accessToken: string, authToken: string) => {
  ApiManager.setAccessToken(accessToken);
  ApiManager.setAuthToken(authToken);
};
 */
