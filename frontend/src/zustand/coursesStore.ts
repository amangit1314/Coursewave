import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Course } from "@/types/course-details-api-response";
import { courseService } from "@/lib/api/services";

type LoadingState = {
  loading: boolean;
  error: string | null;
};

type CoursesState = {
  courses: Course[];
  filteredCourses: Course[];
  course: Course | null;
  categories: any[];
  sections: any[];
  chapters: any[];
  attachments: any[];
  courseProgress: any | null;
  reviews: any[];
  enrollments: any[];
  purchases: any[];
  payments: any[];
  instructor: any | null;
  loadingState: LoadingState;
  selectedCategory: string | null;
  queryString: string;
};

type CoursesActions = {
  fetchCourses: () => Promise<void>;
  setCategory: (category: string | null) => void;
  setQueryString: (query: string) => void;
  filterCourses: () => void;
  fetchCourse: (courseId: string) => Promise<void>;
  fetchCourseCategories: (courseId: string) => Promise<void>;
  fetchCourseSections: (courseId: string) => Promise<void>;
  fetchCourseSectionChapters: (
    courseId: string,
    sectionId: string
  ) => Promise<void>;
  fetchCourseAttachments: (courseId: string) => Promise<void>;
  fetchCourseProgress: (courseId: string, userId: string) => Promise<void>;
  updateCourseChapterProgress: (
    userId: string,
    courseId: string,
    chapterId: string
  ) => Promise<void>;
  fetchCourseReviews: (courseId: string) => Promise<void>;
  fetchCourseInstructor: (courseId: string) => Promise<void>;
  saveCourse: (courseId: string, userId: string) => Promise<void>;
  unsaveCourse: (courseId: string, userId: string) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
};

