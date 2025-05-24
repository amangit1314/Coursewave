import { Category } from "./category";
import { Instructor } from "./instructor";

export type Course = {
    courseId: string;
    courseTitle: string;
    courseImage?: string;
    courseCreator: string;
    courseDescription?: string;
    isFree?: boolean;
    coursePrice?: number;
    dealPrice: string;
    discount: string;
    instructorId: string;
    isLive: boolean;
    courseCategories: string[];
    instructorName: string;
    isPublished: boolean;
    avgStarRatings: number;
    courseDuration: string;
    technologiesYouAreGoingToLearn: string[];
    thisCourseIsFor: string[];
    prerequisites: string[];
    whatYouWillLearn: string[];
    categoryId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    instructor: Instructor;
    categories: Category[];
    // sections: Section[];
}