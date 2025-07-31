import { apiManager, ApiResponse, PaginatedResponse } from '../api-manager';

// Types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  previewUrl?: string;
  price?: number;
  currency: string;
  isFree: boolean;
  discountPercentage?: number;
  isPublished: boolean;
  isLive: boolean;
  publishedAt?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  language: string;
  durationMinutes?: number;
  instructorId?: string;
  instructor?: {
    id: string;
    name: string;
    bio?: string;
    profileImageUrl?: string;
  };
  categories: CourseCategory[];
  averageRating?: number;
  totalStudents: number;
  totalLessons: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  lessons: Lesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  isFree: boolean;
  contentType: 'VIDEO' | 'QUIZ' | 'TEXT' | 'ASSIGNMENT';
  content?: any;
  video?: VideoContent;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VideoContent {
  id: string;
  url: string;
  provider: 'MUX' | 'CLOUDINARY' | 'YOUTUBE' | 'VIMEO';
  duration?: number;
  thumbnailUrl?: string;
}

export interface CourseProgress {
  id: string;
  enrollmentId: string;
  completedLessons: number;
  totalLessons: number;
  lastAccessed?: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
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
  price?: 'free' | 'paid';
  sortBy?: 'newest' | 'popular' | 'rating' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  price?: number;
  isFree: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';
  language?: string;
  categoryIds: string[];
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {
  isPublished?: boolean;
}

// Course Service Class
export class CourseService {
  private static instance: CourseService;

  private constructor() {}

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  // Get all courses (public)
  async getCourses(params?: CourseQueryParams): Promise<PaginatedResponse<Course>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiManager.get<Course[]>(url);
  }

  // Get course by ID
  async getCourseById(courseId: string): Promise<ApiResponse<Course>> {
    return await apiManager.get<Course>(`/courses/${courseId}`);
  }

  // Get course by slug
  async getCourseBySlug(slug: string): Promise<ApiResponse<Course>> {
    return await apiManager.get<Course>(`/courses/slug/${slug}`);
  }

  // Get course sections
  async getCourseSections(courseId: string): Promise<ApiResponse<CourseSection[]>> {
    return await apiManager.get<CourseSection[]>(`/courses/${courseId}/sections`);
  }

  // Get course lessons
  async getCourseLessons(courseId: string): Promise<ApiResponse<Lesson[]>> {
    return await apiManager.get<Lesson[]>(`/courses/${courseId}/lessons`);
  }

  // Get lesson by ID
  async getLessonById(courseId: string, lessonId: string): Promise<ApiResponse<Lesson>> {
    return await apiManager.get<Lesson>(`/courses/${courseId}/lessons/${lessonId}`);
  }

  // Get user enrollments
  async getUserEnrollments(): Promise<ApiResponse<Enrollment[]>> {
    return await apiManager.get<Enrollment[]>('/profile/enrolledCourses');
  }

  // Get enrollment by course ID
  async getEnrollmentByCourseId(courseId: string): Promise<ApiResponse<Enrollment>> {
    return await apiManager.get<Enrollment>(`/profile/enrolledCourses/${courseId}`);
  }

  // Get course progress
  async getCourseProgress(courseId: string): Promise<ApiResponse<CourseProgress>> {
    return await apiManager.get<CourseProgress>(`/profile/enrolledCourses/${courseId}/progress`);
  }

  // Update lesson progress
  async updateLessonProgress(
    courseId: string,
    lessonId: string,
    isCompleted: boolean
  ): Promise<ApiResponse<void>> {
    return await apiManager.post<void>(`/profile/enrolledCourses/${courseId}/lessons/${lessonId}/progress`, {
      isCompleted
    });
  }

  // Enroll in course
  async enrollInCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
    return await apiManager.post<Enrollment>(`/courses/${courseId}/enroll`);
  }

  // Checkout course (for payment)
  async checkoutCourse(courseId: string, userId: string): Promise<ApiResponse<{ url: string }>> {
    console.log("=== courseService.checkoutCourse called ===");
    console.log("Course ID:", courseId);
    console.log("User ID:", userId);
    console.log("Making POST request to Next.js API route:", `/api/courses/${courseId}/checkout`);
    console.log("Request body:", { userId });
    
    try {
      // Use Next.js API route instead of backend server
      const response = await fetch(`/api/courses/${courseId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
      });

      console.log("Checkout API response status:", response.status);
      console.log("Checkout API response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Checkout API error response:", errorText);
        throw new Error(`Checkout failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Checkout API success response:", data);
      
      if (!data.success || !data.url) {
        console.error("Checkout response missing success or URL:", data);
        throw new Error('Checkout failed - invalid response format');
      }

      return {
        success: true,
        data: { url: data.url },
        message: 'Checkout session created successfully'
      };
    } catch (error) {
      console.error("Checkout API error:", error);
      throw error;
    }
  }

  // Check if already purchased
  async checkAlreadyPurchased(courseId: string): Promise<ApiResponse<{ alreadyPurchased: boolean }>> {
    return await apiManager.get<{ alreadyPurchased: boolean }>(`/courses/${courseId}/alreadyPurchased`);
  }

  // Get course reviews
  async getCourseReviews(courseId: string): Promise<ApiResponse<any[]>> {
    return await apiManager.get<any[]>(`/courses/${courseId}/reviews`);
  }

  // Add course review
  async addCourseReview(courseId: string, review: { rating: number; content?: string }): Promise<ApiResponse<any>> {
    return await apiManager.post<any>(`/courses/${courseId}/reviews`, review);
  }

  // Get course attachments
  async getCourseAttachments(courseId: string): Promise<ApiResponse<any[]>> {
    return await apiManager.get<any[]>(`/courses/${courseId}/attachments`);
  }

  // Get course categories
  async getCourseCategories(): Promise<ApiResponse<CourseCategory[]>> {
    return await apiManager.get<CourseCategory[]>('/categories');
  }

  // Instructor methods (if user is instructor)
  async createCourse(courseData: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return await apiManager.post<Course>('/instructor/courses', courseData);
  }

  async updateCourse(courseId: string, courseData: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    return await apiManager.put<Course>(`/instructor/courses/${courseId}`, courseData);
  }

  async deleteCourse(courseId: string): Promise<ApiResponse<void>> {
    return await apiManager.delete<void>(`/instructor/courses/${courseId}`);
  }

  async publishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return await apiManager.patch<Course>(`/instructor/courses/${courseId}/publish`);
  }

  async unpublishCourse(courseId: string): Promise<ApiResponse<Course>> {
    return await apiManager.patch<Course>(`/instructor/courses/${courseId}/unpublish`);
  }

  // Get instructor courses
  async getInstructorCourses(): Promise<ApiResponse<Course[]>> {
    return await apiManager.get<Course[]>('/instructor/courses');
  }

  // Get instructor course analytics
  async getInstructorCourseAnalytics(courseId: string): Promise<ApiResponse<any>> {
    return await apiManager.get<any>(`/instructor/courses/${courseId}/analytics`);
  }

  // Upload course image
  async uploadCourseImage(courseId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ imageUrl: string }>> {
    return await apiManager.upload<{ imageUrl: string }>(`/instructor/courses/${courseId}/image`, file, onProgress);
  }

  // Upload course video
  async uploadCourseVideo(courseId: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ videoUrl: string }>> {
    return await apiManager.upload<{ videoUrl: string }>(`/instructor/courses/${courseId}/video`, file, onProgress);
  }
}

// Export singleton instance
export const courseService = CourseService.getInstance(); 