"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

//* Shadcn ui components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

//* hot toast
import toast, { Toaster } from "react-hot-toast";

//* tremor icons
import { Button, Callout } from "@tremor/react";

//* icons
import {
  Loader,
  Clock,
  Users,
  BookOpen,
  Star,
  CheckCircle,
  Play,
  Award,
  Shield,
  Zap,
  Lock,
  ChevronDown,
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  Info,
  Folder,
  ClipboardList,
  ListChecks,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FaShare, FaGraduationCap } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";
import { RiCoupon3Line } from "react-icons/ri";

//* zustand hooks
import { useCartStore } from "@/zustand/cartStore";
import { useNotificationsStore } from "@/zustand/notificationsStore";

//* custom hooks
import { useCoursesStore } from "@/zustand/coursesStore";

//* API services
import { courseService } from "@/lib/api/services/course-service";

//* types
import { CourseSection } from "@/types/course-details-api-response";

// * Custom Components
import CourseNavbar from "../../_components/CourseNavbar";
import { useUserStore } from "@/zustand/userStore";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import { Footer } from "@/app/(shared)/LandingPage/footer";
import { Course } from "@/types/course-details-api-response";
import { formatCourseDuration } from "@/utils/utils";

interface CoursePreviewClientProps {
  courseId: string;
}

