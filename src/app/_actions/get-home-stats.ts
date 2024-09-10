"use server";

import { db } from "@/lib/db";

export const getHomeStats = async () => {
  const courses = await db.course.findMany();

  const instructors = await db.instructor.findMany();

  const users = await db.user.findMany();

  return { courses, instructors, users };
};
