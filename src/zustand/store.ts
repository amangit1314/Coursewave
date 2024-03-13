import { create } from 'zustand';

export const useZustandStore = create((set) => ({
  userInfo: null,
  courses: [],
  categories: [],
  isFetchingUserInfo: false,
  isFetchingCourses: false,
  isFetchingCategories: false,

  error: null,

  fetchUserInfo: async () => {
    set({ isFetchingUserInfo: true, error: null });
    try {
      // https://localhost:3000
      const url = "/api/auth/me";
      console.log("Fetching user info from:", url);

      const response = await fetch(url);

      if (!response.ok) {
        console.error("Failed to get user info from auth/me api ...");
      }

      const user = await response.json();
      set({ userInfo: user, isFetchingUserInfo: false });
    } catch (error: any) {
      console.error(
        `Failed to get user info from auth/me api, ERROR: ${error.message} ...`
      );
      set({ isFetchingUserInfo: false, error });
    }
  },

  fetchCourses: async () => {
    try {
      const response = await fetch("https://localhost:3000/api/courses/");

      if (!response.ok) {
        console.error("Failed to get user info from api/courses api ...");
      }

      const courses = await response.json();
      set({ courses: courses, isFetchingCourses: false });
    }

    catch (error: any) {
      console.error(
        `Failed to get user info from api/courses api, ERROR: ${error.message} ...`
      );
      set({ isFetchingCourses: false, error });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch("/api/categories/");

      if (!response.ok) {
        console.error("Failed to get categories from api/categories api ...");
      }

      const categories = await response.json();
      set({ categories: [{ categoryName: "All" }, ...categories.data], isFetchingCategories: false });
    }

    catch (error: any) {
      console.error(
        `Failed to get categories from api/categories api, ERROR: ${error.message} ...`
      );
      set({ isFetchingCategories: false, error });
    }
  },
}));
