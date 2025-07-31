// chapters.service.ts

import { ChapterContentType, PrismaClient } from "@prisma/client";

import { z } from "zod";
import { generateResourceId } from "../../../core/utils/idGenerator";

const prisma = new PrismaClient();

const chapterSchema = z.object({
  title: z.string().min(10).max(150),
  description: z.string().min(50).max(500),
  contentType: z.string(),
  position: z.any().optional(),
  content: z.any().optional(),
  courseId: z.string().optional(),
  sectionId: z.string().optional(),
});

const chapterUpdateSchema = z.object({
  title: z.string().min(10).max(150).optional(),
  description: z.string().min(50).max(500).optional(),
  contentType: z.string().optional(),
  position: z.number().optional(),
  content: z.json().optional(),
  newSectionId: z.string().optional(),
});

export const chapterService = {
  getAllInSection: async (sectionId: string) => {
    return prisma.chapter.findMany({
      where: { sectionId },
      orderBy: { position: "asc" },
    });
  },

  getById: async (chapter: any) => chapter,

  create: async (data: any) => {
    // const parsed = chapterSchema.safeParse(data);
    // if (!parsed.success) throw parsed.error;

    const {
      title,
      description,
      contentType,
      position,
      content,
      courseId,
      sectionId,
    } = data;

    return prisma.chapter.create({
      data: {
        id: generateResourceId("chapter"),
        title,
        description,
        position: position !== undefined ? Number(position) : 0,
        content,
        contentType: contentType as ChapterContentType,
        sectionId,
        courseId,
        isPublished: true,
        isFree: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },

  update: async (chapterId: string, data: any) => {
    // const parsed = chapterUpdateSchema.safeParse(data);
    // if (!parsed.success) throw parsed.error;

    const { title, description, contentType, position, content, newSectionId } =
      data;

    return prisma.chapter.update({
      where: { id: chapterId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(contentType !== undefined && {
          contentType: contentType as ChapterContentType,
        }),
        ...(position !== undefined && { position }),
        ...(content !== undefined && { content }),
        ...(newSectionId !== undefined && { newSectionId }),
      },
    });
  },

  delete: async (chapterId: string) => {
    return prisma.chapter.delete({ where: { id: chapterId } });
  },
};
