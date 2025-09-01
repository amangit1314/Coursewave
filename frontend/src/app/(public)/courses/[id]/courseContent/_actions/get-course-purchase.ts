'use server';

import { db } from "@/lib/db";

export async function getCoursePurchase(courseId: string, userId: string) {
  const purchase = await db.purchase.findFirst({
    where: {
      courseId: courseId,
      userId: userId,
    },
  });

  return purchase;
}