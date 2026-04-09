import { Request, Response } from "express";
import * as categoriesService from "./categories.service";
import { asyncHandler, sendSuccess } from "../../core/middleware/errorHandler";

export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await categoriesService.getAllCategories();
    sendSuccess(res, categories, "Categories fetched successfully");
  }
);

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { categoryName, categoryDescription } = req.body;
    const category = await categoriesService.createCategory(
      categoryName,
      categoryDescription
    );
    sendSuccess(res, category, "Category created successfully", 201);
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await categoriesService.updateCategory(id, name, description);
    sendSuccess(res, updated, `Category ${updated.name} successfully updated`);
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = await categoriesService.deleteCategory(id);
    sendSuccess(res, null, `Category ${name} successfully deleted`);
  }
);
