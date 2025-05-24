import axios from "axios";

const API_BASE_URL =
  // process.env.ENVIRONMENT === "DEVELOPMENT"
    // ?
     "http://localhost:5002/api";
    // : "/api";

export const categoriesService = {
  async getCategories() {
    const response = await axios.get(`${API_BASE_URL}/categories`, {
      headers: {
        acces_token: "coursewave_access_token",
      },
    });
    return response.data;
  },

  async addCategory(categoryName: string, categoryDescription: string) {
    const response = await axios.post(
      `${API_BASE_URL}/categories`,
      {
        categoryName,
        categoryDescription,
      },
      {
        headers: {
          acces_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async deleteCategory(categoryId: string) {
    const response = await axios.delete(
      `${API_BASE_URL}/categories/${categoryId}`,
      {
        headers: {
          acces_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },

  async updateCategory(
    categoryName: string,
    categoryDescription: string
  ) {
    const response = await axios.put(
      `${API_BASE_URL}/categories`,
      {
        newCategoryName: categoryName,
        newCategoryDescription: categoryDescription,
      },
      {
        headers: {
          acces_token: "coursewave_access_token",
        },
      }
    );
    return response.data;
  },
};
