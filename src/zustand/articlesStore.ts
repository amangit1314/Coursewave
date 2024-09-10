// import { BlogWithComments } from "@/types/blog-with-comments";
// import { Blog, BlogComment } from "@prisma/client";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface ArticlesState {
//   articles: Blog[];
//   selectedArticle: BlogWithComments | null;
//   articleComments: BlogComment[];
//   loading: boolean;
//   error: string;
// }

// type ArticlesActions = {
//   createArticle: (
//     title: string,
//     content: string,
//     thumbnailUrl: string | null,
//     estimatedReadingTime: string,
//     authorId: string
//   ) => Promise<void>;
//   editArticle: (
//     articleId: string,
//     title: string,
//     content: string,
//     thumbnailUrl: string | null,
//     estimatedReadingTime: string
//   ) => Promise<void>;
//   deleteArticle: (articleId: string) => Promise<void>;
//   fetchArticles: () => Promise<void>;
//   fetchSelectedArticle: (articleId: string) => Promise<void>;

//   // Comments actions
//   addComment: (
//     articleId: string,
//     content: string,
//     authorId: string
//   ) => Promise<void>;
//   editComment: (
//     commentId: string,
//     content: string
//   ) => Promise<void>;
//   deleteComment: (commentId: string) => Promise<void>;
//   fetchArticleComments: (articleId: string) => Promise<void>;
// };

// const useArticlesStore = create<ArticlesState & ArticlesActions>()(
//   persist(
//     (set, get) => ({
//       articles: [],
//       selectedArticle: null,
//       articleComments: [],
//       loading: false,
//       error: '',

//       createArticle: async (
//         title: string,
//         content: string,
//         thumbnailUrl: string | null,
//         estimatedReadingTime: string,
//         authorId: string
//       ) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ title, content, thumbnailUrl, estimatedReadingTime, authorId }),
//           });

//           if (!response.ok) {
//             set({loading: false, error: "Failed to create article in response not ok condition ..."});
//           }

//           const newArticle = await response.json();
//           set((state) => ({
//             articles: [...state.articles, newArticle],
//             loading: false,
//             error: "",
//           }));
//         } catch (error: any) {
//           console.error("Error creating article:", error);
//           set({loading: false, error: error});
//         }
//       },

//       editArticle: async (
//         articleId: string,
//         title: string,
//         content: string,
//         thumbnailUrl: string | null,
//         estimatedReadingTime: string
//       ) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles/${articleId}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ title, content, thumbnailUrl, estimatedReadingTime }),
//           });

//           if (!response.ok) {
//             set({loading: false, error: "Failed to update article in response not ok condition ..."});
//           }

//           const updatedArticle = await response.json();
//           set((state) => ({
//             articles: state.articles.map((article) =>
//               article.id === articleId ? updatedArticle : article
//             ),
//             selectedArticle: state.selectedArticle?.id === articleId ? updatedArticle : state.selectedArticle,
//           }));
//         } catch (error: any) {
//           console.error("Error updating article:", error);
//         }
//       },

//       deleteArticle: async (articleId: string) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles/${articleId}`, {
//             method: "DELETE",
//           });

//           if (!response.ok) {
//             set({loading: false, error: "Failed to delete article in response not ok condition ..."});
//           }

//           set((state) => ({
//             articles: state.articles.filter((article) => article.id !== articleId),
//             selectedArticle: state.selectedArticle?.id === articleId ? null : state.selectedArticle,
//           }));
//         } catch (error: any) {
//           console.error("Error deleting article:", error);
//         }
//       },

//       fetchArticles: async () => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles`);
//           if (!response.ok) {
//             set({loading: false, error: "Failed to fetch articles in response not ok condition ..."});
//           }

//           const data = await response.json();
//           set({ articles: data });
//         } catch (error: any) {
//           console.error("Error fetching articles:", error);
//         }
//       },

//       fetchSelectedArticle: async (articleId: string) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles/${articleId}`);
//           if (!response.ok) {
//             set({loading: false, error: "Failed to fetch article info in response not ok condition ..."});
//           }
//           const data = await response.json();
//           set({ selectedArticle: data });
//         } catch (error: any) {
//           console.error("Error fetching selected article:", error);
//         }
//       },

//       addComment: async (articleId: string, content: string, authorId: string) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles/${articleId}/comments`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ content, authorId }),
//           });

//           if (!response.ok) {
//             set({loading: false, error: "Failed to add comment to article in response not ok condition ..."});
//           }

//           const newComment = await response.json();
//           set((state) => ({
//             articleComments: [...state.articleComments, newComment],
//           }));
//         } catch (error: any) {
//           console.error("Error adding comment:", error);
//         }
//       },

//       editComment: async (commentId: string, content: string) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/comments/${commentId}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ content }),
//           });

//           if (!response.ok) {
//             set({loading: false, error: "Failed to update article comment in response not ok condition ..."});
//           }

//           const updatedComment = await response.json();
//           set((state) => ({
//             articleComments: state.articleComments.map((comment) =>
//               comment.id === commentId ? updatedComment : comment
//             ),
//           }));
//         } catch (error: any) {
//           console.error("Error updating comment:", error);
//         }
//       },

//       deleteComment: async (commentId: string) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/comments/${commentId}`, {
//             method: "DELETE",
//           });

//           if (!response.ok) {
//             set({loading: false, error: "Failed to delete article in response not ok condition ..."});
//           }

//           set((state) => ({
//             articleComments: state.articleComments.filter(
//               (comment) => comment.id !== commentId
//             ),
//           }));
//         } catch (error: any) {
//           console.error("Error deleting comment:", error);
//         }
//       },

