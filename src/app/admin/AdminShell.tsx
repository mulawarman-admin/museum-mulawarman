// src/app/admin/AdminShell.tsx
"use client";

import type { ReactNode } from "react";
import { useState } from "react";

export default function AdminShell({ children }: { children: ReactNode }) {
  // Pindahkan state/handler yang sebelumnya ada di layout ke sini
  const [openKoleksi, setOpenKoleksi] = useState(false);
  const [openPengunjung, setOpenPengunjung] = useState(false);

  // TODO: taruh Sidebar/Header kamu di sini jika ada, gunakan state di atas sesuai kebutuhan
  return (
    <div className="flex min-h-screen">
      {/* contoh placeholder sidebar */}
      {/* <Sidebar openKoleksi={openKoleksi} setOpenKoleksi={setOpenKoleksi} ... /> */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
