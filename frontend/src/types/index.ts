// User Types
export type { User, UserResponse, UserProfile, UserPreferences } from './user';

// Auth Types
export type { 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest, 
  ResetPasswordRequest, 
  VerifyEmailRequest, 
  AuthResponse, 
  RefreshTokenRequest, 
  RefreshTokenResponse 
} from './auth';

// Course Types
export type { Course } from './course-details-api-response';
export type { EnrolledCourse } from './enrollments-api-response';

// Article Types
export type { BlogArticle } from './blog-api-response';

// Session Types
export type { SessionResponse, SessionType, Instructor } from './session';

// Learning Goal Types
export type { LearningGoal } from './learning-goal';

// Subscription Types
export type { UserSubscription } from '../lib/subscription';
export type { SubscriptionPlan } from '../lib/config/subscriptionPlans';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common Types
export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
} 