// src/app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const pass = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  const target = (process.env.ADMIN_PASS ?? "").trim();

  if (pass === target && target !== "") {
    const res = NextResponse.redirect(new URL(next, req.url));
    const isProd = process.env.NODE_ENV === "production";
    res.cookies.set("admin_auth", "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      path: "/",
      maxAge: 60 * 60 * 2, // ⟵ 2 jam
    });
    return res;
  }

  return NextResponse.redirect(
    new URL(`/login?error=1&next=${encodeURIComponent(next)}`, req.url)
  );
}
