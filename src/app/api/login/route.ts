import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Baca dua nama ENV dan trim spasi
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASS ?? "").trim();
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ message: "ADMIN_PASSWORD belum diset" }, { status: 500 });
  }

  // Terima form atau JSON
  let password = "";
  const ct = req.headers.get("content-type") || "";
  try {
    if (ct.includes("application/json")) {
      const body = await req.json();
      password = String(body?.password ?? "");
    } else {
      const form = await req.formData();
      password = String(form.get("password") ?? "");
    }
  } catch {}

  const next = req.nextUrl.searchParams.get("next") || "/admin";

  // Salah password → balik ke /login?error=1
  if (password.trim() !== ADMIN_PASSWORD) {
    return NextResponse.redirect(
      new URL(`/login?error=1&next=${encodeURIComponent(next)}`, req.url),
      { status: 302 }
    );
  }

  // Benar → set cookie + redirect ke target
  const res = NextResponse.redirect(new URL(next, req.url), { status: 302 });
  res.cookies.set("admin_auth", "1", {
    httpOnly: true,
    secure: true,   // Vercel = HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 jam
  });
  return res;
}
