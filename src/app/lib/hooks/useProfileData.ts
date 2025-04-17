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

export function useProfileData() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        toast.error("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user-profile?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData({
          id: data.id,
          workId: data.workId,
          firstName: data.firstName,
          lastName: data.lastName,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          role: data.role,
          profileImageUrl: data.profileImageUrl,
          region: data.region,
          nationalId: data.nationalId,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error("Failed to load profile information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  return { profileData, isLoading };
}
