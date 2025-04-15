"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface ProfileData {
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  workId: string;
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/user-profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData({
          firstName: data.firstName,
          lastName: data.lastName,
          name: data.name,
          email: data.email,
          workId: data.workId,
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
  }, []);

  return { profileData, isLoading };
}
