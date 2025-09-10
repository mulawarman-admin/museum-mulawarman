"use client";

import { useEffect, useMemo, useState } from "react";
import { loadKoleksi, type KoleksiItem } from "@/lib/koleksiStore";
import { loadCategories } from "@/lib/categoryStore";

// Recharts (client components)
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

/* -------------------- util -------------------- */
const TARGET_TOTAL = 5309;
const CAT_COLORS = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];
function fmt(n: number) {
  return n.toLocaleString("id-ID");
}

/* -------------------- widget progres -------------------- */
function ProgresUploadKoleksi() {
  const [uploaded, setUploaded] = useState(0);

  useEffect(() => {
    setUploaded(loadKoleksi().length); // jumlah item di localStorage (demo)
  }, []);

  const remaining = Math.max(0, TARGET_TOTAL - uploaded);
  const percent = Math.min(100, Math.round((uploaded / TARGET_TOTAL) * 100));
  const data = [
    { name: "Sudah di-upload", value: uploaded },
    { name: "Sisa", value: remaining },
  ];
  const PROGRESS_COLORS = ["#0ea5e9", "#e5e7eb"]; // biru & abu

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Progres Upload Koleksi</h3>
        <span className="text-sm text-neutral-500">Target: {fmt(TARGET_TOTAL)}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip formatter={(v: number) => fmt(v)} />
              <Pie data={data} dataKey="value" innerRadius={60} outerRadius={80} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PROGRESS_COLORS[i % PROGRESS_COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ringkasan */}
        <div className="space-y-2">
          <div className="text-3xl font-bold leading-tight">
            {fmt(uploaded)}{" "}
            <span className="text-base font-normal text-neutral-500">({percent}%)</span>
          </div>
          <div className="text-neutral-600">
            Sudah di-upload dari total {fmt(TARGET_TOTAL)} koleksi.
          </div>
          <div className="text-sm text-neutral-500">Sisa: {fmt(remaining)} koleksi lagi.</div>
          <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-sky-500" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- halaman dashboard -------------------- */
export default function AdminDashboard() {
  const [items, setItems] = useState<KoleksiItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setItems(loadKoleksi());
    setCategories(loadCategories());
  }, []);

  const total = items.length;
  const dipamerkan = items.filter((i) => i.status === "Dipamerkan").length;
  const penyimpanan = items.filter((i) => i.status === "Penyimpanan").length;
  const terbaru = [...items].slice(-5).reverse();

  // data pie kategori
  const pieData = useMemo(() => {
    if (!items.length) return [];
    const map = new Map<string, number>();
    items.forEach((i) => {
      const key = i.category || "Lainnya";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [items]);

  // data bar status
  const barData = useMemo(
    () => [{ name: "Status", Dipamerkan: dipamerkan, Penyimpanan: penyimpanan }],
    [dipamerkan, penyimpanan]
  );

  return (
    <main className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        {/* kamu bisa taruh badge "Draft • Belum tersinkron ke DB" di sini */}
      </div>

      {/* KPI Kartu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Koleksi" value={total} />
        <Card title="Kategori" value={categories.length} />
        <Card title="Dipamerkan" value={dipamerkan} />
        <Card title="Penyimpanan" value={penyimpanan} />
      </div>

      {/* Widget Progres */}
      <section className="bg-white border rounded-2xl p-4">
        <ProgresUploadKoleksi />
      </section>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Sebaran Kategori */}
        <section className="bg-white border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Sebaran Kategori</h2>
          {pieData.length === 0 ? (
            <EmptyNote />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={CAT_COLORS[idx % CAT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        {/* Bar Status Koleksi */}
        <section className="bg-white border rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Status Koleksi</h2>
          {total === 0 ? (
            <EmptyNote />
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="Dipamerkan" fill="#10b981" />
                  <Bar dataKey="Penyimpanan" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {/* Koleksi Terbaru */}
      <section className="bg-white border rounded-2xl p-4">
        <h2 className="font-semibold mb-3">Koleksi Terbaru</h2>
        {terbaru.length === 0 ? (
          <EmptyNote />
        ) : (
          <ul className="divide-y">
            {terbaru.map((it) => (
              <li key={it.slug} className="py-3 flex items-center gap-3">
                <img
                  src={it.images?.[0] || "/museum.jpg"}
                  className="w-12 h-12 object-cover rounded-lg border"
                  alt=""
                />
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-neutral-500">
                    {it.category || "—"} • {it.status || "—"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

/* -------------------- helpers -------------------- */
function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-4 text-center shadow-sm">
      <div className="text-2xl font-bold">{fmt(value)}</div>
      <div className="text-sm text-neutral-600">{title}</div>
    </div>
  );
}

function EmptyNote() {
  return (
    <div className="p-6 rounded-xl bg-neutral-50 border text-neutral-600 text-sm">
      Belum ada data untuk ditampilkan.
    </div>
  );
}
