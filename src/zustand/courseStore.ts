import { absoluteUrl } from "@/utils/utils";
import {
  Category,
  Chapter,
  ChapterProgress,
  Course,
  CourseAttachment,
  CourseProgress,
  CourseSection,
  Enrollment,
  Instructor,
  InstructorEarning,
  MuxData,
  Payment,
  Purchase,
  Review,
} from "@prisma/client";
import { create } from "zustand";

type CourseState = {
  course: Course | null;
  categories: Category[];
  sections: CourseSection[];
  chapters: Chapter[];
  muxDatas: MuxData[];
  attachments: CourseAttachment[];
  courseProgress: CourseProgress | null;
  reviews: Review[];
  enrollments: Enrollment[];
  purchases: Purchase[];
  payments: Payment[];
  instructor: Instructor | null;
  instructorEarningsFromThisCourse: InstructorEarning[];
  loading: boolean;
  error: string | null;
};

type CourseActions = {
  fetchCourse: (courseId: string) => Promise<void>;
  fetchCourseCategories: (courseId: string) => Promise<void>;
  fetchCourseSections: (courseId: string) => Promise<void>;
  fetchCourseSectionChapters: (
    courseId: string,
    sectionId: string
  ) => Promise<void>;
  fetchCourseChapters: (courseId: string) => Promise<void>;
  fetchCourseMuxDatas: (courseId: string) => Promise<void>;
  fetchCourseAttachments: (courseId: string) => Promise<void>;
  fetchCourseProgress: (courseId: string, userId: string) => Promise<void>;
  fetchCourseReviews: (courseId: string) => Promise<void>;
  fetchCourseEnrollements: (courseId: string) => Promise<void>;
  fetchCoursePurchases: (courseId: string) => Promise<void>;
  fetchCoursePayments: (courseId: string) => Promise<void>;
  fetchCourseInstructor: (courseId: string) => Promise<void>;
  fetchInstructorEarningsFromThisCourse: (courseId: string) => Promise<void>;

  saveCourse: (courseId: string, userId: string) => Promise<void>;
  updateCourseProgress: (
    userId: string,
    courseId: string,
    chapterId: string
  ) => Promise<void>;
};

type CourseProgressWithChapters = CourseProgress & {
  chapterProgress: ChapterProgress[];
};

const useCourseStore = create<CourseState & CourseActions>()((set) => ({
  course: null,
  categories: [],
  sections: [],
  chapters: [],
  muxDatas: [],
  attachments: [],
  courseProgress: null,
  reviews: [],
  enrollments: [],
  purchases: [],
  payments: [],
  instructor: null,
  instructorEarningsFromThisCourse: [],
  loading: false,
  error: null,
  fetchCourse: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(
        `api/courses/${courseId}`
        // process.env.ENVIRONMENT! === "DEVELOPMENT"
        //   ? absoluteUrl(`/api/courses/${courseId}`)
        //   : `api/courses/${courseId}`
      );

      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch course info ..." });
      }

      const data = await response.json();
      const course: Course = data?.data as Course;
      set({ course: course, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course info in @zustand/courseStore.ts:", error);
      set({ loading: false, error: error.message });
    }
  },
  fetchCourseCategories: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/categories`);

      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch course info ..." });
      }

      const data = await response.json();
      const categories: Category[] = data?.data;

      set({ categories: categories, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course info:", error);
      set({ loading: false, error: error.message });
    }
  },

  fetchCourseSections: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/sections`);

      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch course sections ..." });
      }

      const data = await response.json();
      const sections: CourseSection[] = data?.data;

      set({ sections: sections, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course sections:", error);
      set({ loading: false, error: error.message });
    }
  },

  // TODO: SEE HOW YOU WILL DO THIS
  fetchCourseSectionChapters: async (courseId: string, sectionId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await fetch(
        `api/courses/${courseId}/sections/${sectionId}/chapters`
      );
      if (!response.ok) {
        set({
          loading: false,
          error: "Failed to fetch course section chapters ...",
        });
      }
      const data = await response.json();
      const chapters: Chapter[] = data?.data;
      set({ chapters: chapters, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course section chapters:", error);
      set({ loading: false, error: error.message });
    }
  },

  fetchCourseChapters: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/chapters`);

      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch course chapters ..." });
      }

      const data = await response.json();
      const chapters: Chapter[] = data?.data;

      set({ chapters: chapters, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course chapters:", error);
      set({ loading: false, error: error.message });
    }
  },

  // TODO: SEE HOW YOU WILL DO THIS
  fetchCourseMuxDatas: async (courseId: string) => {},
  fetchCourseAttachments: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/attachments`);

      if (!response.ok) {
        set({
          loading: false,
          error: "Failed to fetch course attachments ...",
        });
      }

      const data = await response.json();
      const attachments: CourseAttachment[] = data?.data;

      set({ attachments: attachments, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course attachments:", error);
      set({ loading: false, error: error.message });
    }
  },
  // TODO: SEE HOW YOU WILL DO THIS
  updateCourseProgress: async (
    userId: string,
    courseId: string,
    chapterId: string
    // progress: number
  ) => {
    try {
      // Update chapter completion status
      const response = await fetch(
        `api/profile/${userId}/enrolledCourses/${courseId}/courseProgress/chapters/${chapterId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ isCompleted: true }),
        }
      );

      const updatedChapterProgress = await response.json();

      // Recalculate and update course progress (implementation depends on your API)
      const courseProgressResponse = await fetch(
        `api/profile/${userId}/enrolledCourses/${courseId}/courseProgress`,
        {
          method: "PATCH",
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
      const response = await fetch(
        `api/profile/${userId}/enrolledCourses/${courseId}/courseProgress?include=chapterProgress`
      );
      const data = await response.json();

      // Ensure data structure matches CourseProgressWithChapters
      const courseProgressWithChapters = data;
      set({ courseProgress: courseProgressWithChapters });

      // set({ courseProgress: data });
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  },
  fetchCourseReviews: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/reviews`);

      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch course reviews ..." });
      }

      const data = await response.json();
      const reviews: Review[] = data?.data;

      set({ reviews: reviews, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course reviews:", error);
      set({ loading: false, error: error.message });
    }
  },
  fetchCourseEnrollements: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/enrollments`);

      if (!response.ok) {
        set({
          loading: false,
          error: "Failed to fetch course enrollments ...",
        });
      }

      const data = await response.json();
      const enrollments: Enrollment[] = data?.data;

      set({ enrollments: enrollments, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course enrollments:", error);
      set({ loading: false, error: error.message });
    }
  },
  fetchCoursePurchases: async (courseId: string) => {},
  fetchCoursePayments: async (courseId: string) => {},
  fetchCourseInstructor: async (courseId: string) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`api/courses/${courseId}/chapters`);

      if (!response.ok) {
        set({ loading: false, error: "Failed to fetch course chapters ..." });
      }

      const data = await response.json();
      const chapters: Chapter[] = data?.data;

      set({ chapters: chapters, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching course chapters:", error);
      set({ loading: false, error: error.message });
    }
  },
  fetchInstructorEarningsFromThisCourse: async (courseId: string) => {},
  saveCourse: async (courseId: string, userId: string) => {},
}));

export default useCourseStore;