// Error Message Component (matching dashboard style)
interface ErrorMessageProps {
  title: string;
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message }) => {
  return (
    <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-6 border border-red-200 dark:border-red-800">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
            {title}
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-400">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CoursePreviewClient = ({ courseId }: CoursePreviewClientProps) => {
  // console.log(
  //   `Course id in courses/[id]/page.tsx before fetching data: ${courseId}`
  // );

  const {
    course,
    loadingState,
    fetchCourse,
    fetchCourseReviews,
    reviews,
    fetchCourseSections,
    sections,
  } = useCoursesStore();

  const { user, checkAuthToken, refreshAuthToken } = useUserStore();

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
      fetchCourseReviews(courseId);
      fetchCourseSections(courseId);
    }
  }, [courseId, fetchCourse, fetchCourseReviews, fetchCourseSections]);


  console.log("Course Reviews: ", JSON.stringify(reviews));

  // Handle success/cancel messages from Stripe checkout
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get("success");
    const canceled = urlParams.get("canceled");

    if (success === "1") {
      toast.success(
        "🎉 Payment successful! You are now enrolled in this course."
      );
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (canceled === "1") {
      toast.error("Payment was canceled. You can try again anytime.");
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Auto-refresh token if user is authenticated but doesn't have a token
  useEffect(() => {
    const autoRefreshToken = async () => {
      // console.log("=== Auto-refresh token check ===");
      // console.log("User:", user);

      if (user && user.id && user.id !== "null" && user.id !== "undefined") {
        const hasToken = checkAuthToken();
        // console.log("Has token:", hasToken);

        if (!hasToken) {
          // console.log(
          //   "User authenticated but no token found, attempting auto-refresh..."
          // );
          try {
            const refreshSuccess = await refreshAuthToken();
            // console.log("Auto-refresh result:", refreshSuccess);

            if (refreshSuccess) {
              // console.log("Auth token auto-refreshed successfully");
            } else {
              // console.warn("Failed to auto-refresh auth token");
            }
          } catch (error) {
            // console.error("Error during auto-refresh:", error);
          }
        } else {
          // console.log("User has valid token, no refresh needed");
        }
      } else {
        // console.log("No valid user found for auto-refresh");
      }
    };

    autoRefreshToken();
  }, [user, checkAuthToken, refreshAuthToken]);

  if (loadingState.loading) {
    return <CoursePreviewLoadingSkeleton />;
  }

  if (loadingState.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-2xl">
              <ErrorMessage
                title="Failed to Fetch Course Information"
                message={loadingState.error}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // console.log(
  //   `Course data for courseId:${courseId} in courses/[id]/page.tsx : `,
  //   course
  // );

  // console.log(
  //   `Sections data for courseId:${courseId} : `,
  //   JSON.stringify(sections)
  // );

  // Handle course data - it might be an array or single object
  const courseData = Array.isArray(course) ? course[0] : course;

  // Provide fallback values only when rendering
  const courseTitle = courseData?.title;
  const instructor = courseData?.instructor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6 lg:space-y-12 lg:px-8">
        {/* Course Navbar */}
        {courseTitle && (
          <div className="sticky top-0 z-50 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-transparent lg:mx-0 lg:px-0">
            <CourseNavbar courseName={courseTitle} />
          </div>
        )}

        {/* Course Content */}
        {courseData && (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <CourseDetailsLeftSection course={courseData} reviews={reviews} />
            </div>
            <div className="lg:col-span-1">
              <CourseDetailsRightSection course={courseData} />
            </div>
          </div>
        )}

        {/* Course Sections and Chapters */}
        <div className="mt-12">
          <CourseSectionsAndChapters courseId={courseId} sections={sections} />
        </div>

        {/* Course Ratings */}
        <div className="mt-12">
          <CourseRatingsSection reviews={reviews} course={courseData} />
        </div>

        {/* Instructor Info */}
        {/* {instructor && (
          <div className="mt-12">
            <CourseInstructorInformationSection instructor={instructor} />
          </div>
        )} */}
      </div>

      <Footer />
    </div>
  );
};

export default CoursePreviewClient;

//* ------------------------------------- SECTIONS -------------------------------------

const CourseDetailsLeftSection = ({
  course,
  reviews,
}: {
  course: Course;
  reviews: any[];
}) => {
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        reviews.length
      : course?.averageRating || 0.0;

  const totalReviews = reviews.length || 0; // Fallback to course data or default

  // console.log(
  //   "Course in state cards in left section: ",
  //   JSON.stringify(course)
  // );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <CardContent className="p-0">
          <div className="relative">
            {/* Mobile Course Image */}
            {/* <div className="relative h-64 w-full lg:hidden">
              <Image
                className="object-cover"
                src={
                  course?.imageUrl ??
                  "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
                }
                alt={course?.title || "Course"}
                fill
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div> */}

            <div className="p-6 lg:p-8">
              <div className="space-y-4">
                {/* <CourseBreadcrumb course={course!} /> */}
                <div className="space-y-2">
                  {/* Title */}
                  <h1 className="text-3xl font-bold tracking-tight text-white lg:text-4xl xl:text-5xl">
                    {course?.title}
                  </h1>

                  {/* Rating and Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-white">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" size={16} />
                        <span className="font-semibold">
                          {avgRating?.toFixed(1) ?? 0.0}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30"
                      >
                        {totalReviews} reviews
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Instructor Info */}
                {course?.instructor && (
                  <Card className="border-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-blue-700 shadow-lg">
                    <CardContent className="flex items-center gap-6 p-4 lg:p-6">
                      {/* 
                        UX Decision:
                        - Since you want to show more courses from the instructor and possibly more details,
                        - The best UX is to navigate to a dedicated instructor profile page (new screen/route).
                        - This allows for a richer experience and easier sharing/linking.
                        - You can use a route like `/instructors/[instructorId]`.
                        - If you want a quick preview, you could also add a dialog or sidebar later.
                        - For now, let's make the avatar and name clickable links.
                      */}
                      <a
                        href={`/instructor/${course.instructor.userId}`}
                        className="relative h-16 w-16 overflow-hidden rounded-full border-4 border-white/20 shadow-lg block focus:outline-none focus:ring-2 focus:ring-blue-400"
                        title={`View ${course.instructor.user?.name}'s profile`}
                      >
                        <Image
                          src={
                            course.instructor.user?.profileImageUrl ??
                            "https://github.com/shadcn.png"
                          }
                          alt={course.instructor.user?.name || "Instructor"}
                          fill
                          className="object-cover"
                        />
                        <span className="sr-only">
                          View {course.instructor.user?.name}'s profile
                        </span>
                      </a>
                      {/* Instructor Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/instructor/${course.instructor.userId}`}
                            className="text-xl font-bold text-white hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                            title={`View ${course.instructor.user?.name}'s profile`}
                          >
                            {course.instructor.user?.name}
                          </a>
                          <span className="ml-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white/80 shadow">
                            Course Instructor
                          </span>
                        </div>

                        {/* Instructor Bio */}
                        {course.instructor.user?.about && (
                          <p className="mt-2 text-sm text-white/90 line-clamp-3">
                            {course.instructor.user.about
                              ? course.instructor.user.about
                              : "No about available"}
                          </p>
                        )}

                        {/* Instructor Expertise */}
                        {course?.instructor?.expertise &&
                          course.instructor.expertise.length > 0 && (
                            <div className="mt-2 space-y-1">
                              <h4 className="text-sm font-semibold text-white/80">
                                Expertise
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {course.instructor.expertise
                                  .slice(0, 4)
                                  .map((tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 border-0 shadow text-blue-800 dark:text-blue-200 flex items-center gap-1"
                                    >
                                      <span className="inline-block w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mr-1" />
                                      {tech}
                                    </Badge>
                                  ))}
                                {course.instructor.expertise.length > 4 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow text-gray-700 dark:text-gray-200 flex items-center gap-1"
                                  >
                                    +{course.instructor.expertise.length - 4}{" "}
                                    more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                {/* TODO: implement this student counts */}
                <p className="text-2xl font-bold text-white">
                  {/* {course?.totalStudents > 1000
                    ? `${(course.totalStudents / 1000).toFixed(1)}k`
                    : (course?.totalStudents ?? 0)} */}
                  0
                </p>

                <p className="text-sm text-white/90">Students enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {/* {course?.totalLessons ?? 0} */}
                  {course.sections.length}
                </p>
                <p className="text-sm text-white/90">Sections included</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-indigo-500 to-cyan-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                {/* TODO: implement this student counts */}
                <p className="text-2xl font-bold text-white">
                  {course.sections.flatMap(section => section.Chapter || []).length}
                  
                </p>

                <p className="text-sm text-white/90">Chapters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Description */}
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            About This Course
          </h2>
        </CardHeader>
        <CardContent>
          <CourseDescription
            courseDescription={
              course?.description ??
              "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat"
            }
          />
        </CardContent>
      </Card>

      {/* What You'll Learn */}
      <Card className="border-stroke shadow-sm dark:shadow-lg border-gray-200 dark:border-transparent dark:bg-zinc-900/90">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-400 p-2 shadow-md">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              What You'll Learn
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="relative border-l border-blue-600 dark:border-blue-500 pl-4 space-y-6">
            {(course.learningOutcomes.length > 0
              ? course.learningOutcomes
              : [
                  "Master modern web development techniques",
                  "Build real-world projects from scratch",
                  "Learn industry best practices",
                  "Get hands-on coding experience",
                  "Understand advanced concepts",
                  "Deploy applications to production",
                ]
            ).map((item, index) => (
              <li key={index} className="ml-2">
                <div className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                  {item}
                </span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Course Requirements */}
      <Card className="border-stroke shadow-sm dark:shadow-lg border-gray-200 dark:border-transparent dark:bg-zinc-900/90">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 dark:from-blue-600 dark:to-purple-400 p-2 shadow-md">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Requirements
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {(course.prerequisites.length > 0
              ? course.prerequisites
              : [
                  "Basic programming knowledge",
                  "A computer with internet connection",
                  "Willingness to learn and practice",
                  "No prior experience required",
                ]
            ).map((item, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 dark:border-zinc-700 bg-blue-50 dark:bg-zinc-800 px-4 py-2 text-sm font-medium text-blue-800 dark:text-blue-300 hover:scale-[1.025] transition-transform"
              >
                <ListChecks className="h-4 w-4" />
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CourseDetailsRightSection = ({ course }: { course: Course }) => {
  // console.log("Course in right section: ", JSON.stringify(course));

  return (
    <div className="space-y-6">
      {/* <Toaster /> */}

      {/* Course Card */}
      <Card className="sticky top-24 border-0 shadow-xl dark:bg-zinc-900/90">
        {/* Course Image */}
        <div className="relative rounded-t-xl overflow-hidden">
          <Image
            className="h-48 w-full object-cover"
            src={
              course?.imageUrl ??
              "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
            }
            alt={course?.title || "Course"}
            width={400}
            height={200}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Play Button Overlay */}
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
              <Play className="h-8 w-8 text-white" fill="white" />
            </div>
          </div> */}
        </div>

        {/* Other content */}
        <CardContent className="p-6">
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${course?.price ?? 499}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                lifetime access
              </span>
            </div>
          </div>

          {/* Enroll Button */}
          <CourseEnrollButton course={course!} courseId={course?.id} />

          <div className="grid grid-cols-3 gap-3 mt-3">
            <button
              className="col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              // onClick={handleAddToCart}
              // disabled={isLoading}
            >
              Add to Cart
            </button>
            <button
              className="col-span-1 w-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
              // onClick={handleAddToWishlist}
              // disabled={isLoading}
            >
              {/* Replace with stateful logic for filled/outline heart */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                  // If added, use fill="currentColor" for filled heart
                  fill="none"
                />
              </svg>
              Wishlist
            </button>
          </div>

          {/* Guarantee */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <Separator className="my-6" />

          {/* Course Includes */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              This course includes:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {formatCourseDuration(course?.duration)}
                    </span>{" "}
                    <span className="text-gray-700 dark:text-gray-300">
                      of high-quality, on-demand video
                    </span>
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Certificate of completion
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Downloadable resources
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Full lifetime access
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Access on mobile and TV
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Technologies */}
          {course?.technologies && course.technologies.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Technologies you'll learn:
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.technologies.slice(0, 4).map((tech, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-pink-900/40 border-0 shadow-sm text-blue-700 dark:text-blue-200 flex items-center gap-1"
                  >
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 mr-1" />
                    {tech}
                  </Badge>
                ))}
                {course.technologies.length > 4 && (
                  <Badge
                    variant="outline"
                    className="text-xs font-medium rounded-full px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-0 shadow-sm text-gray-700 dark:text-gray-200 flex items-center gap-1"
                  >
                    +{course.technologies.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <ShareButton />
            <ApplyCouponCode />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// const CourseInstructorInformationSection = ({
//   instructor,
// }: {
//   instructor: Instructor;
// }) => {
//   const {
//     fetchInstructorStats,
//     instructorStudentsCount,
//     instructorAverageStarRating,
//     loadingState,
//   } = useInstructorStore();

//   // Use instructor.id instead of instructor.user.id for API calls
//   const instructorId = instructor?.id || "undefined";

//   // Fetch instructor courses using react-query hook
//   const {
//     data: instructorCreatedCourses,
//     isLoading,
//     isError,
//     error,
//   } = useFetchInstructorCreatedCourses(instructorId);

//   // Fetch instructor stats on mount or when the instructorId changes
//   useEffect(() => {
//     if (instructorId && instructorId !== "undefined") {
//       fetchInstructorStats(instructorId);
//     }
//   }, [instructorId, fetchInstructorStats]);

//   // Handle loading, error, and empty instructor case
//   if (loadingState.loading || isLoading) {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-6">
//           <InstructorCardLoadingSkeleton />
//           <MoreInstructorCreatedCoursesSkeleton />
//         </CardContent>
//       </Card>
//     );
//   }

//   if (loadingState.error || isError) {
//     return (
//       <Card className="border-0 shadow-lg">
//         <CardContent className="p-6">
//           <ErrorMessage
//             title="Failed to fetch Instructor data"
//             message={
//               loadingState.error || error?.message || "Unknown error occurred"
//             }
//           />
//         </CardContent>
//       </Card>
//     );
//   }

//   // Default placeholder values
//   const instructorProfilePicUrl =
//     instructor?.user?.profileImageUrl ??
//     "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg";
//   const instructorName = instructor?.user?.name ?? "Coursewave";
//   const instructorTag = "Full Stack Developer";
//   const aboutInstructor = instructor?.bio ?? "Sample about";

//   return (
//     <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
//       <CardHeader className="text-center pb-8">
//         <div className="space-y-2">
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
//             <FaGraduationCap className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Meet Your Instructor
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400">
//             Learn from industry experts with proven track records
//           </p>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-8 ">
//         <InstructorCard
//           instructorProfilePicUrl={instructorProfilePicUrl}
//           instructorName={instructorName}
//           instructorTag={instructorTag}
//           aboutInstructor={aboutInstructor}
//           instructorCreatedCourses={instructorCreatedCourses?.length || 1}
//           instructorStudentsCount={instructorStudentsCount || 1}
//           instructorAverageStarRating={instructorAverageStarRating || 4.9}
//         />

//         <MoreIntructorCreatedCourses
//           instructorName={instructorName}
//           instructorCreatedCourses={instructorCreatedCourses || []}
//         />
//       </CardContent>
//     </Card>
//   );
// };

const CourseDescription = ({
  courseDescription,
}: {
  courseDescription: string;
}) => {
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  return (
    <div className="space-y-4">
      <div
        className={`prose prose-gray max-w-none dark:prose-invert ${
          showFullDescription ? "" : "line-clamp-4"
        }`}
      >
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {courseDescription}
        </p>
      </div>

      {courseDescription.length > 250 && (
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          {showFullDescription ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

function checkCourseIsPurchased(
  userId: string,
  courseId: string,
  enrolledCourses: EnrollementWithProgress[]
) {
  return enrolledCourses.some(
    (enrollment: EnrollementWithProgress) => enrollment.courseId === courseId
  );
}

const CourseEnrollButton = React.memo(
  ({ course, courseId }: { course: Course; courseId: string }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const {
      user,
      loadingState,
      fetchEnrolledCourses,
      enrolledCourses,
      checkAuthToken,
      refreshAuthToken,
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

        let hasValidToken = checkAuthToken();

        if (!hasValidToken) {
          const refreshSuccess = await refreshAuthToken();
          if (!refreshSuccess) {
            toast.error("Authentication token expired. Please login again.");
            window.location.assign(`/login`);
            return;
          }
          hasValidToken = true;
        }

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

const ShareButton = () => {
  const pathname = usePathname();

  const notify = (content: string) => toast(`${content}`);

  const handleShare = () => {
    const currentUrl = pathname;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        // console.log("URL copied to clipboard");
        notify("✔ URL copied successfully!");
      },
      (err) => {
        console.error("Failed to copy URL:", err);
        notify("❌ Failed to copy URL!");
      }
    );
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <FaShare className="h-4 w-4" />
      <span>Share</span>
    </button>
  );
};

const ApplyCouponCode = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
          <RiCoupon3Line className="h-4 w-4" />
          <span>Coupon</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-gray-800 dark:text-white">
            Apply Coupon Code
          </DialogTitle>
          <DialogDescription>
            Enter your coupon code below to get a discount on this course.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              placeholder="Enter coupon code..."
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          >
            Apply Coupon
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Course Ratings Section Component
const CourseRatingsSection = ({
  reviews,
  course,
}: {
  reviews: any[];
  course: Course | null;
}) => {
  const [showAllReviews, setShowAllReviews] = React.useState(false);

  // Ensure reviews is an array and handle null/undefined cases
  const safeReviews = Array.isArray(reviews) ? reviews : [{
    id: "134decq1231", userId: "q4545345234-345234df4r-324edede-323fceds", comment: "This is an sample comment.", createdAt: "", rating: 4.8,
  }];

  // Calculate average rating safely
  const avgRating =
    safeReviews.length > 0
      ? safeReviews.reduce((sum, review) => sum + (review.rating || 0), 0) /
        safeReviews.length
      : course?.averageRating || 0.0;

  const totalReviews = safeReviews.length || 0; // Fallback to course data or default

  // Calculate rating distribution safely
  const ratingDistribution = {
    5:
      safeReviews.filter((r) => (r.rating || 0) >= 4.5).length ||
      Math.floor(totalReviews * 0.6),
    4:
      safeReviews.filter((r) => (r.rating || 0) >= 3.5 && (r.rating || 0) < 4.5)
        .length || Math.floor(totalReviews * 0.25),
    3:
      safeReviews.filter((r) => (r.rating || 0) >= 2.5 && (r.rating || 0) < 3.5)
        .length || Math.floor(totalReviews * 0.1),
    2:
      safeReviews.filter((r) => (r.rating || 0) >= 1.5 && (r.rating || 0) < 2.5)
        .length || Math.floor(totalReviews * 0.03),
    1:
      safeReviews.filter((r) => (r.rating || 0) < 1.5).length ||
      Math.floor(totalReviews * 0.02),
  };

  const displayedReviews = showAllReviews
    ? safeReviews
    : safeReviews.slice(0, 6);

  return (
    <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Reviews
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              What students are saying about this course
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <FaStar className="text-yellow-400" size={20} />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {avgRating.toFixed(1)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalReviews} reviews
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Rating Analysis */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Overall Rating */}
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {avgRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(avgRating)
                          ? "text-yellow-400"
                          : i < avgRating
                            ? "text-yellow-300"
                            : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Course Rating
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Rating Distribution
                </h3>
                {[5, 4, 3, 2, 1].map((stars) => {
                  const percentage =
                    totalReviews > 0
                      ? (ratingDistribution[
                          stars as keyof typeof ratingDistribution
                        ] /
                          totalReviews) *
                        100
                      : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stars}
                        </span>
                        <FaStar className="h-3 w-3 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="lg:col-span-2">
            {safeReviews.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {displayedReviews.map((review, index) => (
                    <div
                      key={review.id || index}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {(review.userId
                                ? review.userId.charAt(0)
                                : "A"
                              ).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {review.userId
                                ? `User ${review.userId.slice(-4)}`
                                : "Anonymous"}
                            </p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < (review.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            review.createdAt || Date.now()
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                        "{review.comment || "No comment provided"}"
                      </p>
                    </div>
                  ))}
                </div>

                {safeReviews.length > 6 && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                    >
                      {showAllReviews
                        ? "Show Less"
                        : `Show All ${safeReviews.length} Reviews`}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaStar className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Be the first to review this course and help other students
                  make their decision.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample Course Content Component
const SampleCourseContent = () => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set(["section-1"])
  );
  const { user } = useUserStore();

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isUserAuthenticated =
    user && user.id && user.id !== "null" && user.id !== "undefined";

  const sampleSections = [
    {
      id: "section-1",
      title: "Introduction to Web Development",
      lessons: [
        {
          id: "1",
          title: "Welcome to the Course",
          duration: 300,
          contentType: "VIDEO",
          isFree: true,
        },
        {
          id: "2",
          title: "Setting Up Your Development Environment",
          duration: 600,
          contentType: "VIDEO",
          isFree: true,
        },
        {
          id: "3",
          title: "Understanding HTML Basics",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "4",
          title: "HTML Structure and Elements",
          duration: 750,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "5",
          title: "HTML Quiz",
          duration: 300,
          contentType: "QUIZ",
          isFree: false,
        },
      ],
    },
    {
      id: "section-2",
      title: "CSS Fundamentals",
      lessons: [
        {
          id: "6",
          title: "Introduction to CSS",
          duration: 600,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "7",
          title: "CSS Selectors and Properties",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "8",
          title: "Box Model and Layout",
          duration: 750,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "9",
          title: "CSS Flexbox",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "10",
          title: "CSS Grid Layout",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
      ],
    },
    {
      id: "section-3",
      title: "JavaScript Essentials",
      lessons: [
        {
          id: "11",
          title: "JavaScript Basics",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "12",
          title: "Variables and Data Types",
          duration: 600,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "13",
          title: "Functions and Scope",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "14",
          title: "DOM Manipulation",
          duration: 900,
          contentType: "VIDEO",
          isFree: false,
        },
        {
          id: "15",
          title: "JavaScript Quiz",
          duration: 300,
          contentType: "QUIZ",
          isFree: false,
        },
      ],
    },
  ];

  const totalLessons = sampleSections.reduce(
    (total, section) => total + section.lessons.length,
    0
  );
  const freeLessons = sampleSections.reduce(
    (total, section) =>
      total + section.lessons.filter((lesson) => lesson.isFree).length,
    0
  );

  return (
    <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Content
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalLessons} lessons • {freeLessons} free previews
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Course Duration
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              8h 30m
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleSections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-left">
                      Section {sectionIndex + 1}: {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {section.lessons.length} lessons
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {Math.floor(
                    section.lessons.reduce(
                      (total, lesson) => total + lesson.duration,
                      0
                    ) / 60
                  )}
                  m
                </div>
              </button>

              {expandedSections.has(section.id) && (
                <div className="px-4 space-y-2">
                  {section.lessons.map((lesson, lessonIndex) => {
                    const isFree = lesson.isFree;
                    const isFirstTwoLessons =
                      sectionIndex === 0 && lessonIndex < 2;
                    const canPlay =
                      isFree || isFirstTwoLessons || isUserAuthenticated;

                    return (
                      <div
                        key={lesson.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          canPlay
                            ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                            : "bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {canPlay ? (
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <Play className="h-4 w-4 text-blue-600 dark:text-blue-400 ml-0.5" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <Lock className="h-4 w-4 text-gray-500" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4
                              className={`font-medium text-sm ${
                                canPlay
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            {isFree && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                Free
                              </Badge>
                            )}
                            {!canPlay && (
                              <Badge variant="outline" className="text-xs">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              {lesson.contentType === "VIDEO" && (
                                <Video className="h-3 w-3" />
                              )}
                              {lesson.contentType === "TEXT" && (
                                <FileText className="h-3 w-3" />
                              )}
                              {lesson.contentType === "QUIZ" && (
                                <HelpCircle className="h-3 w-3" />
                              )}
                              <span className="capitalize">
                                {lesson.contentType.toLowerCase()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.floor(lesson.duration / 60)}:
                              {String(lesson.duration % 60).padStart(2, "0")}
                            </div>
                          </div>
                        </div>

                        {!canPlay && (
                          <div className="flex-shrink-0">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sample Content Notice */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                Sample Course Content
              </h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                This is a preview of the course structure. The actual content
                will be available once the instructor adds sections and lessons
                to this course.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Course Sections and Chapters Component
const CourseSectionsAndChapters = ({
  courseId,
  sections,
}: {
  courseId: string;
  sections: CourseSection[] | null;
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(
    new Set()
  );
  const { user } = useUserStore();
  const { loadingState } = useCoursesStore();

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isUserAuthenticated =
    user && user.id && user.id !== "null" && user.id !== "undefined";

  // Handle loading state
  if (loadingState.loading) {
    return (
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-32" />
                <div className="mt-3 space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (loadingState.error) {
    return (
      <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Course Content
          </h2>
        </CardHeader>
        <CardContent>
          <ErrorMessage
            title="Failed to load course content"
            message={loadingState.error}
          />
        </CardContent>
      </Card>
    );
  }

  // Handle empty or null sections - show sample content
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return <SampleCourseContent />;
  }

  // Calculate totals safely
  const totalLessons = sections.reduce((total, section) => {
    const lessonCount = Array.isArray(section.Chapter)
      ? section.Chapter.length
      : 0;
    return total + lessonCount;
  }, 0);

  const freeLessons = sections.reduce((total, section) => {
    const lessons: any[] = Array.isArray((section as any).Chapter)
      ? (section as any).Chapter
      : [];
    const freeCount = lessons.filter((lesson: any) => lesson.isFree).length;
    return total + freeCount;
  }, 0);

  const totalDuration = sections.reduce((total, section) => {
    const lessons = Array.isArray(section.Chapter) ? section.Chapter : [];
    const sectionDuration = lessons.reduce((lessonTotal, lesson) => {
      return lessonTotal + (lesson.duration || 0);
    }, 0);
    return total + sectionDuration;
  }, 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = Math.floor(totalDuration % 60);

  // Precompute each section's duration for display
  const sectionDurations: number[] = sections.map((section) => {
    const lessons = Array.isArray(section.Chapter) ? section.Chapter : [];
    return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  });

  // Precompute previous section durations for each section
  const prevSectionDurations: number[] = [];
  let runningTotal = 0;
  for (let i = 0; i < sectionDurations.length; i++) {
    prevSectionDurations.push(runningTotal);
    runningTotal += sectionDurations[i];
  }

  return (
    <Card className="border-0 shadow-lg dark:bg-zinc-900/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Content
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {totalLessons} lessons • {freeLessons} free previews
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Course Duration
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {hours}h {minutes}m
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => {
            const lessons = Array.isArray(section.Chapter)
              ? section.Chapter
              : [];
            // Use previous section's duration for display
            const prevDuration = prevSectionDurations[sectionIndex] || 0;
            const prevHours = Math.floor(prevDuration / 60);
            const prevMinutes = prevDuration % 60;

            return (
              <div
                key={section.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-gray-800 transition-colors rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}

                    {/* Section title */}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-left">
                        Section {sectionIndex + 1}: {section.title}
                      </h3>

                      <p className="text-left text-sm text-gray-600 dark:text-gray-400">
                        {lessons.length} lessons
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {prevHours > 0 ? `${prevHours}h ` : ""}
                    {prevMinutes}m
                  </div>
                </button>

                {expandedSections.has(section.id) && (
                  <div className="space-y-2">
                    {lessons.map((lesson, lessonIndex) => {
                      const isFree = lesson.isFree;
                      const isFirstTwoLessons =
                        sectionIndex === 0 && lessonIndex < 2;
                      const canPlay =
                        isFree || isFirstTwoLessons || isUserAuthenticated;

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                            canPlay
                              ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer"
                              : "bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex-shrink-0">
                            {canPlay ? (
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Play className="h-4 w-4 text-blue-600 dark:text-blue-400 ml-0.5" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Lock className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4
                                className={`font-medium text-sm ${
                                  canPlay
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {lesson.title}
                              </h4>
                              {isFree && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                >
                                  Free
                                </Badge>
                              )}
                              {!canPlay && (
                                <Badge variant="outline" className="text-xs">
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                {lesson.contentType === "VIDEO" && (
                                  <Video className="h-3 w-3" />
                                )}
                                {lesson.contentType === "TEXT" && (
                                  <FileText className="h-3 w-3" />
                                )}
                                {lesson.contentType === "QUIZ" && (
                                  <HelpCircle className="h-3 w-3" />
                                )}
                                <span className="capitalize">
                                  {lesson.contentType.toLowerCase()}
                                </span>
                              </div>
                              {lesson.duration && (
                                <div className="text-xs text-gray-500">
                                  {Math.floor(lesson.duration / 60)}:
                                  {String(lesson.duration % 60).padStart(
                                    2,
                                    "0"
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {!canPlay && (
                            <div className="flex-shrink-0">
                              <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Course Access Notice */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                Course Access
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                The first 2 lessons are available for free preview. Enroll in
                the course to access all content, including{" "}
                {totalLessons - freeLessons} premium lessons.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ------------------------------------ SKELETONS ------------------------------
const MoreInstructorCreatedCoursesSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    </div>
  );
};

// Loading Skeleton Component (matching dashboard style)
const CoursePreviewLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto max-w-7xl space-y-8 px-4 py-6 lg:space-y-12 lg:px-8">
        {/* Navbar Skeleton */}
        <div className="sticky top-0 z-50 -mx-4 bg-white/80 px-4 py-3 backdrop-blur-md dark:bg-zinc-900/80 lg:mx-0 lg:px-0">
          <div className="flex w-full items-center justify-between rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md dark:bg-slate-900/90 lg:px-6">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section Skeleton */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 bg-white/20" />
                <Skeleton className="h-12 w-3/4 bg-white/20" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-6 w-20 bg-white/20" />
                  <Skeleton className="h-6 w-16 bg-white/20" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24 bg-white/20" />
                    <Skeleton className="h-3 w-32 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-6">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-lg bg-white/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16 bg-white/20" />
                    <Skeleton className="h-4 w-24 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections Skeleton */}
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-lg"
              >
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-white dark:bg-zinc-800 shadow-xl">
              <Skeleton className="h-48 w-full rounded-t-2xl" />
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <Separator />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-16 rounded-lg" />
                  <Skeleton className="h-8 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
