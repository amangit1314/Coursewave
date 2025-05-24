import express, { Request, Response } from 'express';
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../middleware/auth';

const router: Router = express.Router();
const prisma = new PrismaClient();

// Get all notes for a user
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const notes = await prisma.chapterNote.findMany({
      where: {
        userId
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                courseId: true,
                courseTitle: true,
                courseImage: true
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error: any) {
    console.log('ERROR in fetching notes: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get notes for a specific chapter
router.get('/chapter/:chapterId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { chapterId } = req.params;
    
    // Check if user has access to this chapter
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        course: {
          chapters: {
            some: {
              id: chapterId
            }
          }
        }
      }
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this chapter'
      });
    }
    
    const notes = await prisma.chapterNote.findMany({
      where: {
        userId,
        chapterId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    return res.status(200).json({
      success: true,
      data: notes
    });
  } catch (error: any) {
    console.log('ERROR in fetching chapter notes: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Create a note
router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { chapterId, content } = req.body;
    
    // Check if user has access to this chapter
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        course: {
          chapters: {
            some: {
              id: chapterId
            }
          }
        }
      }
    });
    
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this chapter'
      });
    }
    
    // Check if chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId
      }
    });
    
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }
    
    // Create note
    const note = await prisma.chapterNote.create({
      data: {
        userId,
        chapterId,
        content
      }
    });
    
    return res.status(201).json({
      success: true,
      data: note
    });
  } catch (error: any) {
    console.log('ERROR in creating note: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update a note
router.put('/:noteId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { noteId } = req.params;
    const { content } = req.body;
    
    // Check if note exists and belongs to user
    const existingNote = await prisma.chapterNote.findUnique({
      where: {
        id: noteId
      }
    });
    
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    if (existingNote.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this note'
      });
    }
    
    // Update note
    const note = await prisma.chapterNote.update({
      where: {
        id: noteId
      },
      data: {
        content
      }
    });
    
    return res.status(200).json({
      success: true,
      data: note
    });
  } catch (error: any) {
    console.log('ERROR in updating note: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete a note
router.delete('/:noteId', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { noteId } = req.params;
    
    // Check if note exists and belongs to user
    const existingNote = await prisma.chapterNote.findUnique({
      where: {
        id: noteId
      }
    });
    
    if (!existingNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    if (existingNote.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this note'
      });
    }
    
    // Delete note
    await prisma.chapterNote.delete({
      where: {
        id: noteId
      }
    });
    
    return res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error: any) {
    console.log('ERROR in deleting note: ', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router; 