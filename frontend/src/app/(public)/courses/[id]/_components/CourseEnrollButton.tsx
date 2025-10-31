import { Course } from "@/types/course-details-api-response";
import { useNotificationsStore } from "@/zustand/notificationsStore";
import { Button } from "@tremor/react";
import { BookOpen, Eye, Loader } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useUserStore } from "@/zustand/userStore";
import { courseService } from "@/lib/api/services";
import { useAlreadyPurchased, useCheckoutCourse } from "@/hooks/useCheckout";

// export const CourseEnrollButton = React.memo(
//   ({ course, courseId }: { course: Course; courseId: string }) => {
//     const [isLoading, setIsLoading] = React.useState(false);
//     const { user } = useUserStore();
//     const setNotification = useNotificationsStore(
//       (state) => state.setNotification
//     );

//     const enrollInCourse = async () => {
//       try {
//         if (
//           !user ||
//           !user.id ||
//           user.id === "null" ||
//           user.id === "undefined"
//         ) {
//           window.location.assign(`/login`);
//           return;
//         }

//         // let hasValidToken = checkAuthToken();

//         // if (!hasValidToken) {
//         //   const refreshSuccess = await refreshAuthToken();
//         //   if (!refreshSuccess) {
//         //     toast.error("Authentication token expired. Please login again.");
//         //     window.location.assign(`/login`);
//         //     return;
//         //   }
//         //   hasValidToken = true;
//         // }

//         setIsLoading(true);

//         const response = await courseService.checkoutCourse(courseId, user.id);

//         if (response.success && response.data?.url) {
//           window.location.assign(response.data.url);
//         } else {
//           throw new Error("Checkout failed - no URL received");
//         }
//         setNotification(
//           "Course Enrollment Successful 🎉",
//           `Congratulations! You have successfully enrolled in "${course?.title}" course?.`
//         );
//         toast.success(
//           `Congratulations 🎉! You have successfully enrolled in "${course?.title}" course`
//         );
//       } catch (error) {
//         // Handle Axios errors with a custom backend error message
//         const apiErrorMessage =
//           (error as any)?.response?.data?.error ||
//           (error as any)?.response?.data?.message;
//         if (apiErrorMessage) {
//           toast.error(apiErrorMessage); // Show "Already enrolled in this course"
//         } else if (
//           error instanceof Error &&
//           (error.message.includes("401") ||
//             error.message.includes("Unauthorized"))
//         ) {
//           toast.error("Authentication expired. Please login again.");
//           window.location.assign(`/login`);
//         } else if (error instanceof Error && error.message.includes("404")) {
//           toast.error("Course not found or checkout service unavailable.");
//         } else if (error instanceof Error && error.message.includes("500")) {
//           toast.error("Server error. Please try again later.");
//         } else {
//           toast.error("Something went wrong during checkout...");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     const isUserAuthenticated =
//       user && user.id && user.id !== "null" && user.id !== "undefined";

//     // UI improvement: Add a subtle border, icon, and more visual feedback
//     return (
//       <div className="w-full space-y-3">
//         <Button
//           onClick={enrollInCourse}
//           disabled={!courseId || !isUserAuthenticated || isLoading}
//           size="lg"
//           className={`
//             w-full
//             bg-gradient-to-r from-blue-600 to-cyan-600
//             hover:from-blue-700 hover:to-cyan-700
//             text-white font-semibold py-2 px-6
//             rounded-xl border-2 border-blue-500/30
//             shadow-xl hover:shadow-2xl
//             transition-all duration-200
//             disabled:opacity-60 disabled:cursor-not-allowed
//             focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
//             relative overflow-hidden
//           `}
//         >
//           {/* Animated background shimmer */}
//           <span
//             className="absolute inset-0 pointer-events-none rounded-xl"
//             aria-hidden="true"
//             style={{
//               background:
//                 "linear-gradient(120deg, rgba(59,130,246,0.08) 0%, rgba(168,85,247,0.08) 100%)",
//               zIndex: 0,
//             }}
//           />
//           <span className="relative z-10 flex items-center gap-2">
//             {isLoading ? (
//               <>
//                 <Loader className="h-5 w-5 animate-spin" />
//                 <span>Processing...</span>
//               </>
//             ) : (
//               <>
//                 <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 shadow-inner">
//                   <BookOpen className="h-3 w-3 text-blue-100" />
//                 </span>
//                 <span className="tracking-wide text-sm font-bold drop-shadow-sm">
//                   Enroll Now
//                 </span>
//               </>
//             )}
//           </span>
//         </Button>
//         {!isUserAuthenticated && (
//           <div className="text-xs text-center text-red-500 dark:text-red-400 mt-1 animate-fade-in">
//             Please <span className="underline">login</span> to enroll in this
//             course.
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// CourseEnrollButton.displayName = "CourseEnrollButton";

/// ================================================================================

export const CourseEnrollButton = React.memo(
  ({ course, courseId }: { course: Course; courseId: string }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const { user } = useUserStore();
    const setNotification = useNotificationsStore(
      (state) => state.setNotification
    );

    // TanStack Query for enrolled status
    const { data: enrollmentData, isLoading: checking } = useAlreadyPurchased(
      courseId,
      user?.id || ""
    );
    const { mutateAsync: enrollMutation } = useCheckoutCourse();

    const alreadyEnrolled = enrollmentData?.isEnrolled;

    // Enroll handler
    const enrollInCourse = async () => {
      if (!user?.id) {
        window.location.assign(`/login`);
        return;
      }

      setIsLoading(true);
      try {
        const response = await enrollMutation({ courseId, userId: user.id });
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
        const apiErrorMessage =
          (error as any)?.response?.data?.error ||
          (error as any)?.response?.data?.message;
        if (apiErrorMessage) {
          toast.error(apiErrorMessage);
        } else if (
          error instanceof Error &&
          (error.message.includes("401") ||
            error.message.includes("Unauthorized"))
        ) {
          toast.error("Authentication expired. Please login again.");
          window.location.assign(`/login`);
        } else {
          toast.error("Something went wrong during checkout...");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const isUserAuthenticated =
      !!user?.id && user.id !== "null" && user.id !== "undefined";

    // Redirect for already enrolled user
    const handleViewCourse = () => {
      window.location.assign(`/learnings/${courseId}`);
    };

    return (
      <div className="w-full space-y-3">
        {alreadyEnrolled ? (
          <Button
            onClick={handleViewCourse}
            size="lg"
            className={`
              w-full
              bg-gradient-to-r from-green-600 to-emerald-600
              hover:from-green-700 hover:to-emerald-700
              text-white font-semibold py-2 px-6
              rounded-xl border-2 border-green-500/30
              shadow-xl hover:shadow-2xl
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
              relative overflow-hidden
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-white/20 p-2 shadow-inner">
                <Eye className="h-3 w-3 text-green-100" />
              </span>
              <span className="tracking-wide text-sm font-bold drop-shadow-sm">
                View Course
              </span>
            </span>
          </Button>
        ) : (
          <Button
            onClick={enrollInCourse}
            disabled={
              !courseId || !isUserAuthenticated || isLoading || checking
            }
            size="lg"
            className={`
              w-full
              bg-gradient-to-r from-blue-600 to-cyan-600
              hover:from-blue-700 hover:to-cyan-700
              text-white font-semibold py-2 px-6
              rounded-xl border-2 border-blue-500/30
              shadow-xl hover:shadow-2xl
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              relative overflow-hidden
            `}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading || checking ? (
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
        )}
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
