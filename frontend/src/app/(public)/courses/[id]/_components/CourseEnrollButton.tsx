import { useCheckCourseIsPurchased } from "@/hooks/useCheckCourseIsPuchased"; // TODO:

import { Course } from "@/types/course-details-api-response";
import { absoluteUrl } from "@/lib/utils/utils";
import { useNotificationsStore } from "@/zustand/notificationsStore";
// import { Course } from "@prisma/client";
import { Button } from "@tremor/react";
import axios from "axios";
import { BookOpen, Loader } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useUserStore } from "@/zustand/userStore";
import { courseService } from "@/lib/api/services";

// const CourseEnrollButton = ({
//   course,
//   courseId,
// }: {
//   course: Course;
//   courseId: string;
// }) => {
//   const [isLoading, setIsLoading] = React.useState(false);
//   const user = useUserStore();
//   const isCoursePurchased = useCheckCourseIsPurchased(user?.user?.id ?? "", courseId);
//   const setNotification = useNotificationsStore(
//     (state) => state.setNotification,
//   );

//   const enrollInCourse = async () => {
//     try {
//       setIsLoading(true);
//       console.log(
//         "Is course already purchased? : ",
//         isCoursePurchased.courseIsPurchased,
//       );
//       if (isCoursePurchased.courseIsPurchased) {
//         window.location.assign(
//           absoluteUrl(`/courses/${courseId}/courseContent`),
//         );
//       } else {
//         const response = await axios.post(`api/courses/${courseId}/checkout`, {
//           userId: user?.user?.id!,
//         });

//         window.location.assign(response.data.url);

//         setNotification(
//           "Course Enrollment Successful 🎉",
//           `Congratulations! You have successfully enrolled in "${course?.title}" course?.`,
//         );

//         toast.success(
//           `Congratulations 🎉! You have successfully enrolled in "${course?.title}" course`,
//         );
//       }
//     } catch (error) {
//       toast.error("Something went wrong ...");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (isCoursePurchased.error) {
//     return <div>Error: {isCoursePurchased.error.message}</div>;
//   }

//   return (
//     <div className="flex justify-between">
//       <Button
//         onClick={enrollInCourse}
//         disabled={isLoading}
//         size="sm"
//         color="blue"
//         className="mr-8 mt-2 w-[28rem] rounded-md bg-blue-500 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 md:mr-0 md:w-[26rem]"
//       >
//         {isCoursePurchased.isLoading ? (
//           <Loader className="animate-spin" />
//         ) : isCoursePurchased.courseIsPurchased ? (
//           "Resume Learning"
//         ) : (
//           "Buy Now"
//         )}
//       </Button>
//     </div>
//   );
// };

// export default CourseEnrollButton;

export const CourseEnrollButton = React.memo(
  ({ course, courseId }: { course: Course; courseId: string }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const {
      user,
      // loadingState,
      fetchEnrolledCourses,
      enrolledCourses,
      // checkAuthToken,
      // refreshAuthToken,
    } = useUserStore();
    const setNotification = useNotificationsStore(
      (state) => state.setNotification
    );

    const enrollInCourse = async () => {
      try {
        if (
          !user ||
          !user.id ||
          user.id === "null" ||
          user.id === "undefined"
        ) {
          window.location.assign(`/login`);
          return;
        }

        // let hasValidToken = checkAuthToken();

        // if (!hasValidToken) {
        //   const refreshSuccess = await refreshAuthToken();
        //   if (!refreshSuccess) {
        //     toast.error("Authentication token expired. Please login again.");
        //     window.location.assign(`/login`);
        //     return;
        //   }
        //   hasValidToken = true;
        // }

        setIsLoading(true);

        const response = await courseService.checkoutCourse(courseId, user.id);

        if (response.success && response.data?.url) {
          window.location.assign(response.data.url);
        } else {
          throw new Error("Checkout failed - no URL received");
        }
        setNotification(
          "Course Enrollment Successful 🎉",
          `Congratulations! You have successfully enrolled in "${course?.title}" course?.`
        );
        toast.success(
          `Congratulations 🎉! You have successfully enrolled in "${course?.title}" course`
        );
      } catch (error) {
        if (error instanceof Error) {
          if (
            error.message.includes("401") ||
            error.message.includes("Unauthorized")
          ) {
            toast.error("Authentication expired. Please login again.");
            window.location.assign(`/login`);
          } else if (error.message.includes("404")) {
            toast.error("Course not found or checkout service unavailable.");
          } else if (error.message.includes("500")) {
            toast.error("Server error. Please try again later.");
          } else {
            toast.error("Something went wrong during checkout...");
          }
        } else {
          toast.error("Something went wrong during checkout...");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const isUserAuthenticated =
      user && user.id && user.id !== "null" && user.id !== "undefined";

    // UI improvement: Add a subtle border, icon, and more visual feedback
    return (
      <div className="w-full space-y-3">
        <Button
          onClick={enrollInCourse}
          disabled={!courseId || !isUserAuthenticated || isLoading}
          size="lg"
          className={`
            w-full
            bg-gradient-to-r from-blue-600 to-cyan-600
            hover:from-blue-700 hover:to-purple-700
            text-white font-semibold py-2 px-6
            rounded-xl border-2 border-blue-500/30
            shadow-xl hover:shadow-2xl
            transition-all duration-200
            disabled:opacity-60 disabled:cursor-not-allowed
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
            relative overflow-hidden
          `}
        >
          {/* Animated background shimmer */}
          <span
            className="absolute inset-0 pointer-events-none rounded-xl"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(120deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 100%)",
              zIndex: 0,
            }}
          />
          <span className="relative z-10 flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 shadow-inner">
                  <BookOpen className="h-3 w-3 text-blue-100" />
                </span>
                <span className="tracking-wide text-sm font-bold drop-shadow-sm">
                  Enroll Now
                </span>
              </>
            )}
          </span>
        </Button>
        {!isUserAuthenticated && (
          <div className="text-xs text-center text-red-500 dark:text-red-400 mt-1 animate-fade-in">
            Please <span className="underline">login</span> to enroll in this
            course.
          </div>
        )}
      </div>
    );
  }
);

CourseEnrollButton.displayName = "CourseEnrollButton";
