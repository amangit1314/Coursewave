import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categories.controller";

const router: Router = Router();

// Get all categories
router.get("/", getAllCategories);

// Add a category
router.post("/", createCategory);

// Update a category
router.put("/:id", updateCategory);

// Delete a category
router.delete("/:id", deleteCategory);

export default router;
