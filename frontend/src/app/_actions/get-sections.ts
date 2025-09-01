// import { Course, CourseSection } from "@prisma/client";
// import { db } from "@/lib/db";

// type GetCourseSections = {
//   courseId: string;
//   sections: CourseSection[]; // Remove courseName as it's not used in fetching
// };

// export const getCourseSections = async ({ courseId }: GetCourseSections): Promise<GetCourseSections> => {
//   try {
//     const foundSections = await db.courseSection.findMany({
//       where: {
//         courseId,
//       },
//       include: {
//         chapters: true,
//       },
//       // select: {
//       //   courseId: true,
//       //   instructorId: true,
//       //   courseSectionDescription: true,
//       //   courseSectionId: true,
//       //   courseSectionNumber: true,
//       //   courseSectionTitle: true,
//       //   chapters: true,
//       // }
//     });

//     return { courseId, sections: foundSections }; // Return the courseId along with found sections
//   } catch (error) {
//     console.log("[GET_COURSES]", error);
//     // Handle the error appropriately, such as throwing a custom error or logging more details
//     return { courseId, sections: [] }; // Return with empty sections on error
//   }
// };
