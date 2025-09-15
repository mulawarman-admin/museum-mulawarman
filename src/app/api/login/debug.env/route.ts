import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    hasAdminPass: !!(process.env.ADMIN_PASS && String(process.env.ADMIN_PASS).trim()),
  });
}
