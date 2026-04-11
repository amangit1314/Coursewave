import AvatarCircles from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { MdTrendingUp, MdPeople, MdStar } from "react-icons/md";
import { Community } from "@/types/community";
import { formatDateToMMDDYYYY } from "@/lib/utils/utils";

export const CommunityCard = ({
  community,
  userId,
  isJoined,
}: {
  community: Community;
  userId: string;
  isJoined: boolean;
}) => {
  return (
    // hover:scale-[1.02]
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg  border-zinc-200 dark:border-zinc-700">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {community.title}
              </CardTitle>
              {community.isTrending && (
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                >
                  <MdTrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
              {community.isPopular && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                >
                  <MdStar className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>
                  {community.members.filter((member) => member.isOnline).length}{" "}
                  online
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MdPeople className="h-4 w-4" />
                <span>{community.members.length} members</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <AvatarCircles
            numPeople={community.members.length}
            avatarUrls={community.avatarUrls}
          />
          <Badge variant="outline" className="text-xs">
            {community.category.name}
          </Badge>
        </div>

        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {community.description}
        </CardDescription>

        <div className="flex flex-wrap gap-1">
          {community.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {community.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{community.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Last activity: {formatDateToMMDDYYYY(community.lastActiveAt)}
          </span>
          <Link href={`/communityChat/${community.id}`}>
            <Button
              size="sm"
              className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
            >
              {isJoined ? "View" : "Join Now"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
