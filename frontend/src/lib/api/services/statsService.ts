import { apiManager, ApiResponse } from "../api-manager";

export interface PlatformStats {
  totalCourses: number;
  totalInstructors: number;
  totalUsers: number;
  totalSessions: number;
  totalProjects: number;
  totalArticles: number;
}

export interface Review {
  id: string;
  comment: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImageUrl?: string;
  };
  course: {
    id: string;
    title: string;
    instructorName: string;
  };
}

class StatsService {
  private static instance: StatsService;
  private api = apiManager;

  private constructor() { }

  public static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  /**
   * Get platform landing statistics
   */
  // statsService.ts
  // async getPlatformStats(): Promise<PlatformStats> {
  //   try {
  //     console.log("🔍 Fetching platform stats from /stats");

  //     const response = await this.api.get<any>("/stats"); // Use any for debugging

  //     console.log("📦 Full API response:", response);
  //     console.log("📦 Response data:", response.data);
  //     console.log("📦 Response data type:", typeof response.data);
  //     console.log("📦 Response data keys:", Object.keys(response.data));

  //     // Based on the logs, adjust this logic
  //     if (response.data.success && response.data.data) {
  //       return response.data.data;
  //     } else if ("totalCourses" in response.data) {
  //       return response.data;
  //     }

  //     throw new Error(
  //       "Failed to fetch platform statistics - unexpected response format"
  //     );
  //   } catch (error) {
  //     console.error("🚨 Error fetching platform stats:", error);
  //     throw error;
  //   }
  // }

  async getPlatformStats(): Promise<PlatformStats> {
    try {
      const response = await this.api.get<PlatformStats>('/stats');
      console.log("📦 Platform stats response:", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("🚨 Error fetching platform stats:", error);
      throw error;
    }
  }

  /**
   * Get reviews for landing page testimonials
   */
  async getLandingReviews(limit?: number): Promise<Review[]> {
    try {
      console.log("🔍 Fetching landing reviews");

      const params = limit ? `?limit=${limit}` : "";
      const response = await this.api.get<any>(`/stats/reviews${params}`);

      console.log("📦 Landing reviews response:", response.data);
      console.log("📦 Response data type:", typeof response.data);
      console.log("📦 Is array:", Array.isArray(response.data));

      // Handle different response formats
      if (Array.isArray(response.data)) {
        // If response is directly the array (empty or with data)
        console.log("✅ Successfully fetched landing reviews (direct array)");
        return response.data;
      } else if (response.data.success && Array.isArray(response.data.data)) {
        // If response has the ApiResponse wrapper
        console.log("✅ Successfully fetched landing reviews (wrapped data)");
        return response.data.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // If response has data property but no success property
        console.log("✅ Successfully fetched landing reviews (data property)");
        return response.data.data;
      }

      throw new Error(
        "Failed to fetch landing reviews - invalid response structure"
      );
    } catch (error) {
      console.error("🚨 Error fetching landing reviews:", error);
      throw error;
    }
  }
}

export const statsService = StatsService.getInstance();
