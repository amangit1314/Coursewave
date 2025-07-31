import { apiManager, ApiResponse } from '../api-manager';

// Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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

export interface User {
  id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
  about?: string;
  shortSummary?: string;
  isEmailVerified: boolean;
  preferences: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Auth Service Class
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiManager.post<AuthResponse>('/api/auth/login', credentials);
    
    if (response.success && response.data) {
      // Store auth token
      apiManager.setAuthToken(response.data.token, credentials.rememberMe);
      
      // Store refresh token if available
      if (response.data.refreshToken) {
        if (typeof window !== 'undefined') {
          if (credentials.rememberMe) {
            localStorage.setItem('refreshToken', response.data.refreshToken);
          } else {
            sessionStorage.setItem('refreshToken', response.data.refreshToken);
          }
        }
      }
    }
    
    return response;
  }

  // Register
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiManager.post<AuthResponse>('/api/auth/register', userData);
    
    if (response.success && response.data) {
      // Store auth token
      apiManager.setAuthToken(response.data.token, false);
      
      // Store refresh token if available
      if (response.data.refreshToken) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
    }
    
    return response;
  }

  // Logout
  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiManager.post<void>('/api/auth/logout');
      this.clearAuthData();
      return response;
    } catch (error) {
      // Clear auth data even if logout fails
      this.clearAuthData();
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return await apiManager.get<User>('/api/auth/me');
  }

  // Refresh token
  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiManager.post<AuthResponse>('/api/auth/refresh', {
      refreshToken
    });

    if (response.success && response.data) {
      // Update stored tokens
      apiManager.setAuthToken(response.data.token);
      if (response.data.refreshToken) {
        this.setRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  }

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return await apiManager.post<void>('/api/auth/forgotPassword', data);
  }

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return await apiManager.post<void>('/api/auth/resetPassword', data);
  }

  // Verify email
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse<void>> {
    return await apiManager.post<void>('/api/auth/verifyEmail', data);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Get auth token
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    }
    return null;
  }

  // Get refresh token
  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
    }
    return null;
  }

  // Set refresh token
  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      // Store in the same location as auth token
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        localStorage.setItem('refreshToken', token);
      } else {
        sessionStorage.setItem('refreshToken', token);
      }
    }
  }

  // Clear all auth data
  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
    }
    apiManager.removeAuthToken();
  }
}

// Export singleton instance
export const authService = AuthService.getInstance(); 