'use client';

import React, { useState } from 'react';
import { courseService, Course, CourseQueryParams } from '@/lib/api/services';
import { useApiData, useApiPagination } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Filter } from 'lucide-react';

export default function CourseListExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Query parameters
  const queryParams: CourseQueryParams = {
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    level: selectedLevel || undefined,
    sortBy: 'newest',
    limit: 12,
  };

  // Use the API hook for fetching courses
  const {
    data: courses,
    loading,
    error,
    execute: refetchCourses,
  } = useApiData(
    () => courseService.getCourses(queryParams),
    [searchTerm, selectedCategory, selectedLevel]
  );

  // Use pagination hook for infinite scroll
  const {
    data: paginatedCourses,
    loading: paginationLoading,
    hasMore,
    loadNextPage,
    page,
  } = useApiPagination(
    (page, limit) => courseService.getCourses({ ...queryParams, page, limit }),
    1,
    12
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  const handleLoadMore = () => {
    loadNextPage();
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold">Error loading courses</h3>
          <p className="text-sm">{error.message}</p>
        </div>
        <Button onClick={() => refetchCourses()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="data-science">Data Science</SelectItem>
              <SelectItem value="design">Design</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Courses Grid */}
      {!loading && courses && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleLoadMore}
                disabled={paginationLoading}
                variant="outline"
                className="w-full max-w-xs"
              >
                {paginationLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More Courses'
                )}
              </Button>
            </div>
          )}

          {/* No Results */}
          {courses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search criteria or browse all courses.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Paginated Courses (Alternative display) */}
      {!loading && paginatedCourses && paginatedCourses.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">All Courses (Page {page})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCourses.map((course: Course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        {course.imageUrl ? (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        {course.isFree && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            Free
          </Badge>
        )}
      </div>
      
      <CardHeader className="p-4">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {course.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {course.description}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="space-y-3">
          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {course.instructor.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {course.instructor.name}
              </span>
            </div>
          )}

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{course.totalStudents} students</span>
              <span>{course.totalLessons} lessons</span>
            </div>
            {course.averageRating && (
              <div className="flex items-center space-x-1">
                <span>★</span>
                <span>{course.averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Categories */}
          {course.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {course.categories.slice(0, 2).map((category) => (
                <Badge key={category.id} variant="secondary" className="text-xs">
                  {category.name}
                </Badge>
              ))}
              {course.categories.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{course.categories.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {course.isFree ? (
                <span className="text-lg font-bold text-green-600">Free</span>
              ) : (
                <>
                  {course.discountPercentage && (
                    <span className="text-sm text-gray-500 line-through">
                      ${course.price}
                    </span>
                  )}
                  <span className="text-lg font-bold">
                    ${course.discountPercentage 
                      ? (course.price! * (1 - course.discountPercentage / 100)).toFixed(2)
                      : course.price
                    }
                  </span>
                </>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 