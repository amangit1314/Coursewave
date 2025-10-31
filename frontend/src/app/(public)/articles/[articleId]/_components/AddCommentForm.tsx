import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Smile, Send, Loader2 } from "lucide-react";
import { useAddComment } from "@/hooks/useComments";
import { EmojiPicker } from "./EmojiPicker";
import classNames from "classnames";

interface AddCommentFormProps {
  articleId: string;
  parentId?: string;
  onSuccess?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
}

export function AddCommentForm({
  articleId,
  parentId,
  onSuccess,
  autoFocus = false,
  placeholder = "Add your comment… (use @ to mention someone)",
}: AddCommentFormProps) {
  const [comment, setComment] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addCommentMutation = useAddComment();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addCommentMutation.mutateAsync({
        articleId,
        content: comment.trim(),
        parentId,
      });
      setComment("");
      onSuccess?.();
    } catch (error) {
      // error handled below
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const isSubmitting = addCommentMutation.isPending;

  // Find and style @mentions in preview (future-extensible)
  const parsedPreview = comment.split(/(\s+)/).map((word, idx) =>
    word.startsWith("@") && word.length > 1 ? (
      <span key={idx} className="text-blue-500">
        {word}
      </span>
    ) : (
      word
    )
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-2 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-700 shadow-sm px-4 py-3"
    >
      <Textarea
        ref={textareaRef}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={placeholder}
        className={classNames(
          "min-h-[64px] transition shadow-none text-base bg-transparent border-none focus:ring-0 focus:outline-none resize-none",
          isFocused && "ring-2 ring-blue-300 dark:ring-blue-500"
        )}
        autoFocus={autoFocus}
        disabled={isSubmitting}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        spellCheck
        maxLength={600}
      />

      {/* Animated action row */}
      {(isFocused || comment.length > 0) && (
        <div className="flex items-center mt-1 justify-between transition-all">
          <div className="text-xs text-zinc-400">{comment.length}/600</div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-500 hover:text-blue-500"
              onClick={() => setShowEmojiPicker((v) => !v)}
              disabled={isSubmitting}
              tabIndex={-1}
            >
              <Smile className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-7 w-7 bg-blue-600 hover:bg-blue-700 text-white shadow active:scale-95"
              disabled={!comment.trim() || isSubmitting}
              aria-label="Send comment"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-14 right-2 z-20">
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
      )}

      {/* @mention preview (optional, you can remove if not wanted) */}
      {comment.includes("@") && (
        <div className="text-xs mt-1 px-1 pt-1 text-zinc-500 dark:text-zinc-300 whitespace-pre-wrap">
          {parsedPreview}
        </div>
      )}

      {addCommentMutation.isError && (
        <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg mt-2">
          Failed to post comment. Please try again.
        </div>
      )}
    </form>
  );
}
