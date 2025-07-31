import { ApiManager } from "../api-manager";

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

  async updateProfile(userId: string, updates: UpdateProfileRequest): Promise<any> {
    const response = await this.apiManager.put(`/profile/${userId}`, updates);
    return response.data;
  }

  async becomeInstructor(userId: string): Promise<any> {
    const response = await this.apiManager.post("/become-instructor", { userId });
    return response.data;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<any> {
    const response = await this.apiManager.put(`/profile/${userId}/change-password`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  }

  async deleteAccount(userId: string): Promise<any> {
    const response = await this.apiManager.delete(`/profile/${userId}`);
    // Clear tokens after account deletion
    ApiManager.clearTokens();
    return response.data;
  }

  async getEnrolledCourses(userId: string): Promise<any> {
    // Validate userId before making API call
    if (!userId || userId === 'null' || userId === 'undefined') {
      console.warn("Invalid userId provided to getEnrolledCourses:", userId);
      throw new Error("Invalid user ID provided");
    }
    
    const response = await this.apiManager.get(`/profile/${userId}/enrolledCourses`);
    return response.data;
  }

  async getUserById(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}`);
    return response.data;
  }

  async getUserProfile(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}`);
    return response.data;
  }

  async getUserSubscription(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}/getUserSubscription`);
    return response.data;
  }

  async getUserPreferences(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}/preferences`);
    return response.data;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    const response = await this.apiManager.put(`/profile/${userId}/preferences`, preferences);
    return response.data;
  }

  async getSavedArticles(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}/savedArticles`);
    return response.data;
  }

  async getCreatedArticles(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}/articles`);
    return response.data;
  }

  async getScheduledSessions(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}/scheduledSessions`);
    return response.data;
  }

  async getWishlist(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/users/${userId}/wishlist`);
    return response.data;
  }

  async addToWishlist(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.post(`/users/${userId}/wishlist`, { courseId });
    return response.data;
  }

  async removeFromWishlist(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.delete(`/users/${userId}/wishlist/${courseId}`);
    return response.data;
  }

  async saveArticle(userId: string, articleId: string): Promise<any> {
    const response = await this.apiManager.post(`/users/${userId}/saved-articles`, { articleId });
    return response.data;
  }

  async unsaveArticle(userId: string, articleId: string): Promise<any> {
    const response = await this.apiManager.delete(`/users/${userId}/saved-articles/${articleId}`);
    return response.data;
  }

  async saveCourse(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.post(`/users/${userId}/saved-courses`, { courseId });
    return response.data;
  }

  async removeSavedCourse(userId: string, courseId: string): Promise<any> {
    const response = await this.apiManager.delete(`/users/${userId}/saved-courses/${courseId}`);
    return response.data;
  }
}

// Export singleton instance
export const userService = UserService.getInstance(); 