// import { db } from "@/lib/db";
// import { Course, Purchase } from "@prisma/client";

// type PurchaseWithCourse = Purchase & {
//   course: Course;
// };

// const groupByCourse = (purchases: PurchaseWithCourse[]) => {
//   const grouped: { [courseTitle: string]: number } = {};

//   purchases.forEach((purchase) => {
//     const courseTitle = purchase.course.courseTitle;
//     if (!grouped[courseTitle]) {
//       grouped[courseTitle] = 0;
//     }
//     grouped[courseTitle] += Number(purchase.course.coursePrice);
//   });

//   return grouped;
// };

// export const getAnalytics = async (userId: string) => {
//   try {
//     const purchases = await db.purchase.findMany({
//       where: {
//           userId: userId
//       },
//     });

//     const enrolledCoureses = await db.enrollement.findMany({
//       where: {
//         userId,
//       },
//       select: {
//         course: true,
//       }
//     })

//     const groupedEarnings = groupByCourse([...purchases] & enrolledCoureses);
//     const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
//       name: courseTitle,
//       total: total,
//     }));

//     const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
//     const totalSales = purchases.length;

//     return {
//       data,
//       totalRevenue,
//       totalSales,
//     }
//   } catch (error) {
//     console.log("[GET_ANALYTICS]", error);
//     return {
//       data: [],
//       totalRevenue: 0,
//       totalSales: 0,
//     }
//   }
// }

import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

// Type alias reflecting model relationships
type PurchaseWithCourse = Purchase & {
  course: Course;
};

// Function for grouping purchases by course title and aggregating course prices
const groupByCourse = (purchases: PurchaseWithCourse[]): { [courseTitle: string]: number } => {
  const grouped: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.courseTitle;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += Number(purchase.course.coursePrice);
  });

  return grouped;
};

export const getAnalytics = async (userId: string) => {
  try {
    // Fetch purchases for the user, including associated courses
    const purchases = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: true,
      },
    });

    // Directly access course information from the joined purchases
    // (No need to fetch enrollments separately as course data is already available)

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
