import { useState } from "react";
import { toast } from "react-hot-toast";

export function useProfileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePicture = async (file: File) => {
    if (!file) return null;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return null;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/user-profile/profile-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      toast.success(data.message || "Profile picture updated successfully");
      return data.imageUrl;
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload profile picture. Please try again.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadProfilePicture, isUploading };
}
