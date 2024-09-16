"use client";

import axios from "axios";
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

//* hot toast
import toast, { Toaster } from "react-hot-toast";

//* tremor icons
import { Button, Callout, Divider } from "@tremor/react";
import { Course, Instructor } from "@prisma/client";

//* icons
import { Loader } from "lucide-react";
import { FaShare } from "react-icons/fa";
import { VscPreview } from "react-icons/vsc";
import { RiCoupon3Line } from "react-icons/ri";
import { SiCrowdsource } from "react-icons/si";
import { GoProjectTemplate } from "react-icons/go";
import { FaAngleRight, FaStar } from "react-icons/fa6";
import { HiOutlineShoppingCart, HiShoppingCart } from "react-icons/hi";

//* zustand hooks
import { useCartStore } from "@/zustand/cartStore";
import { useNotificationsStore } from "@/zustand/notificationsStore";

//* custom hooks
import { useUserInfo } from "@/hooks/useUserInfo";
import { useCoursesStore } from "@/zustand/coursesStore";
import { useInstructorInfo } from "@/hooks/useInstructorInfo";
import { useCheckCourseIsPurchased } from "@/hooks/useCheckCourseIsPuchased";

// * Custom Components
import CourseNavbar from "../_components/course-navbar";
import CourseContent from "../_components/course-content";
import Prerequisits from "../_components/sections/prerequisits";
import InstructorCard, {
  InstructorCardLoadingSkeleton,
} from "../_components/sections/instructor-card";
import CourseBreadcrumb from "../_components/sections/course-breadcrumb";
import WhatYouWillLearn from "../_components/sections/what-you-will-learn";
import WhoThisCourseIsFor from "../_components/sections/who-this-course-is-for";
import InstructorBadgeLoadingSkeleton from "./_components/skeletons/instructor-badge-loading-skeleton";
import CourseSmallScreenSkeleton from "./_components/skeletons/course-small-screen-skeleton";
import CourseBigScreenSkeleton from "./_components/skeletons/course-big-screen-skeleton";

//* Custom Components which are not default exports because multiple components are exported from these files
import { Footer } from "@/components/LandingPage/footer";
import { CourseRatings } from "../_components/sections/ratings/course-ratings";
import { MoreIntructorCreatedCourses } from "../_components/sections/more-instructor-created-courses";
import { useInstructorStore } from "@/zustand/instructorStore";
import { useUserStore } from "@/zustand/userStore";
import { EnrollementWithProgress } from "@/types/enrollment-with-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseWithOtherFields } from "@/types/course-with-other-fields";

const CoursePreview = ({ params }: { params: { id: string } }) => {
  const courseId = params?.id!;

  console.log(
    `Course id in courses/[id]/page.tsx before fetching data: ${courseId}`,
  );

  const { course, loadingState, fetchCourse, fetchCourseReviews, reviews } =
    useCoursesStore();

  useEffect(() => {
    fetchCourse(courseId);
    fetchCourseReviews(courseId);
  }, [fetchCourse, fetchCourseReviews, courseId]);

  if (loadingState.loading) {
    return (
      <>
        <div className="visible mx-auto my-auto flex items-center justify-center align-middle md:hidden">
          <CourseSmallScreenSkeleton />
        </div>
        <div className="hidden md:mx-auto md:flex md:items-center md:justify-center">
          <CourseBigScreenSkeleton />
        </div>
      </>
    );
  }

  if (loadingState.error) {
    return (
      <div className="w-7xl mx-auto flex items-center justify-center align-middle">
        <Callout
          className=""
          title="Failed to Fetch Course Info 🚨❌"
          color="red"
        >
          ERROR In Course id page: <span>{loadingState.error} 🚨❌ ...</span>
        </Callout>
      </div>
    );
  }

  console.log(
    `Course data for courseId:${courseId} in courses/[id]/page.tsx : `,
    course,
  );

  return (
    <div className="space-y-[6rem] overflow-x-hidden">
      <div className="flex flex-col overflow-x-hidden">
        {/* course navbar */}
        <div className="inset-y-0 z-50 w-full px-4 py-2 md:px-10">
          <CourseNavbar courseName={course?.courseTitle!} />
        </div>

        {/* course content */}
        <div className="pl-8 md:grid md:max-w-7xl md:grid-cols-2 md:pl-[6rem]">
          {/* {(!course?.instructorID || !course) ? <CourseDetailsLeftSection course={course!} instructorId={course?.instructorID!} /> : <div></div> } */}
          <CourseDetailsLeftSection
            course={course!}
            instructorId={course?.instructorID || "Unknown Instructor ID"} // Fallback to avoid undefined
          />
          <CourseDetailsRightSection course={course!} />
        </div>

        {/* course ratings */}
        <div className="flex w-full max-w-7xl items-center justify-start px-2 md:mt-4 md:px-[6rem]">
          <CourseRatings reviews={reviews} />
        </div>

        {/* Instructor Info */}
        <CourseInstructorInformationSection
          // instructorId={course?.instructorID || "Unknown Instructor ID"} // Fallback for instructorId
          // instructorName={course?.courseCreator || "Unknown Instructor"} // Fallback for instructorName
          instructor={course?.Instructor!}
        />
      </div>

      <Footer />
    </div>
  );
};

