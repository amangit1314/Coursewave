import { Instructor } from "@prisma/client";

export type CourseWithOtherFields = {
    courseId: string;
    courseTitle: string;
    courseImage: string | null;
    courseCreator: string | null;
    courseDescription: string | null;
    isFree: boolean;
    coursePrice: number | null;
    dealPrice: number | null;
    discount: number | null;
    instructorID: string;
    isLive: boolean;
    courseCategories: string[];  // assuming categories as an array of strings
    instructorName: string;
    isPublished: boolean;
    avgStarRatings: number | null;
    courseDuration: number | null;
    technologiesYouAreGoingToLearn: string[] | null;  // array of technologies
    thisCourseIsFor: string[] | null;  // array of target audiences
    prerequisits: string[] | null;  // array of prerequisites
    whatYouWillLearn: string[] | null;  // array of learning outcomes
    categoryId: string;
    userId: string;
    reviews: any[];  // replace with actual type for reviews if needed
    enrollments: any[];  // replace with actual type for enrollments
    payments: any[];  // replace with actual type for payments
    purchases: any[];  // replace with actual type for purchases
    attachments: any[];  // replace with actual type for attachments
    courseSections: any[];  // replace with actual type for course sections
    categories: any[];  // replace with actual type for categories
    chapters: any[];  // replace with actual type for chapters
    instructorEarningsFromThisCourse: number | null;
    CourseProgress: any[];  // replace with actual type for course progress
    MuxData: any[];  // replace with actual type for Mux data
    Instructor: Instructor;  // replace with actual type for Instructor relationship
    WishList: any[];  // replace with actual type for wishlist
    createdAt: Date | null;
    updatedAt: Date | null;
    CloudinaryData: any[];  // replace with actual type for Cloudinary data
  };
  