export const useCoursesStore = create<CoursesState & CoursesActions>()(
  persist(
    (set, get) => ({
      courses: [],
      filteredCourses: [],
      course: null,
      categories: [],
      sections: [],
      chapters: [],
      muxDatas: [],
      cloudinaryDatas: [],
      attachments: [],
      courseProgress: null,
      reviews: [],
      enrollments: [],
      purchases: [],
      payments: [],
      instructor: null,
      instructorEarningsFromThisCourse: [],
      loadingState: { loading: false, error: null },
      selectedCategory: null,
      queryString: "",

      fetchCourses: async () => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourses();
          set({
            courses: response,
            filteredCourses: response,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch courses",
            },
          });
        }
      },

      setCategory: (category: string | null) => {
        set({ selectedCategory: category });
        get().filterCourses();
      },

      setQueryString: (query: string) => {
        set({ queryString: query });
        get().filterCourses();
      },

      filterCourses: () => {
        const { courses, selectedCategory, queryString } = get();
        let filtered = [...courses];

        if (selectedCategory) {
          filtered = filtered.filter(
            (course) =>
              course.categories &&
              Array.isArray(course.categories) &&
              course.categories.some(
                (cat: any) => cat && cat.name && cat.name === selectedCategory
              )
          );
        }

        if (queryString) {
          const lowerCaseQuery = queryString.toLowerCase();
          filtered = filtered.filter((course) => {
            const matchesTitle = course.title
              ?.toLowerCase()
              .includes(lowerCaseQuery);
            const matchesCategory = course.categories?.some(
              (category: any) =>
                category &&
                category.name &&
                category.name.toLowerCase().includes(lowerCaseQuery)
            );
            return matchesTitle || matchesCategory;
          });
        }

        set({ filteredCourses: filtered });
      },

      fetchCourse: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseById(courseId);
          set({
            course: response.data as Course,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch course",
            },
          });
        }
      },

      fetchCourseCategories: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseCategories(courseId);
          set({
            categories: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch categories",
            },
          });
        }
      },

      fetchCourseSections: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseSections(courseId);
          console.log(
            "Sections after fetching: ",
            JSON.stringify(response.data)
          );
          set({
            sections: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch sections",
            },
          });
        }
      },

      fetchCourseSectionChapters: async (
        courseId: string,
        sectionId: string
      ) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseSectionChapters(
            courseId,
            sectionId
          );
          set({
            chapters: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch section chapters",
            },
          });
        }
      },

      fetchCourseChapters: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseChapters(courseId);
          set({
            chapters: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch chapters",
            },
          });
        }
      },

      fetchCourseAttachments: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseAttachments(courseId);
          set({
            attachments: response.data?.attachments,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch attachments",
            },
          });
        }
      },

      fetchCourseProgress: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseProgress(courseId);
          set({
            courseProgress: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch course progress",
            },
          });
        }
      },

      updateCourseChapterProgress: async (
        userId: string,
        courseId: string,
        chapterId: string
      ) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          await courseService.updateChapterProgress(courseId, chapterId, true);
          const progressResponse =
            await courseService.getCourseProgress(courseId);
          set({
            courseProgress: progressResponse.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to update progress",
            },
          });
        }
      },

      fetchCourseReviews: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseReviews(courseId);
          set({
            reviews: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch reviews",
            },
          });
        }
      },

      // fetchCourseEnrollments: async (courseId: string) => {
      //   set({ loadingState: { loading: true, error: null } });
      //   try {
      //     const response = await courseService.getCourseEnrollments(courseId);
      //     set({
      //       enrollments: response.data,
      //       loadingState: { loading: false, error: null }
      //     });
      //   } catch (error: any) {
      //     set({
      //       loadingState: {
      //         loading: false,
      //         error: error.message || "Failed to fetch enrollments"
      //       }
      //     });
      //   }
      // },

      // fetchCoursePurchases: async (courseId: string) => {
      //   set({ loadingState: { loading: true, error: null } });
      //   try {
      //     const response = await courseService.getCoursePurchases(courseId);
      //     set({
      //       purchases: response.data,
      //       loadingState: { loading: false, error: null }
      //     });
      //   } catch (error: any) {
      //     set({
      //       loadingState: {
      //         loading: false,
      //         error: error.message || "Failed to fetch purchases"
      //       }
      //     });
      //   }
      // },

      // fetchCoursePayments: async (courseId: string) => {
      //   set({ loadingState: { loading: true, error: null } });
      //   try {
      //     const response = await courseService.getCoursePayments(courseId);
      //     set({
      //       payments: response.data,
      //       loadingState: { loading: false, error: null }
      //     });
      //   } catch (error: any) {
      //     set({
      //       loadingState: {
      //         loading: false,
      //         error: error.message || "Failed to fetch payments"
      //       }
      //     });
      //   }
      // },

      fetchCourseInstructor: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          const response = await courseService.getCourseInstructor(courseId);
          set({
            instructor: response.data,
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to fetch instructor",
            },
          });
        }
      },

      // fetchInstructorEarningsFromThisCourse: async (courseId: string) => {
      //   set({ loadingState: { loading: true, error: null } });
      //   try {
      //     const response = await courseService.getInstructorEarnings(courseId);
      //     set({
      //       instructorEarningsFromThisCourse: response.data,
      //       loadingState: { loading: false, error: null }
      //     });
      //   } catch (error: any) {
      //     set({
      //       loadingState: {
      //         loading: false,
      //         error: error.message || "Failed to fetch earnings"
      //       }
      //     });
      //   }
      // },

      saveCourse: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          await courseService.saveCourse(courseId);
          set({
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to save course",
            },
          });
        }
      },

      unsaveCourse: async (courseId: string, userId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          await courseService.unsaveCourse(courseId);
          set({
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to save course",
            },
          });
        }
      },

      enrollInCourse: async (courseId: string) => {
        set({ loadingState: { loading: true, error: null } });
        try {
          await courseService.enrollInCourse(courseId);
          set({
            loadingState: { loading: false, error: null },
          });
        } catch (error: any) {
          set({
            loadingState: {
              loading: false,
              error: error.message || "Failed to enroll in course",
            },
          });
        }
      },
    }),
    {
      name: "Coursewave-Courses-Store",
    }
  )
);
