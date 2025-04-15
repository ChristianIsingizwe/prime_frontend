"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { useProfileUpload } from "../../lib/hooks/useProfileUpload";
import { RemoveProfileModal } from "../../components/remove-profile-modal";

export default function SettingsPage() {
  const [isPasswordModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfilePicture, isUploading } = useProfileUpload();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = await uploadProfilePicture(file);
    if (imageUrl) {
      setProfilePicture(imageUrl);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture("/default-avatar.png");
    setIsRemoveModalOpen(false);
  };

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
                    src={profilePicture}
                    alt="Profile picture"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-medium">Ange Kevine Uwayo</h3>
                <p className="text-gray-600 mb-1">Prime Insurance</p>
                <p className="text-gray-600 mb-4">Manager</p>
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
                  value="Irene"
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
                  value="Kagabo"
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
                  value="kagabo.irene@primelife.rw"
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
                  value="+250 789 123 456"
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
                  value="123-456-789"
                  className="w-full bg-gray-50 border-gray-200"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <Input
                  type="text"
                  value="Kigali"
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
