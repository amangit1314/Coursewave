import ApiManager  from "../api-manager";

export interface ProfileData {
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface NotificationSettings {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  courseUpdates?: boolean;
  marketingEmails?: boolean;
}

export interface AppearanceSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export class ProfileService {
  private static instance: ProfileService;
  private apiManager: ApiManager;

  private constructor() {
    this.apiManager = ApiManager.getInstance();
  }

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  // Profile management
  async getProfile(): Promise<any> {
    const response = await this.apiManager.get("/api/profile/me");
    return response.data;
  }

  async updateProfile(data: ProfileData): Promise<any> {
    const response = await this.apiManager.patch("/api/profile/me", data);
    return response.data;
  }

  async getProfileById(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}`);
    return response.data;
  }

  // Notification settings
  async getNotificationSettings(): Promise<any> {
    const response = await this.apiManager.get("/api/profile/notifications");
    return response.data;
  }

  async updateNotificationSettings(data: NotificationSettings): Promise<any> {
    const response = await this.apiManager.patch("/api/profile/notifications", data);
    return response.data;
  }

  // Appearance settings
  async getAppearanceSettings(): Promise<any> {
    const response = await this.apiManager.get("/api/profile/appearance");
    return response.data;
  }

  async updateAppearanceSettings(data: AppearanceSettings): Promise<any> {
    const response = await this.apiManager.patch("/api/profile/appearance", data);
    return response.data;
  }

  // Password management
  async changePassword(data: ChangePasswordData): Promise<any> {
    const response = await this.apiManager.post("/api/profile/change-password", data);
    return response.data;
  }

  // Instructor related
  async becomeInstructor(userId: string): Promise<any> {
    const response = await this.apiManager.post(`/api/profile/${userId}/becomeInstructor`);
    // `http://localhost:5002/api/profile/${user.id}/become-instructor`
    return response.data;
  }

  async getInstructorProfile(instructorId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/instructor/${instructorId}`);
    return response.data;
  }

  // Contact and support
  async contactSupport(userId: string, data: {
    subject: string;
    message: string;
    category: string;
  }): Promise<any> {
    const response = await this.apiManager.post(`/api/profile/${userId}/contact`, data);
    return response.data;
  }

  // User preferences
  async getUserPreferences(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/preferences`);
    return response.data;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    const response = await this.apiManager.put(`/api/profile/${userId}/preferences`, preferences);
    return response.data;
  }

  // User subscription
  async getUserSubscription(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/getUserSubscription`);
    return response.data;
  }

  // User activity
  async getUserActivity(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/activity`);
    return response.data;
  }

  async getUserStats(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/stats`);
    return response.data;
  }

  // User learning progress
  async getUserLearningProgress(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/learning-progress`);
    return response.data;
  }

  // User certificates
  async getUserCertificates(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/certificates`);
    return response.data;
  }

  // User achievements
  async getUserAchievements(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/achievements`);
    return response.data;
  }

  // Account deletion
  async deleteAccount(userId: string, password: string): Promise<any> {
    const response = await this.apiManager.delete(`/api/profile/${userId}`, {
      data: { password }
    });
    return response.data;
  }

  // Profile verification
  async verifyProfile(userId: string): Promise<any> {
    const response = await this.apiManager.post(`/api/profile/${userId}/verify`);
    return response.data;
  }

  // Profile privacy settings
  async getPrivacySettings(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/api/profile/${userId}/privacy`);
    return response.data;
  }

  async updatePrivacySettings(userId: string, settings: any): Promise<any> {
    const response = await this.apiManager.put(`/api/profile/${userId}/privacy`, settings);
    return response.data;
  }
}

// Export singleton instance
export const profileService = ProfileService.getInstance(); 