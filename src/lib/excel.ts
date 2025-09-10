// src/lib/excel.ts
import * as XLSX from "xlsx";

export function readSheet<T = any>(file: File): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      try {
        const wb = XLSX.read(fr.result, { type: "binary" });
        const first = wb.SheetNames[0];
        const data = XLSX.utils.sheet_to_json<T>(wb.Sheets[first], {
          defval: "", // kosong => string kosong
          raw: false, // biar tanggal/angka dibaca konsisten
        });
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    fr.onerror = reject;
    fr.readAsBinaryString(file);
  });
}

export function toNumber(v: any): number | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  if (!s) return undefined;
  const n = Number(s.replace(",", ".")); // 12,5 -> 12.5
  return Number.isFinite(n) ? n : undefined;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}


// Koleksi: header + satu baris contoh
export function downloadKoleksiTemplate() {
  const headers = [
    "title","category","description","noReg","noInv",
    "period","material","status","origin","condition","tags",
    "panjang","lebar","tinggi","berat","diamAtas","diamTengah","diamBawah",
  ];

  const example = [
    "Arca Brahma","Arkeologika","Arca batu era klasik","REG-001","INV-001",
    "Abad 13","Batu Andesit","Dipamerkan","Kutai","Baik","arca, hindu",
    120,45,80,35, 25,30,20
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Koleksi");
  XLSX.writeFile(wb, "Template-Koleksi.xlsx");
}

// Pengunjung: header + satu baris contoh
export function downloadVisitorTemplate() {
  const headers = ["tanggal","pelajar","umum","asing","catatan"];
  const example = ["2025-01-15", 120, 300, 5, "Kunjungan studi"];

  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pengunjung");
  XLSX.writeFile(wb, "Template-Pengunjung.xlsx");
}
