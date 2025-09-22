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

  async verifyEmail(token: string): Promise<ApiResponse<User>> {
    return this.apiManager.post<User>("/auth/verify-email", { token });
  }

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.apiManager.post<void>("/auth/forgot-password", { email });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<void>> {
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

/**
 * export const authService = {
  async register(email: string, password: string) {
    const response = await ApiManager.getInstance().post("/api/auth/register", {
      email,
      password,
    });
    console.log("register URL:", "/api/auth/register");
    console.log("register request data:", { email, password });

    console.log("register response:", response.data);

    // Set the tokens after successful login
    return response.data;
  },

  async login(email: string, password: string) {
    const response = await ApiManager.getInstance().post("/api/auth/login", {
      email,
      password,
    });
    console.log("Login URL:", "/api/auth/login");
    console.log("Login request data:", { email, password });

    console.log("Login response:", response.data);

    // Set the tokens after successful login
    if (response.data.accessToken) {
      // Store the access token as authToken in localStorage/sessionStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("coursewave_access_token", response.data.accessToken);
        console.log("Auth token stored in localStorage");
      }
      ApiManager.setAuthToken(response.data.accessToken);
      console.log("Access token set successfully");
    }
    if (response.data.refreshToken) {
      // Store refresh token separately
      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", response.data.refreshToken);
      }
      console.log("Refresh token stored successfully");
    }

    return response.data;
  },

  async logout() {
    try {
      await ApiManager.getInstance().post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    } finally {
      // Clear tokens on logout
      ApiManager.clearTokens();
      // Also clear authToken from localStorage/sessionStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("coursewave_access_token");
        localStorage.removeItem("refreshToken");
        sessionStorage.removeItem("coursewave_access_token");
        sessionStorage.removeItem("refreshToken");
      }
    }
  },

  async verifyEmail(token: string) {
    const response = await ApiManager.getInstance().post("/api/auth/verify-email", {
      token,
    });
    return response.data;
  },

  async refreshToken() {
    console.log("=== authService.refreshToken called ===");
    const refreshToken = typeof window !== "undefined" 
      ? localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken")
      : null;
    
    console.log("Refresh token found:", !!refreshToken);
    console.log("Refresh token value:", refreshToken ? `${refreshToken.substring(0, 20)}...` : "null");
    
    if (!refreshToken) {
      console.error("No refresh token available");
      throw new Error("No refresh token available");
    }

    console.log("Making refresh token request to /api/auth/refresh-token");
    const response = await ApiManager.getInstance().post("/api/auth/refresh-token", {
      refreshToken,
    });

    console.log("Refresh token response:", response);

    if (response.data?.accessToken) {
      // Store the new access token
      if (typeof window !== "undefined") {
        localStorage.setItem("coursewave_access_token", response.data.accessToken);
        console.log("New auth token stored after refresh");
      }
      ApiManager.setAuthToken(response.data.accessToken);
      console.log("New access token set via ApiManager");
    } else {
      console.warn("No access token in refresh response");
    }

    return response.data;
  },
};
 */
