// Refined CourseService with strict types and clean structure
import { Review } from "@/types/review";
import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
import { Course } from "@/types";

// Models (keep them in separate files ideally)
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Instructor {
  id: string;
  name: string;
  bio?: string;
  profileImageUrl?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  lessons: Chapter[];
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  contentType: "VIDEO" | "QUIZ" | "TEXT" | "ASSIGNMENT";
  content?: any;
  video?: VideoContent;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoContent {
  id: string;
  url: string;
  provider: "MUX" | "CLOUDINARY" | "YOUTUBE" | "VIMEO";
  duration?: number;
  thumbnailUrl?: string;
}

export interface CourseProgress {
  id: string;
  enrollmentId: string;
  completedChapters: number;
  totalChapters: number;
  lastAccessed?: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "EXPIRED";
  progress: number;
  startDate: string;
  endDate?: string;
  course: Course;
  courseProgress?: CourseProgress;
}

export interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  instructor?: string;
  price?: "free" | "paid";
  sortBy?: "newest" | "popular" | "rating" | "price";
  sortOrder?: "asc" | "desc";
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  price?: number;
  isFree: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  language?: string;
  categoryIds: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isPublished?: boolean;
}

export interface CourseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  level?: string;
  instructor?: string;
  price?: "free" | "paid";
  sortBy?: "newest" | "popular" | "rating" | "price";
  sortOrder?: "asc" | "desc";
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  price?: number;
  isFree: boolean;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  language?: string;
  categoryIds: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isPublished?: boolean;
}

export interface CourseProgressUpdate {
  chapterId: string;
  isCompleted: boolean;
}

export interface CourseReview {
  rating: number;
  content?: string;
}

export interface CourseEnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
}

export interface CourseEarnings {
  totalEarnings: number;
  currency: string;
  lastPayoutDate?: string;
}

class CourseService {
  private static instance: CourseService;

  private constructor() {}

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  async saveCourse(courseId: string) {
    // const response = await ApiManager.getInstance().post(
    //   `/users/${userId}/saved-courses`,
    //   {
    //     courseId,
    //   }
    // );
    // return response.data;
    return apiManager.post(`/users/me/saved-courses`, { courseId });
  }

  async unsaveCourse(courseId: string) {
    return apiManager.delete(`/users/me/saved-courses`, {
      data: { courseId },
    });
  }

  // get wishlisted courses
  // TODO: check this
  async getWishlistedCourses(): Promise<PaginatedResponse<Course>> {
    // const response = await ApiManager.getInstance().get(
    //   `/users/${userId}/wishlist`
    // );
    // return response.data;
    return apiManager.get<Course[]>("/users/me/wishlist");
  }

  async addToWishlist(
    // userId: string,
    courseId: string
  ) {
    // const response = await ApiManager.getInstance().post(
    //   `/users/${userId}/wishlist`,
    //   { courseId }
    // );
    // return response.data;
    return apiManager.post(`/users/me/wishlist`, { courseId });
  }

  async removeFromWishlist(
    // userId: string,
    courseId: string
  ) {
    // const response = await ApiManager.getInstance().delete(
    //   `/users/${userId}/wishlist/${courseId}`
    // );
    // return response.data;

    // todo: make these without using userId
    return apiManager.delete(`/users/me/wishlist/${courseId}`);
  }

  // Course CRUD Operations
  async getCourses(params?: CourseQueryParams) {
    const response = await apiManager.get<Course[]>("/courses", { params });
    console.log("Get courses response:", response);
    return response.data;
  }