export default CoursePreview;

//* ------------------------------------- SECTIONS -------------------------------------

const CourseDetailsLeftSection = ({
  course,
  instructorId,
}: {
  course: CourseWithOtherFields;
  instructorId: string;
}) => {
  // console.log(
  //   `Instructor id in the course details left section: ${course?.instructorID!} `,
  // );

  // const { instructor, fetchInstructorById, loadingState } =
  //   useInstructorStore();

  // useEffect(() => {
  //   fetchInstructorById(instructorId);
  // }, [fetchInstructorById, instructorId]);

  // if (loadingState.loading) {
  //   return <InstructorBadgeLoadingSkeleton />;
  // }

  // if (loadingState.error) {
  //   return (
  //     <div>
  //       <Callout
  //         className=""
  //         title="Failed to Fetch Instructor Info 🚨❌"
  //         color="red"
  //       >
  //         <span>{loadingState.error} 🚨❌ ...</span>
  //       </Callout>
  //     </div>
  //   );
  // }

  return (
    <div className="text-red mt-[3.125rem] flex flex-col items-start justify-center space-y-6 overflow-x-hidden text-start text-xl">
      {/* course title, description, ratings,*/}
      <div className="mr-8 space-y-4">
        <div className="w-full space-y-4 rounded-3xl bg-gradient-to-br from-[#87CEEB] to-[#4144ff] py-4 pl-4 pr-4 backdrop-blur-sm md:mr-0 md:w-[586px] md:pr-4">
          <div className="space-y-1">
            <CourseBreadcrumb course={course!} />

            {/* course image only for mobile screen */}
            <div className="visible my-4 mr-8 w-full max-w-screen-2xl pr-8 md:hidden">
              <Image
                className="visible h-60 w-full rounded-3xl bg-slate-700 shadow-md md:hidden"
                src={
                  course?.courseImage ??
                  "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
                }
                alt={course?.courseTitle || "Alt"}
                width={400}
                height={30}
                style={{
                  objectFit: "cover",
                }}
                quality={100}
              />
            </div>

            {/* title */}
            <h1 className="text-2xl font-semibold tracking-tight text-white dark:text-white md:text-4xl">
              {course?.courseTitle}
            </h1>

            {/* rating stars */}
            <div className="flex flex-row items-start justify-start md:items-center">
              <div className="flex items-center justify-start space-x-1">
                <div className="text-sm font-semibold tracking-tight text-white dark:text-white">
                  {course?.avgStarRatings?.toFixed(1) ?? 4.8}
                </div>
                <FaStar className="text-yellow-500" size={12} />
              </div>

              {/* number of students enrolled badge */}
              <div className="flex flex-row items-center">
                <div className="mx-1 flex items-center justify-center space-x-[4px] rounded-full bg-slate-900 px-2 py-1 text-xs font-medium text-white dark:bg-blue-600">
                  <VscPreview size={16} />
                  <span className="text-xs">{`${156} reviews`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TODO: instructor info tile */}
          {/* <div className="align-center backdrop-filter-blur flex w-auto flex-shrink-0 cursor-pointer flex-row items-center justify-start rounded-lg transition-all duration-200 md:items-start">
            <Image
              className="h-12 w-12 items-center rounded-full bg-white"
              src={instructor?.instructorProfilePicUrl!}
              alt={instructor?.instructorName!}
              height={12}
              width={12}
              unoptimized
            />

            <div className="my-1 ml-1 flex w-full flex-col px-2 pt-1 md:my-0 md:pt-0">
              <div className="py-auto rating flex items-center justify-between">
                <p className="text-md text-base font-semibold tracking-tight text-gray-100 dark:text-gray-200">
                  {instructor?.instructorName}
                </p>
              </div>

              <p className="text-sm text-gray-300 dark:text-gray-400">
                Instructor of this course
              </p>
            </div>
          </div> */}
        </div>
      </div>

      {/* no of reviews and projects */}
      <div className="flex w-full items-center justify-start space-x-6 pr-8 md:mr-0 md:max-w-7xl md:pr-0">
        <div className="h-50 space-y-2 rounded-3xl bg-gradient-to-br from-[#87CEEB] to-[#4144ff] p-4 backdrop-blur-sm">
          <div className="space-y-1">
            <SiCrowdsource size={24} className="text-white" />
            <p className="text-4xl font-bold tracking-tighter text-white">
              200+
            </p>
          </div>

          <p className="text-md text-base text-gray-200">
            Number of peoples enrolled in this course just after launch
          </p>
        </div>

        <div className="h-50 space-y-2 rounded-3xl bg-gradient-to-br from-[#87CEEB] to-[#4144ff] p-4 backdrop-blur-sm">
          <div className="space-y-1">
            <GoProjectTemplate size={24} className="text-white" />
            <p className="text-4xl font-bold tracking-tighter text-white">5</p>
          </div>

          <p className="text-md text-base text-gray-200">
            We will build 5 big projects together and will learn a lot of
            concepts.
          </p>
        </div>
      </div>

      {/* only for mobile screen */}
      <div className="visible mr-8 space-y-4 py-4 pr-8 md:hidden md:pr-0">
        <div className="mr-8 space-y-2">
          <p className="text-sm font-medium text-blue-500">Buy course</p>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Get access to this course forever when you buy it. Learn at your own
            pace, anytime
          </p>
        </div>

        <p className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white">
          ${course?.coursePrice!}
        </p>

        <div className="mr-4 flex flex-col items-center justify-center space-y-2">
          <CourseEnrollButton course={course!} courseId={course?.courseId} />
          <ApplyCouponCode /> {/* // TODO */}
        </div>
      </div>

      {/* course description */}
      <div className="my-4 w-full md:my-0 md:mb-8 md:mt-16">
        <CourseDescription
          courseDescription={
            course?.courseDescription ??
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident eos odit nam quae repellat quis cumque reiciendis autem ab expedita Provident eos odit nam quae repellat"
          }
        />
      </div>

      <WhatYouWillLearn whatYouWillLearn={course?.whatYouWillLearn} />

      <CourseContent courseId={course?.courseId} />

      <WhoThisCourseIsFor thisCourseIsFor={course?.thisCourseIsFor} />

      <Prerequisits prerequisits={course?.prerequisits} />
    </div>
  );
};

