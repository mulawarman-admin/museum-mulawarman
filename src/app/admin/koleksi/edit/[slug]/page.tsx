"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBySlug, updateKoleksi, type KoleksiItem } from "../../../../../lib/koleksiStore";
import { loadCategories } from "../../../../../lib/categoryStore";

export default function EditKoleksi() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const router = useRouter();

  const [form, setForm] = useState<Partial<KoleksiItem> | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCategories(loadCategories());
    const item = getBySlug(slug);
    if (!item) {
      alert("Data tidak ditemukan");
      router.push("/admin/koleksi");
      return;
    }
    // siapkan struktur dimensions default agar onChange aman
    setForm({
      ...item,
      dimensions: item.dimensions ?? { unit: "cm", weightUnit: "kg", diameter: {} },
    });
  }, [slug, router]);

  if (!form) return null;

  // helper umum
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const num = (v: any) =>
    v === "" || v === undefined || v === null ? undefined : Number(v);

  const setDim =
    (key: keyof NonNullable<KoleksiItem["dimensions"]>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val =
        key === "unit" || key === "weightUnit"
          ? (e.target as HTMLSelectElement).value
          : num((e.target as HTMLInputElement).value);

      setForm((f) => ({
        ...f!,
        dimensions: {
          ...(f?.dimensions ?? { unit: "cm", weightUnit: "gr", diameter: {} }),
          [key]: val as any,
        },
      }));
    };

  const setDia =
    (key: "atas" | "tengah" | "bawah") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({
        ...f!,
        dimensions: {
          ...(f?.dimensions ?? { unit: "cm", weightUnit: "gr" }),
          diameter: { ...(f?.dimensions?.diameter ?? {}), [key]: num(e.target.value) },
        },
      }));
    };

  const onSubmit = () => {
    if (!form.title) {
      alert("Nama wajib diisi");
      return;
    }
    setSaving(true);
    try {
      updateKoleksi(slug, form);
      router.push("/admin/koleksi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Koleksi</h1>
        <button
          onClick={onSubmit}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-black text-white"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      <div className="bg-white border rounded-2xl p-6 space-y-4">
        <div>
          <label className="text-sm">Nama Koleksi</label>
          <input
            name="title"
            value={form.title || ""}
            onChange={onChange}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Kategori</label>
          <select
            name="category"
            value={form.category || ""}
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

        <h3 className="font-semibold mt-6 mb-2">Dimensi & Berat</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm">Panjang</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.panjang ?? ""}
              onChange={setDim("panjang")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="cm"
            />
          </div>
          <div>
            <label className="text-sm">Lebar</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.lebar ?? ""}
              onChange={setDim("lebar")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="cm"
            />
          </div>
          <div>
            <label className="text-sm">Tinggi</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.tinggi ?? ""}
              onChange={setDim("tinggi")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="cm"
            />
          </div>
          <div>
            <label className="text-sm">Berat</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.berat ?? ""}
              onChange={setDim("berat")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="gr"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3">
          <div>
            <label className="text-sm">Diameter Atas</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.diameter?.atas ?? ""}
              onChange={setDia("atas")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="cm"
            />
          </div>
          <div>
            <label className="text-sm">Diameter Tengah</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.diameter?.tengah ?? ""}
              onChange={setDia("tengah")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="cm"
            />
          </div>
          <div>
            <label className="text-sm">Diameter Bawah</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.dimensions?.diameter?.bawah ?? ""}
              onChange={setDia("bawah")}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="cm"
            />
          </div>

        
          
        </div>

        <div>
          <label className="text-sm">Deskripsi</label>
          <textarea
            name="description"
            value={form.description || ""}
            onChange={onChange}
            className="w-full rounded-xl border px-3 py-2 min-h-[120px]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">No. Registrasi</label>
            <input
              name="noReg"
              value={form.noReg || ""}
              onChange={onChange}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm">No. Inventaris</label>
            <input
              name="noInv"
              value={form.noInv || ""}
              onChange={onChange}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Status</label>
            <select
              name="status"
              value={(form.status as string) || "Dipamerkan"}
              onChange={onChange}
              className="w-full rounded-xl border px-3 py-2"
            >
              <option>Dipamerkan</option>
              <option>Penyimpanan</option>
            </select>
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
          <div>
            <label className="text-sm">Periode</label>
            <input
              name="period"
              value={form.period || ""}
              onChange={onChange}
              className="w-full rounded-xl border px-3 py-2"
            />
          </div>
          {/* HAPUS field “Dimensi” berbentuk input teks — tidak diperlukan */}
        </div>
      </div>
    </div>
  );
}
