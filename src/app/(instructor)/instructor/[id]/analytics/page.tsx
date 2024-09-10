// import { db } from "@/lib/db";
// import Analytics from "./_components/analytics-main-content";

// export default async function AnalyticsPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const instructor = await db.instructor.findUnique({
//     where: {
//       instructorID: params?.id!,
//     },
//   });

//   const totalEarning = await db.instructorEarning.aggregate({
//     _sum: {
//       earningAmount: true, 
//     },
//     where: {
//       instructorId: instructor?.instructorID,
//     },
//   });

//   const createdCourses = await db.course.findMany({
//     where: {
//       instructorID: instructor?.instructorID,
//     },
//   });

//   const totalEnrolledStudents = await db.enrollment.aggregate({
//     _count: {
//       userId: true, // Count distinct user enrollments
//     },
//     where: {
//       courseId: {
//         in: createdCourses?.map((course) => course.courseId), // Filter by instructor's courses
//       },
//       enrollmentStatus: "ACTIVE", // Consider only active enrollments
//     },
//   });

//   const totalEarningAmount = totalEarning?._sum.earningAmount || 0;

//   return (
//     <>
//       <Analytics
//         totalEarning={totalEarningAmount.toString()}
//         totalStudents={totalEnrolledStudents?._count.userId || 0}
//         totalCourses={createdCourses.length}
//         createdCourses={createdCourses}
//       />
//     </>
//   );
// }


import { db } from "@/lib/db";
import Analytics from "./_components/analytics-main-content";

export default async function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const instructor = await db.instructor.findUnique({
    where: {
      instructorID: params?.id!,
    },
  });

  if (!instructor) {
    return (
      <div>
        Instructor not found
      </div>
    );
  }

  // Fetch all courses created by this instructor
  const createdCourses = await db.course.findMany({
    where: {
      instructorID: instructor?.instructorID,
    },
    select: {
      courseId: true,
      courseTitle: true,
      courseImage: true, 
      courseCreator: true,
      courseDescription: true,
      isFree: true,
      coursePrice: true,
      dealPrice: true,
      discount: true,
      instructorID: true,
      isLive: true,
      courseCategories: true,
      instructorName: true,
      isPublished: true,
      avgStarRatings: true,
      courseDuration: true,
      technologiesYouAreGoingToLearn: true,
      thisCourseIsFor: true,
      prerequisits: true,
      whatYouWillLearn: true,
      categoryId: true,
      userId: true,
      reviews: true,
      enrollments: true,
      payments: true,
      purchases: true,
      attachments: true,
      courseSections: true,
      categories: true,
      chapters: true,
      instructorEarningsFromThisCourse: true,
      CourseProgress: true,
      MuxData: true,
      Instructor: true,
      WishList: true,
      createdAt: true,
      updatedAt: true,
      CloudinaryData: true,
    },
  });

  const courseIds = createdCourses.map((course) => course.courseId);

  // Get all enrollments for these courses
  const enrollments = await db.enrollment.findMany({
    where: {
      courseId: {
        in: courseIds,
      },
      enrollmentStatus: "ACTIVE",
    },
    select: {
      courseId: true,
    },
  });

  // Calculate total earnings
  const totalEarningAmount = enrollments.reduce((total, enrollment) => {
    const course = createdCourses.find(course => course.courseId === enrollment.courseId);
    return total + (course ? Number(course.coursePrice) : 0);
  }, 0);

  // Get the total number of distinct students enrolled in these courses
  const totalEnrolledStudents = await db.enrollment.aggregate({
    _count: {
      userId: true,
    },
    where: {
      courseId: {
        in: courseIds,
      },
      enrollmentStatus: "ACTIVE",
    },
  });

  return (
    <>
      <Analytics
        totalEarning={totalEarningAmount.toFixed(2)}
        totalStudents={totalEnrolledStudents?._count.userId || 0}
        totalCourses={createdCourses.length}
        createdCourses={createdCourses}
      />
    </>
  );
}
