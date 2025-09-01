import { Category } from "./category";
import { CourseSection } from "./course-details-api-response";
import { Instructor } from "./instructor";

// export type Course = {
//     id: string;
//     title: string;
//     description: string;
//     imageUrl: string;
//     previewUrl: string;
//     isFree: boolean;
//     price: string;
//     currency: string;
//     discountPercentage: number | null;
//     instructorId: string;
//     isLive: boolean;
//     isPublished: boolean;
//     publishedAt: string | null;
//     language: string;
//     level: string;
//     durationMinutes: number;
//     totalLessons: number;
//     totalStudents: number;
//     averageRating: number;
//     slug: string;
//     categories: Category[];
//     instructor: Instructor;
//     userId: string | null;
//     createdAt: string;
//     updatedAt: string;
//     deletedAt: string | null;
// }

export type Course = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  price: string;
  discount: number | null;
  dealPrice?: number | null;
  instructorId: string;
  isLive: boolean;
  isPublished: boolean;
  averageRating: number;
  categories: string[];
  duration?: number | null;
  slug: string;
  learningOutcomes: string[];
  prerequisites: string[];
  targetAudience: string[];
  technologies: string[];
  createdAt: string;
  updatedAt: string;

  sections: CourseSection[];
  category?: Category;
  instructor?: Instructor;
};
