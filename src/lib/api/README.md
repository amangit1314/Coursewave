# API Manager & Services Documentation

This directory contains a comprehensive API management system for the CourseWave frontend application. It provides a centralized way to handle all API calls with proper error handling, authentication, and type safety.

## 🏗️ Architecture

```
src/lib/api/
├── api-manager.ts          # Core API manager with axios
├── services/
│   ├── index.ts           # Service exports
│   ├── auth-service.ts    # Authentication service
│   ├── course-service.ts  # Course management service
│   └── blog-service.ts    # Blog management service
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Basic Usage

```typescript
import { apiManager } from '@/lib/api/api-manager';

// Make a simple GET request
const response = await apiManager.get('/courses');
console.log(response.data); // The actual data
console.log(response.success); // Boolean indicating success
```

### 2. Using Services

```typescript
import { courseService, authService } from '@/lib/api/services';

// Get all courses
const courses = await courseService.getCourses();

// Login user
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### 3. Using React Hooks

```typescript
import { useApiData, useApiSubmit } from '@/hooks/use-api';
import { courseService } from '@/lib/api/services';

function CourseList() {
  const { data: courses, loading, error } = useApiData(
    () => courseService.getCourses(),
    [] // dependencies
  );

  const { execute: createCourse, loading: creating } = useApiSubmit(
    (courseData) => courseService.createCourse(courseData)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {courses?.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
    </div>
  );
}
```

## 📚 API Manager

The `ApiManager` class provides a centralized way to handle HTTP requests with:

- **Authentication**: Automatic token management
- **Error Handling**: Consistent error responses
- **Interceptors**: Request/response middleware
- **File Uploads**: Built-in file upload support
- **Type Safety**: Full TypeScript support

### Configuration

```typescript
import { apiManager } from '@/lib/api/api-manager';

// Set base URL
apiManager.setBaseURL('https://api.coursewave.com');

// Set default headers
apiManager.setDefaultHeaders({
  'X-API-Version': 'v1'
});

// Set auth token
apiManager.setAuthToken('your-jwt-token', true); // true for remember me
```

### HTTP Methods

```typescript
// GET request
const response = await apiManager.get<User>('/users/123');

// POST request
const response = await apiManager.post<User>('/users', userData);

// PUT request
const response = await apiManager.put<User>('/users/123', userData);

// PATCH request
const response = await apiManager.patch<User>('/users/123', { name: 'New Name' });

// DELETE request
const response = await apiManager.delete<void>('/users/123');

// File upload
const response = await apiManager.upload<{ url: string }>(
  '/upload',
  file,
  (progress) => console.log(`Upload: ${progress}%`)
);
```

## 🔧 Services

Services provide domain-specific API methods with proper typing and business logic.

### Auth Service

```typescript
import { authService } from '@/lib/api/services';

// Login
const authResponse = await authService.login({
  email: 'user@example.com',
  password: 'password123',
  rememberMe: true
});

// Register
const authResponse = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});

// Get current user
const user = await authService.getCurrentUser();

// Check if authenticated
if (authService.isAuthenticated()) {
  // User is logged in
}

// Logout
await authService.logout();
```

### Course Service

```typescript
import { courseService } from '@/lib/api/services';

// Get all courses with filters
const courses = await courseService.getCourses({
  search: 'react',
  category: 'web-development',
  level: 'BEGINNER',
  sortBy: 'newest',
  page: 1,
  limit: 12
});

// Get course by ID
const course = await courseService.getCourseById('course-id');

// Get course by slug
const course = await courseService.getCourseBySlug('react-fundamentals');

// Enroll in course
const enrollment = await courseService.enrollInCourse('course-id');

// Get user enrollments
const enrollments = await courseService.getUserEnrollments();

// Update lesson progress
await courseService.updateLessonProgress('course-id', 'lesson-id', true);

// Instructor: Create course
const newCourse = await courseService.createCourse({
  title: 'React Fundamentals',
  description: 'Learn React from scratch',
  price: 99.99,
  isFree: false,
  level: 'BEGINNER',
  categoryIds: ['web-development']
});
```

### Blog Service

```typescript
import { blogService } from '@/lib/api/services';

// Get all blogs
const blogs = await blogService.getBlogs({
  search: 'react',
  category: 'tutorials',
  sortBy: 'popular'
});

// Get blog by slug
const blog = await blogService.getBlogBySlug('react-best-practices');

// Add comment
const comment = await blogService.addBlogComment('blog-id', {
  content: 'Great article!',
  parentId: undefined // for replies
});

// Add reaction
await blogService.addBlogReaction('blog-id', 'LIKE');

// Save blog
await blogService.saveBlog('blog-id');

// Author: Create blog
const newBlog = await blogService.createBlog({
  title: 'React Best Practices',
  content: 'Article content...',
  excerpt: 'Brief description...',
  categoryIds: ['tutorials'],
  isPublished: false
});
```

