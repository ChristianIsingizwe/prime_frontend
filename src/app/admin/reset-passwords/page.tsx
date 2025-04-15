"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardHeader } from "../../components/ui/dashboard-header";
import { Container } from "../../components/ui/container";
import { Card, CardContent } from "../../components/ui/card";
import apiClient from "../../lib/apiClient";
import toast from "react-hot-toast";

// Form validation schema
const resetPasswordSchema = z.object({
  workId: z.string().min(1, "Work ID is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .refine((email) => email.includes("@"), {
      message: "Please enter a valid email address",
    }),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset: resetForm,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange", // Enable real-time validation
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setResetError(null);
      // Make API call to reset password using only workId
      await apiClient.post(`/admin/users/${data.workId}/reset-password`);
      toast.success("Password has been reset successfully!");
      setResetSuccess(true);
      resetForm();
      setTimeout(() => {
        setResetSuccess(false);
      }, 3000);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(msg);
      setResetError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Reset passwords"
        icon={<Lock className="h-5 w-5" />}
        userName="Kagabo Irene Lucky"
      />

      <Container className="py-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-2">Reset password</h2>
              <p className="text-gray-600 text-sm mb-6">
                Please do provide the following in order to reset the
                employee&apos;s password
              </p>

              {resetSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 animate-fade-in">
                  Password has been reset successfully!
                </div>
              )}

              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {resetError}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Work ID"
                    {...register("workId")}
                    className={`w-full p-3 border ${
                      errors.workId ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-none focus:ring-2 focus:ring-[#093753]`}
                  />
                  {errors.workId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.workId.message}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    {...register("email")}
                    className={`w-full p-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded focus:outline-none focus:ring-2 focus:ring-[#093753]`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!isValid}
                  className={`w-full p-3 rounded transition-colors ${
                    isValid
                      ? "bg-[#093753] text-white hover:bg-[#0a4366]"
                      : "bg-blue-200 text-blue-800 cursor-not-allowed"
                  }`}
                >
                  Reset
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
