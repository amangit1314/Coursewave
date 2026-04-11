import { UpdateProfileRequest } from "@/types/users.service.types";
import ApiManager from "../api-manager";

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

  // -------------------------------------- USER -------------------------------------------------
  async getUserById(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}`);
    return response.data;
  }

  async reportUser(userId: string, reason: string, details?: string): Promise<any> {
    const response = await this.apiManager.post(`/users/${userId}/report`, {
      reason,
      details,
    });
    return response.data;
  }

  // -------------------------------------- SESSIONS -------------------------------------------------
  async getScheduledSessions(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/scheduledSessions`
    );
    return response.data;
  }

  // -------------------------------------- WISHLIST -------------------------------------------------
  async getWishlist(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}/wishlist`);
    return response.data;
  }

  async addToWishlist(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.post(`/users/${userId}/wishlist`, {
      courseId,
    });
    return response.data;
  }

  async removeFromWishlist(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.delete(
      `/users/${userId}/wishlist/${courseId}`
    );
    return response.data;
  }

  // -------------------------------------- ARTICLES -------------------------------------------------
  async saveArticle(userId: string, articleId: string): Promise<any> {
    const response = await this.apiManager.post(
      `/users/${userId}/saved-articles`,
      { articleId }
    );
    return response.data;
  }

  async unsaveArticle(userId: string, articleId: string): Promise<any> {
    const response = await this.apiManager.delete(
      `/users/${userId}/saved-articles/${articleId}`
    );
    return response.data;
  }

  async getSavedArticles(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/articles/saved`);
    return response.data;
  }

  async getCreatedArticles(): Promise<any> {
    const response = await this.apiManager.get(`/users/articles/created`);
    return response.data;
  }

  // -------------------------------------- COURSES -------------------------------------------------

  async saveCourse(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.post(
      `/users/${userId}/saved-courses`,
      { courseId }
    );
    return response.data;
  }

  async removeSavedCourse(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.delete(
      `/users/${userId}/saved-courses/${courseId}`
    );
    return response.data;
  }

  async getSavedCourses(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/users/${userId}/saved-courses`
    );
    return response.data;
  }

  // ------------------------------------------- ORDERS -------------------------------------------
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
