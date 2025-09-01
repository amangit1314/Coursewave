// // Type alias reflecting model relationships
// type PurchaseWithCourse = Purchase & {
//   course: Course;
// };

// // Function for grouping purchases by course title and aggregating course prices
// const groupByCourse = (purchases: PurchaseWithCourse[]): { [courseTitle: string]: number } => {
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
//     // Fetch purchases for the user, including associated courses
//     const purchases = await db.purchase.findMany({
//       where: {
//         userId: userId,
//       },
//       include: {
//         course: true,
//       },
//     });

//     const groupedEarnings = groupByCourse(
//       purchases.filter((purchase) => purchase.course !== null) as PurchaseWithCourse[]
//     );
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
//     };
//   } catch (error) {
//     console.log("[GET_ANALYTICS_ERROR]", error);
//     return {
//       data: [],
//       totalRevenue: 0,
//       totalSales: 0,
//     };
//   }
// };
