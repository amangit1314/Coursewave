// src/stores/articles.store.ts
import { articleService } from "@/lib/api/articles";
import { BlogArticle } from "@/types/blog-api-response";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ArticlesState {
  articles: BlogArticle[];
  selectedArticle: BlogArticle | null;
  // articleComments: BlogComment[];
  loading: boolean;
  error: string;
  currentUserId: string | null;
}

type ArticlesActions = {
  createArticle: (
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string,
    authorId: string,
  ) => Promise<void>;
  editArticle: (
    articleId: string,
    title: string,
    content: string,
    thumbnailUrl: string | null,
    estimatedReadingTime: string,
  ) => Promise<void>;
  deleteArticle: (articleId: string) => Promise<void>;
  fetchArticles: () => Promise<void>;
  fetchSelectedArticle: (articleId: string) => Promise<void>;

  // Comments actions
  // addComment: (
  //   articleId: string,
  //   content: string,
  //   authorId: string,
  // ) => Promise<void>;
  // editComment: (commentId: string, content: string) => Promise<void>;
  // deleteComment: (commentId: string) => Promise<void>;
  // fetchArticleComments: (articleId: string) => Promise<void>;

  // Additional actions
  setCurrentUserId: (userId: string) => void;
};

export const useArticlesStore = create<ArticlesState & ArticlesActions>()(
  persist(
    (set, get) => ({
      articles: [],
      selectedArticle: null,
      articleComments: [],
      loading: false,
      error: "",
      currentUserId: null,

      setCurrentUserId: (userId: string) => {
        set({ currentUserId: userId });
      },

      createArticle: async (
        title: string,
        content: string,
        thumbnailUrl: string | null,
        estimatedReadingTime: string,
        authorId: string,
      ) => {
        try {
          set({ loading: true, error: "" });
          const newArticle = await articleService.createArticle(
            title,
            content,
            thumbnailUrl,
            estimatedReadingTime,
            authorId
          );
          set((state) => ({
            articles: [...state.articles, newArticle.data as BlogArticle],
            loading: false,
            error: "",
          }));
        } catch (error: any) {
          console.error("Error creating article:", error);
          set({ loading: false, error: error.message });
        }
      },

      editArticle: async (
        articleId: string,
        title: string,
        content: string,
        thumbnailUrl: string | null,
        estimatedReadingTime: string,
      ) => {
        const { currentUserId } = get();
        const article = get().articles.find((a) => a.id === articleId);

        if (article?.authorId !== currentUserId) {
          set({ error: "You are not authorized to edit this article." });
          return;
        }

        try {
          set({ loading: true, error: "" });
          const updatedArticle = await articleService.updateArticle(
            articleId,
            title,
            content,
            thumbnailUrl,
            estimatedReadingTime
          );
          set((state) => ({
            articles: state.articles.map((article) =>
              article.id === articleId ? updatedArticle : article,
            ),
            selectedArticle:
              state.selectedArticle?.id === articleId
                ? updatedArticle
                : state.selectedArticle,
            loading: false,
            error: "",
          }));
        } catch (error: any) {
          console.error("Error updating article:", error);
          set({ loading: false, error: error.message });
        }
      },

      deleteArticle: async (articleId: string) => {
        const { currentUserId } = get();
        const article = get().articles.find((a) => a.id === articleId);

        if (article?.authorId !== currentUserId) {
          set({ error: "You are not authorized to delete this article." });
          return;
        }

        try {
          set({ loading: true, error: "" });
          await articleService.deleteArticle(articleId);
          set((state) => ({
            articles: state.articles.filter(
              (article) => article.id !== articleId,
            ),
            selectedArticle:
              state.selectedArticle?.id === articleId
                ? null
                : state.selectedArticle,
            loading: false,
            error: "",
          }));
        } catch (error: any) {
          console.error("Error deleting article:", error);
          set({ loading: false, error: error.message });
        }
      },

      fetchArticles: async () => {
        try {
          set({ loading: true, error: "" });
          const data = await articleService.getArticles();
          console.log("Fetched articles:", data.data);
          set({ articles: data.data, loading: false, error: "" });
        } catch (error: any) {
          console.error("Error fetching articles:", error);
          set({ loading: false, error: error.message });
        }
      },

      fetchSelectedArticle: async (articleId: string) => {
        try {
          set({ loading: true, error: "" });
          const data = await articleService.getArticleById(articleId);
          console.log("Fetched selected article:", data.data);
          
          // Handle case where API returns an array instead of single object
          const articleData = Array.isArray(data.data) ? data.data[0] : data.data;
          
          set({ selectedArticle: articleData, loading: false, error: "" });
        } catch (error: any) {
          console.error("Error fetching selected article:", error);
          set({ loading: false, error: error.message });
        }
      },

      // addComment: async (
      //   articleId: string,
      //   content: string,
      //   authorId: string,
      // ) => {
      //   try {
      //     set({ loading: true, error: "" });
      //     const newComment = await articleService.addComment(
      //       articleId,
      //       content,
      //       authorId
      //     );
      //     set((state) => ({
      //       articleComments: [...state.articleComments, newComment],
      //       loading: false,
      //       error: "",
      //     }));
      //   } catch (error: any) {
      //     console.error("Error adding comment:", error);
      //     set({ loading: false, error: error.message });
      //   }
      // },

      // editComment: async (commentId: string, content: string) => {
      //   const { currentUserId } = get();
      //   const comment = get().articleComments.find((c) => c.id === commentId);

      //   if (comment?.authorId !== currentUserId) {
      //     set({ error: "You are not authorized to edit this comment." });
      //     return;
      //   }

      //   try {
      //     set({ loading: true, error: "" });
      //     const updatedComment = await articleService.updateComment(
      //       commentId,
      //       content
      //     );
      //     set((state) => ({
      //       articleComments: state.articleComments.map((comment) =>
      //         comment.id === commentId ? updatedComment : comment,
      //       ),
      //       loading: false,
      //       error: "",
      //     }));
      //   } catch (error: any) {
      //     console.error("Error updating comment:", error);
      //     set({ loading: false, error: error.message });
      //   }
      // },

      // deleteComment: async (commentId: string) => {
      //   const { currentUserId } = get();
      //   const comment = get().articleComments.find((c) => c.id === commentId);
      //   const article = get().articles.find((a) => a.id === comment?.blogId);

      //   if (
      //     comment?.authorId !== currentUserId &&
      //     article?.authorId !== currentUserId
      //   ) {
      //     set({ error: "You are not authorized to delete this comment." });
      //     return;
      //   }

      //   try {
      //     set({ loading: true, error: "" });
      //     await articleService.deleteComment(commentId);
      //     set((state) => ({
      //       articleComments: state.articleComments.filter(
      //         (comment) => comment.id !== commentId,
      //       ),
      //       loading: false,
      //       error: "",
      //     }));
      //   } catch (error: any) {
      //     console.error("Error deleting comment:", error);
      //     set({ loading: false, error: error.message });
      //   }
      // },

      // fetchArticleComments: async (articleId: string) => {
      //   try {
      //     set({ loading: true, error: "" });
      //     const data = await articleService.getArticleComments(articleId);
      //     set({ articleComments: data, loading: false, error: "" });
      //   } catch (error: any) {
      //     console.error("Error fetching article comments:", error);
      //     set({ loading: false, error: error.message });
      //   }
      // },
    }),
    {
      name: "Coursewave-Articles-Store",
    },
  ),
);