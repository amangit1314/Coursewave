export interface EnrolledCoursesResponse {
    success: boolean;
    data: EnrolledCourse[];
    message: string;
  }
  
  export interface EnrolledCourse {
    id: string;
    userId: string;
    courseId: string;
    status: "ACTIVE" | "INACTIVE" | string;
    progress: number;
    startDate: string; // ISO string
    endDate: string | null;
    createdAt: string;
    updatedAt: string;
    course: Course;
  }
  
  export interface Course {
    courseId: string;
    courseTitle: string;
    courseImage: string;
    courseCreator: string;
    courseDescription: string | null;
    isFree: boolean;
    coursePrice: number | null;
    dealPrice: number | null;
    discount: number | null;
    instructorId: string;
    isLive: boolean;
    courseCategories: string[]; // example: ["Full Stack, Next.js"]
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
    createdAt: string;
    updatedAt: string;
  }
  