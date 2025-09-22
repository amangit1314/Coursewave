// Export all middlewares for easy importing
export * from './verifyToken';
export * from './checkAccessToken';
export * from './roleCheck';
export * from '../../api/courses/middlewares/ownership';
export * from './validation';
export * from './errorHandler';
// export * from './cache';

// Re-export commonly used middlewares with aliases
export { requireInstructor } from './roleCheck';
export { requireCourseOwnership, requireResourceOwnership } from '../../api/courses/middlewares/ownership';
export { validate, requireFields, validateUUID } from './validation';
export { asyncHandler, sendSuccess, sendError } from './errorHandler';
// export { invalidateCacheAfter, invalidateCourseCache } from './cache'; 
