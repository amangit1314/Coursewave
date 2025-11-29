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
  // CourseSection,
  CreateCourseRequest,
  Enrollment,
  // Instructor,
  UpdateCourseRequest,
} from "@/types/courses.service.types";
import { Chapter as CourseChapter } from "@/types/course-details-api-response";
import { CourseSection } from "@/types/course-details-api-response";
import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
import { Review } from "@/types/review";
import { useUserStore } from "@/zustand/userStore";
import { Attachment } from "@/types/attachment";
import { Instructor } from "@/types/instructor";

class CourseService {
  private static instance: CourseService;
  private api = apiManager;

  private constructor() { }

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
    const response = await this.api.put<Course>(`/courses/${id}`, data);
    return response;
    // newCourseTitle: values.title,
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
  async getChapters(
    courseId: string,
    sectionId: string
  ): Promise<ApiResponse<Chapter[]>> {
    return this.api.get<Chapter[]>(
      `/courses/${courseId}/sections/${sectionId}/chapters`
    );
  }

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
    data: Partial<CourseChapter>
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
  async getCourseInstructor(
    courseId: string
  ): Promise<ApiResponse<Instructor>> {
    const response = await this.api.get<Instructor>(
      `/courses/${courseId}/instructor`
    );
    console.log("RESPONSE in course instructor: ", JSON.stringify(response));
    return response;
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
    return this.api.post(`/courses/${courseId}/checkout`, { courseId, userId });
  }

  // async checkAlreadyPurchased(
  //   courseId: string
  // ): Promise<ApiResponse<{ purchased: boolean }>> {
  //   return this.api.get<{ purchased: boolean }>(
  //     `/courses/${courseId}/enrollment-status`
  //   );
  // }

  // Update return type and destructure correct field
  async checkAlreadyPurchased(
    courseId: string
  ): Promise<ApiResponse<{ isEnrolled: boolean; enrollment?: any }>> {
    // The API returns { data: { isEnrolled, enrollment } }
    return this.api.get<{ isEnrolled: boolean; enrollment?: any }>(
      `/courses/${courseId}/enrollment-status`
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
    return this.api.get<Attachment[]>(
      `/courses/${courseId}/course-attachments`
    );
  }

  async addAttachment(
    courseId: string,
    attachmentData: { name: string; url: string }
  ) {
    const response = await apiManager.post(
      `/courses/${courseId}/course-attachments`,
      attachmentData
    );
    return response.data;
  }

  async updateAttachment(
    courseId: string,
    attachmentId: string,
    attachmentData: { name: string; url: string }
  ) {
    const response = await apiManager.put(
      `/courses/${courseId}/course-attachments/${attachmentId}`,
      attachmentData
    );
    return response.data;
  }

  async deleteAttachment(courseId: string, attachmentId: string) {
    const response = await apiManager.delete(
      `/courses/${courseId}/course-attachments/${attachmentId}`
    );
    return response.data;
  }
}

export const courseService = CourseService.getInstance();
