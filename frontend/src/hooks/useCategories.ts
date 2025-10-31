import { categoriesService } from "@/lib/api/services/categoriesService";
import { Category } from "@/types/category";
import { useCategoriesStore } from "@/zustand/categoriesStore";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const { setCategories } = useCategoriesStore();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoriesService.getCategories();
      console.log("res in useCategories: ", JSON.stringify(res));

      // Check if res is the data directly or has a data property
      const categories: Category[] = res?.data || [];
      //   const courses = Array.isArray(res) ? res : res?.data;
      console.log("Categories in useCategories: ", JSON.stringify(categories));

      setCategories(categories ?? []); // sync Zustand
      return categories ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
