export interface CartItem {
    id: string;
    userId: string;
    courseId: string;
    courseName: string;
    courseInstructorName?: string;
    courseImageUrl?: string;
    coursePrice: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
  }
  