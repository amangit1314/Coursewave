import { Request, Response } from "express";
import * as categoriesService from "./categories.service";

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoriesService.getAllCategories();
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName, categoryDescription } = req.body;
    const result = await categoriesService.createCategory(
      categoryName,
      categoryDescription
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await categoriesService.updateCategory(
      id,
      name,
      description
    );
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await categoriesService.deleteCategory(id);
    res.status(result.status).json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal Server Error",
    });
  }
};