## 🎣 React Hooks

### useApiData

For data fetching with automatic execution:

```typescript
import { useApiData } from '@/hooks/use-api';

function CourseList() {
  const { data: courses, loading, error, execute: refetch } = useApiData(
    () => courseService.getCourses(),
    [] // dependencies - will refetch when these change
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {courses?.map(course => (
        <div key={course.id}>{course.title}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### useApiSubmit

For form submissions:

```typescript
import { useApiSubmit } from '@/hooks/use-api';

function CreateCourseForm() {
  const { execute: createCourse, loading, error } = useApiSubmit(
    (courseData) => courseService.createCourse(courseData),
    {
      onSuccess: (course) => {
        console.log('Course created:', course);
        // Navigate to course page
      },
      onError: (error) => {
        console.error('Failed to create course:', error);
      }
    }
  );

  const handleSubmit = async (formData) => {
    await createCourse(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Course'}
      </button>
    </form>
  );
}
```

### useApiPagination

For paginated data:

```typescript
import { useApiPagination } from '@/hooks/use-api';

function PaginatedCourseList() {
  const {
    data: courses,
    loading,
    hasMore,
    loadNextPage,
    page,
    refresh
  } = useApiPagination(
    (page, limit) => courseService.getCourses({ page, limit }),
    1, // initial page
    12 // initial limit
  );

  return (
    <div>
      <div className="grid">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {hasMore && (
        <button onClick={loadNextPage} disabled={loading}>
          Load More
        </button>
      )}
      
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

## 🔒 Authentication

The API manager automatically handles authentication:

1. **Token Storage**: Tokens are stored in localStorage/sessionStorage
2. **Automatic Headers**: Authorization headers are added automatically
3. **Token Refresh**: Automatic token refresh on 401 errors
4. **Logout**: Automatic cleanup on logout

```typescript
// Login automatically stores the token
await authService.login(credentials);

// All subsequent requests include the token
const courses = await courseService.getCourses();

// Logout clears all tokens
await authService.logout();
```

## 🚨 Error Handling

All API calls return consistent error responses:

```typescript
try {
  const response = await courseService.getCourseById('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status); // HTTP status code
    console.log(error.message); // Error message
    console.log(error.code); // Error code
    console.log(error.data); // Additional error data
  }
}
```

## 📝 TypeScript Support

Full TypeScript support with proper typing:

```typescript
// API responses are properly typed
const response: ApiResponse<Course> = await courseService.getCourseById('123');
const course: Course = response.data!;

// Paginated responses
const response: PaginatedResponse<Course> = await courseService.getCourses();
const courses: Course[] = response.data!;
const pagination = response.pagination;

// Service methods are typed
const createCourse = async (data: CreateCourseRequest): Promise<ApiResponse<Course>>
```

## 🧪 Testing

Services can be easily mocked for testing:

```typescript
// Mock the API manager
jest.mock('@/lib/api/api-manager', () => ({
  apiManager: {
    get: jest.fn(),
    post: jest.fn(),
    // ... other methods
  }
}));

// Test service methods
test('should fetch courses', async () => {
  const mockCourses = [{ id: '1', title: 'React Course' }];
  apiManager.get.mockResolvedValue({
    success: true,
    data: mockCourses
  });

  const result = await courseService.getCourses();
  expect(result.data).toEqual(mockCourses);
});
```

## 🔧 Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5002
```

### Custom Interceptors

```typescript
import { apiManager } from '@/lib/api/api-manager';

// Add request interceptor
apiManager.addRequestInterceptor({
  onRequest: (config) => {
    // Add custom headers
    config.headers['X-Custom-Header'] = 'value';
    return config;
  }
});

// Add response interceptor
apiManager.addResponseInterceptor({
  onResponse: (response) => {
    // Log responses
    console.log('API Response:', response.data);
    return response;
  }
});
```

## 📚 Best Practices

1. **Use Services**: Always use service classes instead of direct API calls
2. **Handle Errors**: Always handle API errors gracefully
3. **Type Safety**: Use TypeScript interfaces for all API responses
4. **Loading States**: Show loading states during API calls
5. **Optimistic Updates**: Use optimistic updates for better UX
6. **Caching**: Implement caching for frequently accessed data
7. **Pagination**: Use pagination for large datasets
8. **Error Boundaries**: Wrap components in error boundaries

## 🤝 Contributing

When adding new services:

1. Create a new service file in `services/`
2. Define TypeScript interfaces for request/response types
3. Implement service methods with proper error handling
4. Export the service from `services/index.ts`
5. Add tests for the service
6. Update this documentation

## 📄 License

This API management system is part of the CourseWave project. 