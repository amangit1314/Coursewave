import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { absoluteUrl } from "@/utils/utils";
import { checkRateLimit, RateLimitError } from "./rate-limiter";

// API Configuration
const API_BASE_URL = 
// process.env.NEXT_PUBLIC_API_URL ||
 "http://localhost:5002";
const API_TIMEOUT = 30000; // 30 seconds

// Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {};
}

// Error Types
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

// Request/Response Interceptors
export interface RequestInterceptor {
  onRequest?: (
    config: AxiosRequestConfig
  ) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRequestError?: (error: AxiosError) => Promise<AxiosError>;
}

export interface ResponseInterceptor {
  onResponse?: (
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse>;
  onResponseError?: (error: AxiosError) => Promise<AxiosError>;
}

// API Manager Class
export class ApiManager {
  static setAccessToken(accessToken: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coursewave_access_token', accessToken);
    }
  }

  static clearTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coursewave_access_token');
      localStorage.removeItem('refreshToken');
    }
  }

  static setAuthToken(accessToken: string) {
    this.setAccessToken(accessToken);
  }

  private static instance: ApiManager;
  private axiosInstance: AxiosInstance;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  private constructor() {
    console.log("API Base URL:", API_BASE_URL);
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupDefaultInterceptors();
  }

  public static getInstance(): ApiManager {
    if (!ApiManager.instance) {
      ApiManager.instance = new ApiManager();
    }
    return ApiManager.instance;
  }

  // Setup default interceptors
  private setupDefaultInterceptors(): void {
    // Request interceptor for authentication
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Request interceptor - Token added to request:", config.url);
        } else {
          console.log("Request interceptor - No token available for request:", config.url);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleResponseError(error);
      }
    );
  }

  // Add custom interceptors
  public addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  public addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  // Auth token management
  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("coursewave_access_token") || sessionStorage.getItem("coursewave_access_token");
    }
    return null;
  }

  public setAuthToken(token: string, rememberMe: boolean = false): void {
    if (typeof window !== "undefined") {
      if (rememberMe) {
        localStorage.setItem("coursewave_access_token", token);
      } else {
        sessionStorage.setItem("coursewave_access_token", token);
      }
      console.log("Auth token set successfully:", token ? "Token present" : "No token");
    }
  }

  public removeAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("coursewave_access_token");
      sessionStorage.removeItem("coursewave_access_token");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("refreshToken");
    }
  }

  // Error handling
  private handleResponseError(error: AxiosError): Promise<AxiosError> {
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        this.removeAuthToken();
        // Redirect to login if in browser
        if (typeof window !== "undefined") {
          console.error("401 Unauthorized Error:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            headers: error.response?.headers,
            config: error.config
          });
          
          // Show toast notification for 401 error
          if (typeof window !== "undefined") {
            alert("Session expired. Please login again.");
          } else {
            // Fallback for when alert is not available
            console.warn("Alert notification not available for 401 error");
          }
          window.location.href = "/login";
        }
      }

      // Create custom error
      const apiError = new ApiError(
        (data as any)?.message || error.message,
        status,
        (data as any)?.code,
        data
      );

      return Promise.reject(apiError);
    }

    return Promise.reject(error);
  }

  // HTTP Methods
  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      console.log("ApiManager: Making GET request to:", `${this.axiosInstance.defaults.baseURL}${url}`);
      // Check rate limit before making request
      checkRateLimit(url, 'GET');
      
      const response = await this.axiosInstance.get<ApiResponse<T>>(
        url,
        config
      );
      console.log("ApiManager: Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("ApiManager: Error in GET request:", error);
      throw this.handleError(error);
    }
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Check rate limit before making request
      checkRateLimit(url, 'POST');
      
      const response = await this.axiosInstance.post<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Check rate limit before making request
      checkRateLimit(url, 'PUT');
      
      const response = await this.axiosInstance.put<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Check rate limit before making request
      checkRateLimit(url, 'PATCH');
      
      const response = await this.axiosInstance.patch<ApiResponse<T>>(
        url,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      // Check rate limit before making request
      checkRateLimit(url, 'DELETE');
      
      const response = await this.axiosInstance.delete<ApiResponse<T>>(
        url,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // File upload
  public async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await this.axiosInstance.post<ApiResponse<T>>(
        url,
        formData,
        {
          ...config,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling helper
  private handleError(error: any): ApiError {
    // Handle rate limit errors
    if (error instanceof RateLimitError) {
      return new ApiError(
        error.message,
        429, // Too Many Requests
        'RATE_LIMIT_EXCEEDED',
        {
          resetTime: error.resetTime,
          remaining: error.remaining,
          total: error.total,
        }
      );
    }

    // Handle axios errors
    if (error.response) {
      const { status, data } = error.response;
      return new ApiError(
        (data as any)?.message || error.message,
        status,
        (data as any)?.code,
        data
      );
    }

    // Handle network errors
    if (error.request) {
      return new ApiError(
        "Network error - no response received",
        0,
        "NETWORK_ERROR"
      );
    }

    // Handle other errors
    return new ApiError(
      error.message || "Unknown error occurred",
      500,
      "UNKNOWN_ERROR"
    );
  }

  // Utility methods
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  public setBaseURL(url: string): void {
    this.axiosInstance.defaults.baseURL = url;
  }

  public setDefaultHeaders(headers: Record<string, string>): void {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers,
    };
  }

  public async refreshToken(): Promise<string | null> {
    const refreshToken = this.getAuthToken();
    if (!refreshToken) {
      console.log('No refresh token found');
      return null;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
      const { accessToken } = response.data;
      this.setAuthToken(accessToken);
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      this.removeAuthToken();
      return null;
    }
  }
}

// Export singleton instance
export const apiManager = ApiManager.getInstance();

// Export types
export type { AxiosRequestConfig, AxiosResponse, AxiosError };

// Default export
export default ApiManager;
