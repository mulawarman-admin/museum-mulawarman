// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ message: "ADMIN_PASSWORD belum diset" }, { status: 500 });
  }

  let password = "";
  // dukung form POST dan JSON
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      const body = await req.json();
      password = String(body?.password ?? "");
    } else {
      const form = await req.formData();
      password = String(form.get("password") ?? "");
    }
  } catch { /* ignore */ }

  const next = req.nextUrl.searchParams.get("next") || "/admin";
  const target = new URL(next, req.url); // pastikan absolute URL

  if (password !== ADMIN_PASSWORD) {
    // balik ke login dengan pesan error sederhana (opsional tambahkan ?err=1)
    const back = new URL(`/login?next=${encodeURIComponent(next)}`, req.url);
    return NextResponse.redirect(back, { status: 302 });
  }

  const res = NextResponse.redirect(target, { status: 302 });
  res.cookies.set("admin_auth", "1", {
    httpOnly: true,
    secure: true,       // Vercel = HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8 // 8 jam
  });
  return res;
}