//       fetchArticleComments: async (articleId: string) => {
//         try {
//           set({loading: true, error: ""});
//           const response = await fetch(`/api/articles/${articleId}/comments`);
//           if (!response.ok) {
//             set({loading: false, error: "Failed to fetch article comments in response not ok condition ..."});
//           }

//           const data = await response.json();
//           set({ articleComments: data });
//         } catch (error: any) {
//           console.error("Error fetching article comments:", error);
//         }
//       },
//     }),
//     { name: "Coursewave-Articles-Store", getStorage: () => localStorage },
//   ),
// );

// export default useArticlesStore;

import { BlogWithComments } from "@/types/blog-with-comments";
import { Blog, BlogComment } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ArticlesState {
  articles: Blog[];
  selectedArticle: BlogWithComments | null;
  articleComments: BlogComment[];
  loading: boolean;
  error: string;
  currentUserId: string | null; // Added to track the logged-in user
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
  addComment: (
    articleId: string,
    content: string,
    authorId: string,
  ) => Promise<void>;
  editComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  fetchArticleComments: (articleId: string) => Promise<void>;

  // Additional actions
  setCurrentUserId: (userId: string) => void; // Added to set the logged-in user
};

export const useArticlesStore = create<ArticlesState & ArticlesActions>()(
  persist(
    (set, get) => ({
      articles: [],
      selectedArticle: null,
      articleComments: [],
      loading: false,
      error: "",
      currentUserId: null, // Initialize currentUserId

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
          const response = await fetch(`/api/articles`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
              thumbnailUrl,
              estimatedReadingTime,
              authorId,
            }),
          });

          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to create article in response not ok condition ...",
            });
            return;
          }

          const newArticle = await response.json();
          set((state) => ({
            articles: [...state.articles, newArticle.data as Blog],
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
          const response = await fetch(`/api/articles/${articleId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content,
              thumbnailUrl,
              estimatedReadingTime,
            }),
          });

          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to update article in response not ok condition ...",
            });
            return;
          }

          const updatedArticle = await response.json();
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
          const response = await fetch(`/api/articles/${articleId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to delete article in response not ok condition ...",
            });
            return;
          }

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
          const response = await fetch(`/api/articles`);
          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to fetch articles in response not ok condition ...",
            });
            return;
          }

          const data = await response.json();
          set({ articles: data, loading: false, error: "" });
        } catch (error: any) {
          console.error("Error fetching articles:", error);
          set({ loading: false, error: error.message });
        }
      },

      fetchSelectedArticle: async (articleId: string) => {
        try {
          set({ loading: true, error: "" });
          const response = await fetch(`/api/articles/${articleId}`);
          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to fetch article info in response not ok condition ...",
            });
            return;
          }
          const data = await response.json();
          set({ selectedArticle: data, loading: false, error: "" });
        } catch (error: any) {
          console.error("Error fetching selected article:", error);
          set({ loading: false, error: error.message });
        }
      },

      addComment: async (
        articleId: string,
        content: string,
        authorId: string,
      ) => {
        try {
          set({ loading: true, error: "" });
          const response = await fetch(`/api/articles/${articleId}/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content, authorId }),
          });

          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to add comment to article in response not ok condition ...",
            });
            return;
          }

          const newComment = await response.json();
          set((state) => ({
            articleComments: [...state.articleComments, newComment],
            loading: false,
            error: "",
          }));
        } catch (error: any) {
          console.error("Error adding comment:", error);
          set({ loading: false, error: error.message });
        }
      },

      editComment: async (commentId: string, content: string) => {
        const { currentUserId } = get();
        const comment = get().articleComments.find((c) => c.id === commentId);

        if (comment?.authorId !== currentUserId) {
          set({ error: "You are not authorized to edit this comment." });
          return;
        }

        try {
          set({ loading: true, error: "" });
          const response = await fetch(`/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content }),
          });

          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to update comment in response not ok condition ...",
            });
            return;
          }

          const updatedComment = await response.json();
          set((state) => ({
            articleComments: state.articleComments.map((comment) =>
              comment.id === commentId ? updatedComment : comment,
            ),
            loading: false,
            error: "",
          }));
        } catch (error: any) {
          console.error("Error updating comment:", error);
          set({ loading: false, error: error.message });
        }
      },

      deleteComment: async (commentId: string) => {
        const { currentUserId } = get();
        const comment = get().articleComments.find((c) => c.id === commentId);
        const article = get().articles.find((a) => a.id === comment?.blogId);

        if (
          comment?.authorId !== currentUserId &&
          article?.authorId !== currentUserId
        ) {
          set({ error: "You are not authorized to delete this comment." });
          return;
        }

        try {
          set({ loading: true, error: "" });
          const response = await fetch(`/api/comments/${commentId}`, {
            method: "DELETE",
          });

          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to delete comment in response not ok condition ...",
            });
            return;
          }

          set((state) => ({
            articleComments: state.articleComments.filter(
              (comment) => comment.id !== commentId,
            ),
            loading: false,
            error: "",
          }));
        } catch (error: any) {
          console.error("Error deleting comment:", error);
          set({ loading: false, error: error.message });
        }
      },

      fetchArticleComments: async (articleId: string) => {
        try {
          set({ loading: true, error: "" });
          const response = await fetch(`/api/articles/${articleId}/comments`);
          if (!response.ok) {
            set({
              loading: false,
              error:
                "Failed to fetch article comments in response not ok condition ...",
            });
            return;
          }

          const data = await response.json();
          set({ articleComments: data, loading: false, error: "" });
        } catch (error: any) {
          console.error("Error fetching article comments:", error);
          set({ loading: false, error: error.message });
        }
      },
    }),
    { name: "Coursewave-Articles-Store", getStorage: () => localStorage },
  ),
);
