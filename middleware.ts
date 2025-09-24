import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Jangan ganggu API/static/asset
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Proteksi semua halaman /admin
  if (pathname.startsWith("/admin")) {
    const authed = req.cookies.get("admin_auth")?.value === "1";
    if (!authed) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", "/admin");
      // opsional: tampilkan error jika barusan gagal
      if (searchParams.get("error") === "1") url.searchParams.set("error", "1");
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Matcher default sudah cukup; kalau mau lebih ketat, bisa atur di sini
