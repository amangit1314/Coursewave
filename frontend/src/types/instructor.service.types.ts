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
  topCourses: (Course & { studentCount: number })[];
}

export interface InstructorUpdateData {
  bio?: string;
  expertise?: string[];
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
}

// -------------------------------------------------------------------------
// Earnings
// -------------------------------------------------------------------------

export interface EarningTransaction {
  id: string;
  instructorId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: string;
  paymentId: string | null;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    imageUrl: string | null;
  };
}

export interface EarningByCourse {
  courseId: string;
  courseTitle: string;
  total: number;
  count: number;
}

export interface InstructorEarningsData {
  totalEarnings: number;
  currency: string;
  transactions: EarningTransaction[];
  earningsByCourse: EarningByCourse[];
}

// -------------------------------------------------------------------------
// Students
// -------------------------------------------------------------------------

export interface EnrolledCourseEntry {
  courseId: string;
  courseTitle: string;
  courseImageUrl: string | null;
  status: string;
  progress: number;
  enrolledAt: string;
}

export interface InstructorStudent {
  id: string;
  name: string | null;
  email: string;
  profileImageUrl: string | null;
  enrolledCourses: EnrolledCourseEntry[];
  totalCourses: number;
  averageProgress: number;
}

export interface InstructorStudentsData {
  students: InstructorStudent[];
  totalStudents: number;
}

// -------------------------------------------------------------------------
// Course Enrollments
// -------------------------------------------------------------------------

export interface CourseEnrollmentEntry {
  id: string;
  status: string;
  progress: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  completedChapters: number;
  totalChapters: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    profileImageUrl: string | null;
  };
}

export interface CourseEnrollmentsData {
  course: { id: string; title: string };
  totalChapters: number;
  enrollments: CourseEnrollmentEntry[];
  totalEnrollments: number;
}
