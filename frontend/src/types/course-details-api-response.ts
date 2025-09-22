export interface CourseResponse {
  success: boolean;
  data: Course;
}

export interface Course {
  isFree: boolean;
  instructorId: string;
  isLive: boolean;
  isPublished: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  averageRating: number;
  categories: string[];
  description: string;
  duration: number;
  id: string;
  imageUrl: string;
  learningOutcomes: string[];
  prerequisites: string[];
  price: number;
  targetAudience: string[];
  technologies: string[];
  title: string;
  dealPrice: number | null;
  discount: number | null;
  instructor: {
    userId: string;
    bio: string | null;
    expertise: string[];
    socialLinks: {
      twitter: string;
      [key: string]: string;
    };
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      profileImageUrl: string | null;
      about: string | null;
    };
  };
  Category: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
  sections: Array<Section>;
}

export interface Section {
  id: string;
  title: string;
  description: string | null;
  position: number;
  courseId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  Chapter: Array<Chapter>;
}

export interface Chapter {
  id: string;
  title: string;
  description: string | null;
  position: number;
  sectionId: string;
  courseId: string;
  isPublished: boolean;
  isFree: boolean;
  contentType: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  duration?: number; // Add duration as optional, since code expects lesson.duration
}

export interface Instructor {
  id: string;
  userId: string;
  bio: string | null;
  expertise: string[];
  websiteUrl: string | null;
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

/**----------------------------------------------------------------------------------------------------------------------------------- */

// export interface Section {
//   id: string;
//   title: string;
//   description: string;
//   position: number;
//   courseId: string;
//   isPublished: boolean;
//   createdAt: string;
//   updatedAt: string;
//   chapters: Chapter[];
// }

// export interface Chapter {
//   id: string;
//   title: string;
//   description: string | null;
//   position: number;
//   sectionId: string;
//   courseId: string;
//   isPublished: boolean;
//   isFree: boolean;
//   contentType: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   duration?: number; // Add duration as optional, since code expects lesson.duration
// }

export interface CourseSection {
  id: string;
  title: string;
  description: string | null;
  position: number;
  courseId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  Chapter: Chapter[];
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
