// ==================================================== PROFILE SERVICE =====================================================

export interface UserEnrollmentsApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  status: number;
}

export interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progress: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  course: any;
  /**
   * {
    id: string;
    title: string;
    // other course properties
  };
   */
}

// Contact support request
export interface ContactSupportData {
  subject: string;
  message: string;
  category: string; // e.g. "billing", "technical", "general"
}

// User preferences (can be extended as needed)
export interface PreferencesData {
  language?: string; // preferred language code e.g. "en", "fr"
  timezone?: string; // e.g. "Asia/Kolkata"
  notifications?: boolean; // enable/disable global notifications
  theme?: "light" | "dark" | "system";
  [key: string]: any; // allow extra preference keys
}

// Privacy settings
export interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends-only";
  showEnrolledCourses: boolean;
  showAchievements: boolean;
  showCertificates: boolean;
  allowMessagesFrom: "everyone" | "friends" | "no-one";
}

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
  theme?: "light" | "dark" | "system";
  language?: string;
  timezone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
