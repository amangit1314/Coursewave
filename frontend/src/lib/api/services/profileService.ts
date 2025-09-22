import {
  AppearanceSettings,
  ChangePasswordData,
  NotificationSettings,
  ProfileData,
  ContactSupportData,
  PreferencesData,
  PrivacySettings,
  UserEnrollment,
  UserEnrollmentsApiResponse,
} from "@/types/profile.service.types";
import ApiManager from "../api-manager";
import { UpdateProfileRequest } from "@/types/users.service.types";
import { Enrollment } from "@/types/user-enrollments-api-response";

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

  // -------------------- PROFILE MANAGEMENT --------------------
  async getProfile(): Promise<any> {
    const response = await this.apiManager.get("/profile/me");
    return response.data;
  }

  async updateProfile(updates: UpdateProfileRequest): Promise<any> {
    const response = await this.apiManager.put(`/profile`, updates);
    return response.data;
  }

  async getProfileById(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/profile/${userId}`);
    return response.data;
  }

  // -------------------- NOTIFICATIONS --------------------
  async getNotificationSettings(): Promise<any> {
    const { data } = await this.apiManager.get("/api/profile/notifications");
    return data;
  }

  async updateNotificationSettings(data: NotificationSettings): Promise<any> {
    const { data: res } = await this.apiManager.patch(
      "/api/profile/notifications",
      data
    );
    return res;
  }

  // -------------------- APPEARANCE --------------------
  async getAppearanceSettings(): Promise<any> {
    const { data } = await this.apiManager.get("/api/profile/appearance");
    return data;
  }

  async updateAppearanceSettings(data: AppearanceSettings): Promise<any> {
    const { data: res } = await this.apiManager.patch(
      "/api/profile/appearance",
      data
    );
    return res;
  }

  // -------------------- PASSWORD --------------------
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    const response = await this.apiManager.put(`/users/change-password`, {
      currentPassword: oldPassword,
      newPassword,
    });
    return response.data;
  }

  // -------------------- INSTRUCTOR --------------------
  async becomeInstructor(data: {
    bio: string;
    expertise: string[];
    socialLinks?: Record<string, string>;
  }): Promise<any> {
    const response = await this.apiManager.post(
      "/profile/become-instructor",
      data
    );
    return response.data;
  }

  async getInstructorProfile(instructorId: string): Promise<any> {
    const { data } = await this.apiManager.get(
      `/api/instructors/${instructorId}`
    );
    return data;
  }

  // -------------------- CONTACT & SUPPORT --------------------
  async contactSupport(
    userId: string,
    payload: ContactSupportData
  ): Promise<any> {
    const { data } = await this.apiManager.post(
      `/api/profile/${userId}/contact`,
      payload
    );
    return data;
  }

  // -------------------- PREFERENCES --------------------
  // TODO: verify
  async getUserPreferences(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/preferences`
    );
    return response.data;
  }

  async updateUserPreferences(
    userId: string,
    preferences: PreferencesData
  ): Promise<any> {
    const response = await this.apiManager.put(
      `/profile/${userId}/preferences`,
      preferences
    );
    return response.data;
  }

  // -------------------- SUBSCRIPTION --------------------
  async getUserSubscription(userId: string): Promise<any> {
    const response = await this.apiManager.get(
      `/profile/${userId}/subscription`
    );
    return response.data;
  }

  // -------------------- ACTIVITY & STATS --------------------
  async getUserActivity(userId: string): Promise<any> {
    const { data } = await this.apiManager.get(
      `/api/profile/${userId}/activity`
    );
    return data;
  }

  async getUserStats(userId: string): Promise<any> {
    const { data } = await this.apiManager.get(`/api/profile/${userId}/stats`);
    return data;
  }

  // -------------------- LEARNING --------------------
  //todo: use proper types
  // async getEnrolledCourses(): Promise<any> {
  //   const response = await this.apiManager.get(`/users/enrollments`);
  //   console.log("Get enrolled courses response: ", JSON.stringify(response));
  //   return response.data;
  // }

  async getEnrolledCourses(): Promise<Enrollment[]> {
    try {
      const { data: response } =
        await this.apiManager.get<UserEnrollmentsApiResponse<Enrollment[]>>(
          "/users/enrollments"
        );

      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch enrolled courses";
      console.error("Error fetching enrolled courses:", errorMessage);
      throw new Error(errorMessage);
    }
  }

  async getUserLearningProgress(userId: string): Promise<any> {
    const { data } = await this.apiManager.get(
      `/api/profile/${userId}/learning-progress`
    );
    return data;
  }

  async getUserCertificates(userId: string): Promise<any> {
    const { data } = await this.apiManager.get(
      `/api/profile/${userId}/certificates`
    );
    return data;
  }

  async getUserAchievements(userId: string): Promise<any> {
    const { data } = await this.apiManager.get(
      `/api/profile/${userId}/achievements`
    );
    return data;
  }

  // -------------------- ACCOUNT --------------------
  async deleteAccount(password: string): Promise<any> {
    const response = await this.apiManager.delete(`/profile`, {
      data: { password },
    });
    return response; // special case since no data will be available here
  }

  async verifyProfile(userId: string): Promise<any> {
    const { data } = await this.apiManager.post(
      `/api/profile/${userId}/verify`
    );
    ApiManager.clearTokens();
    return data;
  }

  // -------------------- PRIVACY --------------------
  async getPrivacySettings(userId: string): Promise<any> {
    const { data } = await this.apiManager.get(
      `/api/profile/${userId}/privacy`
    );
    return data;
  }

  async updatePrivacySettings(
    userId: string,
    settings: PrivacySettings
  ): Promise<any> {
    const { data } = await this.apiManager.put(
      `/api/profile/${userId}/privacy`,
      settings
    );
    return data;
  }
}

// Export singleton instance
export const profileService = ProfileService.getInstance();
