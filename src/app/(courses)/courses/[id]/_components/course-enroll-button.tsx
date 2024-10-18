import { useCheckCourseIsPurchased } from "@/hooks/useCheckCourseIsPuchased"; // TODO:
import { useUserInfo } from "@/hooks/useUserInfo"; // TODO:
import { absoluteUrl } from "@/utils/utils";
import { useNotificationsStore } from "@/zustand/notificationsStore";
import { Course } from "@prisma/client";
import { Button } from "@tremor/react";
import axios from "axios";
import { Loader } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";

const CourseEnrollButton = ({
  course,
  courseId,
}: {
  course: Course;
  courseId: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const user = useUserInfo();
  const isCoursePurchased = useCheckCourseIsPurchased(user?.user?.id, courseId);
  const setNotification = useNotificationsStore(
    (state) => state.setNotification,
  );

  const enrollInCourse = async () => {
    try {
      setIsLoading(true);
      console.log(
        "Is course already purchased? : ",
        isCoursePurchased.courseIsPurchased,
      );
      if (isCoursePurchased.courseIsPurchased) {
        window.location.assign(
          absoluteUrl(`/courses/${courseId}/courseContent`),
        );
      } else {
        const response = await axios.post(`api/courses/${courseId}/checkout`, {
          userId: user?.user?.id!,
        });

        window.location.assign(response.data.url);

        setNotification(
          "Course Enrollment Successful 🎉",
          `Congratulations! You have successfully enrolled in "${course?.courseTitle}" course?.`,
        );

        toast.success(
          `Congratulations 🎉! You have successfully enrolled in "${course?.courseTitle}" course`,
        );
      }
    } catch (error) {
      toast.error("Something went wrong ...");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCoursePurchased.error) {
    return <div>Error: {isCoursePurchased.error.message}</div>;
  }

  return (
    <div className="flex justify-between">
      <Button
        onClick={enrollInCourse}
        disabled={isLoading}
        size="sm"
        color="blue"
        className="mr-8 mt-2 w-[28rem] rounded-md bg-blue-500 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 md:mr-0 md:w-[26rem]"
      >
        {isCoursePurchased.isLoading ? (
          <Loader className="animate-spin" />
        ) : isCoursePurchased.courseIsPurchased ? (
          "Resume Learning"
        ) : (
          "Buy Now"
        )}
      </Button>
    </div>
  );
};

export default CourseEnrollButton;
