export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string | null;
  about: string | null;
  isEmailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profileImageUrl: string | null;
  about: string | null;
  isEmailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
    showProgress: boolean;
  };
  learning: {
    autoPlay: boolean;
    playbackSpeed: number;
    quality: 'low' | 'medium' | 'high';
  };
} 