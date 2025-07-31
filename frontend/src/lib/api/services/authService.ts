import { ApiManager } from "../api-manager";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export class AuthService {
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

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.apiManager.post("/api/auth/login", data);
    
    // Set the tokens after successful login
    if (response.data?.accessToken) {
      ApiManager.setAuthToken(response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      // Store refresh token as needed
      ApiManager.setAuthToken(response.data.refreshToken);
    }

    return response.data;
  }

  async register(data: RegisterRequest): Promise<any> {
    const response = await this.apiManager.post("/api/auth/register", data);
    return response.data;
  }

  async logout(userId: string): Promise<void> {
    try {
      await this.apiManager.post("/api/auth/logout", { userId });
    } finally {
      // Clear tokens on logout
      ApiManager.clearTokens();
    }
  }

  async verifyEmail(token: string): Promise<any> {
    const response = await this.apiManager.post("/api/auth/verify-email", { token });
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<any> {
    const response = await this.apiManager.post("/api/auth/forgotPassword", data);
    return response.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<any> {
    const response = await this.apiManager.post("/api/auth/resetPassword", data);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<any> {
    const response = await this.apiManager.post("/api/auth/refreshToken", { refreshToken });
    return response.data;
  }

  async me(): Promise<any> {
    const response = await this.apiManager.get("/api/auth/me");
    return response.data;
  }
}

// Export singleton instance
export const authService = AuthService.getInstance(); 