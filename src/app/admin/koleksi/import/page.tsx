"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { bulkImport, upsertKoleksi, type KoleksiItem } from "@/lib/koleksiStore";
import Link from "next/link";

type RowIn = Record<string, any>;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ImportKoleksiPage() {
  const [rows, setRows] = useState<KoleksiItem[]>([]);
  const [loading, setLoading] = useState(false);

  // contoh mapping nama kolom Excel → field kita
  const mapRow = (r: RowIn): KoleksiItem | null => {
    const title = String(r["Judul"] ?? r["Title"] ?? "").trim();
    if (!title) return null;

    const slugBase =
      String(r["Slug"] ?? "").trim() || slugify(title + "-" + (r["No.Inv"] ?? r["NoInv"] ?? r["No Reg"] ?? ""));
    const slug = slugBase || slugify(title);

    const images: string[] = [
      r["Gambar1"], r["Gambar2"], r["Gambar3"], r["Gambar4"]
    ].filter(Boolean).map(String);

    // dimensi opsional
    const dim = {
      panjang: num(r["Panjang"]),
      lebar: num(r["Lebar"]),
      tinggi: num(r["Tinggi"]),
      berat: num(r["Berat"]),
      diameter: {
        atas: num(r["Diameter Atas"]),
        tengah: num(r["Diameter Tengah"]),
        bawah: num(r["Diameter Bawah"]),
      },
    };

    return {
      slug,
      title,
      category: pickStr(r, ["Kategori", "Category"]),
      description: pickStr(r, ["Deskripsi", "Description"]),
      noReg: pickStr(r, ["No.Reg", "No Reg", "Registrasi"]),
      noInv: pickStr(r, ["No.Inv", "No Inv", "Inventaris"]),
      period: pickStr(r, ["Periode", "Period"]),
      material: pickStr(r, ["Bahan", "Material"]),
      status: (pickStr(r, ["Status"]) as any) || undefined, // "Dipamerkan" | "Penyimpanan"
      origin: pickStr(r, ["Asal", "Lokasi"]),
      condition: pickStr(r, ["Kondisi", "Condition"]),
      tags: pickStr(r, ["Tag", "Tags", "Keterangan"]),
      images: images.length ? images : undefined,
      dimensions: hasAnyDim(dim) ? dim : undefined,
      isPublished: false, // ← default Draft
    };
  };

  const onUpload = async (file: File) => {
    setLoading(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: RowIn[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const out: KoleksiItem[] = [];
      for (const r of json) {
        const it = mapRow(r);
        if (it) out.push(it);
      }
      setRows(out);
    } finally {
      setLoading(false);
    }
  };

  const doImport = () => {
    if (!rows.length) return alert("Tidak ada data untuk diimport.");
    // optional: pecah per 1000 agar aman
    const batchSize = 1000;
    for (let i = 0; i < rows.length; i += batchSize) {
      bulkImport(rows.slice(i, i + batchSize));
    }
    alert(`Import selesai. Total baris: ${rows.length}\nSemua disimpan sebagai Draft.`);
  };

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Import Excel Koleksi</h1>
        <Link href="/admin/koleksi" className="underline">← Kembali</Link>
      </div>

      <div className="bg-white border rounded-2xl p-4 space-y-4">
        <div className="text-sm text-neutral-600">
          Unggah file Excel (.xlsx / .xls). Header yang didukung antara lain:
          <code className="mx-1">Judul, Kategori, Deskripsi, No.Reg, No.Inv, Periode, Bahan, Status, Asal, Kondisi, Tag, Gambar1..4, Panjang, Lebar, Tinggi, Berat, Diameter Atas/Tengah/Bawah</code>.
          Kolom yang tidak ada akan diabaikan.
        </div>

        <label className="block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer bg-neutral-50 hover:bg-neutral-100">
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />
          {loading ? "Memproses…" : "Klik untuk pilih file Excel"}
        </label>

        {rows.length > 0 && (
          <>
            <div className="text-sm text-neutral-600">
              Preview: {rows.length.toLocaleString("id-ID")} baris (maks. 20 ditampilkan)
            </div>
            <div className="overflow-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 text-neutral-600">
                  <tr>
                    <th className="p-2 text-left">Judul</th>
                    <th className="p-2 text-left">Kategori</th>
                    <th className="p-2 text-left">No.Reg</th>
                    <th className="p-2 text-left">No.Inv</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Published?</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 20).map((r) => (
                    <tr key={r.slug} className="border-t">
                      <td className="p-2">{r.title}</td>
                      <td className="p-2">{r.category || "—"}</td>
                      <td className="p-2">{r.noReg || "—"}</td>
                      <td className="p-2">{r.noInv || "—"}</td>
                      <td className="p-2">{r.status || "—"}</td>
                      <td className="p-2">{r.isPublished ? "Yes" : "No (Draft)"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-2">
              <button
                onClick={doImport}
                className="px-4 py-2 rounded-xl bg-black text-white"
              >
                Import sebagai Draft
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

/* util kecil */
function num(v: any): number | undefined {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function pickStr(r: RowIn, keys: string[]): string | undefined {
  for (const k of keys) {
    if (r[k] !== undefined && r[k] !== null && String(r[k]).trim() !== "") return String(r[k]).trim();
  }
  return undefined;
}
function hasAnyDim(d: any) {
  return !!(d?.panjang || d?.lebar || d?.tinggi || d?.berat || d?.diameter?.atas || d?.diameter?.tengah || d?.diameter?.bawah);
}
