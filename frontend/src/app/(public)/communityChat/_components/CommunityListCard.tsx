"use client";

import AvatarCircles from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

import { MdTrendingUp, MdPeople, MdStar } from "react-icons/md";
import { Community } from "@/types/community";
import { formatDateToMMDDYYYY } from "@/lib/utils/utils";

export const CommunityListCard = ({
  community,
  userId,
  isJoined,
}: {
  community: Community;
  userId: string;
  isJoined: boolean;
}) => {
  return (
    <Card className="group transition-all duration-300 hover:shadow-md border-zinc-200 dark:border-zinc-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <AvatarCircles
              numPeople={community.totalMembers}
              avatarUrls={community.avatarUrls}
            />
          </div>

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
                  <Badge variant="outline" className="text-xs">
                    {community.category.name}
                  </Badge>
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
                <Link href={`/communityChat/${community.id}`}>
                  <Button
                    size="sm"
                    className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                   {isJoined ? "View" : "Join Now"}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
