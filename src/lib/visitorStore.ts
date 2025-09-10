// src/lib/visitorStore.ts
export type Visitor = {
  id: string;
  tanggal: string;  // format: "2025-09-04"
  kategori: "Pelajar" | "Dewasa/Umum" | "Asing";
  jumlah: number;
};

const KEY = "mulawarman:visitors";

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadVisitors(): Visitor[] {
  if (!isBrowser()) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]") as Visitor[];
  } catch {
    return [];
  }
}

export function saveVisitors(list: Visitor[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addVisitor(v: Omit<Visitor, "id">) {
  const list = loadVisitors();
  const newItem: Visitor = { id: Date.now().toString(), ...v };
  list.push(newItem);
  saveVisitors(list);
}

export function removeVisitor(id: string) {
  const list = loadVisitors().filter((v) => v.id !== id);
  saveVisitors(list);
}

// Statistik sederhana untuk dashboard
export type VisitorStat = {
  Pelajar: number;
  "Dewasa/Umum": number;
  Asing: number;
};

export function getVisitorStat(): VisitorStat {
  const list = loadVisitors();
  return list.reduce(
    (acc, v) => {
      acc[v.kategori] += v.jumlah;
      return acc;
    },
    { Pelajar: 0, "Dewasa/Umum": 0, Asing: 0 } as VisitorStat
  );
}
