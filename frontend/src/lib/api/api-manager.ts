import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { absoluteUrl } from "@/utils/utils";

class ApiManager {
  private static instance: AxiosInstance;
  private static accessToken: string | null = null;
  private static refreshToken: string | null = null;
  private static verificationToken: string | null = null;
  private static authToken: string | null = null;

  public static getInstance(): AxiosInstance {
    if (!ApiManager.instance) {
      ApiManager.instance = axios.create({
        baseURL: "http://localhost:5002/api",
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          "access_token": "coursewave_access_token",
        },
      });

      // Add request interceptor
      ApiManager.instance.interceptors.request.use(
        (config) => {
          // Don't add headers for login/register endpoints
          const isAuthEndpoint = ["/auth/login", "/auth/register"].some(
            (path) => config.url?.includes(path)
          );

          if (!isAuthEndpoint) {
            // Add access_token header if available
            if (ApiManager.accessToken) {
              config.headers["access_token"] = ApiManager.accessToken;
            }

            // Add Authorization header if available
            if (ApiManager.authToken) {
              config.headers["Authorization"] =
                `Bearer ${ApiManager.authToken}`;
            }
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Add response interceptor
      ApiManager.instance.interceptors.response.use(
        (response) => response,
        (error) => {
             // log error
             console.error("Unauthorized access - Token might be expired", error);
             // log headers
             console.error("Request Headers:", error.config.headers);
             // log response data
             console.error("Response Data:", error.response.data);
          
          if (error.response?.status === 401) {
            // Handle token expiration or invalid tokens
            // You might want to implement token refresh logic here

            // log error
            console.error("Unauthorized access - Token might be expired", error);
            // log headers
            console.error("Request Headers:", error.config.headers);
            // log response data
            console.error("Response Data:", error.response.data);
          }
          return Promise.reject(error);
        }
      );
    }

    return ApiManager.instance;
  }

  public static setAccessToken(token: string): void {
    ApiManager.accessToken = token;
  }

  public static setAuthToken(token: string): void {
    ApiManager.authToken = token;
  }

  public static setRefreshToken(token: string): void {
    ApiManager.refreshToken = token;
  }

  public static setVerificationToken(token: string): void {
    ApiManager.verificationToken = token;
  }

  public static clearTokens(): void {
    ApiManager.accessToken = null;
    ApiManager.authToken = null;
    ApiManager.refreshToken = null;
    ApiManager.verificationToken = null;
  }
}

export default ApiManager;
