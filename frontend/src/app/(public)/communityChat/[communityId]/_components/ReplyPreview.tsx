import { Message } from "@/types/message";
import { useCommunityChatStore } from "@/zustand/communityChatStore";
import React from "react";
import { MdClose } from "react-icons/md";

const ReplyPreview = () => {
  const { replyingTo, setReplyingTo } = useCommunityChatStore();

  if (!replyingTo) return null;

  return (
    <div>
      {replyingTo && (
        <div className="border-t border-gray-200 bg-gray-50 p-3 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Replying to{" "}
                <span className="font-semibold">{replyingTo.sender}</span>
              </div>
              <div
                className={`text-sm truncate p-2 rounded-lg ${
                  replyingTo.isCurrentUser
                    ? "bg-blue-500/10 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                    : "bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 text-gray-800 dark:text-gray-200"
                }`}
              >
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
    </div>
  );
};

export default ReplyPreview;
