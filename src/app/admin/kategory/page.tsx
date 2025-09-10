"use client";
import { useEffect, useState } from "react";
import { loadCategories, saveCategories } from "../../../lib/categoryStore";

export default function AdminKategori() {
  const [items, setItems] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => setItems(loadCategories()), []);

  const add = () => {
    const name = input.trim();
    if (!name) return;
    if (items.includes(name)) { alert("Kategori sudah ada"); return; }
    const next = [...items, name];
    setItems(next); saveCategories(next); setInput("");
  };

  const remove = (name: string) => {
    if (!confirm(`Hapus kategori "${name}" ?`)) return;
    const next = items.filter(i => i !== name);
    setItems(next); saveCategories(next);
  };

  const rename = (oldName: string) => {
    const name = prompt(`Ganti nama kategori:`, oldName)?.trim();
    if (!name || name === oldName) return;
    if (items.includes(name)) { alert("Nama sudah ada"); return; }
    const next = items.map(i => (i === oldName ? name : i));
    setItems(next); saveCategories(next);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Kategori Koleksi</h1>

      <div className="bg-white border rounded-2xl p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nama kategori baru"
            className="flex-1 rounded-xl border px-3 py-2"
          />
          <button onClick={add} className="px-4 py-2 rounded-xl bg-black text-white">Tambah</button>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((name) => (
            <div key={name} className="border rounded-xl p-3 flex items-center justify-between bg-neutral-50">
              <div className="font-medium">{name}</div>
              <div className="flex gap-2">
                <button onClick={() => rename(name)} className="px-3 py-1 rounded-lg border">Ubah</button>
                <button onClick={() => remove(name)} className="px-3 py-1 rounded-lg border text-red-600">Hapus</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-sm text-neutral-500">Belum ada kategori.</div>}
        </div>
      </div>

      <div className="text-sm text-neutral-600">
        Tip: Kategori di sini otomatis muncul di form <b>Tambah</b> & <b>Edit</b> koleksi.
      </div>
    </div>
  );
}
