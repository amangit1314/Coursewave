// notes.service.ts

import { PrismaClient } from "@prisma/client";
import { generateResourceId } from "../../../core/utils/idGenerator";

const prisma = new PrismaClient();

export const createNote = async ({
  content,
  chapterId,
  userId,
}: {
  content: string;
  chapterId: string;
  userId: string;
}) => {
  return await prisma.chapterNote.create({
    data: {
      id: generateResourceId("chapterNote"),
      content,
      chapterId,
      userId,
      updatedAt: new Date(),
    },
  });
};

export const getNotesByChapter = async ({
  chapterId,
  userId,
}: {
  chapterId: string;
  userId: string;
}) => {
  return await prisma.chapterNote.findMany({
    where: { chapterId, userId },
  });
};

export const getNoteById = async (noteId: string) => {
  return await prisma.chapterNote.findUnique({
    where: { id: noteId },
  });
};

export const updateNoteById = async ({
  noteId,
  content,
}: {
  noteId: string;
  content: string;
}) => {
  return await prisma.chapterNote.update({
    where: { id: noteId },
    data: {
      content,
      updatedAt: new Date(),
    },
  });
};

export const deleteNoteById = async (noteId: string) => {
  return await prisma.chapterNote.delete({
    where: { id: noteId },
  });
};
