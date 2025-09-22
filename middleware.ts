import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // biarkan API & asset lewat
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|avif|css|js|map|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  // halaman yang dilindungi
  const protectedRoots = ["/admin"];
  const isProtected = protectedRoots.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (!isProtected) return NextResponse.next();

  // cek cookie
  const authed = req.cookies.get("admin_auth")?.value === "1";
  if (authed) return NextResponse.next();

  // kalau belum login → redirect ke /login
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set(
    "next",
    pathname + (searchParams.toString() ? `?${searchParams}` : "")
  );
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!.*\\.).*)"], // jalankan untuk semua route non-file
};
