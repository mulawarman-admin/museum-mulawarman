/"use client";
import type { ReactNode } from "react";
import { useState } from "react";

export default function AdminShell({ children }: { children: ReactNode }) {
  // pindahkan UI interaktif / state ke sini (bila ada)
  const [openKoleksi, setOpenKoleksi] = useState(false);
  const [openPengunjung, setOpenPengunjung] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* sidebar/header kamu di sini */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
