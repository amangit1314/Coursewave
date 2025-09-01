"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import React from "react";
import { BiArrowBack, BiHappy, BiImage, BiFile } from "react-icons/bi";
import {
  MdMoreVert,
  MdClose,
  MdSearch,
  MdPeople,
  MdSettings,
  MdPushPin,
} from "react-icons/md";
import { ThemeModeToggle } from "@/app/(shared)/theme-mode-toggle";
import { Community } from "@/types/community";

import PinnedMessagesButton from "./PinnedMessagesButton";
import { useCommunityChatStore } from "@/zustand/communityChatStore";

type ChatHeaderComponentProps = {
  userId: string;
  community: Community | null | undefined;
  onlineCount: number;
  isAdmin: boolean;
};

const ChatHeaderComponent = (props: ChatHeaderComponentProps) => {
  const {
    messages,
    showPinnedPanel,
    setShowPinnedPanel,
    togglePinMessage,
    setShowOnlineUsers,
    showOnlineUsers,
  } = useCommunityChatStore();

  const pinnedMessages = messages.filter((msg) => msg.isPinned);

  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
      <div className="flex items-center space-x-3">
        <Link href={`/${props.userId}/communityChat`}>
          <Button
            variant="outline"
            size="icon"
            className="relative group h-10 w-10 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 dark:from-gray-900/20 dark:to-slate-900/20 dark:hover:from-gray-900/30 dark:hover:to-slate-900/30 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <BiArrowBack className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-gray-400 to-slate-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
          </Button>
        </Link>

        {/* Community Avatar, Community name, Online count */}
        <div className="flex items-center space-x-3">
          {/* Community Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=40&h=40&fit=crop" />
            <AvatarFallback>TC</AvatarFallback>
          </Avatar>

          {/* Community name, Community online memebers count */}
          <div>
            {/* Community name */}
            <h2 className="font-semibold tracking-tight text-gray-900 dark:text-white">
              {props.community?.title}
            </h2>

            {/* Community online memebers count */}
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {props.onlineCount} online
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Messages, Community Online Users, Theme button, More Icon Button */}
      <div className="flex items-center space-x-2">
        {/* Pinned Messages Button */}
        <PinnedMessagesButton
          pinnedMessages={pinnedMessages}
          showPinnedPanel={showPinnedPanel}
          setShowPinnedPanel={setShowPinnedPanel}
          isAdmin={props.isAdmin}
          togglePinMessage={togglePinMessage}
        />

        {/* <Input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          /> */}

        {/* Show online users button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          className="relative group h-10 w-10 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <MdPeople className="h-[1.2rem] w-[1.2rem] text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200" />
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </Button>

        {/* Theme toggle button */}
        <ThemeModeToggle />

        {/* More icon button */}
        <MoreIconButton />
      </div>
    </div>
  );
};

export default ChatHeaderComponent;

// ------------------------------------------- MORE ICON BUTTON COMPONENT -------------------------------------------
type MoreIconButtonProps = {};

const MoreIconButton = (props: MoreIconButtonProps) => {
  return (
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
      <PopoverContent
        className="w-56 p-0 border border-gray-200 dark:border-zinc-700 shadow-xl bg-white dark:bg-zinc-800 rounded-xl"
        align="end"
      >
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
  );
};
