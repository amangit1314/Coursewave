// // Refined CourseService with strict types and clean structure
// import { Review } from "@/types/review";
// import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
// import { Course } from "@/types";
// import {
//   Chapter,
//   CourseCategory,
//   CourseEarnings,
//   CourseEnrollmentStats,
//   CourseProgress,
//   CourseQueryParams,
//   CourseReview,
//   CourseSection,
//   CreateCourseRequest,
//   Enrollment,
//   Instructor,
//   UpdateCourseRequest,
// } from "@/types/courses.service.types";

// class CourseService {
//   private static instance: CourseService;

//   private constructor() {}

//   public static getInstance(): CourseService {
//     if (!CourseService.instance) {
//       CourseService.instance = new CourseService();
//     }
//     return CourseService.instance;
//   }

//   async saveCourse(courseId: string) {
//     return apiManager.post(`/users/me/saved-courses`, { courseId });
//   }

//   async unsaveCourse(courseId: string) {
//     return apiManager.delete(`/users/me/saved-courses`, {
//       data: { courseId },
//     });
//   }

//   // get wishlisted courses
//   // TODO: check this
//   async getWishlistedCourses(): Promise<PaginatedResponse<Course>> {
//     return apiManager.get<Course[]>("/users/me/wishlist");
//   }

//   async addToWishlist(
//     courseId: string
//   ) {
//     return apiManager.post(`/users/me/wishlist`, { courseId });
//   }

//   async removeFromWishlist(
//     courseId: string
//   ) {
//     return apiManager.delete(`/users/me/wishlist/${courseId}`);
//   }

//   // Course CRUD Operations
//   async getCourses(params?: CourseQueryParams) {
//     const response = await apiManager.get<Course[]>("/courses", { params });
//     console.log("Get courses response:", response);
//     return response.data;
//   }

//   // get enrolled courses for the user without userId
//   async getEnrolledCourses(): Promise<PaginatedResponse<Enrollment>> {
//     return apiManager.get<Enrollment[]>("/users/me/enrollments");
//   }

//   async getCourseById(courseId: string) {
//     const response = await apiManager.get<Course>(`/courses/${courseId}`);
//     return response;
//   }

//   async createCourse(
//     courseData: CreateCourseRequest
//   ): Promise<ApiResponse<Course>> {
//     return apiManager.post<Course>("/courses", courseData);
//   }

//   async updateCourse(
//     courseId: string,
//     courseData: UpdateCourseRequest
//   ): Promise<ApiResponse<Course>> {
//     return apiManager.put<Course>(`/courses/${courseId}`, courseData);
//   }

//   async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
//     return apiManager.delete<void>(`/courses/${courseId}`);
//   }

//   // Course Status Management
//   async publishCourse(courseId: string): Promise<ApiResponse<Course>> {
//     return apiManager.patch<Course>(`/courses/${courseId}/publish`);
//   }

//   async unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
//     return apiManager.patch<Course>(`/courses/${courseId}/unpublish`);
//   }

// // Course Content
// async getCourseSections(
//   courseId: string
// ): Promise<ApiResponse<CourseSection[]>> {
//   return apiManager.get<CourseSection[]>(`/courses/${courseId}/sections`);
// }

//   async getCourseChapters(courseId: string): Promise<ApiResponse<Chapter[]>> {
//     return apiManager.get<Chapter[]>(`/courses/${courseId}/chapters`);
//   }

//   async getCourseSectionChapters(courseId: string, sectionId: string) {
//     return apiManager.get<Chapter[]>(
//       `/courses/${courseId}/sections/${sectionId}/chapters`
//     );
//   }

// async getCourseAttachments(courseId: string) {
//   return apiManager.get<{ attachments: any[] }>(
//     `/courses/${courseId}/attachments`
//   );
// }

//   // Media Uploads
//   async uploadCourseImage(
//     courseId: string,
//     file: File,
//     onProgress?: (progress: number) => void
//   ): Promise<ApiResponse<{ imageUrl: string }>> {
//     return apiManager.upload<{ imageUrl: string }>(
//       `/courses/${courseId}/image`,
//       file,
//       onProgress
//     );
//   }

