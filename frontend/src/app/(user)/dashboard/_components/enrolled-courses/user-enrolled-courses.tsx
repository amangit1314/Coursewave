import { Grid } from "lucide-react";
import UserEnrolledCoursesCard from "./user-enrolled-courses-card";

const EnrolledCourses = () => {
  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="text-lg font-semibold text-muted-foreground">
          Enrolled Courses
        </div>

        <p className="cursor-pointer text-sm font-medium text-blue-500 hover:text-blue-700">
          Show All
        </p>
      </div>

      <Grid className="grid grid-cols-2 gap-4">
        <UserEnrolledCoursesCard />
        <UserEnrolledCoursesCard />
        <UserEnrolledCoursesCard />
        <UserEnrolledCoursesCard />
        <UserEnrolledCoursesCard />
        <UserEnrolledCoursesCard />
      </Grid>
    </div>
  );
};

export default EnrolledCourses;
