// ============================================================================
// COMMON TYPES & UTILITY TYPES
// Central location for shared types, enums, and utility types
// ============================================================================

// === String Literal Enums for Type Safety ===

export enum UserRole {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR',
    ADMIN = 'ADMIN',
}

export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    ALL_LEVELS = 'ALL_LEVELS',
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
}

export enum AttachmentType {
    IMAGE = 'IMAGE',
    DOC = 'DOC',
    PDF = 'PDF',
    VIDEO = 'VIDEO',
    OTHER = 'OTHER',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    CANCELED = 'CANCELED',
    PAST_DUE = 'PAST_DUE',
    EXPIRED = 'EXPIRED',
}

// === Error Handling Types ===

/**
 * Standard error response structure from API
 */
export interface ErrorResponse {
    message: string;
    code?: string;
    status: number;
    details?: Record<string, unknown>;
}

/**
 * Type for error handler callbacks
 */
export type ApiErrorHandler = (error: ErrorResponse) => void;

/**
 * Utility to extract error message safely
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message: unknown }).message);
    }
    return 'An unknown error occurred';
}

// === Generic Utility Types ===

/**
 * Make all properties nullable
 */
export type Nullable<T> = T | null;

/**
 * Make all properties optional
 */
export type Optional<T> = T | undefined;

/**
 * Standard ID type (string-based for UUIDs/MongoDB ObjectIds)
 */
export type ID = string;

/**
 * ISO 8601 timestamp string
 */
export type Timestamp = string;

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys optional  
 */
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// === Pagination Types ===

/**
 * Pagination metadata for API responses
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * Generic paginated response wrapper
 */
export interface PaginatedData<T> {
    items: T[];
    pagination: PaginationMeta;
}

// === Loading & State Types ===

/**
 * Standard loading state for async operations
 */
export interface LoadingState {
    loading: boolean;
    error: string | null;
}

/**
 * Extended loading state with success tracking
 */
export interface AsyncState<T = void> extends LoadingState {
    data: T | null;
    success: boolean;
}

// === Base Entity Types ===

/**
 * Common fields for all entities
 */
export interface BaseEntity {
    id: ID;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Entity with soft delete support
 */
export interface SoftDeletableEntity extends BaseEntity {
    deletedAt: Nullable<Timestamp>;
    isDeleted: boolean;
}

// === Form & Input Types ===

/**
 * Standard form field error
 */
export interface FieldError {
    field: string;
    message: string;
}

/**
 * Form validation result
 */
export interface ValidationResult {
    valid: boolean;
    errors: FieldError[];
}

// === Note Types (for course notes, chapter notes, etc.) ===

export interface Note extends BaseEntity {
    title: string;
    content: string;
    userId: ID;
    courseId?: ID;
    chapterId?: ID;
}

export interface ChapterNote extends Note {
    chapterId: ID;
    courseId: ID;
    timestamp?: number; // Video timestamp if applicable
}

// === Instructor Preference Types (placeholder for future implementation) ===

/**
 * Instructor preferences structure
 * Instructor preferences structure
 */
export interface InstructorPreference {
    key: string;
    value: string | number | boolean;
    category?: 'notification' | 'display' | 'privacy' | 'other';
}