//   async checkoutCourse(
//     courseId: string,
//     userId: string
//   ): Promise<ApiResponse<{ url: string }>> {
//     console.log("=== courseService.checkoutCourse called ===");
//     console.log("Course ID:", courseId);
//     console.log("User ID:", userId);
//     console.log(
//       "Making POST request to Next.js API route:",
//       `/api/courses/${courseId}/checkout`
//     );
//     console.log("Request body:", { userId });

//     try {
//       // Use Next.js API route instead of backend server
//       const response = await fetch(`/api/courses/${courseId}/checkout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//         },
//         body: JSON.stringify({ userId }),
//       });

//       console.log("Checkout API response status:", response.status);
//       console.log(
//         "Checkout API response headers:",
//         Object.fromEntries(response.headers.entries())
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Checkout API error response:", errorText);
//         throw new Error(
//           `Checkout failed: ${response.status} ${response.statusText} - ${errorText}`
//         );
//       }

//       const data = await response.json();
//       console.log("Checkout API success response:", data);

//       if (!data.success || !data.url) {
//         console.error("Checkout response missing success or URL:", data);
//         throw new Error("Checkout failed - invalid response format");
//       }

//       return {
//         success: true,
//         data: { url: data.url },
//         message: "Checkout session created successfully",
//       };
//     } catch (error) {
//       console.error("Checkout API error:", error);
//       throw error;
//     }
//   }

//   // Check if already purchased
//   async checkAlreadyPurchased(
//     courseId: string
//   ): Promise<ApiResponse<{ alreadyPurchased: boolean }>> {
//     return await apiManager.get<{ alreadyPurchased: boolean }>(
//       `/courses/${courseId}/alreadyPurchased`
//     );
//   }

//   // Enrollment & Progress
//   async enrollInCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
//     return apiManager.post<Enrollment>(`/courses/${courseId}/enroll`);
//   }

// async getCourseProgress(
//   courseId: string
// ): Promise<ApiResponse<CourseProgress>> {
//   return apiManager.get<CourseProgress>(`/courses/${courseId}/progress`);
// }

// async updateChapterProgress(
//   courseId: string,
//   chapterId: string,
//   isCompleted: boolean
// ): Promise<ApiResponse<void>> {
//   return apiManager.patch<void>(
//     `/courses/${courseId}/progress/${chapterId}`,
//     { isCompleted }
//   );
// }

//   // Reviews & Ratings
//   async getCourseReviews(courseId: string): Promise<ApiResponse<Review[]>> {
//     return apiManager.get<Review[]>(`/courses/${courseId}/reviews`);
//   }

// async addCourseReview(
//   courseId: string,
//   review: CourseReview
// ): Promise<ApiResponse<Review>> {
//   return apiManager.post<Review>(`/courses/${courseId}/reviews`, review);
// }

//   // Analytics
//   async getCourseEnrollmentStats(
//     courseId: string
//   ): Promise<ApiResponse<CourseEnrollmentStats>> {
//     return apiManager.get<CourseEnrollmentStats>(
//       `/courses/${courseId}/stats/enrollments`
//     );
//   }

//   async getCourseEarnings(
//     courseId: string
//   ): Promise<ApiResponse<CourseEarnings>> {
//     return apiManager.get<CourseEarnings>(`/courses/${courseId}/earnings`);
//   }

//   async getCourseInstructor(courseId: string) {
//     return apiManager.get<Instructor>(`/courses/${courseId}/instructor`);
//   }

//   // Categories
//   async getCourseCategories(
//     courseId: string
//   ): Promise<ApiResponse<CourseCategory[]>> {
//     return apiManager.get<CourseCategory[]>(`/courses/${courseId}/categories`);
//   }
// }

// export const courseService = CourseService.getInstance();

/**
 * -----------------------------------------------------------------------------------------------
 */

