import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// (opsional) kalau mau judul admin khusus:
// export const metadata = { title: { default: "Admin Panel", template: "%s | Museum Mulawarman" } };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = (await cookies()).get("admin_auth")?.value === "1";
  if (!authed) redirect("/login?next=%2Fadmin");
  return <>{children}</>;
}
