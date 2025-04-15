// components/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";
import Forbidden from "./forbidden";
import Unauthenticated from "./unauthenticated";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "manager" | "employee" | "admin";
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
  let isAllowed = true;

  // No redirect here; just check auth state

  // Authorization check
  if (isAuthenticated && requiredRole) {
    if (user?.role !== requiredRole) {
      isAllowed = false;
    }
  }

  if (!isAuthenticated) {
    return <Unauthenticated />;
  }

  if (!isAllowed) {
    return <Forbidden />;
  }

  return <>{children}</>;
};

export default AuthGuard;
