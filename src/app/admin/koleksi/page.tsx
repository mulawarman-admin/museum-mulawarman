"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadKoleksi,
  removeKoleksi,
  updateKoleksi,
  type KoleksiItem,
} from "../../../lib/koleksiStore";

export default function AdminKoleksiPage() {
  const [items, setItems] = useState<KoleksiItem[]>([]);

  const refresh = () => setItems(loadKoleksi());
  useEffect(() => { refresh(); }, []);

  const onDelete = (slug: string) => {
    if (!confirm("Hapus koleksi ini?")) return;
    removeKoleksi(slug);
    refresh();
  };

  const onTogglePublish = (slug: string, curr?: boolean) => {
    updateKoleksi(slug, { isPublished: !curr });
    refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Koleksi</h1>

        <div className="flex gap-2">
          <Link
            href="/admin/koleksi/import"
            className="inline-flex items-center rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" className="mr-2">
              <path fill="currentColor" d="M5 20h14v-2H5v2Zm7-16l-5 5h3v4h4v-4h3l-5-5Z" />
            </svg>
            Import Excel
          </Link>

          <Link
            href="/admin/koleksi/tambah"
            className="px-4 py-2 rounded-xl bg-black text-white"
          >
            + Tambah Koleksi
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-6 bg-white border rounded-2xl">Belum ada data.</div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left p-3">Nama</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Publik</th>
                <th className="text-right p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug} className="border-t">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3">{item.category || "—"}</td>
                  <td className="p-3">{item.status || "—"}</td>
                  <td className="p-3">
                    <button
                      onClick={() => onTogglePublish(item.slug, item.isPublished)}
                      className={`px-2 py-1 rounded-lg border ${
                        item.isPublished ? "text-green-700 border-green-600" : "text-neutral-600"
                      }`}
                      title={item.isPublished ? "Unpublish" : "Publish"}
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/admin/koleksi/edit/${item.slug}`}
                      className="px-3 py-1 rounded-lg border mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(item.slug)}
                      className="px-3 py-1 rounded-lg border text-red-600"
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
