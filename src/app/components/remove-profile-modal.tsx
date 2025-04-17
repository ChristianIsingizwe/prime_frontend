"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";

interface RemoveProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveProfileModal({
  isOpen,
  onClose,
  onConfirm,
}: RemoveProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleRemove = async () => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `/api/user-profile/profile-image?userId=${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove profile picture");
      }

      toast.success("Profile picture removed successfully");
      onConfirm();
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture. Please try again.");
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
        <h3 className="text-xl font-semibold mb-4">Remove Profile Picture</h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to remove your profile picture? This action
          cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemove}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
