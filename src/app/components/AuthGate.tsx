"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, token, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isAuthPage =
      pathname.startsWith("/login") || pathname.startsWith("/forgot-password");
    const isPublicPage =
      pathname === "/" || pathname === "/about" || pathname === "/contact";

    if (!isAuthenticated && !isAuthPage && !isPublicPage) {
      router.replace("/login");
      return;
    }

    if (isAuthenticated && isAuthPage) {
      router.replace("/home");
      return;
    }

    if (isAuthenticated && user) {
      const isAdmin = user.role === "admin";
      const isAgent = user.role === "agent";

      if (pathname.startsWith("/admin") && !isAdmin) {
        router.replace("/home");
        return;
      }

      if (pathname.startsWith("/dashboard") && !isAgent) {
        router.replace("/admin");
        return;
      }
    }

    setIsChecking(false);
  }, [isAuthenticated, pathname, router, user]);

  // Don't render anything while checking authentication
  if (isChecking) {
    return null;
  }

  // Only render children if all checks pass
  return <>{children}</>;
}
