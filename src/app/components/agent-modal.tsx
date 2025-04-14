"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
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
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    reset();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-white/50 backdrop-blur-[2px] transition-all duration-200" />
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          ref={modalRef}
          className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Add Agent</h3>
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
                placeholder="First Name"
                {...register("firstName")}
                className={`w-full ${errors.firstName ? "border-red-500" : ""}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="text"
                placeholder="Last Name"
                {...register("lastName")}
                className={`w-full ${errors.lastName ? "border-red-500" : ""}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
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
                type="text"
                placeholder="National ID"
                {...register("nationalId")}
                className={`w-full ${
                  errors.nationalId ? "border-red-500" : ""
                }`}
              />
              {errors.nationalId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nationalId.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="text"
                placeholder="Phone Number"
                {...register("phoneNumber")}
                className={`w-full ${
                  errors.phoneNumber ? "border-red-500" : ""
                }`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phoneNumber.message}
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
              Add Agent
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AgentFormModal;
