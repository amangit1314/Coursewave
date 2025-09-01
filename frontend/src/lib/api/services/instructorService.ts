import { apiManager, ApiResponse, PaginatedResponse } from '../api-manager';
import { Instructor, Course, Review } from '@/types';

export interface InstructorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'popular' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface InstructorAnalytics {
  totalEarnings: number;
  currency: string;
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  enrollmentTrend: { date: string; count: number }[];
  topCourses: Course[];
}

export interface InstructorUpdateData {
  bio?: string;
  expertise?: string[];
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
}

class InstructorService {
  private static instance: InstructorService;

  private constructor() {}

  public static getInstance(): InstructorService {
    if (!InstructorService.instance) {
      InstructorService.instance = new InstructorService();
    }
    return InstructorService.instance;
  }

  // Instructor CRUD Operations
  async getInstructors(params?: InstructorQueryParams): Promise<PaginatedResponse<Instructor>> {
    return apiManager.get<Instructor[]>('/instructors', { params });
  }

  async getInstructorById(instructorId: string): Promise<ApiResponse<Instructor>> {
    return apiManager.get<Instructor>(`/instructors/${instructorId}`);
  }

  async getInstructorByUserId(userId: string): Promise<ApiResponse<Instructor>> {
    return apiManager.get<Instructor>(`/instructors/user/${userId}`);
  }

  async updateInstructor(
    instructorId: string,
    data: InstructorUpdateData
  ): Promise<ApiResponse<Instructor>> {
    return apiManager.put<Instructor>(`/instructors/${instructorId}`, data);
  }

  // Instructor Courses
  async getInstructorCourses(
    instructorId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Course>> {
    return apiManager.get<Course[]>(`/instructors/${instructorId}/courses`, { params });
  }

  // Analytics
  async getInstructorAnalytics(instructorId: string): Promise<ApiResponse<InstructorAnalytics>> {
    return apiManager.get<InstructorAnalytics>(`/instructors/${instructorId}/analytics`);
  }

  async getInstructorEarnings(instructorId: string): Promise<ApiResponse<{ totalEarnings: number; currency: string }>> {
    return apiManager.get<{ totalEarnings: number; currency: string }>(
      `/instructors/${instructorId}/earnings`
    );
  }

  // Reviews
  async getInstructorReviews(
    instructorId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Review>> {
    return apiManager.get<Review[]>(`/instructors/${instructorId}/reviews`, { params });
  }

  async getInstructorAverageRating(instructorId: string): Promise<ApiResponse<{ averageRating: number }>> {
    return apiManager.get<{ averageRating: number }>(
      `/instructors/${instructorId}/rating`
    );
  }
}

export const instructorService = InstructorService.getInstance();