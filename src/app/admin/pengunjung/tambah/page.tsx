"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVisitor } from "../../../../lib/visitorStore"; // ← ganti ke "../../../../lib/visitorStore" jika tidak pakai alias

const today = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

export default function TambahPengunjung() {
  const router = useRouter();

  const [tanggal, setTanggal] = useState<string>(today());
  const [kategori, setKategori] = useState<"Pelajar" | "Dewasa/Umum" | "Asing">(
    "Pelajar"
  );
  const [jumlah, setJumlah] = useState<string>("1");
  const [saving, setSaving] = useState(false);

  const onSubmit = () => {
    const n = Number(jumlah);
    if (!tanggal) return alert("Tanggal wajib diisi");
    if (!n || n < 0) return alert("Jumlah harus angka ≥ 0");

    setSaving(true);
    try {
      addVisitor({ tanggal, kategori, jumlah: n });
      alert("Tersimpan.");
      router.push("/admin/pengunjung");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Pengunjung</h1>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="bg-white border rounded-2xl p-6 grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm">Tanggal</label>
          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Kategori</label>
          <select
            value={kategori}
            onChange={(e) =>
              setKategori(e.target.value as "Pelajar" | "Dewasa/Umum" | "Asing")
            }
            className="w-full rounded-xl border px-3 py-2"
          >
            <option>Pelajar</option>
            <option>Dewasa/Umum</option>
            <option>Asing</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Jumlah</label>
          <input
            type="number"
            min={0}
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
