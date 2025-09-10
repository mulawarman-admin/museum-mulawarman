"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dimensi, KoleksiItem } from "../../../../lib/koleksiStore";
import { loadCategories } from "../../../../lib/categoryStore";
import { addKoleksi } from "../../../../lib/koleksiStore";

type FormState = {
  title: string;
  category: string;
  description: string;
  noReg: string;
  noInv: string;
  period?: string;
  material?: string;
  dimensions?: Dimensi; // unit/weightUnit dibiarkan kosong (diasumsikan cm & kg)
  status?: "Dipamerkan" | "Penyimpanan";
  origin?: string;
  condition?: string;
  tags?: string;
  images?: string[];
};

export default function TambahKoleksi() {
  const router = useRouter();

  // dropdown kategori
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    setCategories(loadCategories());
  }, []);

  // form state
  const [form, setForm] = useState<FormState>({
    title: "",
    category: "",
    description: "",
    noReg: "",
    noInv: "",
    status: "Dipamerkan",
    // Tanpa unit & weightUnit
    dimensions: { diameter: {} },
  });

  // foto
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // -------- helpers --------
  const num = (v: any) =>
    v === "" || v === undefined || v === null ? undefined : Number(v);

  // hanya untuk panjang/lebar/tinggi/berat
  const setDim =
    (key: "panjang" | "lebar" | "tinggi" | "berat") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({
        ...f,
        dimensions: {
          ...(f.dimensions ?? { diameter: {} }),
          [key]: num(e.target.value),
        },
      }));
    };

  // diameter atas/tengah/bawah
  const setDia =
    (key: "atas" | "tengah" | "bawah") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({
        ...f,
        dimensions: {
          ...(f.dimensions ?? {}),
          diameter: { ...(f.dimensions?.diameter ?? {}), [key]: num(e.target.value) },
        },
      }));
    };

  // handler umum
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // upload file -> dataURL
  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr: string[] = [];
    for (const f of Array.from(files)) {
      if (f.size > 3 * 1024 * 1024) {
        alert(`${f.name} terlalu besar (>3MB)`);
        continue;
      }
      arr.push(await fileToDataURL(f));
    }
    setImages((prev) => [...prev, ...arr]);
  };

  const removeImage = (idx: number) =>
    setImages((prev) => prev.filter((_, i) => i !== idx));

  const onSubmit = async () => {
    if (!form.title) {
      alert("Nama koleksi wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const slug = slugify(form.title);
      // Simpan (demo: localStorage)
      addKoleksi({ slug, ...form, images });
      alert("Tersimpan (demo).");
      router.push("/admin/koleksi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tambah Koleksi</h1>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          {saving ? "Menyimpan..." : "Publikasikan (Demo)"}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kiri: info utama + foto */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border rounded-2xl p-4">
            <h2 className="font-semibold mb-4">Informasi Utama</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm">Nama Koleksi</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Kategori</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={onChange}
                    className="w-full rounded-xl border px-3 py-2"
                >
                  <option value="">— pilih —</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm">Periode</label>
                <input
                  name="period"
                  value={form.period || ""}
                  onChange={onChange}
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Bahan / Material</label>
                <input
                  name="material"
                  value={form.material || ""}
                  onChange={onChange}
                  className="w-full rounded-xl border px-3 py-2"
                />
              </div>

              {/* ======= DIMENSI & BERAT (tanpa unit) ======= */}
              <div className="md:col-span-2">
                <h3 className="font-semibold mt-2 mb-2">Dimensi & Berat</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-sm">Panjang (cm)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.panjang ?? ""}
                      onChange={setDim("panjang")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Lebar (cm)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.lebar ?? ""}
                      onChange={setDim("lebar")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Tinggi (cm)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.tinggi ?? ""}
                      onChange={setDim("tinggi")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Berat (gr)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.berat ?? ""}
                      onChange={setDim("berat")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
                  <div>
                    <label className="text-sm">Diameter Atas (cm)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.diameter?.atas ?? ""}
                      onChange={setDia("atas")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Diameter Tengah (cm)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.diameter?.tengah ?? ""}
                      onChange={setDia("tengah")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Diameter Bawah (cm)</label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.dimensions?.diameter?.bawah ?? ""}
                      onChange={setDia("bawah")}
                      className="w-full rounded-xl border px-3 py-2"
                    />
                  </div>
                </div>
              </div>
              {/* ======= /DIMENSI & BERAT ======= */}

              <div>
                <label className="text-sm">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onChange}
                  className="w-full rounded-xl border px-3 py-2"
                >
                  <option>Dipamerkan</option>
                  <option>Penyimpanan</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm">Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  className="w-full rounded-xl border px-3 py-2 min-h-[120px]"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border rounded-2xl p-4">
            <h2 className="font-semibold mb-4">Foto Koleksi</h2>
            <label className="block border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer bg-neutral-50 hover:bg-neutral-100">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              <div className="text-sm text-neutral-600">
                Klik untuk pilih foto (JPG/PNG, &lt; 3MB/Foto)
              </div>
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
                {images.map((src, i) => (
                  <div key={i}>
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-28 object-cover rounded-xl border"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="text-xs mt-1 underline text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Kanan: identitas & meta */}
        <div className="space-y-6">
          <section className="bg-white border rounded-2xl p-4">
            <h2 className="font-semibold mb-4">Identitas Koleksi</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <input
                name="noReg"
                value={form.noReg}
                onChange={onChange}
                className="rounded-xl border px-3 py-2"
                placeholder="No. Registrasi"
              />
              <input
                name="noInv"
                value={form.noInv}
                onChange={onChange}
                className="rounded-xl border px-3 py-2"
                placeholder="No. Inventaris"
              />
              <input
                name="origin"
                value={form.origin || ""}
                onChange={onChange}
                className="rounded-xl border px-3 py-2"
                placeholder="Asal / Lokasi Temuan"
              />
              <input
                name="condition"
                value={form.condition || ""}
                onChange={onChange}
                className="rounded-xl border px-3 py-2"
                placeholder="Kondisi"
              />
              <input
                name="Keterangan"
                value={form.tags || ""}
                onChange={onChange}
                className="md:col-span-2 rounded-xl border px-3 py-2"
                placeholder="Keterangan"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- util kecil ---------- */
function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
