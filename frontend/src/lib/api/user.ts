import { ApiManager } from "./api-manager";


export const authService = {
  async register(email: string, password: string) {
    const response = await ApiManager.getInstance().post("/api/auth/register", {
      email,
      password,
    });
    console.log("register URL:", "/api/auth/register");
    console.log("register request data:", { email, password });

    console.log("register response:", response.data);

    // Set the tokens after successful login
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await ApiManager.getInstance().post("/api/auth/login", {
      email,
      password,
    });
    console.log("Login URL:", "/api/auth/login");
    console.log("Login request data:", { email, password });

    console.log("Login response:", response.data);

    // Set the tokens after successful login
    if (response.data.accessToken) {
      // Store the access token as authToken in localStorage/sessionStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("coursewave_access_token", response.data.accessToken);
        console.log("Auth token stored in localStorage");
      }
      ApiManager.setAuthToken(response.data.accessToken);
      console.log("Access token set successfully");
    }
    if (response.data.refreshToken) {
      // Store refresh token separately
      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      console.log("Refresh token stored successfully");
    }

    return response.data;
  },

  async logout() {
    try {
      await ApiManager.getInstance().post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      // Clear tokens on logout
      ApiManager.clearTokens();
      // Also clear authToken from localStorage/sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("coursewave_access_token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("coursewave_access_token");
        sessionStorage.removeItem("refreshToken");
      }
    }
  },

  async verifyEmail(token: string) {
    const response = await ApiManager.getInstance().post("/api/auth/verify-email", {
      token,
    });
    return response.data;
  },

  async refreshToken() {
    console.log("=== authService.refreshToken called ===");
    const refreshToken = typeof window !== "undefined" 
      ? localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken")
      : null;
    
    console.log("Refresh token found:", !!refreshToken);
    console.log("Refresh token value:", refreshToken ? `${refreshToken.substring(0, 20)}...` : "null");
    
    if (!refreshToken) {
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }

    console.log("Making refresh token request to /api/auth/refresh-token");
    const response = await ApiManager.getInstance().post("/api/auth/refresh-token", {
      refreshToken,
    });

    console.log("Refresh token response:", response);

    if (response.data?.accessToken) {
      // Store the new access token
      if (typeof window !== "undefined") {
        localStorage.setItem("coursewave_access_token", response.data.accessToken);
        console.log("New auth token stored after refresh");
      }
      ApiManager.setAuthToken(response.data.accessToken);
      console.log("New access token set via ApiManager");
    } else {
      console.warn("No access token in refresh response");
    }

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
