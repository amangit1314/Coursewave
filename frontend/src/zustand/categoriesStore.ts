"use client";


import { categoriesService } from "@/lib/api/services/categoriesService";
import { Category } from "@/types/category";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "./safe-storage";

type CategoriesState = {
  categories: Category[];
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
};

type CategoriesActions = {
  fetchCategories: () => Promise<void>;
  setCategories: (categories: Category[]) => void;
  selectCategory: (categoryName: string | null) => void;
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
          set({ loading: true, error: null });

          const data = await categoriesService.getCategories();
          console.log(
            "API response for categories in categories-zustand-store: ",
            data
          );

          const categories: Category[] = data?.data || [];
          set({ categories, error: null });
        } catch (error: any) {
          console.error("Error fetching categories:", error);
          set({
            error: error?.message || "Unknown error while fetching categories",
          });
        } finally {
          set({ loading: false });
        }
      },

      setCategories: (categories: Category[]) => {
        set({ categories, error: null });
      },

      selectCategory: (categoryName: string | null) => {
        set({ selectedCategory: categoryName });
      },
    }),
    {
      name: "Coursewave-Categories-Store",
      storage: safeLocalStorage,
    }
  )
);
