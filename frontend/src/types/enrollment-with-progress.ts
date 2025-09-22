import { CourseProgress } from "./courses.service.types";
import { User } from "./user";
import { Course, Enrollment } from "./user-enrollments-api-response";

export type EnrollementWithProgress = Enrollment & {
  user: User; // This may need to be computed or fetched
  course: Course; // This may need to be fetched or computed
  courseProgress: CourseProgress; // This may need to be computed or fetched
  ChapterProgress: any;
};
