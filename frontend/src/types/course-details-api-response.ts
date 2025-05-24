export interface CourseResponse {
  success: boolean;
  data: Course;
}

export interface Course {
  courseId: string;
  courseTitle: string;
  courseImage: string;
  courseCreator: string;
  courseDescription: string | null;
  isFree: boolean;
  coursePrice: string | null;
  dealPrice: string | null;
  discount: string | null;
  instructorId: string;
  isLive: boolean;
  courseCategories: string[]; // e.g., ["Full Stack, Next.js"]
  instructorName: string | null;
  isPublished: boolean;
  avgStarRatings: number;
  courseDuration: string;
  technologiesYouAreGoingToLearn: string[];
  thisCourseIsFor: string[];
  prerequisits: string[];
  whatYouWillLearn: string[];
  categoryId: string | null;
  userId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string;
  instructor: Instructor;
  categories: Category[]; // Empty in current data, but structurally included
  sections: Section[];

  attachments: any[]; // Define better if structure is known
}

export interface Instructor {
  id: string;
  userId: string;
  bio: string;
  expertise: string[];
  socialLinks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  user: InstructorUser;
}

export interface InstructorUser {
  id: string;
  name: string | null;
  email: string;
  profileImageUrl: string | null;
  about: string | null;
  shortSummary: string | null;
}

export interface Category {
  // Define your category structure here if needed
  [key: string]: any;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  position: number;
  courseId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  position: number;
  sectionId: string;
  courseId: string;
  isPublished: boolean;
  isFree: boolean;
  contentType: "VIDEO" | "TEXT" | "QUIZ"; // Add more if needed
  content: ChapterContent;
  createdAt: string;
  updatedAt: string;
}

export interface ChapterContent {
  duration: number; // in seconds
  videoUrl: string;
  subtitles: Subtitle[];
  resolution: {
    width: number;
    height: number;
  };
  thumbnailUrl: string;
}

export interface Subtitle {
  url: string;
  language: string;
}
