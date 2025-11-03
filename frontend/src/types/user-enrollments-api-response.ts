export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  status: "ACTIVE" | "INACTIVE" | string;
  progress: number;
  startDate: string; // ISO date string
  endDate: string | null; // ISO date string or null
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  course: Course;
};

export type Course = {
  id: string;
  title: string;
  slug?: string; // optional as it exists in the log but you didn't include it originally
  description: string;
  imageUrl: string;
  duration: number; // number of seconds (3000 in log)
  price: number;
  dealPrice: number | null;
  discount: number | null;
  isFree: boolean;
  isLive: boolean;
  isPublished: boolean;
  instructorId: string;
  categoryId: string;
  averageRating: number;
  categories: string[]; // array of category names, e.g. ["Programming"]
  learningOutcomes: string[];
  prerequisites: string[];
  targetAudience: string[];
  technologies: string[];

  completedAt: string | null; // ? optional field, need to add it to backend for completion tracking
};

export type Instructor = {
  userId: string;
  bio: string | null;
  expertise: string[];
  socialLinks: {
    twitter: string;
  };
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    profileImageUrl: string | null;
  };
};

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Section = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  courseId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  Chapter: Chapter[];
};

export type Chapter = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  sectionId: string;
  courseId: string;
  isPublished: boolean;
  isFree: boolean;
  contentType: "VIDEO" | "TEXT" | string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
