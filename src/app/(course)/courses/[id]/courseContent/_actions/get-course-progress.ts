'use server';

import { db } from "@/lib/db";

export async function getCourseProgress(courseId: string, userId: string) {
  const courseProgress = await db.courseProgress.findFirst({
    where: {
      courseId: courseId,
      userId: userId,
    },
  });

  return courseProgress;
}