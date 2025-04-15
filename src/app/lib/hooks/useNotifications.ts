"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  senderWorkId: string;
  senderName: string;
  type: string;
  sendTime: string;
  read: boolean;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export function useNotifications() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/admin/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      return response.json();
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const response = await fetch(
        `/api/admin/notifications/${notificationId}/read`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }
      return response.ok;
    },
    onSuccess: (success, notificationId) => {
      if (success) {
        // Only invalidate the query if the mark as read was successful
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        toast.success("Notification marked as read");
      }
    },
    onError: (error) => {
      toast.error("Failed to mark notification as read. Please try again.");
      console.error("Error marking notification as read:", error);
    },
  });

  const unreadNotifications = data?.notifications.filter((n) => !n.read) || [];

  return {
    notifications: unreadNotifications,
    unreadCount: data?.unreadCount || 0,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
  };
}
