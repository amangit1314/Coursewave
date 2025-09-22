import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

import { checkRateLimit, getRateLimitStatus } from "./core/rate-limiter";
import {
  RefreshTokenResponse,
  RefreshTokenResponseData,
} from "@/types/auth.service.types";
// import { authService } from "./services";

const API_BASE_URL = "http://localhost:5002/api";
// // process.env.ENVIRONMENT === "DEVELOPMENT"
// //   ? process.env.API_LOCAL_URL
// //   : process.env.API_LIVE_URL;
const API_TIMEOUT = 30000;
const STATIC_TOKEN = "coursewave_access_token"; // static token header

// === Types ===
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {};
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public data?: any;

  constructor(message: string, status: number, code?: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// === API Manager ===
class ApiManager {
  private static instance: ApiManager;
  private axiosInstance: AxiosInstance;

  static setAccessToken(accessToken: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("coursewave_access_token", accessToken);
    }
  }

  // Token storage helpers
  public static setAuthToken(token: string, rememberMe = false) {
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("coursewave_access_token", token);
      } else {
        sessionStorage.setItem("coursewave_access_token", token);
      }
    }
  }

  public static getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("coursewave_access_token") ||
        sessionStorage.getItem("coursewave_access_token")
      );
    }
    return null;
  }

  public static clearTokens() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("coursewave_access_token");
      sessionStorage.removeItem("coursewave_access_token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("refreshToken");
    }
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        access_token: STATIC_TOKEN,
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiManager {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }

  static getRateLimitStatus(url: string, method: string = "GET") {
    return getRateLimitStatus(url, method);
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = ApiManager.getAuthToken();
        if (token) {
          if (token && config.headers?.set) {
            config.headers.set("Authorization", `Bearer ${token}`);
            config.headers.set("access_token", token);
          }
        }

        // ✅ Apply rate limiting
        checkRateLimit(config.url!, config.method?.toUpperCase() || "GET");

        // === Log request ===
        console.groupCollapsed(
          `%c[API Request] ${config.method?.toUpperCase()} ${config.url}`,
          "color: blue;"
        );
        console.log("Headers:", config.headers);
        if (config.data) console.log("Body:", config.data);
        console.groupEnd();

        return config;
      },
      (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // === Log response ===
        console.groupCollapsed(
          `%c[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
          "color: green;"
        );
        console.log("Headers:", response.headers);
        console.log("Data:", response.data);
        console.groupEnd();

        return response;
      },
      (error) => {
        // Log error response
        if (error.response) {
          console.groupCollapsed(
            `%c[API Error Response] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`,
            "color: red;"
          );
          console.log("Headers:", error.response.headers);
          console.log("Data:", error.response.data);
          console.groupEnd();
        } else {
          console.error("[API Error] No response received", error.message);
        }

        return this.handleError(error);
      }
    );
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

  private async handleError(error: AxiosError): Promise<ApiError | any> {
    if (error.response) {
      const { status, data } = error.response;
      const message = (data as any)?.message || error.message;
      const code = (data as any)?.code;

      if (status === 401 && typeof window !== "undefined") {
        try {
          const refreshToken = this.getRefreshToken();
          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // Call refresh token endpoint
          const response = await this.axiosInstance.post<
            ApiResponse<RefreshTokenResponseData>
          >("/auth/refresh-token", { refreshToken });

          const res: RefreshTokenResponse = response.data;

          if (res.success && res.data?.accessToken && error.config) {
            // Store new tokens
            ApiManager.setAuthToken(res.data.accessToken, true);
            if (res.data.refreshToken) {
              if (typeof window !== "undefined") {
                localStorage.setItem("refreshToken", res.data.refreshToken);
              }
            }

            // Update header with new token safely
            if (
              error.config.headers &&
              typeof (error.config.headers as any).set === "function"
            ) {
              (error.config.headers as any).set(
                "Authorization",
                `Bearer ${res.data.accessToken}`
              );
            } else {
              error.config.headers = {
                ...error.config.headers,
                Authorization: `Bearer ${res.data.accessToken}`,
              } as any;
            }

            return this.axiosInstance.request(error.config); // retry failed request
          }
        } catch (refreshErr) {
          ApiManager.clearTokens();
          window.location.href = "/login";
        }
      }

      return Promise.reject(new ApiError(message, status, code, data));
    }

    if (error.request) {
      return Promise.reject(
        new ApiError("Network error - no response", 0, "NETWORK_ERROR")
      );
    }

    return Promise.reject(
      new ApiError(error.message || "Unknown error", 500, "UNKNOWN_ERROR")
    );
  }

  // === HTTP Methods ===
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "GET");
    const res = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return res.data;
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "POST");
    const res = await this.axiosInstance.post<ApiResponse<T>>(
      url,
      data,
      config
    );
    return res.data;
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "PUT");
    const res = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "PATCH");
    const res = await this.axiosInstance.patch<ApiResponse<T>>(
      url,
      data,
      config
    );
    return res.data;
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "DELETE");
    const res = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return res.data;
  }

  // === File Upload ===
  public async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await this.axiosInstance.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        "Content-Type": "multipart/form-data",
        access_token: STATIC_TOKEN,
      },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          const progress = Math.round((event.loaded * 100) / event.total);
          onProgress(progress);
        }
      },
    });

    return res.data;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const apiManager = ApiManager.getInstance();
export default ApiManager;
