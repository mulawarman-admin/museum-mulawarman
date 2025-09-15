// src/middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("admin_auth")?.value;

  // Lindungi semua halaman /admin/...
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }
  }

  // Lindungi juga API di bawah /api/admin/ kalau ada
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    if (!token) return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.next();
}

// Hanya aktif untuk path berikut:
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
