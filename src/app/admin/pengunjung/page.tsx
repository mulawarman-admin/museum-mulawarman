"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadVisitors,
  removeVisitor,
  type Visitor,
  getVisitorStat,
} from "../../../lib/visitorStore"; // ← ganti ke "../../../../lib/visitorStore" jika tidak pakai alias

export default function PengunjungList() {
  const [items, setItems] = useState<Visitor[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setItems(loadVisitors());
  }, [refreshKey]);

  const onDelete = (id: string) => {
    if (!confirm("Hapus entri pengunjung ini?")) return;
    removeVisitor(id);
    setRefreshKey((k) => k + 1);
  };

  const stat = getVisitorStat();
  const total = stat.Pelajar + stat["Dewasa/Umum"] + stat.Asing;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Pengunjung</h1>
        <Link
          href="/admin/pengunjung/tambah"
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          + Tambah Pengunjung
        </Link>
      </div>

      {/* Ringkasan */}
      <div className="grid sm:grid-cols-4 gap-3">
        <CardStat label="Total" value={total} />
        <CardStat label="Pelajar" value={stat.Pelajar} />
        <CardStat label="Dewasa/Umum" value={stat["Dewasa/Umum"]} />
        <CardStat label="Asing" value={stat.Asing} />
      </div>

      {/* Tabel */}
      {items.length === 0 ? (
        <div className="p-6 border rounded-2xl bg-white">
          Belum ada data pengunjung. Klik <b>+ Tambah Pengunjung</b>.
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-2xl bg-white">
          <table className="min-w-[720px] w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left p-3">Tanggal</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-right p-3">Jumlah</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items
                .slice()
                .reverse()
                .map((v) => (
                  <tr key={v.id} className="border-t">
                    <td className="p-3">{v.tanggal}</td>
                    <td className="p-3">{v.kategori}</td>
                    <td className="p-3 text-right">{v.jumlah}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDelete(v.id)}
                        className="px-3 py-1 rounded-lg border text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 border rounded-2xl bg-white">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-2xl font-bold">{value.toLocaleString("id-ID")}</div>
    </div>
  );
}
