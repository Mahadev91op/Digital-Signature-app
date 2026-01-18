import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Agar token hai tabhi jaane do
    },
  }
);

// Yahan batayein kis-kis page ko PROTECT karna hai
export const config = {
  matcher: [
    "/",               // Admin Dashboard (Protected)
    "/api/create-doc", // Create API (Protected)
    "/api/delete-doc", // Delete API (Protected)
    "/api/reset-doc",  // Reset API (Protected)
    "/api/get-docs",   // Data Fetch API (Protected)
    // NOTE: "/sign/:path*" aur "/api/save-signature" yahan nahi hai, matlab wo PUBLIC rahenge.
  ],
};