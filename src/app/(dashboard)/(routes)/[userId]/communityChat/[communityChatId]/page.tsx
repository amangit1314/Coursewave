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
    <div className="py-10 mt-12 space-y-4 pr-[2.5rem] overflow-y-hidden">
      <div className="flex justify-between items-center rounded-lg w-full h-[64px] bg-blue-700 dark:bg-black px-3">
        <div className="flex justify-start items-center space-x-3">
          <Link href={`/${userId}/communityChat`}>
            <Button
              variant="outline"
              size="icon"
              className="flex justify-center items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200"
            >
              <BiArrowBack className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
            </Button>
          </Link>

          <div>
            <p className="text-white tracking-tight font-semibold">
              Community Name
            </p>
            <div className="flex justify-start items-center space-x-2">
              <p className="h-2 w-2 rounded-full bg-green-500"></p>
              <p className="text-xs text-gray-200">{11} online</p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="flex justify-center items-center h-10 w-10 rounded-md dark:bg-transparent dark:hover:bg-zinc-800 transition-all duration-200"
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
