"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface ProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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
        <h3 className="text-xl font-semibold mb-4">Remove profile picture</h3>
        <p className="mb-6 text-gray-600">
          Are you sure you want to remove your profile picture?
          <br />
          This action cannot be undone, and your profile will revert to the
          default image.
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
            onClick={onConfirm}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
