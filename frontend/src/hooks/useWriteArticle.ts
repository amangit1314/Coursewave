// import { articleService } from "@/lib/api/services";
// import { BlogArticle } from "@/types";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";

// interface CreateArticlePayload {
//   title: string;
//   content: string;
//   thumbnailUrl: string | null;
//   estimatedReadingTime: string;
//   authorId: string;
// }

// export const useWriteArticle = () => {
//   const queryClient = useQueryClient();

//   return useMutation<BlogArticle, Error, CreateArticlePayload>({
//     mutationFn: async (payload) => {
//       console.log("Creating article with payload:", payload);
//       try {
//         const result = await articleService.createArticle(
//           payload.title,
//           payload.content,
//           payload.thumbnailUrl,
//           payload.estimatedReadingTime,
//           payload.authorId
//         );
//         console.log("Article created successfully:", result);
//         // Show success toast
//         if (typeof window !== "undefined") {
//           toast.success("Article created successfully!");
//         }
//         return result;
//       } catch (error) {
//         console.error("Error in mutationFn:", error);
//         // Show error toast
//         if (typeof window !== "undefined") {
//           toast.error("Failed to create article.");
//         }
//         throw error;
//       }
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["articles"] });
//       console.log("onSuccess: Article created:", data);
//       if (typeof window !== "undefined") {
//         toast.success("Article created and cache updated!");
//       }
//     },
//     onError: (error) => {
//       console.error("onError: Error creating article:", error);
//       if (typeof window !== "undefined") {
//         toast.error("Error creating article.");
//       }
//     },
//   });
// };


import { articleService } from "@/lib/api/services";
import { BlogArticle } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CreateArticlePayload {
  title: string;
  content: string;
  thumbnailUrl: string | null;
  estimatedReadingTime: string;
  authorId: string;
}

export const useWriteArticle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<BlogArticle, Error, CreateArticlePayload>({
    mutationFn: async (payload) => {
      console.log("Creating article with payload:", payload);
      
      // Validation
      if (!payload.title?.trim()) {
        throw new Error("Title is required");
      }
      if (!payload.content?.trim()) {
        throw new Error("Content is required");
      }
      if (!payload.authorId) {
        throw new Error("Author ID is required");
      }

      // Check payload size before sending
      const payloadSize = JSON.stringify(payload).length;
      console.log("Payload size:", payloadSize, "bytes");
      
      if (payloadSize > 10 * 1024 * 1024) { // 10MB limit
        throw new Error("Article content is too large. Please reduce image sizes or content length.");
      }

      const result = await articleService.createArticle(
        payload.title,
        payload.content,
        payload.thumbnailUrl,
        payload.estimatedReadingTime,
        payload.authorId
      );
      
      console.log("Article created successfully:", result);
      return result;
    },
    onMutate: () => {
      toast.loading("Publishing article...", { id: "publish-article" });
    },
    onSuccess: (data) => {
      toast.success("Article published successfully!", { id: "publish-article" });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      
      // Navigate to articles page
      setTimeout(() => {
        router.push("/articles");
      }, 1000);
      
      console.log("onSuccess: Article created:", data);
    },
    onError: (error: any) => {
      console.error("onError: Error creating article:", error);
      
      let errorMessage = "Failed to publish article";
      
      // Handle specific error types
      if (error.message?.includes("413") || error.message?.includes("Payload Too Large") || error.message?.includes("request entity too large")) {
        errorMessage = "Article is too large. Please compress images or reduce content length.";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { id: "publish-article" });
    },
  });
};