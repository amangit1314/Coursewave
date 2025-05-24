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
import { NextResponse } from "next/server";

export default async function AnalyticsPage({
  params,
}: {
  params: { id: string };
}) {
  const instructorId = await params.id;

  const instructor = await db.instructor.findUnique({
    where: {
      instructorID: instructorId,
    },
  });

  if (!instructor) {
    return new NextResponse("Instructor not found", { status: 404 });
  }

  // Calculate total earnings
  const totalEarning = await db.instructorEarning.aggregate({
    _sum: {
      earningAmount: true,
    },
    where: {
      instructorId: instructorId,
    },
  });

  // Get created courses
  const createdCourses = await db.course.findMany({
    where: {
      instructorID: instructorId,
    },
  });

  // Calculate total enrolled students
  const totalEnrolledStudents = await db.enrollment.aggregate({
    _count: {
      userId: true,
    },
    where: {
      courseId: {
        in: createdCourses.map((course) => course.courseId),
      },
      enrollmentStatus: "ACTIVE",
    },
  });

  const totalEarningAmount = totalEarning?._sum.earningAmount || 0;

  return (
    <Analytics
      totalEarning={totalEarningAmount.toString()}
      totalStudents={totalEnrolledStudents?._count.userId || 0}
      totalCourses={createdCourses.length}
      createdCourses={createdCourses}
    />
  );
}
