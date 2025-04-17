"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../stores/authStore";

interface ProfileData {
  id: string; // Database-generated ID
  workId: string; // User-provided work ID
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: {
    name: string;
  };
  profileImageUrl: string;
  region: string;
  nationalId: string;
}

// Custom hook for fetching and managing user profile data
export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  // Fetch profile data when component mounts or user changes
  useEffect(() => {
    const fetchProfileData = async () => {
      // Check if user is authenticated
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/user-profile/profile-data?userId=${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to fetch profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]); // Refetch when user ID changes

  return {
    profileData,
    isLoading,
  };
};
