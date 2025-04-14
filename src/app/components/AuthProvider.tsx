// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuthStore } from "../stores/authStore";
// import { jwtDecode } from "jwt-decode";
// import Loading from "../loading";

// interface TokenPayload {
//   exp: number;
//   role: string;
// }

// interface AuthProviderProps {
//   children: React.ReactNode;
// }

// export default function AuthProvider({ children }: AuthProviderProps) {
//   const { token, refreshToken, isAuthenticated, hasRole, logout } =
//     useAuthStore();
//   const [isChecking, setIsChecking] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (pathname === "/login" || pathname.startsWith("/api")) {
//       setIsChecking(false);
//       return;
//     }

//     const checkAuth = async () => {
//       if (!isAuthenticated || !token) {
//         router.push("/login");
//         setIsChecking(false);
//         return;
//       }

//       try {
//         const decoded = jwtDecode<TokenPayload>(token);
//         const currentTime = Date.now() / 1000;

//         if (decoded.exp < currentTime) {
//           if (!refreshToken) {
//             logout();
//             router.push("/login");
//             setIsChecking(false);
//             return;
//           }
//         }

//         if (!hasRole("manager")) {
//           logout();
//           router.push("/login");
//           setIsChecking(false);
//           return;
//         }

//         setIsChecking(false);
//       } catch (error) {
//         console.error("Auth provider error:", error);
//         logout();
//         router.push("/login");
//         setIsChecking(false);
//       }
//     };

//     checkAuth();
//   }, [isAuthenticated, token, refreshToken, hasRole, logout, router, pathname]);

//   if (isChecking && pathname !== "/login") {
//     return <Loading />;
//   }

//   return <>{children}</>;
// }
