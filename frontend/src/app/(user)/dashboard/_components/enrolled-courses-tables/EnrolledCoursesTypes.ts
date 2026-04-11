import React from "react";

/**
 * Course interface matching the API response structure.
 * Uses index signature for flexibility since the API shape varies.
 */
export interface Course {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  imageUrl?: string | null;
  price?: number;
  dealPrice?: number;
  discount?: number;
  duration?: number;
  isFree?: boolean;
  isLive?: boolean;
  isPublished?: boolean;
  averageRating?: number;
  categoryId?: string;
  instructorId?: string;
  categories?: string[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  targetAudience?: string[];
  technologies?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

/**
 * Enrollment status union type
 */
export type EnrollmentStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "DROPPED";

/**
 * Enrollment interface matching the API response structure
 */
export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progress: number;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  course: Course;
}

/**
 * Processed enrollment data for table display
 */
export interface ProcessedEnrollment {
  id: string;
  status: EnrollmentStatus;
  startDate: string;
  endDate: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  enrollmentDate: string;
  enrollmentStatus: EnrollmentStatus;
  progress: number;
  certificate: boolean;
  validity: string;
  createdAt: string;
  updatedAt: string;
  course: any;
  courseProgress: number;
}

export type SortField = keyof ProcessedEnrollment;
export type SortDirection = "asc" | "desc";

export interface VisibleColumns {
  courseTitle: boolean;
  status: boolean;
  progress: boolean;
  startDate: boolean;
  certificate: boolean;
  validity: boolean;
  category: boolean;
}

export interface StatusConfig {
  color: string;
  icon: React.ReactElement;
}

export type StatusConfigMap = {
  [K in EnrollmentStatus]: StatusConfig;
};
