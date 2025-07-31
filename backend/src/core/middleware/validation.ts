import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Common validation schemas
export const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be non-negative'),
  categories: z.array(z.string().uuid()).optional(),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
  language: z.string().optional(),
  duration: z.number().positive().optional(),
  totalLessons: z.number().positive().optional()
});

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  excerpt: z.string().max(300, 'Excerpt too long').optional(),
  coverImage: z.string().url().optional(),
  categories: z.array(z.string().uuid()).optional()
});

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment too long')
});

export const resourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  url: z.string().url('Invalid URL'),
  type: z.enum(['DOCUMENT', 'PDF', 'ZIP', 'LINK']).default('DOCUMENT'),
  courseId: z.string().uuid('Invalid course ID')
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  email: z.string().email('Invalid email').optional(),
  about: z.string().max(500, 'About too long').optional(),
  profileImageUrl: z.string().url('Invalid URL').optional()
});

export const paginationSchema = z.object({
  page: z.string().transform((val: string) => parseInt(val)).pipe(z.number().min(1)).default(1),
  limit: z.string().transform((val: string) => parseInt(val)).pipe(z.number().min(1).max(100)).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

/**
 * Generic validation middleware
 * @param schema - Zod schema to validate against
 * @param target - Where to validate from ('body', 'params', 'query')
 * @returns Middleware function
 */
export const validate = (schema: z.ZodSchema, target: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[target];
      const validatedData = schema.parse(data);
      
      // Replace the original data with validated data
      req[target] = validatedData;
      next();
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((issue: z.ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }
  };
};

/**
 * Middleware to validate required fields
 * @param fields - Array of required field names
 * @returns Middleware function
 */
export const requireFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        missingFields
      });
    }
    
    next();
  };
};

/**
 * Middleware to validate UUID format
 * @param paramName - Name of the parameter to validate
 * @returns Middleware function
 */
export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuid || !uuidRegex.test(uuid)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }
    
    next();
  };
};

/**
 * Middleware to validate email format
 * @returns Middleware function
 */
export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format'
    });
  }
  
  next();
};

/**
 * Middleware to validate password strength
 * @returns Middleware function
 */
export const validatePassword = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;
  
  if (password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Password validation failed',
        errors
      });
    }
  }
  
  next();
};

/**
 * Middleware to sanitize input data
 * @returns Middleware function
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize string fields
  const sanitizeString = (str: string): string => {
    return str
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };
  
  // Recursively sanitize object
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  next();
}; 