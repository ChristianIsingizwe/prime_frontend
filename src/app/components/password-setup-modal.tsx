"use client";

import React from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { passwordSetupSchema } from "../lib/schemas";
import type { z } from "zod";

type FormData = z.infer<typeof passwordSetupSchema>;

interface PasswordSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { workId: string; email: string; password: string }) => void;
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
    resolver: zodResolver(passwordSetupSchema),
    mode: "onChange",
  });

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      workId: data.workId,
      email: data.email,
      password: data.password,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Fill the form</h3>
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
              type="text"
              placeholder="Work ID"
              {...register("workId")}
              className={`w-full ${errors.workId ? "border-red-500" : ""}`}
            />
            {errors.workId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.workId.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={`w-full ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

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
            Use password
          </Button>
        </form>
      </div>
    </div>
  );
}
