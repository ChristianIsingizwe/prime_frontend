"use client";

import React from "react";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

export default function ForgotPasswordPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement the functionality later
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Image
              src="/logo.svg"
              alt="Prime Insurance Logo"
              width={170}
              height={62}
              priority
            />
          </div>

          <h1 className="text-2xl font-semibold mb-2">Forgot password?</h1>
          <p className="text-gray-600 mb-8">
            Provide your email and employment ID
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Employment ID"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#093753] hover:bg-[#0f2a43] text-white py-3 rounded-md transition-colors"
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="h-full w-full relative">
          <Image
            src="/forgot-password.jpg"
            alt="Father and daughter smiling"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
