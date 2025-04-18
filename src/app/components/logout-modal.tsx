"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useAuthStore } from "../stores/authStore";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const logout = useAuthStore((s) => s.logout);
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

  const handleConfirm = () => {
    logout();
    onConfirm();
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
        <h3 className="text-xl font-semibold mb-4">Logging out</h3>
        <p className="mb-6 text-gray-600">Are you sure you want to log out?</p>
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
            onClick={handleConfirm}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            Yes, Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
