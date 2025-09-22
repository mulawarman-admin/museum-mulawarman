import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// JANGAN ada "use client" di file ini
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cs = await cookies(); // Next 15: cookies() -> Promise
  const authed = cs.get("admin_auth")?.value === "1";
  if (!authed) redirect("/login?next=%2Fadmin");
  return <>{children}</>;
}
