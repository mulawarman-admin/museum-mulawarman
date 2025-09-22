// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // 1) LEWATKAN API & ASSET (jangan di-intercept)
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|map|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // 2) BATASAN HALAMAN TERPROTEKSI
  const protectedRoots = ["/admin"];
  const isProtected = protectedRoots.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (!isProtected) return NextResponse.next();

  // 3) CEK COOKIE AUTH
  const authed = req.cookies.get("museum_admin_auth")?.value === "1";
  if (authed) return NextResponse.next();

  // 4) REDIRECT KE /login + callback
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  // gunakan "next" (biar URL kamu sekarang tetap dipertahankan)
  url.searchParams.set("next", pathname + (searchParams.toString() ? `?${searchParams}` : ""));
  return NextResponse.redirect(url);
}

// 5) Jalankan middleware untuk semua route non-file
export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
