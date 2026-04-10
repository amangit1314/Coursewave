// import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
// import { Course } from "@/types/course";
// import { Instructor } from "@/types/instructor";
// import {
//   InstructorAnalytics,
//   InstructorQueryParams,
//   InstructorUpdateData,
// } from "@/types/instructor.service.types";
// import { Review } from "@/types/review";

// class InstructorService {
//   private static instance: InstructorService;

//   private constructor() {}

//   public static getInstance(): InstructorService {
//     if (!InstructorService.instance) {
//       InstructorService.instance = new InstructorService();
//     }
//     return InstructorService.instance;
//   }

//   // Instructor CRUD Operations
//   async getInstructors(
//     params?: InstructorQueryParams
//   ): Promise<PaginatedResponse<Instructor>> {
//     return apiManager.get<Instructor[]>("/instructors", { params });
//   }

//   async getInstructorById(
//     instructorId: string
//   ): Promise<ApiResponse<Instructor>> {
//     return apiManager.get<Instructor>(`/instructors/${instructorId}`);
//   }

//   async getInstructorProfile(): Promise<Instructor> {
//     const response = await apiManager.get<Instructor>(`/instructors/me`);
//     if (!response.data) {
//       throw new Error("OOPS, Instructor data is missing in API response");
//     }
//     return response.data; // ✅ return only the instructor object
//   }

//   async updateInstructorProfile(
//     data: InstructorUpdateData
//   ): Promise<ApiResponse<Instructor>> {
//     return apiManager.put<Instructor>(`/instructors/me`, data);
//   }

//   // Instructor Courses
//   async getInstructorCourses(
//     instructorId: string,
//     params?: { page?: number; limit?: number }
//   ): Promise<PaginatedResponse<Course>> {
//     return apiManager.get<Course[]>(`/instructors/${instructorId}/courses`, {
//       params,
//     });
//   }

//   async getMyCreatedCourses(
//     instructorId: string,
//     params?: { page?: number; limit?: number }
//   ): Promise<PaginatedResponse<Course>> {
//     return apiManager.get<Course[]>(`/instructors/${instructorId}/courses`, {
//       params,
//     });
//   }

//   // Analytics
//   async getInstructorAnalytics(
//     instructorId: string
//   ): Promise<ApiResponse<InstructorAnalytics>> {
//     return apiManager.get<InstructorAnalytics>(
//       `/instructors/${instructorId}/analytics`
//     );
//   }

//   async getInstructorEarnings(
//     instructorId: string
//   ): Promise<ApiResponse<{ totalEarnings: number; currency: string }>> {
//     return apiManager.get<{ totalEarnings: number; currency: string }>(
//       `/instructors/${instructorId}/earnings`
//     );
//   }

//   // Reviews
//   async getInstructorReviews(
//     instructorId: string,
//     params?: { page?: number; limit?: number }
//   ): Promise<PaginatedResponse<Review>> {
//     return apiManager.get<Review[]>(`/instructors/${instructorId}/reviews`, {
//       params,
//     });
//   }

//   async getInstructorAverageRating(
//     instructorId: string
//   ): Promise<ApiResponse<{ averageRating: number }>> {
//     return apiManager.get<{ averageRating: number }>(
//       `/instructors/${instructorId}/rating`
//     );
//   }
// }

// export const instructorService = InstructorService.getInstance();

/**
 * --------------------------------------------------------------------------------------------------------
 */

// import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
// import { Course } from "@/types/course";
// import { Instructor } from "@/types/instructor";
// import {
//   InstructorAnalytics,
//   InstructorQueryParams,
//   InstructorUpdateData,
// } from "@/types/instructor.service.types";
// import { Review } from "@/types/review";

// class InstructorService {
//   private static instance: InstructorService;

//   private constructor() {}

//   public static getInstance(): InstructorService {
//     if (!InstructorService.instance) {
//       InstructorService.instance = new InstructorService();
//     }
//     return InstructorService.instance;
//   }

//   // ------------------------
//   // PUBLIC INSTRUCTOR ROUTES
//   // ------------------------

//   async getInstructors(
//     params?: InstructorQueryParams
//   ): Promise<PaginatedResponse<Instructor>> {
//     return apiManager.get<Instructor[]>("/instructors", { params });
//   }

//   async getInstructorById(
//     instructorId: string
//   ): Promise<ApiResponse<Instructor>> {
//     return apiManager.get<Instructor>(`/instructors/${instructorId}`);
//   }

//   async getInstructorCourses(
//     instructorId: string,
//     params?: { page?: number; limit?: number }
//   ): Promise<PaginatedResponse<Course>> {
//     return apiManager.get<Course[]>(
//       `/instructors/${instructorId}/courses`,
//       { params }
//     );
//   }

//   async getInstructorAnalytics(
//     instructorId: string
//   ): Promise<ApiResponse<InstructorAnalytics>> {
//     return apiManager.get<InstructorAnalytics>(
//       `/instructors/${instructorId}/analytics`
//     );
//   }

//   // ------------------------
//   // LOGGED-IN INSTRUCTOR ROUTES
//   // ------------------------

//   async getInstructorProfile(): Promise<Instructor> {
//     const response = await apiManager.get<Instructor>(`/instructors/me`);
//     if (!response.data) {
//       throw new Error("OOPS, Instructor data is missing in API response");
//     }
//     return response.data;
//   }

