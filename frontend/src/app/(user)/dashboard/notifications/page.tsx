"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  Inbox,
} from "lucide-react";
import { dmSans } from "@/lib/config/fonts";
import { apiManager } from "@/lib/api/api-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "course":
    case "enrollment":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "achievement":
    case "certificate":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "payment":
    case "subscription":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "system":
    case "alert":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

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
    (id: string) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteNotificationMutation.mutate(id);
    },
    [deleteNotificationMutation]
  );

  const notifications = response?.notifications ?? [];
  const pagination = response?.pagination;
  const unreadCount = response?.unreadCount ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <BellOff className="h-12 w-12 mx-auto mb-4 text-zinc-400" />
            <p className="text-zinc-600 dark:text-zinc-400">
              Failed to load notifications. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`${dmSans.className} min-h-screen bg-gradient-to-br from-zinc-50 via-white to-blue-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-blue-900/20`}
    >
      <div className="mx-auto max-w-4xl px-4 py-11 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 mt-16">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-7 w-7 text-zinc-900 dark:text-white" />
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl tracking-tight">
                  Notifications
                </h1>
                <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                    : "You're all caught up"}
                </p>
              </div>
            </div>
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
          </div>
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Inbox className="h-16 w-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                No notifications yet
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                When you receive notifications about your courses, achievements,
                or account activity, they will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <ScrollArea className="max-h-[70vh]">
              <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex items-start gap-4 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0 transition-colors ${
                      !notification.read
                        ? "bg-blue-50/50 dark:bg-blue-950/20"
                        : "bg-white dark:bg-zinc-900"
                    }`}
                  >
                    {/* Unread indicator */}
                    <div className="flex-shrink-0 pt-1.5">
                      {!notification.read ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`text-sm font-semibold text-zinc-900 dark:text-white truncate ${
                            !notification.read ? "" : "font-medium"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] px-1.5 py-0 shrink-0 ${getTypeColor(notification.type)}`}
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 block">
                        {formatTimeAgo(notification.sentAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400"
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
                        className="h-8 w-8 text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
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
              <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
      </div>
    </div>
  );
}
