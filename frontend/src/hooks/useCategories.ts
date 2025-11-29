import { categoriesService } from "@/lib/api/services/categoriesService";
import { BlogCategory } from "@/types/blog.service.types";
import { Category } from "@/types/category";
import { useCategoriesStore } from "@/zustand/categoriesStore";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  const { setCategories } = useCategoriesStore();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("🔍 useCategories: Fetching categories...");
      const res = await categoriesService.getCategories();
      console.log("📦 useCategories: API Response:", res);
      console.log("📊 useCategories: Response data:", res?.data);

      const categories: Category[] = res?.data || [];
      console.log("✅ useCategories: Parsed categories:", categories);

      setCategories(categories ?? []); // sync Zustand
      return categories ?? [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