  // get enrolled courses for the user without userId
  async getEnrolledCourses(): Promise<PaginatedResponse<Enrollment>> {
    return apiManager.get<Enrollment[]>("/users/me/enrollments");
  }

  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    return apiManager.get<Course>(`/courses/${courseId}`);
  }

  async createCourse(
    courseData: CreateCourseRequest
  ): Promise<ApiResponse<Course>> {
    return apiManager.post<Course>("/courses", courseData);
  }

  async updateCourse(
    courseId: string,
    courseData: UpdateCourseRequest
  ): Promise<ApiResponse<Course>> {
    return apiManager.put<Course>(`/courses/${courseId}`, courseData);
  }

  async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    return apiManager.delete<void>(`/courses/${courseId}`);
  }

  // Course Status Management
  async publishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return apiManager.patch<Course>(`/courses/${courseId}/publish`);
  }

  async unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return apiManager.patch<Course>(`/courses/${courseId}/unpublish`);
  }

  // Course Content
  async getCourseSections(
    courseId: string
  ): Promise<ApiResponse<CourseSection[]>> {
    return apiManager.get<CourseSection[]>(`/courses/${courseId}/sections`);
  }

  async getCourseChapters(courseId: string): Promise<ApiResponse<Chapter[]>> {
    return apiManager.get<Chapter[]>(`/courses/${courseId}/chapters`);
  }

  async getCourseSectionChapters(courseId: string, sectionId: string) {
    return apiManager.get<Chapter[]>(
      `/courses/${courseId}/sections/${sectionId}/chapters`
    );
  }

  async getCourseAttachments(courseId: string) {
    return apiManager.get<{ attachments: any[] }>(
      `/courses/${courseId}/attachments`
    );
  }

  // Media Uploads
  async uploadCourseImage(
    courseId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiManager.upload<{ imageUrl: string }>(
      `/courses/${courseId}/image`,
      file,
      onProgress
    );
  }

  async checkoutCourse(
    courseId: string,
    userId: string
  ): Promise<ApiResponse<{ url: string }>> {
    console.log("=== courseService.checkoutCourse called ===");
    console.log("Course ID:", courseId);
    console.log("User ID:", userId);
    console.log(
      "Making POST request to Next.js API route:",
      `/api/courses/${courseId}/checkout`
    );
    console.log("Request body:", { userId });

    try {
      // Use Next.js API route instead of backend server
      const response = await fetch(`/api/courses/${courseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ userId }),
      });

      console.log("Checkout API response status:", response.status);
      console.log(
        "Checkout API response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Checkout API error response:", errorText);
        throw new Error(
          `Checkout failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Checkout API success response:", data);

      if (!data.success || !data.url) {
        console.error("Checkout response missing success or URL:", data);
        throw new Error("Checkout failed - invalid response format");
      }

      return {
        success: true,
        data: { url: data.url },
        message: "Checkout session created successfully",
      };
    } catch (error) {
      console.error("Checkout API error:", error);
      throw error;
    }
  }

  // Check if already purchased
  async checkAlreadyPurchased(
    courseId: string
  ): Promise<ApiResponse<{ alreadyPurchased: boolean }>> {
    return await apiManager.get<{ alreadyPurchased: boolean }>(
      `/courses/${courseId}/alreadyPurchased`
    );
  }

  // Enrollment & Progress
  async enrollInCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
    return apiManager.post<Enrollment>(`/courses/${courseId}/enroll`);
  }

  async getCourseProgress(
    courseId: string
  ): Promise<ApiResponse<CourseProgress>> {
    return apiManager.get<CourseProgress>(`/courses/${courseId}/progress`);
  }

  async updateChapterProgress(
    courseId: string,
    chapterId: string,
    isCompleted: boolean
  ): Promise<ApiResponse<void>> {
    return apiManager.patch<void>(
      `/courses/${courseId}/progress/${chapterId}`,
      { isCompleted }
    );
  }

  // Reviews & Ratings
  async getCourseReviews(courseId: string): Promise<ApiResponse<Review[]>> {
    return apiManager.get<Review[]>(`/courses/${courseId}/reviews`);
  }

  async addCourseReview(
    courseId: string,
    review: CourseReview
  ): Promise<ApiResponse<Review>> {
    return apiManager.post<Review>(`/courses/${courseId}/reviews`, review);
  }

  // Analytics
  async getCourseEnrollmentStats(
    courseId: string
  ): Promise<ApiResponse<CourseEnrollmentStats>> {
    return apiManager.get<CourseEnrollmentStats>(
      `/courses/${courseId}/stats/enrollments`
    );
  }

  async getCourseEarnings(
    courseId: string
  ): Promise<ApiResponse<CourseEarnings>> {
    return apiManager.get<CourseEarnings>(`/courses/${courseId}/earnings`);
  }

  async getCourseInstructor(courseId: string) {
    return apiManager.get<Instructor>(`/courses/${courseId}/instructor`);
  }

  // Categories
  async getCourseCategories(
    courseId: string
  ): Promise<ApiResponse<CourseCategory[]>> {
    return apiManager.get<CourseCategory[]>(`/courses/${courseId}/categories`);
  }
}

export const courseService = CourseService.getInstance();
