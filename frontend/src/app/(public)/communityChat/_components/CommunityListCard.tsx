"use client";

import AvatarCircles from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { MdTrendingUp, MdPeople, MdStar } from "react-icons/md";
import { Community } from "@/types/community";
import { formatDateToMMDDYYYY } from "@/lib/utils/utils";
import { useJoinCommunity } from "@/hooks/useCommunities";
import { getCategoryColor } from "./categoryColors";

export const CommunityListCard = ({
  community,
  userId,
  isJoined,
}: {
  community: Community;
  userId: string;
  isJoined: boolean;
}) => {
  const router = useRouter();
  const { mutate: joinCommunity, isPending } = useJoinCommunity();
  const color = getCategoryColor(community.category.name);

  const handleClick = () => {
    if (isJoined) {
      router.push(`/communityChat/${community.id}`);
      return;
    }
    joinCommunity(community.id, {
      onSuccess: () => router.push(`/communityChat/${community.id}`),
      onError: () => toast.error("Couldn't join this community. Try again."),
    });
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-md border-zinc-200 dark:border-zinc-700">
      <span className={`absolute top-0 bottom-0 left-0 w-1 ${color.ring}`} />
      <CardContent className="p-6 pl-7">
        <div className="flex items-center gap-4">
          {/* Avatar Section */}
          {community.totalMembers > 0 && (
            <div className="flex-shrink-0">
              <AvatarCircles
                numPeople={community.totalMembers}
                avatarUrls={community.avatarUrls}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-zinc-800 dark:text-white truncate">
                    {community.title}
                  </h3>
                  {community.isTrending && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 flex-shrink-0"
                    >
                      <MdTrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  {community.isPopular && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 flex-shrink-0"
                    >
                      <MdStar className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                  {community.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>{community.members.filter(member => member.isOnline).length} online</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MdPeople className="h-4 w-4" />
                    <span>{community.members.length} members</span>
                  </div> 
                  <span>•</span>
                  <span>Last activity: {formatDateToMMDDYYYY(community.lastActiveAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
                  >
                    {community.category.name}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {community.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {community.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{community.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex-shrink-0 ml-4">
                <Button
                  size="sm"
                  onClick={handleClick}
                  disabled={isPending}
                  className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                >
                  {isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : null}
                  {isJoined ? "View" : "Join Now"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
