import { Category } from "./category";
import { CourseSection } from "./course-details-api-response";
import { Instructor } from "./instructor";

export type Course = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  price: number;
  discount: number | null;
  dealPrice?: number | null;
  instructorId: string;
  isLive: boolean;
  isPublished: boolean;
  averageRating: number;
  categories: string[];
  duration?: number | null;
  slug?: string;
  learningOutcomes: string[];
  prerequisites: string[];
  targetAudience: string[];
  technologies: string[];
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  createdAt: string;
  updatedAt: string;

  sections: CourseSection[];
  category?: Category;
  instructor?: Instructor;

  totalStudents: number | null; /// todo: to implment 
};
