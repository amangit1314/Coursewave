import {
  AuthResponseData,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
  RefreshTokenResponseData,
  RegisterRequest,
  RegisterResponse,
  RegisterResponseData,
  ResetPasswordRequest,
  User,
} from "@/types/auth.service.types";
import ApiManager, { ApiResponse } from "../api-manager";

class AuthService {
  private static instance: AuthService;
  private apiManager: ApiManager;

  private constructor() {
    this.apiManager = ApiManager.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private setTokens(
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false
  ): void {
    ApiManager.setAuthToken(accessToken, rememberMe);
    if (typeof window !== "undefined") {
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("refreshToken", refreshToken);
    }
  }

  private getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("refreshToken") ||
        sessionStorage.getItem("refreshToken")
      );
    }
    return null;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.apiManager.post<AuthResponseData>(
      "/auth/login",
      data
    );

    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      this.setTokens(accessToken, refreshToken, data.rememberMe);
    }

    return response as LoginResponse;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.apiManager.post<RegisterResponseData>(
      "/auth/register",
      data
    );

    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      this.setTokens(accessToken, refreshToken, true);
    }

    return response as RegisterResponse;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await this.apiManager.post<void>("/auth/logout");
      return response;
    } finally {
      ApiManager.clearTokens();
    }
  }

  async verifyEmail(token: string, csrfToken: string): Promise<ApiResponse<User>> {
    return this.apiManager.post<User>("/auth/verify-email", { token, csrfToken });
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.apiManager.post<void>("/auth/forgot-password", { email });
  }

  async resetPassword(data: { token: string; csrfToken: string; newPassword: string }): Promise<ApiResponse<void>> {
    return this.apiManager.post<void>("/auth/reset-password", data);
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.apiManager.post<RefreshTokenResponseData>(
      "/auth/refresh-token",
      { refreshToken }
    );

    if (response.success && response.data) {
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      if (accessToken && newRefreshToken) {
        this.setTokens(accessToken, newRefreshToken);
      }
    }

    return response as RefreshTokenResponse;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.apiManager.get<User>("/auth/me");
  }

  isAuthenticated(): boolean {
    return !!ApiManager.getAuthToken();
  }

  getAuthToken(): string | null {
    return ApiManager.getAuthToken();
  }

  async socialLogin(
    provider: "google" | "github" | "facebook",
    token: string
  ): Promise<LoginResponse> {
    const response = await this.apiManager.post<AuthResponseData>(
      `/auth/${provider}`,
      { token }
    );

    if (response.success && response.data) {
      const { accessToken, refreshToken } = response.data;
      this.setTokens(accessToken, refreshToken);
    }

    return response as LoginResponse;
  }
}

export const authService = AuthService.getInstance();
