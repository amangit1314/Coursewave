import { ApiManager } from "../api-manager";

export interface CreateCourseRequest {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  instructorId: string;
  categoryId: string;
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  categoryId?: string;
}

export interface CourseReviewRequest {
  rating: number;
  comment: string;
}

export interface CourseProgressRequest {
  chapterId: string;
  progress: number;
}

export class CourseService {
  private static instance: CourseService;
  private apiManager: ApiManager;

  private constructor() {
    this.apiManager = ApiManager.getInstance();
  }

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  // Course CRUD operations
  async getAllCourses(params?: any): Promise<any> {
    const response = await this.apiManager.get("/courses", { params });
    return response.data;
  }

  async getCourseById(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}`);
    return response.data;
  }

  async createCourse(data: CreateCourseRequest): Promise<any> {
    const response = await this.apiManager.post("/courses", data);
    return response.data;
  }

  async updateCourse(courseId: string, data: UpdateCourseRequest): Promise<any> {
    const response = await this.apiManager.put(`/courses/${courseId}`, data);
    return response.data;
  }

  async deleteCourse(courseId: string): Promise<any> {
    const response = await this.apiManager.delete(`/courses/${courseId}`);
    return response.data;
  }

  // Course publishing
  async publishCourse(courseId: string): Promise<any> {
    const response = await this.apiManager.patch(`/courses/${courseId}/publish`);
    return response.data;
  }

  async unpublishCourse(courseId: string): Promise<any> {
    const response = await this.apiManager.patch(`/courses/${courseId}/unpublish`);
    return response.data;
  }

  // Course enrollment and checkout
  async checkoutCourse(courseId: string, userId: string): Promise<any> {
    const response = await this.apiManager.post(`/courses/${courseId}/checkout`, { userId });
    return response.data;
  }

  async enrollInCourse(courseId: string, userId: string): Promise<any> {
    const response = await this.apiManager.post(`/courses/${courseId}/enroll`, { userId });
    return response.data;
  }

  // Course content
  async getCourseContent(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/content`);
    return response.data;
  }

  async getCourseChapters(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/chapters`);
    return response.data;
  }

  async getCourseSections(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/sections`);
    return response.data;
  }

  // Course reviews
  async getCourseReviews(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/reviews`);
    return response.data;
  }

  async addCourseReview(courseId: string, data: CourseReviewRequest): Promise<any> {
    const response = await this.apiManager.post(`/courses/${courseId}/reviews`, data);
    return response.data;
  }

  async updateCourseReview(courseId: string, reviewId: string, data: CourseReviewRequest): Promise<any> {
    const response = await this.apiManager.put(`/courses/${courseId}/reviews/${reviewId}`, data);
    return response.data;
  }

  async deleteCourseReview(courseId: string, reviewId: string): Promise<any> {
    const response = await this.apiManager.delete(`/courses/${courseId}/reviews/${reviewId}`);
    return response.data;
  }

  // Course progress
  async getCourseProgress(courseId: string, userId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/progress/${userId}`);
    return response.data;
  }

  async updateCourseProgress(courseId: string, data: CourseProgressRequest): Promise<any> {
    const response = await this.apiManager.put(`/courses/${courseId}/progress`, data);
    return response.data;
  }

  // Course attachments
  async getCourseAttachments(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/attachments`);
    return response.data;
  }

  async addCourseAttachment(courseId: string, attachment: any): Promise<any> {
    const response = await this.apiManager.post(`/courses/${courseId}/attachments`, attachment);
    return response.data;
  }

  async deleteCourseAttachment(courseId: string, attachmentId: string): Promise<any> {
    const response = await this.apiManager.delete(`/courses/${courseId}/attachments/${attachmentId}`);
    return response.data;
  }

  // Course analytics
  async getCourseAnalytics(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/analytics`);
    return response.data;
  }

  async getCourseStats(courseId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/stats`);
    return response.data;
  }

  // Course search and filtering
  async searchCourses(query: string, filters?: any): Promise<any> {
    const response = await this.apiManager.get("/courses/search", { 
      params: { q: query, ...filters } 
    });
    return response.data;
  }

  async getCoursesByCategory(categoryId: string): Promise<any> {
    const response = await this.apiManager.get(`/categories/${categoryId}/courses`);
    return response.data;
  }

  async getCoursesByInstructor(instructorId: string): Promise<any> {
    const response = await this.apiManager.get(`/instructor/${instructorId}/courses`);
    return response.data;
  }

  // Course recommendations
  async getRecommendedCourses(userId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/recommendations/${userId}`);
    return response.data;
  }

  async getPopularCourses(): Promise<any> {
    const response = await this.apiManager.get("/courses/popular");
    return response.data;
  }

  async getFeaturedCourses(): Promise<any> {
    const response = await this.apiManager.get("/courses/featured");
    return response.data;
  }

  // Course validation
  async checkCourseAccess(courseId: string, userId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/access/${userId}`);
    return response.data;
  }

  async isCoursePurchased(courseId: string, userId: string): Promise<any> {
    const response = await this.apiManager.get(`/courses/${courseId}/purchased/${userId}`);
    return response.data;
  }
}

// Export singleton instance
export const courseService = CourseService.getInstance(); 