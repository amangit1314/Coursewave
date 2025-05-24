"use client";

import { Button } from "@/components/ui/button";
import { Callout } from "@tremor/react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { BiArrowBack, BiMoveVertical, BiHappy } from "react-icons/bi";
import { MdMoreVert, MdSend, MdAttachFile, MdReply } from "react-icons/md";
import { FiThumbsUp, FiShare2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "@/app/(shared)/emoji-picker";

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  reactions: { emoji: string; count: number }[];
  replyTo?: {
    id: string;
    sender: string;
    content: string;
  };
}

const CommunityPage = ({
  params,
}: {
  params: {
    userId?: string;
    communityChatId?: string;
  };
}) => {
  const communityId = params?.communityChatId!;
  const userId = params?.userId!;
  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      content: "Hey everyone! Welcome to our new community chat!",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
      reactions: [{ emoji: "👍", count: 3 }],
    },
    {
      id: "2",
      sender: "Sam Wilson",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      content: "Excited to be here! What are we discussing today?",
      timestamp: new Date(Date.now() - 1800000),
      isCurrentUser: false,
      reactions: [{ emoji: "❤️", count: 2 }],
      replyTo: {
        id: "1",
        sender: "Alex Johnson",
        content: "Hey everyone! Welcome to our new community chat!",
      },
    },
    {
      id: "3",
      sender: "You",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      content: "I was thinking we could talk about the upcoming community event next month.",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: true,
      reactions: [{ emoji: "👍", count: 5 }, { emoji: "😄", count: 2 }],
    },
    {
      id: "4",
      sender: "Taylor Swift",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      content: "That sounds great! I've been working on some ideas for the event.",
      timestamp: new Date(Date.now() - 600000),
      isCurrentUser: false,
      reactions: [],
    },
  ]);

  const [onlineCount, setOnlineCount] = useState(11);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      content: message,
      timestamp: new Date(),
      isCurrentUser: true,
      reactions: [],
      replyTo: replyingTo ? {
        id: replyingTo.id,
        sender: replyingTo.sender,
        content: replyingTo.content.length > 30 
          ? replyingTo.content.substring(0, 30) + "..." 
          : replyingTo.content
      } : undefined,
    };

    setMessages([...messages, newMessage]);
    setMessage("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex h-16 items-center justify-between rounded-b-lg bg-blue-600 px-4 py-3 shadow-md dark:bg-black">
        <div className="flex items-center space-x-3">
          <Link href={`/${userId}/communityChat`}>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 hover:bg-blue-700 dark:bg-transparent dark:hover:bg-zinc-800"
            >
              <BiArrowBack className="h-[1.2rem] w-[1.2rem] scale-100 text-white transition-all" />
            </Button>
          </Link>

          <div>
            <p className="font-semibold tracking-tight text-white">
              Tech Enthusiasts
            </p>
            <div className="flex items-center justify-start space-x-2">
              <p className="h-2 w-2 rounded-full bg-green-500"></p>
              <p className="text-xs text-gray-200">{onlineCount} online</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 hover:bg-blue-700 dark:bg-transparent dark:hover:bg-zinc-800"
        >
          <MdMoreVert className="h-[1.2rem] w-[1.2rem] scale-100 text-white transition-all" />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <Callout className="mb-4 rounded-lg bg-blue-100 text-blue-900" title="Welcome to Tech Enthusiasts" >
          This is a community for discussing all things tech. Be respectful and enjoy the conversation!
        </Callout>

        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.isCurrentUser ? 'justify-end rounded-t-3xl rounded-bl-3xl' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${msg.isCurrentUser ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tl-none'} shadow-sm`}>
                  {msg.replyTo && (
                    <div className="mb-1 border-l-2 border-blue-400 pl-2 text-xs italic text-gray-500 dark:text-gray-400">
                      Replying to <span className="font-semibold">{msg.replyTo.sender}</span>: {msg.replyTo.content}
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    {!msg.isCurrentUser && (
                      <img 
                        src={msg.avatar} 
                        alt={msg.sender} 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <div className="flex-1">
                      {!msg.isCurrentUser && (
                        <p className="text-sm font-semibold">{msg.sender}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <div className="flex space-x-1">
                          {msg.reactions.map((reaction) => (
                            <button
                              key={reaction.emoji}
                              onClick={() => addReaction(msg.id, reaction.emoji)}
                              className="rounded-full bg-black bg-opacity-10 px-1 text-xs hover:bg-opacity-20 dark:bg-white dark:bg-opacity-10"
                            >
                              {reaction.emoji} {reaction.count}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs opacity-70">{formatTime(msg.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-end space-x-2">
                    <button 
                      onClick={() => addReaction(msg.id, '👍')}
                      className="rounded-full p-1 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
                    >
                      <FiThumbsUp className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setReplyingTo(msg)}
                      className="rounded-full p-1 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10"
                    >
                      <MdReply className="h-4 w-4" />
                    </button>
                    <button className="rounded-full p-1 hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10">
                      <FiShare2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="border-t border-gray-200 bg-gray-100 p-2 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Replying to <span className="font-semibold">{replyingTo.sender}</span>
              <p className="truncate text-xs">{replyingTo.content}</p>
            </div>
            <button 
              onClick={() => setReplyingTo(null)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="relative flex items-center rounded-lg border border-gray-300 bg-gray-50 dark:border-zinc-600 dark:bg-zinc-700">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <BiHappy className="h-5 w-5" />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-10">
              <EmojiPicker 
                onEmojiSelect={(emoji) => {
                  setMessage(message + emoji);
                  setShowEmojiPicker(false);
                }} 
              />
            </div>
          )}
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="max-h-20 flex-1 resize-none border-none bg-transparent p-2 text-gray-900 outline-none dark:text-gray-200"
            rows={1}
          />
          
          <div className="flex items-center space-x-1 pr-2">
            <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <MdAttachFile className="h-5 w-5" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`rounded-full p-2 ${message.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'}`}
            >
              <MdSend className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;