// src/lib/api/services/courseService.ts
import { Course } from "@/types";
import {
  Chapter,
  CourseCategory,
  CourseEarnings,
  CourseEnrollmentStats,
  CourseProgress,
  CourseQueryParams,
  CourseReview,
  CourseSection,
  CreateCourseRequest,
  Enrollment,
  Instructor,
  UpdateCourseRequest,
} from "@/types/courses.service.types";
import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
import { Review } from "@/types/review";
import { useUserStore } from "@/zustand/userStore";
import { Attachment } from "@/types/attachment";

class CourseService {
  private static instance: CourseService;
  private api = apiManager;

  private constructor() {}

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  // ------------------------
  // 🔹 Courses
  // ------------------------
  async getCourses(
    params?: Record<string, any>
  ): Promise<PaginatedResponse<Course>> {
    const query = new URLSearchParams(params as any).toString();
    const response = await this.api.get<PaginatedResponse<Course>>(
      `/courses${query ? `?${query}` : ""}`
    );
    return response.data;
  }

  async getCourseById(id: string): Promise<ApiResponse<Course>> {
    return this.api.get<Course>(`/courses/${id}`);
  }

  async createCourse(data: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return this.api.post<Course>("/courses", data);
  }

  async updateCourse(
    id: string,
    data: UpdateCourseRequest
  ): Promise<ApiResponse<Course>> {
    return this.api.put<Course>(`/courses/${id}`, data);
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/courses/${id}`);
  }

  async publishCourse(id: string): Promise<ApiResponse<Course>> {
    return this.api.patch<Course>(`/courses/${id}/publish`);
  }

  async unpublishCourse(id: string): Promise<ApiResponse<Course>> {
    return this.api.patch<Course>(`/courses/${id}/unpublish`);
  }

  async searchCourses(query: string): Promise<ApiResponse<Course[]>> {
    return this.api.get<Course[]>(`/courses/search?q=${query}`);
  }

  async getFeaturedCourses(): Promise<ApiResponse<Course[]>> {
    return this.api.get<Course[]>("/courses/featured");
  }

  async getCoursesByInstructor(
    instructorId: string
  ): Promise<ApiResponse<Course[]>> {
    return this.api.get<Course[]>(`/instructors/${instructorId}/courses`);
  }

  // ------------------------
  // 🔹 Categories
  // ------------------------
  async getCourseCategories(courseId: string): Promise<ApiResponse<string[]>> {
    return this.api.get<string[]>(`/courses/${courseId}/categories`);
  }

  // ------------------------
  // 🔹 Sections
  // ------------------------

  // Course Content
  async getCourseSections(
    courseId: string
  ): Promise<ApiResponse<CourseSection[]>> {
    return apiManager.get<CourseSection[]>(`/courses/${courseId}/sections`);
  }

  async addSection(
    courseId: string,
    data: Partial<CourseSection>
  ): Promise<ApiResponse<CourseSection>> {
    return this.api.post<CourseSection>(`/courses/${courseId}/sections`, data);
  }

  async updateSection(
    courseId: string,
    sectionId: string,
    data: Partial<CourseSection>
  ): Promise<ApiResponse<CourseSection>> {
    return this.api.put<CourseSection>(
      `/courses/${courseId}/sections/${sectionId}`,
      data
    );
  }

  async deleteSection(
    courseId: string,
    sectionId: string
  ): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/courses/${courseId}/sections/${sectionId}`);
  }

  // ------------------------
  // 🔹 Chapters
  // ------------------------
  async addChapter(
    courseId: string,
    sectionId: string,
    data: Partial<Chapter>
  ): Promise<ApiResponse<Chapter>> {
    return this.api.post<Chapter>(
      `/courses/${courseId}/sections/${sectionId}/chapters`,
      data
    );
  }

  async updateChapter(
    courseId: string,
    sectionId: string,
    chapterId: string,
    data: Partial<Chapter>
  ): Promise<ApiResponse<Chapter>> {
    return this.api.put<Chapter>(
      `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`,
      data
    );
  }

  async deleteChapter(
    courseId: string,
    sectionId: string,
    chapterId: string
  ): Promise<ApiResponse<void>> {
    return this.api.delete<void>(
      `/courses/${courseId}/sections/${sectionId}/chapters/${chapterId}`
    );
  }

  // ------------------------
  // 🔹 Progress
  // ------------------------
  async getProgress(courseId: string): Promise<ApiResponse<CourseProgress>> {
    return this.api.get<CourseProgress>(`/courses/${courseId}/progress`);
  }

  async updateProgress(
    courseId: string,
    progress: Partial<CourseProgress>
  ): Promise<ApiResponse<CourseProgress>> {
    return this.api.put<CourseProgress>(
      `/courses/${courseId}/progress`,
      progress
    );
  }

  async updateChapterProgress(
    courseId: string,
    chapterId: string,
    isCompleted: boolean
  ): Promise<ApiResponse<CourseProgress>> {
    return this.api.patch<CourseProgress>(
      `/courses/${courseId}/chapters/${chapterId}/progress`,
      { isCompleted }
    );
  }

  // ------------------------
  // 🔹 Instructor
  // ------------------------
  async getCourseInstructor(courseId: string): Promise<ApiResponse<Review>> {
    return this.api.get(`/courses/${courseId}/instructor`);
  }

  // ------------------------
  // 🔹 Reviews
  // ------------------------
  async getCourseReviews(courseId: string): Promise<ApiResponse<Review>> {
    return this.api.get(`/courses/${courseId}/reviews`);
  }

  async addCourseReview(
    courseId: string,
    review: CourseReview
  ): Promise<ApiResponse<Review>> {
    return apiManager.post<Review>(`/courses/${courseId}/reviews`, review);
  }

  // ------------------------
  // 🔹 Saved Courses
  // ------------------------
  async saveCourse(courseId: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/courses/${courseId}/save`);
  }

  async unsaveCourse(courseId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/courses/${courseId}/save`);
  }

  async getSavedCourses(): Promise<ApiResponse<Course[]>> {
    return this.api.get<Course[]>("/courses/saved");
  }

  // ------------------------
  // 🔹 Wishlist
  // ------------------------
  async getWishlistedCourses(): Promise<ApiResponse<Course[]>> {
    return this.api.get<Course[]>("/courses/wishlist");
  }

  async addToWishlist(courseId: string): Promise<ApiResponse<void>> {
    return this.api.post<void>(`/courses/${courseId}/wishlist`);
  }

  async removeFromWishlist(courseId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/courses/${courseId}/wishlist`);
  }

  // ------------------------
  // 🔹 Media Uploads
  // ------------------------
  async uploadCourseImage(
    courseId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.api.post<{ url: string }>(
      `/courses/${courseId}/image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e: import("axios").AxiosProgressEvent) => {
          if (onProgress && e.total) {
            onProgress(Math.round((e.loaded * 100) / e.total));
          }
        },
      }
    );
  }

  // ------------------------
  // 🔹 Checkout
  // ------------------------
  async checkoutCourse(
    courseId: string,
    userId: string
  ): Promise<ApiResponse<any>> {
    return this.api.post("/checkout", { courseId, userId });
  }

  async checkAlreadyPurchased(
    courseId: string
  ): Promise<ApiResponse<{ purchased: boolean }>> {
    return this.api.get<{ purchased: boolean }>(
      `/courses/${courseId}/purchased`
    );
  }

  // ------------------------
  // 🔹 Enroll
  // ------------------------
  async enrollInCourse(courseId: string): Promise<ApiResponse<any>> {
    const { user } = useUserStore();
    return this.api.post("/enroll", { courseId, userId: user?.id ?? "" });
  }

  // ------------------------
  // 🔹 Attachments
  // ------------------------
  async getCourseAttachments(
    courseId: string
  ): Promise<ApiResponse<Attachment[]>> {
    return this.api.get<Attachment[]>(`/courses/${courseId}/attachments`);
  }
}

export const courseService = CourseService.getInstance();
