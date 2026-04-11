"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  useCheckArticleSaved,
  useSaveArticle,
  useUnsaveArticle,
} from "@/hooks/useArticles";

type Props = {
  articleId: string;
};

const SaveArticleButton = ({ articleId }: Props) => {
  // Fetch saved status (always returns a boolean)
  const {
    data: isSaved = false,
    isLoading: isSavedLoading,
  } = useCheckArticleSaved(articleId);

  const saveArticleMutation = useSaveArticle();
  const unsaveArticleMutation = useUnsaveArticle();

  const handleSaveArticle = async () => {
    try {
      if (isSaved) {
        await unsaveArticleMutation.mutateAsync(articleId);
        toast.success("Article removed from your saved list");
      } else {
        await saveArticleMutation.mutateAsync(articleId);
        toast.success("Article saved for later reading");
      }
    } catch (error) {
      toast.error(`Failed to ${isSaved ? "unsave" : "save"} article`);
    }
  };

  // Disabled state logic
  const isActionPending =
    isSavedLoading ||
    saveArticleMutation.isPending ||
    unsaveArticleMutation.isPending;

  return (
    <Button
      onClick={handleSaveArticle}
      disabled={isActionPending}
      variant="ghost"
      size="sm"
      className={`group relative h-10 px-4 rounded-xl transition-all duration-300 ${isSaved
          ? "bg-cyan-500/20 text-cyan-500 hover:bg-cyan-500/30"
          : "hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-red-500/10"
        }`}
    >
      {isSaved ? (
        <Check className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
      )}

      <span
        className={`hidden sm:inline text-sm font-medium transition-colors ${isSaved
            ? "text-cyan-500"
            : "text-muted-foreground group-hover:text-cyan-500"
          }`}
      >
        {isActionPending
          ? "..."
          : isSaved
            ? "Saved"
            : "Save"}
      </span>
    </Button>
  );
};

export default SaveArticleButton;
