import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const pass = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");

  if (pass === process.env.ADMIN_PASS) {
    const res = NextResponse.redirect(new URL(next, req.url));

    // secure cookie HANYA di production (Vercel)
    const isProd = process.env.NODE_ENV === "production";

    res.cookies.set("admin_auth", pass, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,      // ⟵ perbaikan utama
      path: "/",
      maxAge: 60 * 60 * 8, // 8 jam
    });

    return res;
  }

  // kalau salah, balik ke login (opsional beri query ?e=1 utk pesan)
  return NextResponse.redirect(new URL(`/admin/login?e=1&next=${encodeURIComponent(next)}`, req.url));
}
