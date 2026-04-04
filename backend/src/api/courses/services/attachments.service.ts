import { generateResourceId } from "../../../core/utils/idGenerator";
// import { invalidateCache } from "../../../config/redis";
import { prisma } from "../../../config/prisma";

export const getAllAttachmentsForCourse = async (courseId: string) => {
  return await prisma.courseAttachment.findMany({
    where: { courseId },
    orderBy: { createdAt: "desc" },
  });
};

export const getAttachmentDetails = async (attachmentId: string) => {
  return await prisma.courseAttachment.findUnique({
    where: { id: attachmentId },
    include: {
      Course: true,
      Instructor: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const createNewAttachment = async (
  name: string,
  url: string,
  courseId: string,
  instructorId: string
) => {
  // Validate course
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  if (course.instructorId !== instructorId) {
    throw new Error("Unauthorized");
  }

  const attachment = await prisma.courseAttachment.create({
    data: {
      id: generateResourceId("courseAttachment"),
      name,
      url,
      courseId,
      instructorId,
      updatedAt: new Date(),
    },
    include: {
      Course: true,
      Instructor: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  // await invalidateCache.courses(courseId);

  return attachment;
};

export const updateExistingAttachment = async (
  attachmentId: string,
  name: string,
  url: string,
  instructorId: string
) => {
  const attachment = await prisma.courseAttachment.findUnique({
    where: { id: attachmentId },
    include: {
      Course: true,
    },
  });

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  if (attachment.Course?.instructorId !== instructorId) {
    throw new Error("Unauthorized");
  }

  const updatedAttachment = await prisma.courseAttachment.update({
    where: { id: attachmentId },
    data: { name, url },
  });

  // await invalidateCache.courses(attachment.courseId);

  return updatedAttachment;
};

export const deleteAttachmentById = async (
  attachmentId: string,
  instructorId: string
) => {
  const attachment = await prisma.courseAttachment.findUnique({
    where: { id: attachmentId },
    include: {
      Course: true,
    },
  });

  if (!attachment) {
    throw new Error("Attachment not found");
  }

  if (attachment.Course?.instructorId !== instructorId) {
    throw new Error("Unauthorized");
  }

  await prisma.courseAttachment.delete({
    where: { id: attachmentId },
  });

  // await invalidateCache.courses(attachment.courseId);

  return true;
};
