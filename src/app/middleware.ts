// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtDecode } from "jwt-decode";

// interface TokenPayload {
//   exp: number;
//   role: string;
// }

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   // Skip for login page and static assets
//   if (
//     request.nextUrl.pathname === "/login" ||
//     request.nextUrl.pathname.startsWith("/_next") ||
//     request.nextUrl.pathname.startsWith("/api")
//   ) {
//     return NextResponse.next();
//   }

//   // Get tokens from cookies
//   const token = request.cookies.get("auth-storage")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     // Parse the token from the storage
//     const storageData = JSON.parse(decodeURIComponent(token));

//     if (!storageData.state?.token) {
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     // Decode JWT token
//     const decoded = jwtDecode<TokenPayload>(storageData.state.token);

//     // Check if token is expired
//     const currentTime = Date.now() / 1000;
//     if (decoded.exp < currentTime) {
//       // Token is expired, redirect to login
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     // Check if user has manager role (from token or stored user data)
//     const tokenRole = decoded.role || "";
//     const userRole = storageData.state.user?.role || "";

//     // Check if either token or user role is manager
//     const hasManagerRole = tokenRole === "manager" || userRole === "manager";

//     if (!hasManagerRole) {
//       // User doesn't have manager role, redirect to login
//       return NextResponse.redirect(new URL("/login", request.url));
//     }

//     // User is authenticated and has manager role
//     return NextResponse.next();
//   } catch (error) {
//     console.error("Auth middleware error:", error);
//     // Error parsing token, redirect to login
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     // Match all paths except static files, api routes, and login
//     "/((?!_next/static|_next/image|favicon.ico|api|login).*)",
//   ],
// };
