import { prisma } from "../../config/prisma";
import { AppError } from "../../core/middleware/errorHandler";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const createCategory = async (
  categoryName: string,
  categoryDescription?: string
) => {
  if (!categoryName) {
    throw new AppError("Category name is required", 400);
  }

  return prisma.category.create({
    data: {
      name: categoryName,
      description: categoryDescription,
    },
  });
};

export const updateCategory = async (
  id: string,
  name: string,
  description?: string
) => {
  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  await prisma.category.delete({ where: { id } });

  return { name: category.name };
};
