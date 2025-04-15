"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Allow /login and /forgot-password without authentication
    if (pathname === "/login" || pathname === "/forgot-password") {
      setAuthChecked(true);
      return;
    }
    if (!isAuthenticated) {
      router.replace("/login");
      setAuthChecked(false);
    } else if (user?.role === "manager") {
      router.replace("/home");
      setAuthChecked(false);
    } else if (user?.role === "admin") {
      router.replace("/admin/managers");
      setAuthChecked(false);
    } else {
      setAuthChecked(true);
    }
  }, [isAuthenticated, user, router, pathname]);

  if (
    pathname !== "/login" &&
    pathname !== "/forgot-password" &&
    !authChecked
  ) {
    return null;
  }

  return <>{children}</>;
}
