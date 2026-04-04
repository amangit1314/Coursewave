import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdClose, MdPushPin } from "react-icons/md";
import { ChatMessage } from "@/zustand/communityChatStore";

type PinnedMessagesButtonProps = {
  pinnedMessages: Array<ChatMessage>;
  showPinnedPanel: boolean;
  setShowPinnedPanel: (show: boolean) => void;
  isAdmin: boolean;
  togglePinMessage: (messageId: string) => void;
};

const PinnedMessagesButton = (props: PinnedMessagesButtonProps) => {
  return (
    <div>
      {props.pinnedMessages.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => props.setShowPinnedPanel(!props.showPinnedPanel)}
          className="relative group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <MdPushPin className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <span className="hidden sm:inline text-blue-700 dark:text-blue-300 font-medium">
              Pinned
            </span>
            <div className="relative flex items-center justify-center">
              <Badge
                variant="secondary"
                className="h-6 w-6 rounded-full p-0 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-2 border-white dark:border-zinc-800 shadow-sm group-hover:scale-110 transition-transform duration-200 flex items-center justify-center"
              >
                {props.pinnedMessages.length}
              </Badge>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-200"></div>
            </div>
          </div>
        </Button>
      )}
    </div>
  );
};

export default PinnedMessagesButton;
