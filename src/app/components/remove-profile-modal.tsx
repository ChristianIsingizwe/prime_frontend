"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

interface RemoveProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Modal component for removing user profile picture
export default function RemoveProfileModal({
  isOpen,
  onClose,
  onSuccess,
}: RemoveProfileModalProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Function to handle profile picture removal
  const handleRemove = async () => {
    // Check if user is authenticated
    if (!user?.id) {
      toast.error("You must be logged in to remove your profile picture");
      return;
    }

    setIsRemoving(true);
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
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to remove your profile picture?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={isRemoving}
            >
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
