export interface CreateProjectRequest {
  title: string;
  description?: string;
  courseId: string;
  thumbnailUrl?: string;
  deadline?: Date;
  maxSubmissions?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPublic?: boolean;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  tags?: string[];
  prerequisites?: string[];
  technologies?: string[];
  learningOutcomes?: string[];
  resources?: string[];
}

export interface UpdateProjectRequest {
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  deadline?: Date;
  maxSubmissions?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPublic?: boolean;
  startDate?: Date;
  endDate?: Date;
  categories?: string[];
  tags?: string[];
  prerequisites?: string[];
  technologies?: string[];
  learningOutcomes?: string[];
  resources?: string[];
}
