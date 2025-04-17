import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import toast from "react-hot-toast";

interface UseProfileUploadProps {
  onSuccess?: () => void;
}

// Custom hook for handling profile picture uploads
export const useProfileUpload = ({ onSuccess }: UseProfileUploadProps = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Function to upload a profile picture
  const uploadProfilePicture = async (file: File) => {
    // Check if user is authenticated
    if (!user?.id) {
      toast.error("You must be logged in to upload a profile picture");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id); // Use database ID for user identification

    try {
      const response = await fetch("/api/user-profile/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload profile picture");
      }

      toast.success("Profile picture uploaded successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProfilePicture,
  };
};
