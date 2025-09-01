"use client";

import { Button } from "@/components/ui/button";

import React, { useRef } from "react";
import { BiHappy } from "react-icons/bi";
import { MdSend, MdAttachFile } from "react-icons/md";
import EmojiPicker from "@/app/(shared)/emoji-picker";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MessageInput = () => {
  const {
    showEmojiPicker,
    setShowEmojiPicker,
    messageInput,
    setMessageInput,
    addMessage,
    handleFileUpload,
  } = useCommunityChatStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    addMessage({
      id: Date.now().toString(),
      sender: "You",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      content: messageInput,
      timestamp: new Date(),
      isCurrentUser: true,
      reactions: [],
    });

    setMessageInput("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="flex items-center gap-3">
        {/* Emoji Button */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              <BiHappy className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <EmojiPicker
              onEmojiSelect={(emoji) => {
                setMessageInput(messageInput + emoji);
                setShowEmojiPicker(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Text Input */}
        <div className="flex-1 min-w-0">
          <textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full h-10 px-3 py-2 resize-none rounded-md border border-gray-300 bg-white text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-200 dark:focus:border-blue-400"
            rows={1}
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            <MdAttachFile className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500 text-white transition-all duration-200 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <MdSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;