// =============================================================== INSTRUCTOR SERVICE ========================================

import { Course } from "./course";

export interface InstructorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "popular" | "rating" | "newest";
  sortOrder?: "asc" | "desc";
}

export interface InstructorAnalytics {
  totalEarnings: number;
  currency: string;
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  enrollmentTrend: { date: string; count: number }[];
  createdCourses: Course[];
  topCourses: Course[];
}

export interface InstructorUpdateData {
  bio?: string;
  expertise?: string[];
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
}
