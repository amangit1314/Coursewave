import { prisma } from "../../config/prisma";

export interface ServiceResponse {
  success: boolean;
  data?: any;
  message: string;
  status: number;
  error?: string;
}

export const getAllCategories = async (): Promise<ServiceResponse> => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      data: categories,
      message: "Categories fetched successfully",
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in getAllCategories: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to fetch categories",
      status: 500,
    };
  }
};

export const createCategory = async (
  categoryName: string,
  categoryDescription?: string
): Promise<ServiceResponse> => {
  try {
    if (!categoryName) {
      return {
        success: false,
        message: "Category name is required",
        status: 400,
      };
    }

    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: categoryDescription,
      },
    });

    // Invalidate categories cache
    // await invalidateCache.categories();

    return {
      success: true,
      data: category,
      message: "Category created successfully",
      status: 201,
    };
  } catch (error: any) {
    console.log("ERROR in createCategory: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to create category",
      status: 500,
    };
  }
};

export const updateCategory = async (
  id: string,
  name: string,
  description?: string
): Promise<ServiceResponse> => {
  try {
    if (!name) {
      return {
        success: false,
        message: "Category name is required",
        status: 400,
      };
    }

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return {
        success: false,
        message: "Category not found",
        status: 404,
      };
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    // Invalidate categories cache
    // await invalidateCache.categories();

    return {
      success: true,
      data: updatedCategory,
      message: `Category ${name} successfully updated`,
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in updateCategory: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to update category",
      status: 500,
    };
  }
};

export const deleteCategory = async (id: string): Promise<ServiceResponse> => {
  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return {
        success: false,
        message: "Category not found",
        status: 404,
      };
    }

    await prisma.category.delete({ where: { id } });

    // Invalidate categories cache
    // await invalidateCache.categories();

    return {
      success: true,
      message: `Category ${category.name} successfully deleted`,
      status: 200,
    };
  } catch (error: any) {
    console.log("ERROR in deleteCategory: ", error.message);
    return {
      success: false,
      error: error.message,
      message: "Failed to delete category",
      status: 500,
    };
  }
};
