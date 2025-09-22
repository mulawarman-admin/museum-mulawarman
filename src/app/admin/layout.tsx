"use client";

import Link from "next/link";
import { useState } from "react";
import { FaHome, FaTachometerAlt, FaTable, FaPlus, FaUsers, FaList } from "react-icons/fa";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// jangan ada "use client" di file ini

 
  const authed = cookies().get("admin_auth")?.value === "1";
  if (!authed) redirect("/login?next=%2Fadmin");



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [openKoleksi, setOpenKoleksi] = useState(false);
  const [openPengunjung, setOpenPengunjung] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-2">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

        {/* Home */}
        <Link href="/" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaHome /> Home
        </Link>

        {/* Dashboard */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
          <FaTachometerAlt /> Dashboard
        </Link>

        {/* Data Koleksi */}
        <div>
          <button
            onClick={() => setOpenKoleksi(!openKoleksi)}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
          >
            <span className="flex items-center gap-2">
              <FaTable /> Data Koleksi
            </span>
            <span>{openKoleksi ? "▲" : "▼"}</span>
          </button>
          {openKoleksi && (
            <div className="ml-6 mt-1 space-y-1">
              <Link href="/admin/koleksi" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                <FaTable /> Data Koleksi
              </Link>
              <Link href="/admin/koleksi/tambah" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
                <FaPlus /> Tambah Koleksi
              </Link>
            </div>
          )}
        </div>

        {/* Data Pengunjung */}
<div>
  <button
    onClick={() => setOpenPengunjung(!openPengunjung)}
    className="flex items-center justify-between w-full p-2 hover:bg-gray-700 rounded"
  >
    <span className="flex items-center gap-2">
      <FaUsers /> Data Pengunjung
    </span>
    <span>{openPengunjung ? "▲" : "▼"}</span>
  </button>
  {openPengunjung && (
    <div className="ml-6 mt-1 space-y-1">
      <Link
        href="/admin/pengunjung"
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
      >
        <FaUsers /> Jumlah Pengunjung
      </Link>
      <Link
        href="/admin/pengunjung/tambah"
        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded"
      >
        <FaPlus /> Tambah Data Pengunjung
      </Link>
    </div>
  )}
</div>

      </aside>

      {/* Konten */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
