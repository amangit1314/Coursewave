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
import { ErrorResponse } from "@/types/common-types";

// const API_BASE_URL =
//   process.env.ENVIRONMENT === "DEVELOPMENT"
//     ? process.env.API_LOCAL_URL
//     : process.env.API_LIVE_URL;

// const API_BASE_URL = "https://male-nathalie-amanic-af4ba0b9.koyeb.app/api";
const API_BASE_URL = "http://localhost:5002/api";

const API_TIMEOUT = 30000;
const STATIC_TOKEN = "coursewave_access_token"; // static token header

// === Types ===
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {};
}

export interface ArticlesPaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// For non-paginated responses
export interface ListResponse<T> {
  items: T[];
}

export class ApiError extends Error {
  public status: number;
  public code?: string;
  public data?: ErrorResponse;

  constructor(message: string, status: number, code?: string, data?: ErrorResponse) {
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

        // ✅ ADD DEBUG LOGGING
        console.log("🔍 Request Interceptor Debug:", {
          url: config.url,
          method: config.method,
          tokenExists: !!token,
          token: token ? `${token.substring(0, 20)}...` : "MISSING",
          storageCheck: {
            localStorage: localStorage.getItem("coursewave_access_token")
              ? "EXISTS"
              : "MISSING",
            sessionStorage: sessionStorage.getItem("coursewave_access_token")
              ? "EXISTS"
              : "MISSING",
          },
        });

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
        console.log("Raw Data:", response.data);

        // ✅ GLOBAL UNWRAP LOGIC
        // Check if response.data has a nested 'data' property and 'success' property
        // This handles the double-wrapping issue: { success: true, data: { success: true, data: { ... } } }
        // if (
        //   response.data &&
        //   typeof response.data === "object" &&
        //   "data" in response.data &&
        //   "success" in response.data
        // ) {
        //   console.log("📦 Detected double-wrapped response. Unwrapping...");
        //   response.data = response.data.data;
        //   console.log("Unwrapped Data:", response.data);
        // }

        console.log("Final Data:", response.data);
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

  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private async handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      const { status, data } = error.response;
      const errorData = data as ErrorResponse | undefined;
      const message = errorData?.message || error.message;
      const code = errorData?.code;

      // ✅ PREVENT INFINITE LOOP - if refresh endpoint itself fails
      if (error.config?.url?.includes("/auth/refresh")) {
        console.log(
          "🛑 Refresh endpoint failed - stopping loop and redirecting to login"
        );
        ApiManager.clearTokens();
        window.location.href = "/login";
        return Promise.reject(
          new ApiError("Refresh token failed", 401, "REFRESH_FAILED")
        );
      }

      if (status === 401 && typeof window !== "undefined") {
        // ✅ PREVENT MULTIPLE SIMULTANEOUS REFRESHES
        if (this.isRefreshing) {
          console.log("⏳ Refresh already in progress, queuing request");
          return new Promise((resolve, reject) => {
            this.refreshSubscribers.push((token: string) => {
              if (error.config) {
                if (
                  error.config.headers &&
                  typeof (error.config.headers as any).set === "function"
                ) {
                  (error.config.headers as any).set(
                    "Authorization",
                    `Bearer ${token}`
                  );
                } else {
                  error.config.headers = {
                    ...error.config.headers,
                    Authorization: `Bearer ${token}`,
                  } as any;
                }

                resolve(this.axiosInstance.request(error.config));
              } else {
                reject(new Error("No config available for retry"));
              }
            });
          });
        }

        this.isRefreshing = true;

        try {
          const refreshToken = this.getRefreshToken();
          const currentAccessToken = ApiManager.getAuthToken();

          console.log("🔄 Attempting token refresh...", {
            hasRefreshToken: !!refreshToken,
            hasAccessToken: !!currentAccessToken,
            currentToken: currentAccessToken?.substring(0, 20) + "...",
            refreshToken: refreshToken?.substring(0, 20) + "...",
            endpoint: "/auth/refresh",
          });

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          // ✅ Use separate axios instance to avoid interceptor loops
          const refreshAxios = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            headers: {
              "Content-Type": "application/json",
              access_token: STATIC_TOKEN,
            },
          });

          // ✅ FIX: Remove Authorization header - refresh endpoint only needs refreshToken in body
          const response = await refreshAxios.post<
            ApiResponse<RefreshTokenResponseData>
          >(
            "/auth/refresh",
            { refreshToken }
            // ❌ No Authorization header needed
          );

          console.log("✅ Token refresh successful", response.data);

          const res: RefreshTokenResponse = response.data;

          if (res.success && res.data?.accessToken) {
            // Store new tokens
            ApiManager.setAuthToken(res.data.accessToken, true);
            if (res.data.refreshToken) {
              if (typeof window !== "undefined") {
                localStorage.setItem("refreshToken", res.data.refreshToken);
              }
            }

            console.log(
              "🔄 Processing queued requests:",
              this.refreshSubscribers.length
            );

            // Update all queued requests with new token
            this.refreshSubscribers.forEach((callback) => {
              try {
                callback(res.data.accessToken);
              } catch (err) {
                console.error("Error in refresh subscriber:", err);
              }
            });
            this.refreshSubscribers = [];

            // Retry original request if config exists
            if (error.config) {
              const retryConfig = {
                ...error.config,
                headers: {
                  ...error.config.headers,
                  Authorization: `Bearer ${res.data.accessToken}`,
                },
              };

              console.log("🔄 Retrying original request with new token");
              return this.axiosInstance.request(retryConfig);
            }
          } else {
            throw new Error("Invalid response from refresh endpoint");
          }
        } catch (refreshErr: unknown) {
          const refreshError = refreshErr instanceof Error
            ? refreshErr
            : new Error(String(refreshErr));

          console.error("❌ Token refresh failed:", {
            message: refreshError.message,
            status: refreshErr && typeof refreshErr === 'object' && 'response' in refreshErr
              ? (refreshErr as AxiosError).response?.status
              : undefined,
            data: refreshErr && typeof refreshErr === 'object' && 'response' in refreshErr
              ? (refreshErr as AxiosError).response?.data
              : undefined,
          });

          // Clear all subscribers on failure
          this.refreshSubscribers.forEach((callback) => {
            try {
              callback(""); // Notify subscribers of failure
            } catch (err) {
              console.error("Error in failed subscriber:", err);
            }
          });
          this.refreshSubscribers = [];

          // Clear tokens and redirect to login
          ApiManager.clearTokens();
          window.location.href = "/login";

          // return Promise.reject(
          //   new ApiError(
          //     "Authentication failed - please login again",
          //     401,
          //     "AUTH_REQUIRED"
          //   )
          // );
        } finally {
          this.isRefreshing = false;
        }
      }

      // Handle other error statuses
      switch (status) {
        case 400:
          return Promise.reject(
            new ApiError(message || "Bad request", status, code, errorData)
          );
        case 403:
          return Promise.reject(
            new ApiError(message || "Forbidden", status, code, errorData)
          );
        case 404:
          return Promise.reject(
            new ApiError(message || "Resource not found", status, code, errorData)
          );
        case 429:
          return Promise.reject(
            new ApiError(message || "Too many requests", status, code, errorData)
          );
        case 500:
          return Promise.reject(
            new ApiError(message || "Internal server error", status, code, errorData)
          );
        case 502:
          return Promise.reject(
            new ApiError(message || "Bad gateway", status, code, errorData)
          );
        case 503:
          return Promise.reject(
            new ApiError(message || "Service unavailable", status, code, errorData)
          );
        default:
          return Promise.reject(
            new ApiError(message || "Unknown error", status, code, errorData)
          );
      }
    }

    // Network errors (no response received)
    if (error.request) {
      console.error("🌐 Network error - no response received:", error.message);
      return Promise.reject(
        new ApiError(
          "Network error - please check your connection",
          0,
          "NETWORK_ERROR"
        )
      );
    }

    // Request configuration errors
    console.error("⚙️ Request configuration error:", error.message);
    return Promise.reject(
      new ApiError(
        error.message || "Request configuration error",
        500,
        "REQUEST_ERROR"
      )
    );
  }

  // === HTTP Methods ===
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "GET");
    const res = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return res.data;
  }

  public async post<T, D = unknown>(
    url: string,
    data?: D,
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

  public async put<T, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "PUT");
    const res = await this.axiosInstance.put<ApiResponse<T>>(url, data, config);
    return res.data;
  }

  public async patch<T, D = unknown>(
    url: string,
    data?: D,
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

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    checkRateLimit(url, "DELETE");
    const res = await this.axiosInstance.delete<ApiResponse<T>>(url, config);
    return res.data;
  }

  // === File Upload ===
  public async upload<T>(
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
