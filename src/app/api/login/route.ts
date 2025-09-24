import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASS ?? "").trim();
  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ message: "ADMIN_PASSWORD belum diset" }, { status: 500 });
  }

  let password = "";
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("application/json")) password = String((await req.json())?.password ?? "");
    else password = String((await req.formData()).get("password") ?? "");
  } catch {}

  const next = req.nextUrl.searchParams.get("next") || "/admin";

  if (password.trim() !== ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL(`/login?error=1&next=${encodeURIComponent(next)}`, req.url), { status: 302 });
  }

  const res = NextResponse.redirect(new URL(next, req.url), { status: 302 });
  res.cookies.set("admin_auth", "1", {
    httpOnly: true,
    secure: true,     // Vercel = HTTPS
    sameSite: "lax",
    path: "/",
  });
  return res;
}
