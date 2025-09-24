// src/app/api/logout/route.ts
import { NextResponse } from "next/server";

export const GET = async () => {
  const res = NextResponse.redirect(new URL("/login?loggedOut=1", "https://dbmuseummulawarman.vercel.app"));
  res.cookies.set("admin_auth", "", { path: "/", httpOnly: true, secure: true, sameSite: "lax", maxAge: 0 });
  return res;
};
export const POST = GET;
