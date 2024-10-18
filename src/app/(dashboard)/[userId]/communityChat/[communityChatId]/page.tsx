import { Button } from "@/components/ui/button";
import { Callout } from "@tremor/react";
import Link from "next/link";
import React from "react";
import { BiArrowBack, BiMoveVertical } from "react-icons/bi";
import { MdMoreVert } from "react-icons/md";

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

  return (
    <div className="mt-12 space-y-4 overflow-y-hidden py-10 pr-[2.5rem]">
      <div className="flex h-[64px] w-full items-center justify-between rounded-lg bg-blue-700 px-3 dark:bg-black">
        <div className="flex items-center justify-start space-x-3">
          <Link href={`/${userId}/communityChat`}>
            <Button
              variant="outline"
              size="icon"
              className="flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
            >
              <BiArrowBack className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
            </Button>
          </Link>

          <div>
            <p className="font-semibold tracking-tight text-white">
              Community Name
            </p>
            <div className="flex items-center justify-start space-x-2">
              <p className="h-2 w-2 rounded-full bg-green-500"></p>
              <p className="text-xs text-gray-200">{11} online</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="flex h-10 w-10 items-center justify-center rounded-md transition-all duration-200 dark:bg-transparent dark:hover:bg-zinc-800"
        >
          <MdMoreVert className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
        </Button>
      </div>

      {/* scrollable */}
      <div className="">
        <Callout className="" title="Feature under development" color="blue">
          Community Id:, {communityId} ...
        </Callout>
      </div>
    </div>
  );
};

export default CommunityPage;
