"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Callout } from "@tremor/react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { BiArrowBack, BiHappy, BiImage, BiFile } from "react-icons/bi";
import { MdMoreVert, MdSend, MdAttachFile, MdReply, MdClose, MdSearch, MdPeople, MdSettings, MdPushPin, MdExpandMore, MdExpandLess } from "react-icons/md";
import { FiThumbsUp, FiShare2, FiMoreHorizontal, FiSmile } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "@/app/(shared)/emoji-picker";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";

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
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: string;
  }[];
  isPinned?: boolean;
  pinnedBy?: string;
  pinnedAt?: Date;
}

interface OnlineUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'busy';
  lastSeen?: Date;
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
  const [isTyping, setIsTyping] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [showPinnedMessages, setShowPinnedMessages] = useState(false);
  const [showPinnedPanel, setShowPinnedPanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reactionPickerRef = useRef<HTMLDivElement>(null);
  
  // Quick reaction emojis
  const quickReactions = ["👍", "❤️", "😄", "🎉", "👏", "🔥", "💯", "🚀"];

  // Mock admin status - in real app this would come from user permissions
  const isAdmin = true; // Set to true to test admin features

  // Sample messages data
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      content: "Hey everyone! Welcome to our new community chat! 🎉",
      timestamp: new Date(Date.now() - 3600000),
      isCurrentUser: false,
      reactions: [{ emoji: "👍", count: 3 }, { emoji: "🎉", count: 2 }],
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
        content: "Hey everyone! Welcome to our new community chat! 🎉",
      },
    },
    {
      id: "3",
      sender: "You",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      content: "I was thinking we could talk about the upcoming community event next month. Anyone interested in helping organize it?",
      timestamp: new Date(Date.now() - 900000),
      isCurrentUser: true,
      reactions: [{ emoji: "👍", count: 5 }, { emoji: "😄", count: 2 }],
    },
    {
      id: "4",
      sender: "Taylor Swift",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      content: "That sounds great! I've been working on some ideas for the event. Here's a quick mockup I made:",
      timestamp: new Date(Date.now() - 600000),
      isCurrentUser: false,
      reactions: [],
      attachments: [
        {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop',
          name: 'event-mockup.png'
        }
      ]
    },
    {
      id: "5",
      sender: "David Chen",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      content: "I can help with the technical setup! Here's the project proposal document:",
      timestamp: new Date(Date.now() - 300000),
      isCurrentUser: false,
      reactions: [{ emoji: "👏", count: 1 }],
      attachments: [
        {
          type: 'file',
          url: '#',
          name: 'project-proposal.pdf',
          size: '2.4 MB'
        }
      ]
    },
    {
      id: "6",
      sender: "Community Admin",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg",
      content: "📢 Important Announcement: Our monthly community meetup will be held this Saturday at 2 PM. Please RSVP in the events channel!",
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      isCurrentUser: false,
      reactions: [{ emoji: "📢", count: 12 }, { emoji: "👍", count: 8 }],
      isPinned: true,
      pinnedBy: "Community Admin",
      pinnedAt: new Date(Date.now() - 43200000), // 12 hours ago
    },
    {
      id: "7",
      sender: "Emma Davis",
      avatar: "https://randomuser.me/api/portraits/women/6.jpg",
      content: "🚀 New Feature Alert: We've just launched our community resource library! Check it out and let us know what you think.",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isCurrentUser: false,
      reactions: [{ emoji: "🚀", count: 15 }, { emoji: "👏", count: 6 }],
      isPinned: true,
      pinnedBy: "Community Admin",
      pinnedAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "8",
      sender: "Mike Brown",
      avatar: "https://randomuser.me/api/portraits/men/7.jpg",
      content: "📚 Weekly Reading List: Here are this week's must-read articles on AI and machine learning. Happy learning!",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isCurrentUser: false,
      reactions: [{ emoji: "📚", count: 9 }, { emoji: "❤️", count: 4 }],
      isPinned: true,
      pinnedBy: "Community Admin",
      pinnedAt: new Date(Date.now() - 900000), // 15 minutes ago
    },
  ]);

  const [onlineUsers] = useState<OnlineUser[]>([
    { id: "1", name: "Alex Johnson", avatar: "https://randomuser.me/api/portraits/men/1.jpg", status: 'online' },
    { id: "2", name: "Sam Wilson", avatar: "https://randomuser.me/api/portraits/women/2.jpg", status: 'online' },
    { id: "3", name: "Taylor Swift", avatar: "https://randomuser.me/api/portraits/women/4.jpg", status: 'away' },
    { id: "4", name: "David Chen", avatar: "https://randomuser.me/api/portraits/men/5.jpg", status: 'online' },
    { id: "5", name: "Emma Davis", avatar: "https://randomuser.me/api/portraits/women/6.jpg", status: 'busy' },
    { id: "6", name: "Mike Brown", avatar: "https://randomuser.me/api/portraits/men/7.jpg", status: 'online' },
  ]);

  const [onlineCount, setOnlineCount] = useState(11);

  // Get pinned messages
  const pinnedMessages = messages.filter(msg => msg.isPinned);

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
    setShowReactionPicker(null);
  };

  const togglePinMessage = (messageId: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        if (msg.isPinned) {
          // Unpin the message
          const { isPinned, pinnedBy, pinnedAt, ...rest } = msg;
          return rest;
        } else {
          // Pin the message
          return {
            ...msg,
            isPinned: true,
            pinnedBy: "You",
            pinnedAt: new Date()
          };
        }
      }
      return msg;
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "You",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        content: `Shared ${file.name}`,
        timestamp: new Date(),
        isCurrentUser: true,
        reactions: [],
        attachments: [{
          type: file.type.startsWith('image/') ? 'image' : 'file',
          url: fileUrl,
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
        }]
      };

      setMessages([...messages, newMessage]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle click outside to close reaction picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target as Node)) {
        setShowReactionPicker(null);
      }
    };

    if (showReactionPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactionPicker]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredOnlineUsers = onlineUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="flex h-16 items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center space-x-3">
          <Link href={`/${userId}/communityChat`}>
            <Button
              variant="outline"
              size="icon"
              className="relative group h-10 w-10 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 dark:from-gray-900/20 dark:to-slate-900/20 dark:hover:from-gray-900/30 dark:hover:to-slate-900/30 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <BiArrowBack className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-400 to-slate-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </Button>
          </Link>

          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=40&h=40&fit=crop" />
              <AvatarFallback>TC</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold tracking-tight text-gray-900 dark:text-white">
                Tech Enthusiasts
              </h2>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{onlineCount} online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Pinned Messages Button */}
          {pinnedMessages.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPinnedPanel(!showPinnedPanel)}
              className="relative group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MdPushPin className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                <span className="hidden sm:inline text-blue-700 dark:text-blue-300 font-medium">Pinned</span>
                <div className="relative flex items-center justify-center">
                  <Badge 
                    variant="secondary" 
                    className="h-6 w-6 rounded-full p-0 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-white dark:border-zinc-800 shadow-sm group-hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                  >
                    {pinnedMessages.length}
                  </Badge>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-200"></div>
                </div>
              </div>
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowOnlineUsers(!showOnlineUsers)}
            className="relative group h-10 w-10 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <MdPeople className="h-[1.2rem] w-[1.2rem] text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
          </Button>
          
          <ThemeModeToggle />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative group h-10 w-10 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 dark:from-gray-900/20 dark:to-slate-900/20 dark:hover:from-gray-900/30 dark:hover:to-slate-900/30 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <MdMoreVert className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-400 to-slate-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 border border-gray-200 dark:border-zinc-700 shadow-xl bg-white dark:bg-zinc-800 rounded-xl" align="end">
              <div className="p-2">
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center justify-center w-5 h-5">
                      <MdSearch className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span>Search Messages</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center justify-center w-5 h-5">
                      <MdPeople className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span>Community Info</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center justify-center w-5 h-5">
                      <MdSettings className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span>Community Settings</span>
                  </button>
                </div>
                
                <Separator className="my-2 bg-gray-200 dark:bg-zinc-700" />
                
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center justify-center w-5 h-5">
                      <MdPushPin className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span>Pinned Messages</span>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 rounded-lg transition-all duration-200 group">
                    <div className="flex items-center justify-center w-5 h-5">
                      <BiFile className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span>Shared Files</span>
                  </button>
                </div>
                
                <Separator className="my-2 bg-gray-200 dark:bg-zinc-700" />
                
                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-all duration-200 group">
                  <div className="flex items-center justify-center w-5 h-5">
                    <MdClose className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span>Leave Community</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {/* Pinned Messages Section */}
            {pinnedMessages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 shadow-sm">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MdPushPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                        Pinned Messages ({pinnedMessages.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPinnedMessages(!showPinnedMessages)}
                        className="h-6 px-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {showPinnedMessages ? (
                          <MdExpandLess className="h-4 w-4" />
                        ) : (
                          <MdExpandMore className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Pinned Messages List */}
                  <AnimatePresence>
                    {showPinnedMessages && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 overflow-hidden"
                      >
                        {pinnedMessages.map((msg, index) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/50 dark:bg-black/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800"
                          >
                            <div className="flex items-start gap-3">
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src={msg.avatar} />
                                <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {msg.sender}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      {formatTime(msg.timestamp)}
                                    </span>
                                  </div>
                                  {isAdmin && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => togglePinMessage(msg.id)}
                                      className="h-5 px-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                    >
                                      <MdClose className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-2">
                                  {msg.content}
                                </p>
                                
                                {/* Reactions */}
                                {msg.reactions.length > 0 && (
                                  <div className="flex space-x-1 mt-2">
                                    {msg.reactions.slice(0, 3).map((reaction) => (
                                      <span
                                        key={reaction.emoji}
                                        className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-white dark:bg-black/30 text-xs"
                                      >
                                        {reaction.emoji} {reaction.count}
                                      </span>
                                    ))}
                                    {msg.reactions.length > 3 && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        +{msg.reactions.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed View - Show first pinned message preview */}
                  {!showPinnedMessages && (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={pinnedMessages[0].avatar} />
                        <AvatarFallback>{pinnedMessages[0].sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
                          {pinnedMessages[0].content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {pinnedMessages.length > 1 ? `+${pinnedMessages.length - 1} more pinned messages` : 'Pinned message'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Welcome Message (only if no pinned messages) */}
            {pinnedMessages.length === 0 && (
              <Callout className="mb-4 rounded-lg bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-100 dark:border-blue-800" title="Welcome to Tech Enthusiasts" >
                This is a community for discussing all things tech. Be respectful and enjoy the conversation! 🚀
              </Callout>
            )}

            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${msg.isCurrentUser ? 'order-2' : 'order-1'}`}>
                      {!msg.isCurrentUser && (
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={msg.avatar} />
                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{msg.sender}</span>
                        </div>
                      )}
                      
                      <div className={`rounded-2xl p-3 relative ${
                        msg.isCurrentUser 
                          ? 'bg-gradient-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-sm border border-blue-400/30 shadow-lg' 
                          : 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
                      } shadow-sm border border-gray-200 dark:border-zinc-700 ${
                        msg.isCurrentUser 
                          ? 'rounded-br-md' 
                          : 'rounded-tl-md'
                      }`}>
                        {/* Message Bubble Notch */}
                        <div className={`absolute w-0 h-0 ${
                          msg.isCurrentUser 
                            ? 'bottom-0 right-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-blue-500/90 dark:border-b-blue-600/90' 
                            : 'top-0 left-0 border-r-[12px] border-r-transparent border-t-[12px] border-t-white dark:border-t-zinc-800'
                        }`}></div>
                        
                        {msg.replyTo && (
                          <div className={`mb-2 p-2 rounded-lg ${
                            msg.isCurrentUser 
                              ? 'bg-white/20 backdrop-blur-sm border border-white/20' 
                              : 'bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600'
                          }`}>
                            <div className={`text-xs ${
                              msg.isCurrentUser ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              Replying to {msg.replyTo.sender}
                            </div>
                            <div className={`text-sm truncate ${
                              msg.isCurrentUser ? 'text-white/90' : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {msg.replyTo.content}
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <p className={`text-sm leading-relaxed ${
                            msg.isCurrentUser ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {msg.content}
                          </p>
                          
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="space-y-2">
                              {msg.attachments.map((attachment, index) => (
                                <div key={index} className="rounded-lg overflow-hidden">
                                  {attachment.type === 'image' ? (
                                    <img 
                                      src={attachment.url} 
                                      alt={attachment.name}
                                      className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    />
                                  ) : (
                                    <div className={`flex items-center space-x-2 p-2 rounded-lg ${
                                      msg.isCurrentUser 
                                        ? 'bg-white/20 backdrop-blur-sm border border-white/20' 
                                        : 'bg-gray-100 dark:bg-zinc-700'
                                    }`}>
                                      <BiFile className={`h-5 w-5 ${
                                        msg.isCurrentUser ? 'text-white/80' : 'text-blue-500'
                                      }`} />
                                      <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-medium truncate ${
                                          msg.isCurrentUser ? 'text-white/90' : 'text-gray-800 dark:text-gray-200'
                                        }`}>
                                          {attachment.name}
                                        </div>
                                        {attachment.size && (
                                          <div className={`text-xs ${
                                            msg.isCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                            {attachment.size}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex space-x-1">
                            {msg.reactions.map((reaction) => (
                              <button
                                key={reaction.emoji}
                                onClick={() => addReaction(msg.id, reaction.emoji)}
                                className={`rounded-full px-2 py-1 text-xs transition-colors ${
                                  msg.isCurrentUser 
                                    ? 'bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/20 text-white' 
                                    : 'bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 border border-gray-200 dark:border-zinc-600'
                                }`}
                              >
                                {reaction.emoji} {reaction.count}
                              </button>
                            ))}
                          </div>
                          <span className={`text-xs ${
                            msg.isCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                      </div>

                      <div className={`mt-1 flex space-x-1 ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className="relative" ref={reactionPickerRef}>
                          <button 
                            onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                          >
                            <FiSmile className="h-4 w-4" />
                          </button>
                          
                          {showReactionPicker === msg.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute bottom-8 left-0 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 p-2 z-10"
                            >
                              <div className="flex space-x-1">
                                {quickReactions.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => addReaction(msg.id, emoji)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-lg"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </div>
                        <button 
                          onClick={() => setReplyingTo(msg)}
                          className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                          <MdReply className="h-4 w-4" />
                        </button>
                        {isAdmin && (
                          <button 
                            onClick={() => togglePinMessage(msg.id)}
                            className={`rounded-full p-1 transition-colors ${
                              msg.isPinned 
                                ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' 
                                : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
                            }`}
                            title={msg.isPinned ? "Unpin message" : "Pin message"}
                          >
                            <MdPushPin className={`h-4 w-4 ${msg.isPinned ? 'fill-current' : ''}`} />
                          </button>
                        )}
                        <button className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                          <FiShare2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-zinc-800 rounded-2xl p-3 shadow-sm border border-gray-200 dark:border-zinc-700">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Reply Preview */}
          {replyingTo && (
            <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Replying to <span className="font-semibold">{replyingTo.sender}</span>
                  </div>
                  <div className={`text-sm truncate p-2 rounded-lg ${
                    replyingTo.isCurrentUser 
                      ? 'bg-blue-500/10 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200' 
                      : 'bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-gray-200'
                  }`}>
                    {replyingTo.content}
                  </div>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full transition-colors"
                >
                  <MdClose className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="border-t border-gray-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-end gap-3">
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
                      setMessage(message + emoji);
                      setShowEmojiPicker(false);
                    }} 
                  />
                </PopoverContent>
              </Popover>

              {/* Text Input */}
              <div className="flex-1 min-w-0">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-gray-200 dark:focus:border-blue-400"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2 flex-shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
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
                  disabled={!message.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500 text-white transition-all duration-200 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <MdSend className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pinned Messages Panel */}
        {showPinnedPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MdPushPin className="h-4 w-4 text-blue-500" />
                  Pinned Messages
                </h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPinnedPanel(false)}
                  className="h-8 w-8"
                >
                  <MdClose className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-3">
                  {pinnedMessages.map((msg) => (
                    <div key={msg.id} className="bg-gray-50 dark:bg-zinc-700 rounded-lg p-3 border border-gray-200 dark:border-zinc-600">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {msg.sender}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePinMessage(msg.id)}
                                className="h-6 px-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                              >
                                <MdClose className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                            {msg.content}
                          </p>
                          
                          {/* Reactions */}
                          {msg.reactions.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {msg.reactions.map((reaction) => (
                                <span
                                  key={reaction.emoji}
                                  className="inline-flex items-center px-2 py-1 rounded-full bg-white dark:bg-zinc-600 text-xs"
                                >
                                  {reaction.emoji} {reaction.count}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}

        {/* Online Users Sidebar */}
        {showOnlineUsers && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Online Users</h3>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowOnlineUsers(false)}
                  className="h-8 w-8"
                >
                  <MdClose className="h-4 w-4" />
                </Button>
              </div>

              <div className="relative mb-4">
                <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {filteredOnlineUsers.map((user) => (
                    <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-800 ${getStatusColor(user.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;