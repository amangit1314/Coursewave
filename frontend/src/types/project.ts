export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "planning" | "in-progress" | "completed" | "on-hold";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
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