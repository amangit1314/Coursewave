"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MdClose, MdSearch } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useState } from "react";

const OnlineUsersSidebar = () => {
  const { showOnlineUsers, setShowOnlineUsers, onlineUsers } =
    useCommunityChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  if (!showOnlineUsers) return null;

  const online = onlineUsers.filter((u) => u.isOnline);
  const offline = onlineUsers.filter((u) => !u.isOnline);

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 280, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className="border-l border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800"
    >
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Online — {online.length}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowOnlineUsers(false)}
            className="h-8 w-8"
          >
            <MdClose className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-1">
            {/* Online users */}
            {online.map((user) => (
              <UserRow key={user.userId} userId={user.userId} isOnline={true} />
            ))}

            {/* Offline section */}
            {offline.length > 0 && (
              <>
                <div className="pb-1 pt-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Offline — {offline.length}
                </div>
                {offline.map((user) => (
                  <UserRow key={user.userId} userId={user.userId} isOnline={false} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

const UserRow = ({ userId, isOnline }: { userId: string; isOnline: boolean }) => {
  // We only have userId from presence events — show a minimal row
  const initials = userId.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-800 ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
          {userId.substring(0, 8)}...
        </div>
        <div className="text-xs capitalize text-gray-500 dark:text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default OnlineUsersSidebar;
