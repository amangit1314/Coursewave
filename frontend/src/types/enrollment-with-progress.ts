
import { CourseProgress } from "@/lib/api/services";
import { User } from "./user";
import { Course, Enrollment } from "./user-enrollments-api-response";

export type EnrollementWithProgress =
  //   enrollmentId: string;
  //   userId: string;
  //   courseId: string;
  //   enrollmentDate: string;
  //   course
  //   enrollmentStatus: EnrollmentStatus;
  //   user: User;
  //   course: Course;
  //   progress: {
  //     progress: number;
  //     completedPercentage: number;
  //     isCompleted: Boolean;
  //   }
  // };
  Enrollment & {
    user: User; // This may need to be computed or fetched
    course: Course; // This may need to be fetched or computed
    courseProgress: CourseProgress; // This may need to be computed or fetched
    ChapterProgress: any
  };