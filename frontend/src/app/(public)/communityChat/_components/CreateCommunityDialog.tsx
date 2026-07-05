"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { useCreateCommunity } from "@/hooks/useCommunities";

export const CreateCommunityDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [tagsInput, setTagsInput] = useState("");

  const { data: categories } = useCategories();
  const { mutate: createCommunity, isPending } = useCreateCommunity();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setIsPublic(true);
    setTagsInput("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !categoryId) return;

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    createCommunity(
      { title: title.trim(), description: description.trim(), categoryId, isPublic, tags },
      {
        onSuccess: () => {
          toast.success("Community created");
          resetForm();
          setOpen(false);
        },
        onError: () => {
          toast.error("Couldn't create the community. Try again.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button className="flex items-center gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Create Community
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a community</DialogTitle>
          <DialogDescription>
            Start a space where people can find each other and talk about a shared topic.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="community-title">Name</Label>
            <Input
              id="community-title"
              placeholder="e.g., React Developers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-description">Description</Label>
            <Textarea
              id="community-description"
              placeholder="What is this community about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={280}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="community-category">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="community-tags">Tags</Label>
            <Input
              id="community-tags"
              placeholder="react, frontend, hooks (comma separated)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-3">
            <div>
              <Label htmlFor="community-public">Public community</Label>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Anyone can find and join. Turn off to make it invite-only.
              </p>
            </div>
            <Switch id="community-public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !categoryId || isPending}>
            {isPending ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : null}
            Create community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
