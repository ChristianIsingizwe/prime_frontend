"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { format } from "date-fns";

interface NotificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: number;
    title: string;
    message: string;
    senderName: string;
    sendTime: string;
  };
  onMarkAsRead: (id: number) => void;
  isMarkAsReadSuccess: boolean;
}

export function NotificationDetailsModal({
  isOpen,
  onClose,
  notification,
  onMarkAsRead,
  isMarkAsReadSuccess,
}: NotificationDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      onMarkAsRead(notification.id);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, notification.id, onMarkAsRead]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={cn(
          "bg-white rounded-lg p-5 sm:p-6 w-full max-w-md shadow-xl",
          "transform transition-all duration-300",
          "animate-in fade-in zoom-in-95"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold mb-4">{notification.title}</h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-600">{notification.message}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>From: {notification.senderName}</span>
            <span>
              {format(new Date(notification.sendTime), "MMM d, yyyy h:mm a")}
            </span>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            className="bg-[#093753] hover:bg-[#0f2a43] text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
