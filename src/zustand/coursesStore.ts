import { create } from "zustand";
import {
  Category,
  Chapter,
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

type LoadingState = {
  loading: boolean;
  error: string | null;
};

type CoursesState = {
  // courses
  courses: Course[];
  filteredCourses: Course[];

  // for particular course
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

  // tracking
  loadingState: LoadingState;

  // to filter
  selectedCategory: string | null;
  queryString: string;
};

type CoursesActions = {
  fetchCourses: () => Promise<void>;
  setCategory: (category: string | null) => void;
  setQueryString: (query: string) => void;
  filterCourses: () => void;

  // course actions
  fetchCourse: (courseId: string) => Promise<void>;
  fetchCourseCategories: (courseId: string) => Promise<void>;
  fetchCourseSections: (courseId: string) => Promise<void>;
  fetchCourseSectionChapters: (
    courseId: string,
    sectionId: string,
  ) => Promise<void>;
  fetchCourseChapters: (courseId: string) => Promise<void>;
  fetchCourseMuxDatas: (courseId: string) => Promise<void>;
  fetchCourseAttachments: (courseId: string) => Promise<void>;
  fetchCourseProgress: (courseId: string, userId: string) => Promise<void>;
  fetchCourseReviews: (courseId: string) => Promise<void>;
  fetchCourseEnrollments: (courseId: string) => Promise<void>;
  fetchCoursePurchases: (courseId: string) => Promise<void>;
  fetchCoursePayments: (courseId: string) => Promise<void>;
  fetchCourseInstructor: (courseId: string) => Promise<void>;
  fetchInstructorEarningsFromThisCourse: (courseId: string) => Promise<void>;
  saveCourse: (courseId: string, userId: string) => Promise<void>;
  updateCourseProgress: (
    userId: string,
    courseId: string,
    chapterId: string,
  ) => Promise<void>;
};

export const useCoursesStore = create<CoursesState & CoursesActions>()(
  (set, get) => ({
    // courses
    courses: [],
    filteredCourses: [],

    // for particular course
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

    // tracking

    loadingState: {
      loading: false,
      error: null,
    },

    // to filter
    selectedCategory: null,
    queryString: "",

    // * -------------------------------- courses methods -------------------------------------
    fetchCourses: async () => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });

        const response = await fetch(
          process.env.ENVIRONMENT === "DEVELOPMENT"
            ? "/api/courses"
            : `api/courses`,
        );

        if (!response.ok) {
          set({
            loadingState: {
              loading: false,
              error: "Failed to fetch courses in response not ok case ...",
            },
          });
        }

        const data = await response.json();
        const courses: Course[] = data?.data! as Course[];

        set({ courses, loadingState: { loading: false, error: null } });

        // Automatically filter courses after fetching
        get().filterCourses();
      } catch (error: any) {
        console.error("Error fetching courses:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
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

      let filtered = courses;

      if (selectedCategory) {
        filtered = filtered.filter(
          (course) => course.categoryId === selectedCategory,
        );
      }

      if (queryString) {
        const lowerCaseQuery = queryString.toLowerCase();
        filtered = filtered.filter((course) => {
          const matchesTitle = course.courseTitle
            .toLowerCase()
            .includes(lowerCaseQuery);
          const matchesCategory = course.courseCategories.some((category) =>
            category.toLowerCase().includes(lowerCaseQuery),
          );

          // Additional filtering logic can be added here for other fields
          return matchesTitle || matchesCategory;
        });
      }

      set({ filteredCourses: filtered });
    },

    // * -------------------------------- course methods ---------------------------------------

    fetchCourse: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });

        const url =
          process.env.ENVIRONMENT === "DEVELOPMENT"
            ? `/api/courses/${courseId}`
            : `api/courses/${courseId}`;
        const response = await fetch(url);
        if (!response.ok) {
          set({
            loadingState: {
              loading: false,
              error: "Failed to fetch course info in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          course: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course info:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseCategories: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/categories`);
        if (!response.ok) {
          console.error("Failed to fetch course categories");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course categories in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          categories: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course categories:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseSections: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/sections`);
        if (!response.ok) {
          console.error("Failed to fetch course sections");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course sections in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          sections: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course sections:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseSectionChapters: async (courseId: string, sectionId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(
          `/api/courses/${courseId}/sections/${sectionId}/chapters`,
        );
        if (!response.ok) {
          console.error("Failed to fetch course section chapters");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course section chapters in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          chapters: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course section chapters:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseChapters: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/chapters`);
        if (!response.ok) {
          console.error("Failed to fetch course chapters");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course chapters in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          chapters: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course chapters:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseMuxDatas: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/muxDatas`);
        if (!response.ok) {
          console.error("Failed to fetch course mux data");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course mux data in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          muxDatas: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course mux data:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseAttachments: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/attachments`);
        if (!response.ok) {
          console.error("Failed to fetch course attachments");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course attachments in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          attachments: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course attachments:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseProgress: async (courseId: string, userId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(
          `/api/profile/${userId}/enrolledCourses/${courseId}/courseProgress?include=chapterProgress`,
        );
        if (!response.ok) {
          console.error("Failed to fetch course progress");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course progress in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          courseProgress: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course progress:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseReviews: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/reviews`);
        if (!response.ok) {
          console.error("Failed to fetch course review");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course review in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          reviews: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course reviews:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseEnrollments: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/enrollments`);
        if (!response.ok) {
          console.error("Failed to fetch course enrollments");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course enrollmentsin coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          enrollments: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course enrollments:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCoursePurchases: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/purchases`);
        if (!response.ok) {
          console.error("Failed to fetch course purchases");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course purchases in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          purchases: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course purchases:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCoursePayments: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/payments`);
        if (!response.ok) {
          console.error("Failed to fetch course payments");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course payments in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          payments: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course payments:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchCourseInstructor: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/courses/${courseId}/instructor`);
        if (!response.ok) {
          console.error("Failed to fetch course instructor");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch course instructor in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          instructor: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching course instructor:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    fetchInstructorEarningsFromThisCourse: async (courseId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(
          `/api/courses/${courseId}/instructorEarnings`,
        );
        if (!response.ok) {
          console.error("Failed to fetch instructor earnings");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to fetch instructor earnings in coursesStore.ts file ...",
            },
          });
        }
        const data = await response.json();
        set({
          instructorEarningsFromThisCourse: data,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error fetching instructor earnings:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    saveCourse: async (courseId: string, userId: string) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(`/api/profile/${userId}/savedCourses`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        if (!response.ok) {
          console.error("Failed to save course ");
          set({
            loadingState: {
              loading: false,
              error: "Failed to save course in coursesStore.ts file ...",
            },
          });
        }
        set({
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error saving course:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },

    updateCourseProgress: async (
      userId: string,
      courseId: string,
      chapterId: string,
    ) => {
      try {
        set({
          loadingState: {
            loading: true,
            error: null,
          },
        });
        const response = await fetch(
          `/api/profile/${userId}/enrolledCourses/${courseId}/courseProgress/chapters/${chapterId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isCompleted: true }),
          },
        );
        if (!response.ok) {
          console.error("Failed to update cahpter progress ");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to update cahpter progress in coursesStore.ts file ...",
            },
          });
        }

        // Recalculate and update course progress (implementation depends on your API)
        const updatedChapterProgress = await response.json();
        const courseProgressResponse = await fetch(
          `/api/profile/${userId}/enrolledCourses/${courseId}/courseProgress`,
          {
            method: "PATCH",
          },
        );
        if (!courseProgressResponse.ok) {
          console.error("Failed to update course progress ");
          set({
            loadingState: {
              loading: false,
              error:
                "Failed to update course progress in coursesStore.ts file ...",
            },
          });
        }
        const updatedCourseProgress = await courseProgressResponse.json();
        set({
          courseProgress: updatedCourseProgress,
          loadingState: {
            loading: false,
            error: null,
          },
        });
      } catch (error: any) {
        console.error("Error updating course progress:", error);
        set({
          loadingState: {
            loading: false,
            error: error.message,
          },
        });
      }
    },
  }),
);