const CourseDetailsRightSection = ({
  course,
}: {
  course: CourseWithOtherFields;
}) => {
  return (
    <div className="hidden h-auto w-auto md:mt-12 md:flex md:flex-col">
      <Toaster />

      <div className="mx-auto h-auto w-full max-w-md rounded-3xl shadow-xl dark:bg-slate-800">
        <Image
          className="relative left-0 right-0 h-60 w-full max-w-[28rem] rounded-t-3xl bg-slate-700"
          src={
            course?.courseImage ??
            "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20210301154221/System-Design-Live-Course-By-GeeksforGeeks.png"
          }
          alt={course?.courseTitle || "Alt"}
          width={448}
          height={30}
          style={{
            objectFit: "cover",
          }}
          quality={100}
        />

        <div className="p-4">
          <div className="py-auto flex items-center">
            <span className="mr-1 font-bold text-blue-500">$</span>
            <p className="text-lg font-semibold tracking-tight text-gray-950 dark:text-gray-200">
              {course?.coursePrice ?? 499}
            </p>
            <p className="pl-1 text-xs dark:text-gray-400">
              (life time access)
            </p>
          </div>

          <div className="flex w-full flex-col items-center justify-start space-y-1 px-2">
            <CourseEnrollButton course={course!} courseId={course?.courseId} />
            {/* <AddToCartButton course={course!} /> */}
          </div>

          <p className="pt-2 text-center text-xs font-thin text-gray-400">
            30 Day money back guarantee
          </p>

          <Divider />

          {/* what you will get in this course */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-xl dark:text-gray-200">
              What you will get?
            </h3>
            <ul className="flex list-disc flex-col justify-between space-y-2 pb-2 pl-4 text-sm text-gray-700 dark:text-gray-400">
              <li>
                On demand{" "}
                {course?.courseDuration ? course?.courseDuration : "2 hour"} of
                video content
              </li>
              <li>Certificate for Completion</li>
              <li>A Complete Project Included</li>
              <li>
                <YouWillLearnAbout
                  technologiesYouAreGoingToLearn={
                    course?.technologiesYouAreGoingToLearn
                  }
                />
              </li>
            </ul>
          </div>

          <Divider />

          {/* share, gift, apply coupon code */}
          <div className="flex items-center justify-center space-x-4">
            <ShareButton />
            <ApplyCouponCode />
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseInstructorInformationSection = ({
  instructorId,
  // instructorName,
  instructor,
}: {
  instructor: Instructor;
  instructorId: string;
  // instructorName: string;
}) => {
  // console.log(
  //   `Instructor id in the instructor-info.tsx: ${instructor.instructorID} `,
  // );

  const {
    // fetchInstructorById,
    fetchInstructorStats,
    // instructor,
    instructorCreatedCourses,
    instructorStudentsCount,
    instructorAverageStarRating,
    loadingState,
  } = useInstructorStore();

  // Fetch instructor data when instructorId changes
  useEffect(() => {
    if (instructor.instructorID) {
      fetchInstructorStats(instructor.instructorID);
    }
  }, [instructor, fetchInstructorStats]);

  if (loadingState.error) {
    return (
      <Callout
        className=""
        title="Failed to fetch Instructor data 🚨❌"
        color="red"
      >
        ERROR: <span>{loadingState.error} </span>
      </Callout>
    );
  }

  return (
    <div className="mt-4 flex w-full max-w-7xl flex-col justify-start border-y px-8 py-8 dark:bg-transparent md:px-[6rem]">
      <h3 className="mb-4 text-xl font-semibold tracking-tight text-gray-800 dark:text-slate-200">
        Meet Your Instructor
      </h3>

      {!instructor || !instructor.instructorID ? (
        <div>
          {loadingState.loading ? (
            <InstructorCardLoadingSkeleton />
          ) : (
            <InstructorCard
              instructorProfilePicUrl={
                instructor?.instructorProfilePicUrl ??
                "https://wcgwzdehnxpexussrkni.supabase.co/storage/v1/object/public/assets/green-3d.jpg"
              }
              instructorName={instructor?.instructorName || "Coursewave"}
              instructorTag={
                instructor?.instructorTag || "Full Stack Developer"
              }
              aboutInstructor={instructor?.aboutInstructor || "Sample about"}
              instructorCreatedCourses={instructorCreatedCourses}
              instructorStudentsCount={instructorStudentsCount}
              instructorAverageStarRating={instructorAverageStarRating}
            />
          )}

          {loadingState.loading ? (
            <MoreInstructorCreatedCoursesSkeleton />
          ) : (
            <MoreIntructorCreatedCourses
              // instructorId={instructorId}
              instructorName={instructor.instructorName}
              instructorCreatedCourses={instructorCreatedCourses || []}
            />
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

//? --------------------------------------- COMPONENTS ----------------------------------

const YouWillLearnAbout = ({
  technologiesYouAreGoingToLearn,
}: {
  technologiesYouAreGoingToLearn: string[] | null;
}) => {
  // Check if there are technologies and if their length is greater than 0
  if (
    !technologiesYouAreGoingToLearn ||
    technologiesYouAreGoingToLearn.length === 0
  ) {
    return <div></div>; // Return an empty div if no technologies
  }

  return (
    <div className="flex items-center justify-start space-x-2">
      <p>You will learn about: </p>
      {technologiesYouAreGoingToLearn
        .slice(0, 2)
        .map((tech: string, index: number) => {
          return (
            <div
              className="flex items-center rounded-md bg-slate-200 px-2 py-1 text-black"
              key={index}
            >
              {tech}
            </div>
          );
        })}
      <p className="text-xs">etc.</p>
    </div>
  );
};

const CourseDescription = ({
  courseDescription,
}: {
  courseDescription: string;
}) => {
  const [showFullDescription, setShowFullDescription] = React.useState(false);

  return (
    <div className="mt-2 h-auto w-full space-y-4">
      <h3 className="text-xl font-semibold tracking-tight text-zinc-800 dark:text-slate-200">
        About This Course
      </h3>

      <p
        className={`${
          showFullDescription ? "" : "line-clamp-4"
        } text-md md:text-md w-auto py-4 text-base text-slate-700 dark:text-gray-400 md:p-0 md:py-2 ${
          showFullDescription ? "" : "overflow-hidden"
        }`}
      >
        {courseDescription}
      </p>

      {courseDescription.length > 250 && (
        <div
          className="expand-toggle text-md cursor-pointer text-base text-blue-500"
          onClick={() => setShowFullDescription(!showFullDescription)}
        >
          {showFullDescription ? "Show Less" : "Show More"}
        </div>
      )}
    </div>
  );
};

function checkCourseIsPurchased(
  userId: string,
  courseId: string,
  enrolledCourses: EnrollementWithProgress[],
) {
  return enrolledCourses.some(
    (enrollment: EnrollementWithProgress) => enrollment.courseId === courseId,
  );
}

const CourseEnrollButton = ({
  course,
  courseId,
}: {
  course: CourseWithOtherFields;
  courseId: string;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user, loadingState, fetchEnrolledCourses, enrolledCourses } =
    useUserStore();
  const setNotification = useNotificationsStore(
    (state) => state.setNotification,
  );

  useEffect(() => {
    user && user?.id ? fetchEnrolledCourses(user?.id) : null;
  }, [fetchEnrolledCourses, user]);

  if (loadingState.loading) {
    return (
      <Skeleton className="mr-8 mt-2 w-[28rem] rounded-md p-2 text-center md:mr-0 md:w-[26rem]" />
    );
  }

  if (loadingState.error) {
    return (
      <div className="w-7xl mx-auto flex items-center justify-center align-middle">
        <Callout
          className=""
          title="Failed to fetch user enrolledCourses 🚨❌"
          color="red"
        >
          ERROR In courses/[id]/page.tsx :{" "}
          <span>{loadingState.error} 🚨❌ ...</span>
        </Callout>
      </div>
    );
  }

  // Check if both user id and courseId are defined
  const isCoursePurchased =
    user?.id && courseId
      ? checkCourseIsPurchased(user.id, courseId, enrolledCourses)
      : false;

  const enrollInCourse = async () => {
    try {
      if (!user) {
        window.location.assign(`/login`);
      } else {
        setIsLoading(true);
        console.log("Is course already purchased? : ", isCoursePurchased);

        if (isCoursePurchased) {
          window.location.assign(`/courses/${courseId}/courseContent`);
        } else {
          const response = await axios.post(
            `api/courses/${courseId}/checkout`,
            {
              userId: user?.id!,
            },
          );

          window.location.assign(response.data.url);

          setNotification(
            "Course Enrollment Successful 🎉",
            `Congratulations! You have successfully enrolled in "${course?.courseTitle}" course?.`,
          );

          toast.success(
            `Congratulations 🎉! You have successfully enrolled in "${course?.courseTitle}" course`,
          );
        }
      }
    } catch (error) {
      toast.error("Something went wrong ...");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between">
      <Button
        onClick={enrollInCourse}
        // || !courseId || !user?.id
        disabled={isLoading}
        size="sm"
        color="blue"
        className="mr-8 mt-2 w-[28rem] rounded-md bg-blue-500 p-2 text-center text-sm font-semibold text-white hover:bg-blue-700 md:mr-0 md:w-[26rem]"
      >
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : isCoursePurchased ? (
          "Resume Learning"
        ) : (
          "Buy Now"
        )}
      </Button>
    </div>
  );
};

const AddToCartButton = ({ course }: { course: Course }) => {
  const user = useUserInfo();
  // const cartItemId = generateUid();

  const [isInCart, setIsInCart] = React.useState(false);
  const { addToCart: handleAddToCart, removeFromCart: handleRemoveFromCart } =
    useCartStore();

  // const cartItemToAdd: CartItem = {
  //   id: `cart_${cartItemId}`,
  //   userId: user.user?.id,
  //   courseId: course?.courseId,
  //   courseName: course?.courseTitle,
  //   courseInstructorName: course?.instructorName ?? "",
  //   courseImageUrl: course?.courseImage ?? "./assets/images/images1.jpg",
  //   coursePrice: course?.coursePrice!,
  //   quantity: 1,
  //   createdAt: null,
  //   updatedAt: null,
  // };

  const toggleIsInCart = () => {
    if (isInCart) {
      handleRemoveFromCart(course?.courseId!);
    } else {
      handleAddToCart(course!, user.user?.id!);
      setIsInCart(!isInCart);
    }
  };

  return (
    <Button
      onClick={toggleIsInCart}
      size="sm"
      color="blue"
      className={`m-2 mt-2 w-[26rem] rounded-md bg-blue-500 text-center text-sm font-semibold text-white hover:bg-blue-700 ${isInCart ? "bg-blue-600" : "bg-blue-500"}`}
    >
      {isInCart ? (
        <div className="flex items-center justify-center">
          <HiShoppingCart size={22} /> Remove from cart
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <HiOutlineShoppingCart size={22} /> Add to cart
        </div>
      )}
    </Button>
  );
};

const ShareButton = () => {
  const pathname = usePathname();

  const notify = (content: string) => toast(`${content}`);

  const handleShare = () => {
    const currentUrl = pathname;
    navigator.clipboard.writeText(currentUrl).then(
      () => {
        console.log("URL copied to clipboard");
        notify("✔ URL copied successfully!");
      },
      (err) => {
        console.error("Failed to copy URL:", err);
        notify("❌ Failed to copy URL!");
      },
    );
  };

  return (
    <>
      <button
        onClick={() => handleShare()}
        className="flex items-center justify-center"
      >
        <FaShare />
        <p className="pl-2 text-xs text-gray-400 hover:cursor-pointer hover:text-blue-500 hover:underline">
          Share
        </p>
      </button>
    </>
  );
};

const ApplyCouponCode = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-center">
          <RiCoupon3Line />
          <p className="pl-2 text-xs text-gray-400 hover:cursor-pointer hover:text-blue-500 hover:underline">
            Apply Coupon
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-semibold text-gray-800 dark:text-white">
            Enter coupon code below
          </DialogTitle>
          <DialogDescription>
            Enter coupon code below and press apply when you are done. It will
            applied to the course price.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="items-center">
            <Label className="mb-1 text-left font-semibold text-gray-800 dark:text-white">
              Coupon Code
            </Label>
            <Input
              id="couponCode"
              value="Enter coupon code ..."
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MoreInstructorCreatedCoursesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:justify-start md:gap-0 md:space-x-4">
      <Skeleton className="h-32 w-40 rounded-xl" />
      <Skeleton className="h-32 w-40 rounded-xl" />
      <Skeleton className="h-32 w-40 rounded-xl" />
    </div>
  );
};