//   async updateInstructorProfile(
//     data: InstructorUpdateData
//   ): Promise<ApiResponse<Instructor>> {
//     return apiManager.put<Instructor>(`/instructors/me`, data);
//   }

//   async getMyCreatedCourses(
//     params?: { page?: number; limit?: number }
//   ): Promise<PaginatedResponse<Course>> {
//     return apiManager.get<Course[]>(`/instructors/me/courses`, { params });
//   }

//   async getMyAnalytics(): Promise<ApiResponse<InstructorAnalytics>> {
//     return apiManager.get<InstructorAnalytics>(`/instructors/me/analytics`);
//   }

//   async getMyStudentsCount(): Promise<ApiResponse<{ totalStudents: number }>> {
//     return apiManager.get<{ totalStudents: number }>(`/instructors/me/students`);
//   }
// }

// export const instructorService = InstructorService.getInstance();

/**
 * ---------------------------------------------------------------------------------------------------------
 */

// src/lib/api/services/instructorService.ts

import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";
import { Course } from "@/types/course";
import { Instructor } from "@/types/instructor";
import {
  InstructorAnalytics,
  InstructorQueryParams,
  InstructorUpdateData,
  InstructorEarningsData,
  InstructorStudentsData,
  CourseEnrollmentsData,
} from "@/types/instructor.service.types";
import { Review } from "@/types/review";

class InstructorService {
  private static instance: InstructorService;

  private constructor() { }

  public static getInstance(): InstructorService {
    if (!InstructorService.instance) {
      InstructorService.instance = new InstructorService();
    }
    return InstructorService.instance;
  }

  // ------------------------
  // 🔹 PUBLIC INSTRUCTOR ROUTES
  // ------------------------

  async getIsInstructor(): Promise<ApiResponse<boolean>> {
    return apiManager.get<boolean>("/instructor/me/status");
  }

  async getInstructors(
    params?: InstructorQueryParams
  ): Promise<PaginatedResponse<Instructor>> {
    return apiManager.get<Instructor[]>("/instructors", { params });
  }

  async getInstructorById(
    instructorId: string
  ): Promise<ApiResponse<Instructor>> {
    return apiManager.get<Instructor>(`/instructor/${instructorId}`);
  }

  async getInstructorCourses(
    instructorId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Course>> {
    return apiManager.get<Course[]>(`/instructor/${instructorId}/courses`, {
      params,
    });
  }

  async getInstructorAnalytics(
    instructorId: string
  ): Promise<ApiResponse<InstructorAnalytics>> {
    return apiManager.get<InstructorAnalytics>(
      `/instructor/${instructorId}/analytics`
    );
  }

  async getInstructorEarnings(
    instructorId: string
  ): Promise<ApiResponse<{ totalEarnings: number; currency: string }>> {
    return apiManager.get<{ totalEarnings: number; currency: string }>(
      `/instructor/${instructorId}/earnings`
    );
  }

  async getInstructorReviews(
    instructorId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedResponse<Review>> {
    return apiManager.get<Review[]>(`/instructor/${instructorId}/reviews`, {
      params,
    });
  }

  async getInstructorAverageRating(
    instructorId: string
  ): Promise<ApiResponse<{ averageRating: number }>> {
    return apiManager.get<{ averageRating: number }>(
      `/instructor/${instructorId}/rating`
    );
  }

  // ------------------------
  // 🔹 LOGGED-IN INSTRUCTOR ROUTES
  // ------------------------

  async getInstructorProfile(): Promise<Instructor> {
    const response = await apiManager.get<Instructor>(`/instructor/me`);
    if (!response.data) {
      throw new Error("OOPS, Instructor data is missing in API response");
    }
    return response.data;
  }

  async updateInstructorProfile(
    data: InstructorUpdateData
  ): Promise<ApiResponse<Instructor>> {
    return apiManager.put<Instructor>(`/instructor/me`, data);
  }

  async getMyCreatedCourses(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Course>> {
    return apiManager.get<Course[]>(`/instructor/me/courses`, { params });
  }

  async getMyAnalytics(): Promise<ApiResponse<InstructorAnalytics>> {
    return apiManager.get<InstructorAnalytics>(`/instructor/me/analytics`);
  }

  async getMyEarnings(): Promise<ApiResponse<InstructorEarningsData>> {
    return apiManager.get<InstructorEarningsData>(`/instructor/me/earnings`);
  }

  async getMyStudentsList(): Promise<ApiResponse<InstructorStudentsData>> {
    return apiManager.get<InstructorStudentsData>(
      `/instructor/me/students/list`
    );
  }

  async getMyCourseEnrollments(
    courseId: string
  ): Promise<ApiResponse<CourseEnrollmentsData>> {
    return apiManager.get<CourseEnrollmentsData>(
      `/instructor/me/courses/${courseId}/enrollments`
    );
  }

  async getMyReviews(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Review>> {
    return apiManager.get<Review[]>(`/instructor/me/reviews`, { params });
  }

  async getMyAverageRating(): Promise<ApiResponse<{ averageRating: number }>> {
    return apiManager.get<{ averageRating: number }>(`/instructor/me/rating`);
  }

  async getMyStudentsCount(): Promise<ApiResponse<{ totalStudents: number }>> {
    return apiManager.get<{ totalStudents: number }>(
      `/instructor/me/students`
    );
  }
}

export const instructorService = InstructorService.getInstance();
