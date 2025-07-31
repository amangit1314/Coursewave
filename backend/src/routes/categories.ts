import express, { Request, Response, Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { invalidateCache } from '../config/redis';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    return res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    console.log('ERROR in fetching categories: ', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Add a category
router.post('/', async (req: Request, res: Response) => {
  const { categoryName, categoryDescription } = req.body;

  if (!categoryName) {
    return res.status(400).json({ success: false, error: 'category name is required' });
  }

  try {
    const category = await prisma.category.create({ 
      data: { 
        name: categoryName, 
        description: categoryDescription 
      } 
    });
    
    // Invalidate categories cache
    await invalidateCache.categories();
    
    return res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    console.log('ERROR in add category: ', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Update a category
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'category name is required',
    });
  }

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { 
        name,
        description 
      },
    });

    // Invalidate categories cache
    await invalidateCache.categories();

    return res.status(200).json({
      success: true,
      data: updatedCategory,
      message: `Category ${name} successfully updated`,
    });
  } catch (error: any) {
    console.log('ERROR in update category: ', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Delete a category
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    await prisma.category.delete({ where: { id } });

    // Invalidate categories cache
    await invalidateCache.categories();

    return res.status(200).json({
      success: true,
      message: `Category ${category.name} successfully deleted`,
    });
  } catch (error: any) {
    console.log('ERROR in delete category: ', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
