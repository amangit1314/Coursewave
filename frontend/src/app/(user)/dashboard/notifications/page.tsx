"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  Inbox,
} from "lucide-react";
import { apiManager } from "@/lib/api/api-manager";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PageContainer,
  PageHeader,
  EmptyState,
  LoadingPage,
  StatusBadge,
} from "@/components/shared";
import { staggerItem } from "@/lib/config/motion";

interface Notification {
  id: string;
  userId: string;
  role: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  data?: unknown;
  channel: string;
  read: boolean;
  sentAt: string;
  viewedAt?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type NotificationType = "info" | "success" | "warning" | "error" | "neutral";

function getNotificationType(type: string): NotificationType {
  switch (type.toLowerCase()) {
    case "course":
    case "enrollment":
      return "info";
    case "achievement":
    case "certificate":
      return "warning";
    case "payment":
    case "subscription":
      return "success";
    case "system":
    case "alert":
      return "error";
    default:
      return "neutral";
  }
}

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["notifications", page],
    queryFn: async () => {
      const res = await apiManager.get<NotificationsResponse>(
        `/notifications?page=${page}&limit=20`
      );
      return res.data;
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiManager.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiManager.put("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiManager.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = useCallback(
    (id: string) => markAsReadMutation.mutate(id),
    [markAsReadMutation]
  );

  const handleMarkAllAsRead = useCallback(
    () => markAllAsReadMutation.mutate(),
    [markAllAsReadMutation]
  );

  const handleDelete = useCallback(
    (id: string) => deleteNotificationMutation.mutate(id),
    [deleteNotificationMutation]
  );

  const notifications = response?.notifications ?? [];
  const pagination = response?.pagination;
  const unreadCount = response?.unreadCount ?? 0;

  if (isLoading) {
    return (
      <PageContainer size="md">
        <LoadingPage variant="table" />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer size="md">
        <EmptyState
          icon={BellOff}
          title="Failed to load notifications"
          description="Please try again later."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="md">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
            : "You're all caught up"
        }
      >
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="gap-2"
          >
            {markAllAsReadMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all as read
          </Button>
        )}
      </PageHeader>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No notifications yet"
          description="When you receive notifications about your courses, achievements, or account activity, they will appear here."
        />
      ) : (
        <Card>
          <ScrollArea className="max-h-[70vh]">
            <AnimatePresence mode="popLayout">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  layout
                  className={`flex items-start gap-4 px-6 py-4 border-b border-border last:border-b-0 transition-colors ${
                    !notification.read
                      ? "bg-primary/5"
                      : "bg-card"
                  }`}
                >
                  {/* Unread indicator */}
                  <div className="flex-shrink-0 pt-1.5">
                    {!notification.read ? (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4
                        className={`text-sm text-foreground truncate ${
                          !notification.read ? "font-semibold" : "font-medium"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      <StatusBadge
                        status={getNotificationType(notification.type)}
                        label={notification.type}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-1 block">
                      {formatTimeAgo(notification.sentAt)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(notification.id)}
                      disabled={deleteNotificationMutation.isPending}
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages} ({pagination.total}{" "}
                total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </PageContainer>
  );
}
