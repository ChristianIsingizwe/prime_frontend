"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Settings } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { PasswordSetupModal } from "../../components/password-setup-modal";

export default function SettingsPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handlePasswordSubmit = (data: {
    workId: string;
    email: string;
    password: string;
  }) => {
    // Handle password setup logic here
    console.log("Password setup data:", data);
    setIsPasswordModalOpen(false);
  };

  return (
    <>
      <div
        className={`min-h-screen bg-white ${
          isPasswordModalOpen ? "blur-sm" : ""
        } transition-all duration-200`}
      >
        <DashboardHeader
          title="Settings"
          icon={<Settings className="h-6 w-6" />}
        />

        <div className="p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* User Profile Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">User Profile</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                    <Image
                      src="/default-avatar.png"
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
                    <Button
                      variant="primary"
                      className="bg-[#093753] hover:bg-[#0f2a43] text-white px-6"
                    >
                      Upload New Photo
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-300 text-gray-700 px-6"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div>
              <h2 className="text-xl font-semibold mb-6">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <Input
                    type="text"
                    value="Lucky"
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
                    value="Kagabo123@gmail.com"
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
                    value="+250 7889098"
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

            {/* Password Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-6">
                Want to use a password?
              </h2>
              <Button
                variant="primary"
                className="bg-[#093753] hover:bg-[#0f2a43] text-white px-6"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Set up password
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PasswordSetupModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordSubmit}
      />
    </>
  );
}
