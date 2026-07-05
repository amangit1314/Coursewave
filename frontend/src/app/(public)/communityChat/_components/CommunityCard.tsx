import AvatarCircles from "@/components/magicui/avatar-circles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { MdTrendingUp, MdPeople, MdStar } from "react-icons/md";
import { Community } from "@/types/community";
import { formatDateToMMDDYYYY } from "@/lib/utils/utils";
import { useJoinCommunity } from "@/hooks/useCommunities";
import { getCategoryColor } from "./categoryColors";

export const CommunityCard = ({
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
  const onlineCount = community.members.filter((m) => m.isOnline).length;

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
    <Card className="group relative flex h-full flex-col overflow-hidden border-zinc-200 dark:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg pt-1">
      {/* Category-colored top edge */}
      <span className={`absolute top-0 left-0 right-0 h-1 ${color.ring}`} />

      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white line-clamp-1">
            {community.title}
          </h3>
          <span
            className={`shrink-0 text-[11px] font-semibold px-2 py-1 rounded-full ${color.bg} ${color.text}`}
          >
            {community.category.name}
          </span>
        </div>

        {/* Status badges + counts */}
        <div className="flex flex-wrap items-center gap-2">
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
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <div
              className={`h-2 w-2 rounded-full ${onlineCount > 0 ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-600"}`}
            />
            <span>{onlineCount} online</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
            <MdPeople className="h-4 w-4" />
            <span>{community.members.length} members</span>
          </div>
        </div>

        <CardDescription className="line-clamp-2 text-sm leading-relaxed">
          {community.description}
        </CardDescription>

        {community.members.length > 0 && (
          <AvatarCircles
            numPeople={community.members.length}
            avatarUrls={community.avatarUrls}
          />
        )}

        <div className="flex flex-wrap gap-1.5">
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

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Active {formatDateToMMDDYYYY(community.lastActiveAt)}
          </span>
          <Button
            size="sm"
            onClick={handleClick}
            disabled={isPending}
            className="transition-colors"
          >
            {isPending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : null}
            {isJoined ? "View" : "Join Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
