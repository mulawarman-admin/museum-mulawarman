"use client";
import { useEffect, useState } from "react";
import { loadKoleksi, type KoleksiItem } from "@/lib/koleksiStore";

export default function KoleksiPublikPage() {
  const [items, setItems] = useState<KoleksiItem[]>([]);
  useEffect(() => { setItems(loadKoleksi()); }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Koleksi Museum</h1>
      {items.length === 0 ? (
        <p className="text-neutral-600">Belum ada koleksi ditampilkan.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map(it => (
            <article key={it.slug} className="rounded-xl border bg-white overflow-hidden">
              <img src={it.images?.[0] || "/museum.jpg"} alt={it.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="font-semibold">{it.title}</h2>
                <p className="text-sm text-neutral-600">
                  {it.category || "—"} • {it.status || "—"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
