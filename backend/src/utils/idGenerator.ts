import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a consistent ID for resources with a prefix and truncated UUID
 * @param prefix - The prefix for the ID (e.g., 'user', 'course', 'cart')
 * @returns A string in the format: prefix_xxxxxxxxxx (where x is from UUID)
 */
export const generateResourceId = (prefix: string): string => {
  const uuid = uuidv4();
  // Take first 10 characters of UUID and remove hyphens
  const truncatedUuid = uuid.replace(/-/g, '').substring(0, 10);
  return `${prefix}_${truncatedUuid}`;
};

/**
 * Generates a consistent ID for cart items
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns A string in the format: item_userId_courseId
 */
export const generateCartItemId = (userId: string, courseId: string): string => {
  return `item_${userId}_${courseId}`;
};

/**
 * Generates a consistent ID for wishlist items
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns A string in the format: wish_userId_courseId
 */
export const generateWishlistItemId = (userId: string, courseId: string): string => {
  return `wish_${userId}_${courseId}`;
};

/**
 * Generates a consistent ID for reviews
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns A string in the format: review_userId_courseId
 */
export const generateReviewId = (userId: string, courseId: string): string => {
  return `review_${userId}_${courseId}`;
};

/**
 * Generates a consistent ID for payments
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns A string in the format: pay_userId_courseId
 */
export const generatePaymentId = (userId: string, courseId: string): string => {
  return `pay_${userId}_${courseId}`;
};

/**
 * Generates a consistent ID for enrollments
 * @param userId - The user ID
 * @param courseId - The course ID
 * @returns A string in the format: enroll_userId_courseId
 */
export const generateEnrollmentId = (userId: string, courseId: string): string => {
  return `enroll_${userId}_${courseId}`;
};

/**
 * Generates a consistent ID for blog posts
 * @param authorId - The author ID
 * @returns A string in the format: blog_authorId_xxxxxxxxxx
 */
export const generateBlogId = (authorId: string): string => {
  const uuid = uuidv4();
  const truncatedUuid = uuid.replace(/-/g, '').substring(0, 10);
  return `blog_${authorId}_${truncatedUuid}`;
};

/**
 * Generates a consistent ID for blog comments
 * @param blogId - The blog ID
 * @param authorId - The author ID
 * @returns A string in the format: comment_blogId_authorId
 */
export const generateBlogCommentId = (blogId: string, authorId: string): string => {
  return `comment_${blogId}_${authorId}`;
};

/**
 * Generates a consistent ID for course sections
 * @param courseId - The course ID
 * @param position - The position of the section
 * @returns A string in the format: section_courseId_position
 */
export const generateSectionId = (courseId: string, position: number): string => {
  return `section_${courseId}_${position}`;
};

/**
 * Generates a consistent ID for chapters
 * @param sectionId - The section ID
 * @param position - The position of the chapter
 * @returns A string in the format: chapter_sectionId_position
 */
export const generateChapterId = (sectionId: string, position: number): string => {
  return `chapter_${sectionId}_${position}`;
}; 