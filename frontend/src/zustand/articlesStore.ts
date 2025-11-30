"use client";

import { BlogArticle } from "@/types/blog-api-response";
import { BlogWithComments } from "@/types/blog-with-comments";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ArticlesState {
  selectedArticle: BlogArticle | null;
  articleComments: BlogWithComments[];
  savedArticles: BlogArticle[]; // saved locally
  currentUserId: string | null;
}

type ArticlesActions = {
  setCurrentUserId: (userId: string) => void;
  setSelectedArticle: (article: BlogArticle | null) => void;
  saveArticle: (article: BlogArticle) => void;
  unsaveArticle: (id: string) => void;
  setComments: (comments: any[]) => void;
};

export const useArticlesStore = create<ArticlesState & ArticlesActions>()(
  persist(
    (set) => ({
      selectedArticle: null,
      articleComments: [],
      savedArticles: [],
      currentUserId: null,

      setCurrentUserId: (userId) => set({ currentUserId: userId }),

      setSelectedArticle: (article) => set({ selectedArticle: article }),

      setComments: (comments) => set({ articleComments: comments }),

      saveArticle: (article) =>
        set((state) => ({
          savedArticles: [...state.savedArticles, article],
        })),

      unsaveArticle: (id) =>
        set((state) => ({
          savedArticles: state.savedArticles.filter((a) => a.id !== id),
        })),
    }),
    { name: "Coursewave-Articles-Store" }
  )
);
