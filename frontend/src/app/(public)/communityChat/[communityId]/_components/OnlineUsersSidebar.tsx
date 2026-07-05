"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MdClose } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useCommunityMembers } from "@/hooks/useCommunities";
import { useParams } from "next/navigation";

const OnlineUsersSidebar = () => {
  const { showOnlineUsers, setShowOnlineUsers, onlineUsers } =
    useCommunityChatStore();
  const params = useParams<{ communityId?: string }>();
  const communityId = params?.communityId || "";
  const { data: members } = useCommunityMembers(communityId);

  if (!showOnlineUsers) return null;

  const presenceMap = new Map(onlineUsers.map((u) => [u.userId, u.isOnline]));

  const rows = (members || []).map((member) => ({
    userId: member.userId,
    name: member.user.name || "Unknown",
    avatar: member.user.profileImageUrl,
    isOnline: presenceMap.has(member.userId) ? !!presenceMap.get(member.userId) : member.isOnline,
  }));

  const online = rows.filter((r) => r.isOnline);
  const offline = rows.filter((r) => !r.isOnline);

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
            {online.map((user) => (
              <UserRow key={user.userId} {...user} />
            ))}

            {offline.length > 0 && (
              <>
                <div className="pb-1 pt-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Offline — {offline.length}
                </div>
                {offline.map((user) => (
                  <UserRow key={user.userId} {...user} />
                ))}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
};

const UserRow = ({
  name,
  avatar,
  isOnline,
}: {
  userId: string;
  name: string;
  avatar: string | null;
  isOnline: boolean;
}) => {
  return (
    <div className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50 dark:hover:bg-zinc-700">
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar || undefined} />
          <AvatarFallback className="text-xs">{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-800 ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-gray-900 dark:text-white">{name}</div>
        <div className="text-xs capitalize text-gray-500 dark:text-gray-400">
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
};

export default OnlineUsersSidebar;
