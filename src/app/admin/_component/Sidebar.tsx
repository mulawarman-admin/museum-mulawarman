"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: React.ReactNode };

const items: Item[] = [
  { href: "/admin",             label: "Home",            icon: <span>🌐</span> },
  { href: "/admin/dashboard",   label: "Dashboard",       icon: <span>🏠</span> },
  { href: "/admin/koleksi",     label: "Data Koleksi",    icon: <span>📦</span> },
  { href: "/admin/pengunjung",  label: "Data Pengunjung", icon: <span>👥</span> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 border-r bg-white">
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500" />
        <div className="font-semibold">Admin Panel</div>
      </div>
      <nav className="px-2 pb-4 space-y-1">
        {items.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm " +
                (active
                  ? "bg-black text-white"
                  : "text-neutral-700 hover:bg-neutral-100")
              }
            >
              <span className="w-5 text-center">{icon}</span>
              <span className="truncate">{label}</span>
              <span className="ml-auto">{/* caret / chevron jika perlu */}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
<Link href="/admin/koleksi/import" className="...">Import Koleksi (Excel)</Link>