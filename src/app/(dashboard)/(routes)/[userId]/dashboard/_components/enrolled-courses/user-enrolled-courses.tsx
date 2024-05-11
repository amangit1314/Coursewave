import { Grid } from "lucide-react";
import UserEnrolledCoursesCard from "./user-enrolled-courses-card";

const EnrolledCourses = () => {
  return (
    <div className=" w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="font-semibold text-gray-700 text-lg dark:text-gray-400">
          Enrolled Courses
        </div>

        <p className="text-sm cursor-pointer font-medium hover:text-blue-700 text-blue-500">
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