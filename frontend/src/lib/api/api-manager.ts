import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

import { checkRateLimit, RateLimitError } from "./core/rate-limiter";

const API_BASE_URL = "http://localhost:5002/api";
// process.env.ENVIRONMENT === "DEVELOPMENT"
//   ? process.env.API_LOCAL_URL
//   : process.env.API_LIVE_URL;

const API_TIMEOUT = 30000;
const STATIC_TOKEN = "coursewave_access_token"; // static token header

// === Types ===
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
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
 
  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = ApiManager.getAuthToken();
        if (token && config.headers?.set) {
          config.headers.set("Authorization", `Bearer ${token}`);
          config.headers.set("access_token", token);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  // private setupInterceptors(): void {
  //   this.axiosInstance.interceptors.request.use((config) => {
  //     const token = ApiManager.getAuthToken();
  //     if (token) {
  //       if (config.headers && typeof config.headers.set === "function") {
  //         config.headers.set("Authorization", `Bearer ${token}`);
  //         config.headers.set("access_token", token);
  //       } else {
  //         config.headers = {
  //           ...(config.headers || {}),
  //           Authorization: `Bearer ${token}`,
  //           access_token: token,
  //         } as any;
  //       }
  //     }
  //     return config;
  //   });

  //   this.axiosInstance.interceptors.response.use(
  //     (response) => response,
  //     (error) => this.handleError(error)
  //   );
  // }

  private handleError(error: AxiosError): Promise<ApiError> {
    if (error.response) {
      const { status, data } = error.response;
      const message = (data as any)?.message || error.message;
      const code = (data as any)?.code;

      if (status === 401 && typeof window !== "undefined") {
        alert("Session expired. Please login again.");
        window.location.href = "/login";
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
