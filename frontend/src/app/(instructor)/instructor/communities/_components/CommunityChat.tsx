"use client";

import React, { useEffect, useRef, useState } from "react";
import { useCommunityMessages, useSendMessage } from "@/hooks/useCommunities";
import { useCommunityChatStore, ServerMessage } from "@/zustand/communityChatStore";
import { useUserStore } from "@/zustand/userStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  Loader2,
  MessageSquare,
  Reply,
  X,
} from "lucide-react";
import { Community } from "@/types/community";

interface CommunityChatProps {
  community: Community;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(date: Date) {
  const today = new Date();
  if (date.toDateString() === today.toDateString()) return "Today";
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommunityChat({ community }: CommunityChatProps) {
  const { data: rawMessages, isLoading } = useCommunityMessages(community.id);
  const sendMessageMutation = useSendMessage(community.id);
  const user = useUserStore((s) => s.user);

  const {
    messages,
    setMessages,
    messageInput,
    setMessageInput,
    replyingTo,
    setReplyingTo,
  } = useCommunityChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Sync API data into zustand store
  useEffect(() => {
    if (rawMessages && Array.isArray(rawMessages)) {
      setMessages(rawMessages as ServerMessage[]);
    }
  }, [rawMessages, setMessages]);

  // Reset store when community changes
  useEffect(() => {
    return () => {
      useCommunityChatStore.getState().reset();
    };
  }, [community.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  const handleSend = () => {
    const content = messageInput.trim();
    if (!content) return;

    sendMessageMutation.mutate(
      { content, parentId: replyingTo?.id },
      {
        onSuccess: () => {
          setMessageInput("");
          setReplyingTo(null);
          setAutoScroll(true);
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: typeof messages }[] = [];
  let lastDate = "";
  for (const msg of messages) {
    const dateStr = formatDate(msg.createdAt);
    if (dateStr !== lastDate) {
      groupedMessages.push({ date: dateStr, msgs: [msg] });
      lastDate = dateStr;
    } else {
      groupedMessages[groupedMessages.length - 1].msgs.push(msg);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          {community.title}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {community.totalMembers || community.members?.length || 0} members
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-4 py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="h-8 w-8 text-zinc-300 dark:text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date}>
                <div className="my-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-[10px] font-medium uppercase text-zinc-400">
                    {group.date}
                  </span>
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                </div>
                {group.msgs.map((msg) => {
                  const isOwn = user?.id === msg.senderId;
                  return (
                    <div
                      key={msg.id}
                      className={`group mb-3 flex items-start gap-2.5 ${
                        isOwn ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src={msg.senderAvatar || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {msg.senderName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`max-w-[75%] ${isOwn ? "text-right" : ""}`}
                      >
                        <div className="flex items-baseline gap-2">
                          {!isOwn && (
                            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                              {msg.senderName}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                        {msg.replyTo && (
                          <div className="mb-1 mt-0.5 rounded border-l-2 border-blue-400 bg-blue-50 px-2 py-1 text-left dark:bg-blue-900/20">
                            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                              {msg.replyTo.senderName}
                            </span>
                            <p className="line-clamp-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                              {msg.replyTo.content}
                            </p>
                          </div>
                        )}
                        <div
                          className={`inline-block rounded-lg px-3 py-1.5 text-sm ${
                            isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-white"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {/* Reply action */}
                        <button
                          className="ml-1 hidden text-zinc-400 hover:text-zinc-600 group-hover:inline-block dark:hover:text-zinc-300"
                          onClick={() => setReplyingTo(msg)}
                          title="Reply"
                        >
                          <Reply className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Reply indicator */}
      {replyingTo && (
        <div className="flex items-center gap-2 border-t border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800/50">
          <Reply className="h-3.5 w-3.5 text-blue-500" />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {replyingTo.senderName}
            </span>
            <p className="truncate text-xs text-zinc-500">
              {replyingTo.content}
            </p>
          </div>
          <button onClick={() => setReplyingTo(null)}>
            <X className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-200 p-3 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="h-9 text-sm"
          />
          <Button
            size="sm"
            className="h-9 w-9 shrink-0 p-0"
            onClick={handleSend}
            disabled={
              !messageInput.trim() || sendMessageMutation.isPending
            }
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
