import { absoluteUrl } from '@/utils/utils';
import { ChapterProgress, CourseProgress } from '@prisma/client';
import { create } from 'zustand';

interface CourseProgressState {
  courseProgress: CourseProgress | null;
  updateCourseProgress: (userId: string, courseId: string, chapterId: string,
    // progress: number
  ) => Promise<void>;
  fetchCourseProgress: (userId: string, courseId: string) => Promise<void>;
}

type CourseProgressWithChapters = CourseProgress & { chapterProgress: ChapterProgress[] };

const useCourseProgressStore = create<CourseProgressState>((set) => ({
  courseProgress: null,
  updateCourseProgress: async (userId: string, courseId: string, chapterId: string,
    // progress: number
  ) => {
    try {

      // Update chapter completion status
      const response = await fetch(
        (`api/profile/${userId}/enrolledCourses/${courseId}/courseProgress/chapters/${chapterId}`),
        {
          method: 'PATCH',
          body: JSON.stringify({ isCompleted: true }),
        }
      );

      const updatedChapterProgress = await response.json();

      // Recalculate and update course progress (implementation depends on your API)
      const courseProgressResponse = await fetch(
        (`/api/profile/${userId}/enrolledCourses/${courseId}/courseProgress`),
        {
          method: 'PATCH',
        }
      );
      const updatedCourseProgress = await courseProgressResponse.json();

      set({ courseProgress: updatedCourseProgress });

    } catch (error) {
      console.error("Error updating course progress:", error);
    }
  },
  fetchCourseProgress: async (userId: string, courseId: string) => {
    try {
      const response = await fetch((`/api/profile/${userId}/enrolledCourses/${courseId}/courseProgress?include=chapterProgress`));
      const data = await response.json();

      // Ensure data structure matches CourseProgressWithChapters
      const courseProgressWithChapters = data as CourseProgressWithChapters;
      set({ courseProgress: courseProgressWithChapters });

      // set({ courseProgress: data });
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  },
}));

export default useCourseProgressStore;