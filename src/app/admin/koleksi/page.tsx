"use client";
import { useEffect, useState } from "react";
import { loadKoleksi, type KoleksiItem } from "@/lib/koleksiStore";

export default function KoleksiPublik() {
  const [items, setItems] = useState<KoleksiItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => { setItems(loadKoleksi()); }, []);

  const filtered = items.filter(i =>
    (i.title || "").toLowerCase().includes(q.toLowerCase()) ||
    (i.category || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main className="p-6 space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Koleksi Museum</h1>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Cari judul / kategori…"
          className="border rounded-lg px-3 py-2 w-full sm:w-72"
        />
      </header>

      {filtered.length === 0 ? (
        <div className="text-neutral-600">Belum ada koleksi.</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map(it => (
            <article key={it.slug} className="rounded-xl border bg-white overflow-hidden hover:shadow-sm transition">
              <img src={it.images?.[0] || "/museum.jpg"} alt={it.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h2 className="font-semibold line-clamp-2">{it.title}</h2>
                <p className="text-sm text-neutral-600 mt-1">{it.category || "—"} • {it.status || "—"}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
