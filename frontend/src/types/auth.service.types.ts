// ================================================ AUTH SERVICE =========================================================

import { Course } from "./course";

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string | null;
  about?: string | null;
  shortSummary?: string | null;
  isEmailVerified: boolean;
  roles: string[];
  preferences?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// Response Data Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponseData extends AuthResponseData {
  message?: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken?: string;
}

export type LoginResponse = {
  success: boolean;
  data: AuthResponseData;
  message?: string;
  error?: string;
};

export type RegisterResponse = {
  success: boolean;
  data: RegisterResponseData;
  message?: string;
  error?: string;
};

export type RefreshTokenResponse = {
  success: boolean;
  data: RefreshTokenResponseData;
  message?: string;
  error?: string;
};