"use client";

import React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { passwordSchema } from "../lib/schemas";
import { z } from "zod";

type FormData = {
  password: string;
  confirmPassword: string;
};

interface PasswordSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { password: string }) => void;
}

export function PasswordSetupModal({
  isOpen,
  onClose,
  onSubmit,
}: PasswordSetupModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(
      z
        .object({
          password: passwordSchema,
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        })
    ),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/user-profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: data.password }),
      });

      if (!response.ok) {
        throw new Error("Failed to set password");
      }

      onSubmit({ password: data.password });
    } catch (error) {
      console.error("Error setting password:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-all duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Set Password</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Password"
              {...register("password")}
              className={`w-full ${errors.password ? "border-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              className={`w-full ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full ${
              isValid ? "bg-[#093753] hover:bg-[#0f2a43]" : "bg-gray-400"
            } text-white py-2 rounded transition-colors`}
            disabled={!isValid}
          >
            Set Password
          </Button>
        </form>
      </div>
    </div>
  );
}
