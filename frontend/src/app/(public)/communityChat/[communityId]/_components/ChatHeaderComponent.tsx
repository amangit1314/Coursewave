"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { BiArrowBack, BiFile } from "react-icons/bi";
import {
  MdMoreVert,
  MdClose,
  MdSearch,
  MdPeople,
  MdSettings,
  MdPushPin,
} from "react-icons/md";
import { ThemeModeToggle } from "@/components/common/ThemeModeToggle";
import { Community } from "@/types/community";

import PinnedMessagesButton from "./PinnedMessagesButton";
import CommunityInfoPanel from "./CommunityInfoPanel";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useLeaveCommunity } from "@/hooks/useCommunities";
import { getCategoryColor } from "../../_components/categoryColors";

const headerIconButtonClass =
  "relative group h-10 w-10 border-zinc-200 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors duration-200";

type ChatHeaderComponentProps = {
  userId: string;
  community: Community | null | undefined;
  onlineCount: number;
  isAdmin: boolean;
  isModerator?: boolean;
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

  const [infoPanelOpen, setInfoPanelOpen] = useState(false);
  const [infoPanelTab, setInfoPanelTab] = useState<"info" | "settings" | "members">("info");

  const pinnedMessages = messages.filter((msg) => msg.isPinned);
  const color = props.community?.category
    ? getCategoryColor(props.community.category.name)
    : getCategoryColor("all");
  const initials = (props.community?.title || "?")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const openInfoPanel = (tab: "info" | "settings" | "members") => {
    setInfoPanelTab(tab);
    setInfoPanelOpen(true);
  };

  return (
    <div className="flex h-16 items-center justify-between bg-white px-4 py-3 shadow-sm dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
      <div className="flex items-center space-x-3">
        <Link href="/communityChat">
          <Button variant="outline" size="icon" className={headerIconButtonClass}>
            <BiArrowBack className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
          </Button>
        </Link>

        {/* Community Avatar, Community name, Online count */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className={`${color.bg} ${color.text} font-semibold`}>
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-semibold tracking-tight text-gray-900 dark:text-white">
              {props.community?.title}
            </h2>

            <div className="flex items-center space-x-2">
              <div
                className={`h-2 w-2 rounded-full ${props.onlineCount > 0 ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {props.onlineCount} online
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <SearchMessagesButton />

        <PinnedMessagesButton
          pinnedMessages={pinnedMessages}
          showPinnedPanel={showPinnedPanel}
          setShowPinnedPanel={setShowPinnedPanel}
          isAdmin={props.isAdmin}
          togglePinMessage={togglePinMessage}
        />

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
          aria-pressed={showOnlineUsers}
          className={`${headerIconButtonClass} ${showOnlineUsers ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-800" : ""}`}
        >
          <MdPeople
            className={`h-[1.2rem] w-[1.2rem] group-hover:scale-110 transition-transform duration-200 ${showOnlineUsers ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}
          />
        </Button>

        <ThemeModeToggle />

        <MoreIconButton
          isAdmin={props.isAdmin}
          onOpenInfo={() => openInfoPanel("info")}
          onOpenSettings={() => openInfoPanel("settings")}
          onOpenMembers={() => openInfoPanel("members")}
        />
      </div>

      {props.community && (
        <CommunityInfoPanel
          communityId={props.community.id}
          community={props.community}
          isAdmin={props.isAdmin}
          isModerator={!!props.isModerator}
          open={infoPanelOpen}
          onOpenChange={setInfoPanelOpen}
          initialTab={infoPanelTab}
        />
      )}
    </div>
  );
};

export default ChatHeaderComponent;

// ------------------------------------------- SEARCH MESSAGES -------------------------------------------
const SearchMessagesButton = () => {
  const { messages } = useCommunityChatStore();
  const [query, setQuery] = useState("");

  const results = query.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const scrollTo = (messageId: string) => {
    document
      .getElementById(`message-${messageId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={headerIconButtonClass}>
          <MdSearch className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="end">
        <Input
          autoFocus
          placeholder="Search messages..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="mt-2 max-h-56 space-y-1 overflow-y-auto">
          {results.map((m) => (
            <button
              key={m.id}
              onClick={() => scrollTo(m.id)}
              className="w-full rounded-md p-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
            >
              <span className="font-medium">{m.senderName}: </span>
              <span className="text-zinc-500">{m.content}</span>
            </button>
          ))}
          {query.trim() && results.length === 0 && (
            <p className="p-2 text-sm text-zinc-400">No matches in the loaded messages.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ------------------------------------------- MORE ICON BUTTON -------------------------------------------
type MoreIconButtonProps = {
  isAdmin: boolean;
  onOpenInfo: () => void;
  onOpenSettings: () => void;
  onOpenMembers: () => void;
};

const MoreIconButton = ({ isAdmin, onOpenInfo, onOpenSettings, onOpenMembers }: MoreIconButtonProps) => {
  const router = useRouter();
  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId || "";
  const { messages } = useCommunityChatStore();
  const leaveCommunity = useLeaveCommunity();

  const sharedFiles = messages.filter((m) => m.attachments.length > 0);

  const handleLeave = () => {
    if (!communityId) return;
    leaveCommunity.mutate(communityId, {
      onSuccess: () => router.push("/communityChat"),
      onError: () => toast.error("Couldn't leave the community. Try again."),
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className={headerIconButtonClass}>
          <MdMoreVert className="h-[1.2rem] w-[1.2rem] text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform duration-200" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-64 p-0 border border-gray-200 dark:border-zinc-700 shadow-xl bg-white dark:bg-zinc-800 rounded-xl"
        align="end"
      >
        <div className="p-2">
          <div className="space-y-1">
            <button
              onClick={onOpenInfo}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300 rounded-lg transition-all duration-200"
            >
              <MdPeople className="h-4 w-4" />
              <span>Community Info</span>
            </button>

            <button
              onClick={onOpenMembers}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded-lg transition-all duration-200"
            >
              <MdPeople className="h-4 w-4" />
              <span>Members</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenSettings}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg transition-all duration-200"
              >
                <MdSettings className="h-4 w-4" />
                <span>Community Settings</span>
              </button>
            )}
          </div>

          <Separator className="my-2 bg-gray-200 dark:bg-zinc-700" />

          <Popover>
            <PopoverTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-700 dark:hover:text-yellow-300 rounded-lg transition-all duration-200">
                <BiFile className="h-4 w-4" />
                <span>Shared Files ({sharedFiles.length})</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-64 overflow-y-auto p-2" align="start">
              {sharedFiles.length === 0 ? (
                <p className="p-2 text-sm text-zinc-400">No files shared yet.</p>
              ) : (
                sharedFiles.flatMap((m) =>
                  m.attachments.map((att, i) => (
                    <a
                      key={`${m.id}-${i}`}
                      href={att.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    >
                      <BiFile className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="truncate">{att.name}</span>
                    </a>
                  ))
                )
              )}
            </PopoverContent>
          </Popover>

          <Separator className="my-2 bg-gray-200 dark:bg-zinc-700" />

          <button
            onClick={handleLeave}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-all duration-200"
          >
            <MdClose className="h-4 w-4" />
            <span>Leave Community</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
