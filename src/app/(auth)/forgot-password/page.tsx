"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import apiClient from "../../lib/apiClient";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  workId: z.string().nonempty("Work ID is required"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", {
        email: data.email,
        workId: data.workId,
      });
      toast.success("If the account exists, a reset link has been sent.");
      reset();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Failed to send reset email.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
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
          <p className="text-gray-600 mb-8">Provide your email and work ID</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md"
                {...register("email")}
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
                className="w-full p-3 border border-gray-300 rounded-md"
                {...register("workId")}
              />
              {errors.workId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.workId.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#093753] hover:bg-[#0f2a43] text-white py-3 rounded-md transition-colors"
              disabled={!isValid || loading}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="h-full w-full relative">
          <Image
            src="/loginImage.png"
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
