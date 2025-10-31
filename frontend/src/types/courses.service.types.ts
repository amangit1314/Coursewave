// ==================================================== COURSES SERVICE =====================================================

import { Course } from "./course";

// Models (keep them in separate files ideally)
export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

// export interface Instructor {
//   id: string;
//   name: string;
//   bio?: string;
//   profileImageUrl?: string;
// }

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
