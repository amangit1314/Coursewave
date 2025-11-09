export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  thumbnailUrl: string;
  status: "planning" | "in-progress" | "completed" | "on-hold";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
  categories: string[];
  members: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  }[];
  progress: number;
  startDate: string;
  technologies: string[];
  likes: number;
  views: number;
  isBookmarked: boolean;
  isPublic: boolean;
}

export interface ProjectDetails {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  courseId: string;
  instructorId: string;
  thumbnailUrl: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  deadline: string | null; // ISO string or null
  startDate: string | null;
  endDate: string | null;
  maxSubmissions: number | null;
  status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  isPublic: boolean;
  categories: string[];
  tags: string[];
  prerequisites: string[];
  technologies: string[];
  learningOutcomes: string[];
  resources: string[];
  // ...
}