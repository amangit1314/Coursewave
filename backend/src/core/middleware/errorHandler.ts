import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { logger } from '../utils/logger';

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message } = error;

  logger.error('error', {
    requestId: req.requestId,
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userId: req.user?.id
  });

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid foreign key reference';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  }

  // Handle Prisma validation errors
  if (error instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Handle cast errors (invalid ObjectId, etc.)
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Handle duplicate key errors
  if ((error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    requestId: req.requestId,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error.message
    })
  });
};

/**
 * Async error wrapper to catch async errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found middleware
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Success response helper
 */
export const sendSuccess = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error response helper
 */
export const sendError = (res: Response, message: string, statusCode: number = 500, error?: any) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && error && { error })
  });
};

/**
 * Validation error response helper
 */
export const sendValidationError = (res: Response, errors: any[]) => {
  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

/**
 * Unauthorized response helper
 */
export const sendUnauthorized = (res: Response, message: string = 'Unauthorized') => {
  res.status(401).json({
    success: false,
    message
  });
};

/**
 * Forbidden response helper
 */
export const sendForbidden = (res: Response, message: string = 'Access denied') => {
  res.status(403).json({
    success: false,
    message
  });
};

/**
 * Not found response helper
 */
export const sendNotFound = (res: Response, message: string = 'Resource not found') => {
  res.status(404).json({
    success: false,
    message
  });
};

/**
 * Conflict response helper
 */
export const sendConflict = (res: Response, message: string = 'Resource conflict') => {
  res.status(409).json({
    success: false,
    message
  });
};