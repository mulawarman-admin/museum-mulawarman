import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Lindungi semua path di bawah /admin KECUALI /admin/login
  const isAdmin = pathname.startsWith("/admin");
  const isLogin = pathname.startsWith("/admin/login");

  if (isAdmin && !isLogin) {
    const token = req.cookies.get("admin_auth")?.value;
    if (token !== process.env.ADMIN_PASS) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
