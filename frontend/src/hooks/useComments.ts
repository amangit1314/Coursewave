// hooks/useComments.ts
import { commentService } from "@/lib/api/services/commentService";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatar: string | null;
  };
  likes: number;
  isLiked: boolean;
  replies: Comment[];
  _count: { replies: number; likes: number };
  parentId?: string;
  articleId: string;
  isOptimistic?: boolean;
}

interface AddCommentData {
  articleId: string;
  content: string;
  parentId?: string;
}

interface UpdateCommentData {
  articleId: string;
  commentId: string;
  content: string;
}

interface DeleteCommentData {
  articleId: string;
  commentId: string;
}

interface ToggleLikeData {
  articleId: string;
  commentId: string;
}

// Main hook for fetching comments
export const useComments = (articleId: string) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => commentService.getComments(articleId),
    enabled: !!articleId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Add comment mutation
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, content, parentId }: AddCommentData) =>
      commentService.addComment(articleId, content, parentId),
    
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ 
        queryKey: ["comments", newComment.articleId] 
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments", 
        newComment.articleId
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["comments", newComment.articleId],
        (old: Comment[] = []) => {
          const optimisticComment: Comment = {
            id: `temp-${Date.now()}`,
            content: newComment.content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            user: {
              id: "current-user",
              name: "You",
              avatar: null,
            },
            likes: 0,
            isLiked: false,
            replies: [],
            _count: { replies: 0, likes: 0 },
            parentId: newComment.parentId,
            articleId: newComment.articleId,
            isOptimistic: true,
          };

          if (newComment.parentId) {
            // For nested replies - find and update parent comment recursively
            return updateCommentsWithReply(old, newComment.parentId, optimisticComment);
          }

          // For top-level comments
          return [...old, optimisticComment];
        }
      );

      return { previousComments };
    },

    onError: (err, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", newComment.articleId],
          context.previousComments
        );
      }
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["comments", variables.articleId] 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["article", variables.articleId] 
      });
    },
  });
};

// Update comment mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, commentId, content }: UpdateCommentData) =>
      commentService.updateComment(articleId, commentId, content),
    
    onMutate: async (updatedComment) => {
      await queryClient.cancelQueries({ 
        queryKey: ["comments", updatedComment.articleId] 
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments", 
        updatedComment.articleId
      ]);

      // Optimistically update the comment
      queryClient.setQueryData(
        ["comments", updatedComment.articleId],
        (old: Comment[] = []) => 
          updateCommentInTree(old, updatedComment.commentId, comment => ({
            ...comment,
            content: updatedComment.content,
            updatedAt: new Date().toISOString(),
            isOptimistic: true,
          }))
      );

      return { previousComments };
    },

    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", variables.articleId],
          context.previousComments
        );
      }
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["comments", variables.articleId] 
      });
    },
  });
};

// Delete comment mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, commentId }: DeleteCommentData) =>
      commentService.deleteComment(articleId, commentId),
    
    onMutate: async (deleteData) => {
      await queryClient.cancelQueries({ 
        queryKey: ["comments", deleteData.articleId] 
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments", 
        deleteData.articleId
      ]);

      // Optimistically remove the comment
      queryClient.setQueryData(
        ["comments", deleteData.articleId],
        (old: Comment[] = []) => 
          removeCommentFromTree(old, deleteData.commentId)
      );

      return { previousComments };
    },

    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", variables.articleId],
          context.previousComments
        );
      }
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["comments", variables.articleId] 
      });
      
      queryClient.invalidateQueries({ 
        queryKey: ["article", variables.articleId] 
      });
    },
  });
};

// Toggle like mutation
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, commentId }: ToggleLikeData) =>
      commentService.toggleLike(articleId, commentId),
    
    onMutate: async (likeData) => {
      await queryClient.cancelQueries({ 
        queryKey: ["comments", likeData.articleId] 
      });

      const previousComments = queryClient.getQueryData<Comment[]>([
        "comments", 
        likeData.articleId
      ]);

      // Optimistically update like status
      queryClient.setQueryData(
        ["comments", likeData.articleId],
        (old: Comment[] = []) => 
          updateCommentInTree(old, likeData.commentId, comment => {
            const currentLikes = comment.likes || 0;
            const currentlyLiked = comment.isLiked || false;
            
            return {
              ...comment,
              likes: currentlyLiked ? currentLikes - 1 : currentLikes + 1,
              isLiked: !currentlyLiked,
              isOptimistic: true,
            };
          })
      );

      return { previousComments };
    },

    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["comments", variables.articleId],
          context.previousComments
        );
      }
    },

    onSuccess: (data, variables) => {
      // Optionally invalidate to get exact count from server
      // queryClient.invalidateQueries({ 
      //   queryKey: ["comments", variables.articleId] 
      // });
    },
  });
};

// Combined hook for easy usage in components
export const useCommentMutations = () => {
  const addComment = useAddComment();
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();
  const toggleLike = useToggleLike();

  return {
    addComment: addComment.mutateAsync,
    updateComment: updateComment.mutateAsync,
    deleteComment: deleteComment.mutateAsync,
    toggleLike: toggleLike.mutateAsync,
    isAdding: addComment.isPending,
    isUpdating: updateComment.isPending,
    isDeleting: deleteComment.isPending,
    isTogglingLike: toggleLike.isPending,
  };
};

// Helper functions for nested comment operations
function updateCommentsWithReply(
  comments: Comment[], 
  parentId: string, 
  newComment: Comment
): Comment[] {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newComment],
        _count: {
          ...comment._count,
          replies: (comment._count?.replies || 0) + 1
        }
      };
    }
    
    // Check nested replies recursively
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = updateCommentsWithReply(comment.replies, parentId, newComment);
      if (updatedReplies !== comment.replies) {
        return {
          ...comment,
          replies: updatedReplies
        };
      }
    }
    
    return comment;
  });
}

function updateCommentInTree(
  comments: Comment[], 
  commentId: string, 
  updater: (comment: Comment) => Comment
): Comment[] {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return updater(comment);
    }
    
    if (comment.replies && comment.replies.length > 0) {
      const updatedReplies = updateCommentInTree(comment.replies, commentId, updater);
      if (updatedReplies !== comment.replies) {
        return {
          ...comment,
          replies: updatedReplies
        };
      }
    }
    
    return comment;
  });
}

function removeCommentFromTree(comments: Comment[], commentId: string): Comment[] {
  return comments.filter(comment => {
    if (comment.id === commentId) {
      return false;
    }
    
    if (comment.replies && comment.replies.length > 0) {
      comment.replies = removeCommentFromTree(comment.replies, commentId);
    }
    
    return true;
  });
}