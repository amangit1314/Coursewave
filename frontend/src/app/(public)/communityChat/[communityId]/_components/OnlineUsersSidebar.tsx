import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MdClose, MdSearch } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { geCommunitytStatusColor } from "@/lib/utils/utils";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import { useState } from "react";

const OnlineUsersSidebar = () => {
  const { showOnlineUsers, setShowOnlineUsers, onlineUsers, onlineCount } =
    useCommunityChatStore();
  const [searchQuery, setSearchQuery] = useState("");

  if (!showOnlineUsers) return null;

  const filteredOnlineUsers = onlineUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {showOnlineUsers && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          className="border-l border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Online Users
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
                  <div
                    key={user.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-800 ${geCommunitytStatusColor(user.status)}`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OnlineUsersSidebar;
