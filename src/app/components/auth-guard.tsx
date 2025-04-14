// components/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "manager" | "employee";
}

const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/home": ["manager"],
  "/dashboard/admin": ["manager"],
  "/reports": ["manager"],

  "/employee-dashboard": ["employee", "manager"],
  "/profile": ["employee", "manager"],
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!token || !isAuthenticated) {
      logout();
      router.replace("/login");
      return;
    }

    const userRole = user?.role || "";

    if (pathname && ROUTE_PERMISSIONS[pathname]) {
      const allowedRoles = ROUTE_PERMISSIONS[pathname];

      if (!allowedRoles.includes(userRole)) {
        if (userRole === "manager") {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      }
    }

    // If component requires a specific role
    if (requiredRole) {
      // If user doesn't have required role
      if (requiredRole === "manager" && userRole !== "manager") {
        // Redirect to appropriate dashboard
        router.replace("/login");
      }
    }
  }, [pathname, token, user, isAuthenticated, router, logout, requiredRole]);

  return <>{children}</>;
};

export default AuthGuard;
