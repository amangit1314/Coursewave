"use client";

import { Button } from "@/components/ui/button";
import React, { useRef, useCallback } from "react";
import { BiHappy } from "react-icons/bi";
import { MdSend, MdAttachFile, MdClose, MdEdit } from "react-icons/md";
import EmojiPicker from "@/components/EmojiPicker";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import {
  sendMessage,
  editMessage,
  setTyping,
} from "@/lib/socket/communitySocket";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageInputProps {
  communityId: string;
}

const MessageInput = ({ communityId }: MessageInputProps) => {
  const {
    showEmojiPicker,
    setShowEmojiPicker,
    messageInput,
    setMessageInput,
    replyingTo,
    setReplyingTo,
    editingMessage,
    setEditingMessage,
  } = useCommunityChatStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = useCallback(() => {
    setTyping(communityId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(communityId, false);
    }, 2000);
  }, [communityId]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (editingMessage) {
      // Edit existing message
      editMessage(communityId, editingMessage.id, messageInput.trim());
      setEditingMessage(null);
    } else {
      // Send new message
      sendMessage(
        communityId,
        messageInput.trim(),
        replyingTo?.id
      );
      setReplyingTo(null);
    }

    setMessageInput("");
    setShowEmojiPicker(false);
    setTyping(communityId, false);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  };

  const handleFileUpload = (file: File) => {
    // For now, send file name as message content with attachment metadata
    // Full file upload requires a file storage service (S3/Cloudinary)
    const attachment = {
      type: file.type.startsWith("image/") ? "image" : "file",
      url: URL.createObjectURL(file), // Local preview — production should use uploaded URL
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    };

    sendMessage(communityId, `Shared ${file.name}`, undefined, [attachment]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCancel = () => {
    if (editingMessage) {
      setEditingMessage(null);
      setMessageInput("");
    }
    if (replyingTo) {
      setReplyingTo(null);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800">
      {/* Edit/Reply indicator */}
      {(editingMessage || replyingTo) && (
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2 dark:border-zinc-700">
          <div className="flex items-center gap-2 text-sm">
            {editingMessage ? (
              <>
                <MdEdit className="h-4 w-4 text-blue-500" />
                <span className="text-zinc-500 dark:text-zinc-400">
                  Editing message
                </span>
              </>
            ) : (
              <>
                <span className="text-zinc-500 dark:text-zinc-400">
                  Replying to{" "}
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {replyingTo?.senderName}
                  </span>
                </span>
              </>
            )}
          </div>
          <button onClick={handleCancel} className="text-zinc-400 hover:text-zinc-600">
            <MdClose className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 p-4">
        {/* Emoji Button */}
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md"
            >
              <BiHappy className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <EmojiPicker
              onEmojiSelect={(emoji: string) => {
                setMessageInput(messageInput + emoji);
                setShowEmojiPicker(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Text Input */}
        <div className="min-w-0 flex-1">
          <textarea
            value={messageInput}
            onChange={(e) => {
              setMessageInput(e.target.value);
              handleTyping();
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              editingMessage
                ? "Edit your message..."
                : replyingTo
                  ? `Reply to ${replyingTo.senderName}...`
                  : "Type your message..."
            }
            className="h-10 w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-200 dark:focus:border-blue-400"
            rows={1}
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {!editingMessage && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                  e.target.value = "";
                }}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-md"
              >
                <MdAttachFile className="h-5 w-5" />
              </Button>
            </>
          )}
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {editingMessage ? (
              <MdEdit className="h-5 w-5" />
            ) : (
              <MdSend className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
