// import { Category } from "@/types/category";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type LoadingState = {
//   loading: boolean;
//   error: string | null;
// };

// type CategoriesState = {
//   categories: Category[];
//   selectedCategory: string | null;
//   loading: boolean;
//   error: string | null;
// };

// type CategoriesActions = {
//   fetchCategories: () => Promise<void>;
//   selectCategory: (categoryName: string | null) => void;
//   filterArticles: () => void;
//   filterCourses: () => void;
//   filterSessions: () => void;
// };

// export const useCategoriesStore = create<CategoriesState & CategoriesActions>()(
//   persist(
//     (set, get) => ({
//       categories: [],
//       selectedCategory: null,
//       loading: false,
//       error: null,

//       fetchCategories: async () => {
//         try {
//           set({ loading: true });

//           const response = await fetch(`/api/categories`);

//           if (!response.ok) {
//             set({
//               error:
//                 "Failed to fetch categories in response not ok condition ...",
//             });
//           }

//           const data = await response.json();
//           console.log(
//             "Api request response for categories api in categories-zustand-store: ",
//             data,
//           );
//           const categories: Category[] = data?.data! as Category[];

//           set({ categories, error: null });
//         } catch (error: any) {
//           console.error("Error fetching categories:", error);
//           set({ error: error.message });
//         } finally {
//           set({ loading: false });
//         }
//       },

//       selectCategory: (categoryName: string | null) => {
//         set({ selectedCategory: categoryName });

//         // Automatically filter relevant data after selecting a category
//         get().filterArticles();
//         get().filterCourses();
//         get().filterSessions();
//       },

//       filterArticles: () => {
//         // Implement filtering logic for articles based on selectedCategory
//         const { selectedCategory } = get();
//         if (!selectedCategory) return;

//         // Fetch and filter articles based on selectedCategory
//         // You might want to fetch articles from the server and filter them locally or on the server-side
//       },

//       filterCourses: () => {
//         // Implement filtering logic for courses based on selectedCategory
//         const { selectedCategory } = get();
//         if (!selectedCategory) return;

//         // Fetch and filter courses based on selectedCategory
//         // You might want to fetch courses from the server and filter them locally or on the server-side
//       },

//       filterSessions: () => {
//         // Implement filtering logic for sessions based on selectedCategory
//         const { selectedCategory } = get();
//         if (!selectedCategory) return;

//         // Fetch and filter sessions based on selectedCategory
//         // You might want to fetch sessions from the server and filter them locally or on the server-side
//       },
//     }),
//     {
//       name: "Coursewave-Categories-Store",
//     },
//   ),
// );


import { categoriesService } from "@/lib/api/services/categoriesService";
import { Category } from "@/types/category";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LoadingState = {
  loading: boolean;
  error: string | null;
};

type CategoriesState = {
  categories: Category[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
};

type CategoriesActions = {
  fetchCategories: () => Promise<void>;
  selectCategory: (categoryName: string | null) => void;
  filterArticles: () => void;
  filterCourses: () => void;
  filterSessions: () => void;
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>()(
  persist(
    (set, get) => ({
      categories: [],
      selectedCategory: null,
      loading: false,
      error: null,

      fetchCategories: async () => {
        try {
          set({ loading: true });

          const data = await categoriesService.getCategories();
          console.log(
            "API response for categories in categories-zustand-store: ",
            data,
          );

          const categories: Category[] = data?.data || [];
          set({ categories, error: null });
        } catch (error: any) {
          console.error("Error fetching categories:", error);
          set({ error: error?.message || "Unknown error while fetching categories" });
        } finally {
          set({ loading: false });
        }
      },

      selectCategory: (categoryName: string | null) => {
        set({ selectedCategory: categoryName });

        // Automatically trigger filters
        get().filterArticles();
        get().filterCourses();
        get().filterSessions();
      },

      filterArticles: () => {
        const { selectedCategory } = get();
        if (!selectedCategory) return;

        // Filtering logic for articles
      },

      filterCourses: () => {
        const { selectedCategory } = get();
        if (!selectedCategory) return;

        // Filtering logic for courses
      },

      filterSessions: () => {
        const { selectedCategory } = get();
        if (!selectedCategory) return;

        // Filtering logic for sessions
      },
    }),
    {
      name: "Coursewave-Categories-Store",
    },
  ),
);
