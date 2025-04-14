"use client";

import { useEffect, useRef } from "react";
import { Calendar, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { agentFormSchema } from "../lib/schemas";
import type { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type FormData = z.infer<typeof agentFormSchema>;

interface AgentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export function AgentFormModal({
  isOpen,
  onClose,
  onSubmit,
}: AgentFormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(agentFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const mainContent = document.querySelector("main");
    if (mainContent && isOpen) {
      // Add blur to main content
      mainContent.style.filter = "blur(4px)";
      mainContent.style.transition = "filter 0.2s ease-out";
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (mainContent) {
        mainContent.style.filter = "";
        mainContent.style.transition = "";
        document.body.style.overflow = "auto";
      }
    };
  }, [isOpen]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Agent Form</h3>
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
              placeholder="Names"
              {...register("name")}
              className={`w-full ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

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

          <div className="relative">
            <Input
              type="date"
              placeholder="Date Of Birth"
              {...register("dateOfBirth")}
              className={`w-full pr-10 ${
                errors.dateOfBirth ? "border-red-500" : ""
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="Location"
              {...register("location")}
              className={`w-full ${errors.location ? "border-red-500" : ""}`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <Input
              type="text"
              placeholder="National ID"
              {...register("nationalId")}
              className={`w-full ${errors.nationalId ? "border-red-500" : ""}`}
            />
            {errors.nationalId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nationalId.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full ${
              isValid ? "bg-[#003152] hover:bg-[#002544]" : "bg-gray-400"
            } text-white py-2 px-4 rounded transition-colors`}
            disabled={!isValid}
          >
            Add agent
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AgentFormModal;
