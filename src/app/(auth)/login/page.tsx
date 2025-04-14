"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  employmentId: z.string().nonempty("Employment ID is required"),
  password: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [hasPassword, setHasPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Watch for changes in email and employmentId to check if user has password
  const email = watch("email");
  const employmentId = watch("employmentId");

  useEffect(() => {
    // Here you would typically make an API call to check if the user has set a password
    // For now, we'll simulate this with localStorage
    if (email && employmentId) {
      const userKey = `${email}-${employmentId}`;
      const hasPassword = localStorage.getItem(userKey) === "true";
      setHasPassword(hasPassword);
    }
  }, [email, employmentId]);

  const onSubmit = (data: FormData) => {
    // Here you would typically make an API call to verify credentials
    // For now, we'll simulate this with localStorage
    const userKey = `${data.email}-${data.employmentId}`;

    if (hasPassword) {
      if (!data.password) {
        setLoginError("Password is required");
        return;
      }

      const storedPassword = localStorage.getItem(`${userKey}-password`);
      if (data.password !== storedPassword) {
        setLoginError("Invalid password");
        return;
      }
    } else {
      // If user doesn't have password, redirect to password setup
      router.push("/password-setup");
      return;
    }

    // If all checks pass, redirect to dashboard
    router.push("/home");
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-12 flex flex-col justify-center items-center">
        <div className="mb-8 w-full max-w-md">
          <div className="mb-8 flex justify-center md:justify-start">
            <Image
              src="/logo.svg"
              alt="Prime insurance logo."
              height={65}
              width={170}
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-1 border-b pb-4 text-center md:text-left">
            Welcome back!
          </h1>

          <p className="text-gray-600 mt-4 sm:mt-6 mb-6 sm:mb-8 font-bold text-center md:text-left">
            Log in to manage agents, track performance, and monitor attendance
            with real-time updates.
          </p>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Login</h2>
          <p className="text-gray-600 mb-6">Login to your account in seconds</p>

          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {loginError}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-3 border border-gray-300 rounded"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Employment ID"
                className="w-full p-3 border border-gray-300 rounded"
                {...register("employmentId")}
              />
              {errors.employmentId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employmentId.message}
                </p>
              )}
            </div>

            {hasPassword && (
              <>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-[#093753] hover:text-[#0f2a43] text-sm font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className={`w-full p-3 rounded transition-colors ${
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
