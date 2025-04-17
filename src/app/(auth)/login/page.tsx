"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "../../lib/apiClient";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

// Password validation schema requiring strong password criteria
const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

// Form validation schema using Zod
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  workId: z.string().nonempty("Work ID is required"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || strongPassword.safeParse(val).success, {
      message:
        "Password must be strong (min 8 chars, upper, lower, number, special)",
    }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setLoginError(null);
    try {
      // Attempt login with provided credentials
      const response = await apiClient.post("/auth/login", {
        email: data.email,
        workId: data.workId,
        password: data.password || undefined,
      });

      // Extract user data and tokens from response
      const {
        token,
        refreshToken,
        expiresIn,
        workId,
        email,
        firstName,
        lastName,
        role,
        name,
        id,
      } = response.data;

      // Update auth store with user data and tokens
      setAuth({
        token,
        refreshToken,
        user: { id, workId, email, firstName, lastName, role, name },
        isAuthenticated: true,
        expiresIn,
      });

      // Redirect based on user role
      if (role === "admin") {
        router.push("/admin/managers");
      } else if (role === "manager") {
        router.push("/home");
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      // Handle login errors
      const msg = error?.response?.data?.message || "Login failed";
      setLoginError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center">
        <div className="mb-4 w-full max-w-md">
          <div className="mb-4 flex justify-center md:justify-start">
            <Image
              src="/logo.svg"
              alt="Prime insurance logo."
              height={50}
              width={130}
              priority
            />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold mb-1 border-b pb-2 text-center md:text-left">
            Welcome back!
          </h1>

          <p className="text-gray-600 mt-2 mb-4 text-sm font-bold text-center md:text-left">
            Log in to manage agents, track performance, and monitor attendance
            with real-time updates.
          </p>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-lg sm:text-xl font-bold mb-1">Login</h2>
          <p className="text-gray-600 mb-4 text-sm">
            Login to your account in seconds
          </p>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
              {loginError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded text-base"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Work ID"
                className="w-full p-3 border border-gray-300 rounded text-base"
                {...register("workId")}
              />
              {errors.workId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.workId.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Password (optional)"
                className="w-full p-3 border border-gray-300 rounded text-base"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[#093753] hover:text-[#0f2a43] text-xs font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={!isValid}
              className={`w-full p-2 rounded transition-colors text-sm ${
                isValid
                  ? "bg-[#093753] text-white hover:bg-[#0a4366]"
                  : "bg-blue-200 text-blue-800"
              } flex justify-center items-center`}
            >
              Log In
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:block md:w-2/5 bg-gray-100 relative">
        <Image
          src="/loginImage.png"
          alt="Father and daughter smiling together"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
    </div>
  );
}
