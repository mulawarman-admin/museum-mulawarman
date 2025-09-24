import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname;

  // Biarkan API/asset
  if (p.startsWith("/api") || p.startsWith("/_next") || p === "/favicon.ico") {
    return NextResponse.next();
  }

  // Kunci semua /admin/**
  if (p.startsWith("/admin")) {
    const authed = req.cookies.get("admin_auth")?.value === "1";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", "/admin");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
