import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET || (process.env.NODE_ENV === "development" ? "dev-secret-min-32-chars-long" : undefined);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) return NextResponse.next();
  if (path === "/admin/login") return NextResponse.next();
  try {
    const token = secret ? await getToken({ req: request, secret }) : null;
    if (!token) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(login);
    }
  } catch (err) {
    console.error("Middleware getToken error:", err);
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
