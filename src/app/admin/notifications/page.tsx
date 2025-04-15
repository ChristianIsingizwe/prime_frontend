"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { useNotifications } from "../../lib/hooks/useNotifications";
import { NotificationDetailsModal } from "../../components/notification-details-modal";
import Image from "next/image";

export default function NotificationsPage() {
  const [selectedNotification, setSelectedNotification] = useState<{
    id: number;
    title: string;
    message: string;
    senderName: string;
    sendTime: string;
  } | null>(null);
  const { notifications, isLoading, markAsRead, isMarkAsReadSuccess } =
    useNotifications();

  const handleNotificationClick = (notification: {
    id: number;
    title: string;
    message: string;
    senderName: string;
    sendTime: string;
  }) => {
    setSelectedNotification(notification);
  };

  const handleCloseModal = () => {
    setSelectedNotification(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader
          title="Notifications"
          icon={<Bell className="h-6 w-6" />}
        />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        <DashboardHeader
          title="Notifications"
          icon={<Bell className="h-6 w-6" />}
        />

        <div className="max-w-4xl mx-auto p-6">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Image
                src="/notifications-notfound.png"
                alt="No notifications"
                width={300}
                height={300}
                className="mb-4"
              />
              <p className="text-gray-600">No unread notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        From: {notification.senderName}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.sendTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedNotification && (
        <NotificationDetailsModal
          isOpen={!!selectedNotification}
          onClose={handleCloseModal}
          notification={selectedNotification}
          onMarkAsRead={markAsRead}
          isMarkAsReadSuccess={isMarkAsReadSuccess}
        />
      )}
    </>
  );
}
