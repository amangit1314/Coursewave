// components/emoji-picker.tsx
"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const commonEmojis = ["😊", "😂", "❤️", "🔥", "👏", "👍", "🎉", "🙏", "🤔", "😍"];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverContent 
        className="w-64 p-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl shadow-lg"
        align="end"
      >
        <div className="grid grid-cols-5 gap-2">
          {commonEmojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg p-2 transition-colors"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}