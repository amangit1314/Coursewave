import { PrismaClient } from "@prisma/client";
import React from "react";
const prisma = new PrismaClient();

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
    
    const course = await prisma.course.findUnique({
        where: {
            courseId: params.courseId,
        }
    });

    return (
    
    <div>
      <p>Course Id: {params.courseId}</p>
      <p>EditCourse</p>
    </div>
  );
};

export default CourseIdPage;
