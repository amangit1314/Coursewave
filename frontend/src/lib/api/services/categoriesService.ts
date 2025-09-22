// // import axios from "axios";

// import { apiManager, ApiResponse, PaginatedResponse } from "../api-manager";

// const API_BASE_URL =
//   // process.env.ENVIRONMENT === "DEVELOPMENT"
//   // ?
//   "http://localhost:5002/api";
// // : "/api";

// export const categoriesService = {
//   async getCategories() {
//     const response = await apiManager.get(`${API_BASE_URL}/categories`, {
//       headers: {
//         acces_token: "coursewave_access_token",
//       },
//     });
//     return response.data;
//   },

//   async addCategory(categoryName: string, categoryDescription: string) {
//     const response = await apiManager.post(
//       `${API_BASE_URL}/categories`,
//       {
//         categoryName,
//         categoryDescription,
//       },
//       {
//         headers: {
//           acces_token: "coursewave_access_token",
//         },
//       }
//     );
//     return response.data;
//   },

//   async deleteCategory(categoryId: string) {
//     const response = await apiManager.delete(
//       `${API_BASE_URL}/categories/${categoryId}`,
//       {
//         headers: {
//           acces_token: "coursewave_access_token",
//         },
//       }
//     );
//     return response.data;
//   },

//   async updateCategory(categoryName: string, categoryDescription: string) {
//     const response = await apiManager.put(
//       `${API_BASE_URL}/categories`,
//       {
//         newCategoryName: categoryName,
//         newCategoryDescription: categoryDescription,
//       },
//       {
//         headers: {
//           acces_token: "coursewave_access_token",
//         },
//       }
//     );
//     return response.data;
//   },
// };


import { BlogCategory, CreateCategoryRequest, UpdateCategoryRequest } from "@/types/blog.service.types";
import { apiManager, ApiResponse } from "../api-manager";

class CategoriesService {
  private static instance: CategoriesService;
  private api = apiManager;

  private constructor() {}

  public static getInstance(): CategoriesService {
    if (!CategoriesService.instance) {
      CategoriesService.instance = new CategoriesService();
    }
    return CategoriesService.instance;
  }

  // ====================== GET CATEGORIES ======================
  async getCategories(): Promise<ApiResponse<BlogCategory[]>> {
    return this.api.get<BlogCategory[]>("/blogs/categories");
  }

  async getCategoryById(categoryId: string): Promise<ApiResponse<BlogCategory>> {
    return this.api.get<BlogCategory>(`/blogs/categories/${categoryId}`);
  }

  async getCategoryBySlug(slug: string): Promise<ApiResponse<BlogCategory>> {
    return this.api.get<BlogCategory>(`/blogs/categories/slug/${slug}`);
  }

  // ====================== CREATE / UPDATE / DELETE ======================
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponse<BlogCategory>> {
    return this.api.post<BlogCategory>("/blogs/categories", data);
  }

  async updateCategory(categoryId: string, data: UpdateCategoryRequest): Promise<ApiResponse<BlogCategory>> {
    return this.api.put<BlogCategory>(`/blogs/categories/${categoryId}`, data);
  }

  async deleteCategory(categoryId: string): Promise<ApiResponse<void>> {
    return this.api.delete<void>(`/blogs/categories/${categoryId}`);
  }
}

export const categoriesService = CategoriesService.getInstance();
