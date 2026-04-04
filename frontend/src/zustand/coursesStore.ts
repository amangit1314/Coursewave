/**
 * ------------------------------------------------------------------------------------------------------------
 */

"use client";


import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "./safe-storage";
import { Chapter, Course, Section } from "@/types/course-details-api-response";

type CoursesState = {
  courses: Course[];
  filteredCourses: Course[];
  selectedCourse: Course | null;
  selectedCategory: string | null;
  queryString: string;

  activeSectionIndex: number;
  activeChapterIndex: number;
};

type CoursesActions = {
  setCourses: (courses: Course[]) => void;
  selectCourse: (course: Course | null) => void;
  setCategory: (category: string | null) => void;
  setQueryString: (query: string) => void;
  filterCourses: () => void;

  // New actions for section and chapter navigation
  setActiveSectionIndex: (index: number) => void;
  setActiveChapterIndex: (index: number) => void;
  nextChapter: () => void;
  previousChapter: () => void;

  nextSection: () => void;
  previousSection: () => void;

  // Helper getters
  getActiveSection: () => Section | null;
  getActiveChapter: () => Chapter | null;
  getAboutChapter: () => string;
};

export const useCoursesStore = create<CoursesState & CoursesActions>()(
  persist(
    (set, get) => ({
      courses: [],
      filteredCourses: [],
      selectedCourse: null,
      selectedCategory: null,
      queryString: "",

      // Initialize active indices
      activeSectionIndex: 0,
      activeChapterIndex: 0,

      setCourses: (courses) => set({ courses, filteredCourses: courses }),

      selectCourse: (course) => set({ selectedCourse: course }),

      setCategory: (category) => {
        set({ selectedCategory: category });
        get().filterCourses();
      },

      setQueryString: (query) => {
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
                (cat: any) => cat?.name === selectedCategory
              )
          );
        }

        if (queryString) {
          const lowerCaseQuery = queryString.toLowerCase();
          filtered = filtered.filter((course) => {
            const matchesTitle = course.title
              ?.toLowerCase()
              .includes(lowerCaseQuery);
            const matchesCategory = course.categories?.some((category: any) =>
              category?.name?.toLowerCase().includes(lowerCaseQuery)
            );
            return matchesTitle || matchesCategory;
          });
        }

        set({ filteredCourses: filtered });
      },

      // New actions for section and chapter management
      setActiveSectionIndex: (index) => {
        set({
          activeSectionIndex: index,
          // Reset chapter index when section changes
          activeChapterIndex: 0,
        });
      },

      setActiveChapterIndex: (index) => {
        set({ activeChapterIndex: index });
      },

      nextChapter: () => {
        const { activeSectionIndex, activeChapterIndex, selectedCourse } =
          get();
        if (!selectedCourse?.sections) return;

        const currentSection = selectedCourse.sections[activeSectionIndex];
        if (!currentSection?.Chapter) return;

        // If there's a next chapter in current section
        if (activeChapterIndex < currentSection.Chapter.length - 1) {
          set({ activeChapterIndex: activeChapterIndex + 1 });
        }
        // Otherwise, move to first chapter of next section
        else if (activeSectionIndex < selectedCourse.sections.length - 1) {
          set({
            activeSectionIndex: activeSectionIndex + 1,
            activeChapterIndex: 0,
          });
        }
      },

      previousChapter: () => {
        const { activeSectionIndex, activeChapterIndex, selectedCourse } =
          get();
        if (!selectedCourse?.sections) return;

        // If there's a previous chapter in current section
        if (activeChapterIndex > 0) {
          set({ activeChapterIndex: activeChapterIndex - 1 });
        }
        // Otherwise, move to last chapter of previous section
        else if (activeSectionIndex > 0) {
          const previousSection =
            selectedCourse.sections[activeSectionIndex - 1];
          const lastChapterIndex = previousSection?.Chapter?.length
            ? previousSection.Chapter.length - 1
            : 0;
          set({
            activeSectionIndex: activeSectionIndex - 1,
            activeChapterIndex: lastChapterIndex,
          });
        }
      },

      nextSection: () => {
        const { activeSectionIndex, selectedCourse } = get();
        if (!selectedCourse?.sections) return;

        if (activeSectionIndex < selectedCourse.sections.length - 1) {
          set({
            activeSectionIndex: activeSectionIndex + 1,
            activeChapterIndex: 0,
          });
        }
      },

      previousSection: () => {
        const { activeSectionIndex } = get();
        if (activeSectionIndex > 0) {
          set({
            activeSectionIndex: activeSectionIndex - 1,
            activeChapterIndex: 0,
          });
        }
      },

      // Helper getters
      getActiveSection: () => {
        const { selectedCourse, activeSectionIndex } = get();
        return selectedCourse?.sections?.[activeSectionIndex] || null;
      },

      getActiveChapter: () => {
        const activeSection = get().getActiveSection();
        const { activeChapterIndex } = get();
        return activeSection?.Chapter?.[activeChapterIndex] || null;
      },

      getAboutChapter: () => {
        const activeChapter = get().getActiveChapter();
        return (
          activeChapter?.description || "No chapter description available."
        );
      },
    }),
    { name: "Coursewave-Courses-Store", storage: safeLocalStorage }
  )
);
