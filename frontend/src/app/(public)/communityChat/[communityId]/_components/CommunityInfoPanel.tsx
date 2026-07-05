"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { Community } from "@/types/community";
import {
  useCommunityMembers,
  useUpdateCommunity,
  useDeleteCommunity,
  useUpdateMemberRole,
  useKickMember,
  useLeaveCommunity,
} from "@/hooks/useCommunities";

interface CommunityInfoPanelProps {
  communityId: string;
  community: Community;
  isAdmin: boolean;
  isModerator: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "info" | "settings" | "members";
}

const CommunityInfoPanel = ({
  communityId,
  community,
  isAdmin,
  isModerator,
  open,
  onOpenChange,
  initialTab = "info",
}: CommunityInfoPanelProps) => {
  const router = useRouter();
  const { data: members, isLoading: loadingMembers } = useCommunityMembers(communityId);
  const updateCommunity = useUpdateCommunity(communityId);
  const deleteCommunity = useDeleteCommunity();
  const updateRole = useUpdateMemberRole(communityId);
  const kickMember = useKickMember(communityId);
  const leaveCommunity = useLeaveCommunity();

  const [title, setTitle] = useState(community.title);
  const [description, setDescription] = useState(community.description || "");

  const handleSaveSettings = () => {
    updateCommunity.mutate(
      { title, description },
      {
        onSuccess: () => toast.success("Community updated"),
        onError: () => toast.error("Couldn't update the community. Try again."),
      }
    );
  };

  const handleDeleteCommunity = () => {
    if (!confirm(`Delete "${community.title}"? This cannot be undone.`)) return;
    deleteCommunity.mutate(communityId, {
      onSuccess: () => {
        toast.success("Community deleted");
        router.push("/communityChat");
      },
      onError: () => toast.error("Couldn't delete the community. Try again."),
    });
  };

  const handleLeave = () => {
    leaveCommunity.mutate(communityId, {
      onSuccess: () => {
        onOpenChange(false);
        router.push("/communityChat");
      },
      onError: () => toast.error("Couldn't leave the community. Try again."),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{community.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={initialTab}>
          <TabsList>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            {isAdmin && <TabsTrigger value="settings">Settings</TabsTrigger>}
          </TabsList>

          <TabsContent value="info" className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {community.description || "No description yet."}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {community.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <Button variant="destructive" size="sm" onClick={handleLeave}>
              Leave Community
            </Button>
          </TabsContent>

          <TabsContent value="members" className="space-y-2 max-h-80 overflow-y-auto">
            {loadingMembers ? (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
            ) : (
              members?.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {(member.user.name || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.user.name}</div>
                      <Badge variant="outline" className="text-[10px]">
                        {member.role}
                      </Badge>
                    </div>
                  </div>
                  {isAdmin && member.role !== "ADMIN" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updateRole.isPending}
                        onClick={() =>
                          updateRole.mutate({
                            userId: member.userId,
                            role: member.role === "MODERATOR" ? "MEMBER" : "MODERATOR",
                          })
                        }
                      >
                        {member.role === "MODERATOR" ? "Demote" : "Promote"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={kickMember.isPending}
                        onClick={() => kickMember.mutate(member.userId)}
                      >
                        Kick
                      </Button>
                    </div>
                  )}
                  {isModerator && !isAdmin && member.role === "MEMBER" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={kickMember.isPending}
                      onClick={() => kickMember.mutate(member.userId)}
                    >
                      Kick
                    </Button>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          {isAdmin && (
            <TabsContent value="settings" className="space-y-3">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={280}
              />
              <div className="flex items-center justify-between">
                <Button onClick={handleSaveSettings} disabled={updateCommunity.isPending}>
                  {updateCommunity.isPending && (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  )}
                  Save changes
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCommunity}
                  disabled={deleteCommunity.isPending}
                >
                  Delete Community
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityInfoPanel;
