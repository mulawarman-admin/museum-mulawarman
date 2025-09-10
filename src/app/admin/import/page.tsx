"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { addKoleksi, type KoleksiItem } from "../../../lib/koleksiStore";
import { addVisitor } from "../../../lib/visitorStore";

type Row = Record<string, any>;

export default function ImportPage() {
  const [fileName, setFileName] = useState<string>("");
  const [koleksiRows, setKoleksiRows] = useState<Row[]>([]);
  const [visitRows, setVisitRows] = useState<Row[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);

  const pushLog = (m: string) => setLog((L) => [m, ...L]);

  const onFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setLog([]);
    setKoleksiRows([]);
    setVisitRows([]);

    try {
      const ab = await file.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });

      // --- Baca sheet Koleksi ---
      const wsK = wb.Sheets["Koleksi"];
      if (wsK) {
        const json: Row[] = XLSX.utils.sheet_to_json(wsK, { defval: "" });
        setKoleksiRows(json);
        pushLog(`Sheet "Koleksi": ${json.length} baris terbaca`);
      } else {
        pushLog(`Sheet "Koleksi" tidak ditemukan (opsional).`);
      }

      // --- Baca sheet Pengunjung ---
      const wsP = wb.Sheets["Pengunjung"];
      if (wsP) {
        const json: Row[] = XLSX.utils.sheet_to_json(wsP, { defval: "" });
        setVisitRows(json);
        pushLog(`Sheet "Pengunjung": ${json.length} baris terbaca`);
      } else {
        pushLog(`Sheet "Pengunjung" tidak ditemukan (opsional).`);
      }
    } catch (e: any) {
      pushLog(`Gagal membaca file: ${e?.message || e}`);
    }
  };

  // mapping kolom template -> object Koleksi
  const mapKoleksi = (r: Row): Omit<KoleksiItem, "slug"> & { slug: string } | null => {
    // Nama kolom harus sesuai header template
    const title: string = (r["Nama Koleksi *"] || "").toString().trim();
    const category: string = (r["Kategori *"] || "").toString().trim();
    const status: string = (r["Status *"] || "").toString().trim();

    if (!title) return null; // minimal wajib ada nama (baris kosong di-skip)

    const noReg = (r["No. Registrasi"] || "").toString().trim();
    const noInv = (r["No. Inventaris"] || "").toString().trim();
    const period = (r["Periode"] || "").toString().trim();
    const material = (r["Bahan / Material"] || "").toString().trim();
    const origin = (r["Asal / Lokasi Temuan"] || "").toString().trim();
    const condition = (r["Kondisi"] || "").toString().trim();

    const panjang = num(r["Panjang (cm)"]);
    const lebar = num(r["Lebar (cm)"]);
    const tinggi = num(r["Tinggi (cm)"]);
    const berat = num(r["Berat (kg)"]);
    const diaAtas = num(r["Ø Atas (cm)"]);
    const diaTengah = num(r["Ø Tengah (cm)"]);
    const diaBawah = num(r["Ø Bawah (cm)"]);

    const tags = (r["Tag (pisahkan koma)"] || "")
      .toString()
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean)
      .join(", ");

    const images = (r["URL Gambar (pisahkan koma)"] || "")
      .toString()
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const description = (r["Deskripsi"] || "").toString().trim();

    const slug = slugify(title);

    const item: KoleksiItem = {
      slug,
      title,
      category,
      status: status as any, // "Dipamerkan" | "Penyimpanan"
      noReg,
      noInv,
      period,
      material,
      origin,
      condition,
      description,
      tags,        // kita simpan sebagai string (kamu sudah supporting)
      images,      // array string
      dimensions: {
        panjang,
        lebar,
        tinggi,
        berat,
        diameter: {
          atas: diaAtas,
          tengah: diaTengah,
          bawah: diaBawah,
        },
      },
    };

    return item;
  };

  const mapVisitor = (r: Row) => {
    const tanggal = (r["Tanggal (YYYY-MM-DD) *"] || "").toString().trim();
    const kategori = (r["Kategori *"] || "").toString().trim();
    const jumlah = num(r["Jumlah *"]);

    if (!tanggal || !kategori || jumlah == null) return null;

    return {
      tanggal,
      kategori: kategori as "Pelajar" | "Dewasa/Umum" | "Asing",
      jumlah,
    };
  };

  const doImport = async () => {
    setImporting(true);
    let okK = 0;
    let okV = 0;

    try {
      // Import Koleksi
      for (const r of koleksiRows) {
        const item = mapKoleksi(r);
        if (!item) continue;
        try {
          addKoleksi(item);
          okK++;
        } catch (e: any) {
          pushLog(`Gagal impor koleksi "${item.title}": ${e?.message || e}`);
        }
      }
      // Import Pengunjung
      for (const r of visitRows) {
        const v = mapVisitor(r);
        if (!v) continue;
        try {
          addVisitor(v);
          okV++;
        } catch (e: any) {
          pushLog(`Gagal impor pengunjung (${v.tanggal} - ${v.kategori}): ${e?.message || e}`);
        }
      }

      pushLog(`✅ Selesai impor. Koleksi: ${okK}, Pengunjung: ${okV}`);
      alert(`Selesai impor.\nKoleksi: ${okK}\nPengunjung: ${okV}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Import Excel</h1>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <label className="px-4 py-2 rounded-xl border cursor-pointer bg-neutral-50 hover:bg-neutral-100">
            Pilih File Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
          <div className="text-sm text-neutral-600">{fileName || "Belum ada file"}</div>
        </div>

        {/* Ringkasan */}
        <div className="grid sm:grid-cols-3 gap-3">
          <Card label="Baris Koleksi" value={koleksiRows.length} />
          <Card label="Baris Pengunjung" value={visitRows.length} />
          <Card label="Siap Impor" value={(koleksiRows.length + visitRows.length) > 0 ? "Ya" : "Tidak"} />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={doImport}
            disabled={importing || (koleksiRows.length + visitRows.length) === 0}
            className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
          >
            {importing ? "Mengimpor..." : "Impor ke Sistem (LocalStorage)"}
          </button>
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Log</h3>
            <div className="text-sm bg-neutral-50 border rounded-2xl p-3 space-y-1 max-h-64 overflow-auto">
              {log.map((l, i) => (
                <div key={i}>• {l}</div>
              ))}
            </div>
          </div>
        )}

        {/* Preview ringkas */}
        {koleksiRows.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Preview Koleksi (maks 5 baris)</h3>
            <Preview rows={koleksiRows} max={5} />
          </div>
        )}
        {visitRows.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Preview Pengunjung (maks 5 baris)</h3>
            <Preview rows={visitRows} max={5} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Komponen kecil ---------- */
function Card({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="p-4 border rounded-2xl bg-white">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="text-xl font-semibold">{String(value)}</div>
    </div>
  );
}

function Preview({ rows, max = 5 }: { rows: Row[]; max?: number }) {
  const top = rows.slice(0, max);
  if (top.length === 0) return null;
  const headers = Object.keys(top[0] || {});
  return (
    <div className="overflow-auto border rounded-2xl bg-white">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            {headers.map((h) => (
              <th key={h} className="text-left p-3 border-b">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {top.map((r, i) => (
            <tr key={i} className="border-t">
              {headers.map((h) => (
                <td key={h} className="p-3">{String(r[h] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Util ---------- */
function num(v: any): number | undefined {
  if (v === "" || v == null) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
