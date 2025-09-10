"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadKoleksi, type KoleksiItem, type Dimensi } from "../../../lib/koleksiStore";

// helper untuk menampilkan dimensi sebagai teks rapi
function formatDimensi(d?: Dimensi) {
  if (!d) return "—";
  const u = d.unit ?? "cm";
  const w = d.weightUnit ?? "gr";

  const parts: string[] = [];

  // Panjang × Lebar × Tinggi
  if (d.panjang != null && d.lebar != null && d.tinggi != null) {
    parts.push(`${d.panjang}×${d.lebar}×${d.tinggi} ${u}`);
  }

  // Diameter (atas/tengah/bawah)
  if (d.diameter && (d.diameter.atas != null || d.diameter.tengah != null || d.diameter.bawah != null)) {
    parts.push(
      `Diameter ${d.diameter.atas ?? "-"} / ${d.diameter.tengah ?? "-"} / ${d.diameter.bawah ?? "-"} ${u}`
    );
  }

  // Berat
  if (d.berat != null) {
    parts.push(`${d.berat} ${w}`);
  }

  return parts.length ? parts.join(" • ") : "—";
}

export default function Detail({ params }: { params: { slug: string } }) {
  const [item, setItem] = useState<KoleksiItem | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const it = loadKoleksi().find((x) => x.slug === params.slug) || null;
    setItem(it);
    setActive(it?.images?.[0] || null);
  }, [params.slug]);

  if (!item) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Koleksi tidak ditemukan</h1>
        <Link href="/koleksi" className="underline">← Kembali</Link>
      </div>
    );
  }

  const images = item.images && item.images.length ? item.images : ["/museum.jpg"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/koleksi" className="text-sm underline">← Kembali</Link>

      <div className="grid lg:grid-cols-2 gap-8 mt-4">
        <div>
          <img
            src={active || images[0]}
            alt={item.title}
            className="w-full aspect-square object-cover rounded-2xl border"
          />
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(src)}
                  className={`border rounded-xl overflow-hidden ${
                    active === src ? "ring-2 ring-black" : ""
                  }`}
                >
                  <img src={src} className="aspect-square object-cover w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <div className="text-neutral-600">{item.category || "—"}</div>
          <div className="mt-4 whitespace-pre-line leading-relaxed">
            {item.description || "Belum ada deskripsi."}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-6 text-sm">
            <Info label="No. Registrasi" value={item.noReg ?? "—"} />
            <Info label="No. Inventaris" value={item.noInv ?? "—"} />
            <Info label="Periode" value={item.period ?? "—"} />
            <Info label="Bahan/Material" value={item.material ?? "—"} />
            {/* di sini kita format objek dimensi jadi teks */}
            <Info label="Dimensi" value={formatDimensi(item.dimensions)} />
            <Info label="Status" value={item.status ?? "—"} />
            <Info label="Asal/Lokasi" value={item.origin ?? "—"} />
            <Info label="Kondisi" value={item.condition ?? "—"} />
          </div>

          {!!item.tags && (
            <div className="mt-4 text-sm">
              <span className="text-neutral-500">Tag: </span>{item.tags}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// value sekarang React.ReactNode agar fleksibel (string/elemen)
function Info({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-xl p-3">
      <div className="text-neutral-500">{label}</div>
      <div className="font-medium">{value ?? "—"}</div>
    </div>
  );
}
