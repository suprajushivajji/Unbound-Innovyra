import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authConfig } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export function middleware(request: NextRequest) {
  // Just continue without authentication required for now
  // NextAuth handles session management automatically
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
