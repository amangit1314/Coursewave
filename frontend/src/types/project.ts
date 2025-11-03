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