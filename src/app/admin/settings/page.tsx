"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { useProfileUpload } from "../../lib/hooks/useProfileUpload";
import { RemoveProfileModal } from "../../components/remove-profile-modal";
import { useProfileData } from "../../lib/hooks/useProfileData";

export default function SettingsPage() {
  const [isPasswordModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfilePicture, isUploading } = useProfileUpload();
  const { profileData, isLoading } = useProfileData();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadProfilePicture(file);
    if (imageUrl) {
      // The profile data will be automatically updated on the next render
      // since the profileImageUrl will be fetched again
    }
  };

  const handleRemoveProfilePicture = () => {
    // The profile data will be automatically updated on the next render
    // since the profileImageUrl will be fetched again
    setIsRemoveModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <DashboardHeader
          title="Settings"
          icon={<Settings className="h-6 w-6" />}
        />
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-32 h-32 rounded-full bg-gray-200"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`min-h-screen bg-white ${
          isPasswordModalOpen || isRemoveModalOpen ? "blur-sm" : ""
        } transition-all duration-200`}
      >
        <DashboardHeader
          title="Settings"
          icon={<Settings className="h-6 w-6" />}
        />

        <div className="max-w-4xl mx-auto p-6">
          {/* User Profile Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">User Profile</h2>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={profileData?.profileImageUrl || "/default-avatar.png"}
                    alt="Profile picture"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-medium">
                  {profileData?.name || ""}
                </h3>
                <p className="text-gray-600 mb-1">Prime Insurance</p>
                <p className="text-gray-600 mb-4">
                  {profileData?.role.name.replace("ROLE_", "") || ""}
                </p>
                <div className="flex gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="primary"
                    className="bg-[#093753] hover:bg-[#0f2a43] text-white px-6"
                    onClick={handleFileSelect}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload New Photo"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 px-6"
                    onClick={() => setIsRemoveModalOpen(true)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <Input
                  type="text"
                  value={profileData?.firstName || ""}
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <Input
                  type="text"
                  value={profileData?.lastName || ""}
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={profileData?.email || ""}
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={profileData?.phoneNumber || ""}
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID
                </label>
                <Input
                  type="text"
                  value={profileData?.nationalId || ""}
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <Input
                  type="text"
                  value={profileData?.region || ""}
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <RemoveProfileModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleRemoveProfilePicture}
      />
    </>
  );
}
