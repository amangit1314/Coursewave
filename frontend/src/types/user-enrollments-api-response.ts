export type Enrollment = {
    id: string;
    userId: string;
    courseId: string;
    status: "ACTIVE" | "INACTIVE" | string;
    progress: number;
    startDate: string;
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
    course: Course;
  };
  
  export type Course = {
    isFree: boolean;
    instructorId: string;
    isLive: boolean;
    isPublished: boolean;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
    averageRating: number;
    categories: Category[]; // Note: This is empty in your data, but defined as an array
    description: string;
    duration: string | null;
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
    instructor: Instructor;
    Category: Category;
    sections: Section[];
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
  