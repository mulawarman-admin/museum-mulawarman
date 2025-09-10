export type Dimensi = {
  panjang?: number;
  lebar?: number;
  tinggi?: number;
  berat?: number;
  diameter?: { atas?: number; tengah?: number; bawah?: number };
  unit?: "mm" | "cm" | "m";
  weightUnit?: "gr" | "kg";
};

export type KoleksiItem = {
  slug: string;
  title: string;
  category?: string;
  description?: string;
  noReg?: string;
  noInv?: string;
  period?: string;
  material?: string;
  dimensions?: Dimensi;
  status?: "Dipamerkan" | "Penyimpanan";
  origin?: string;
  condition?: string;
  tags?: string;
  images?: string[];
  isPublished?: boolean;          // ← NEW
  createdAt?: string;
  updatedAt?: string;
};

const KEY = "mulawarman:koleksi";
const isBrowser = () => typeof window !== "undefined";

export function loadKoleksi(): KoleksiItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveKoleksi(list: KoleksiItem[]) {
  if (!isBrowser()) return;
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addKoleksi(item: KoleksiItem) {
  const list = loadKoleksi();
  const now = new Date().toISOString();
  // default publish = false kalau tidak diisi
  const isPublished = item.isPublished ?? false;
  list.unshift({ ...item, isPublished, createdAt: now, updatedAt: now });
  saveKoleksi(list);
}

export function getBySlug(slug: string) {
  return loadKoleksi().find((x) => x.slug === slug) || null;
}

export function updateKoleksi(slug: string, patch: Partial<KoleksiItem>) {
  const list = loadKoleksi();
  const idx = list.findIndex((x) => x.slug === slug);
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
    saveKoleksi(list);
  }
}

export function removeKoleksi(slug: string) {
  saveKoleksi(loadKoleksi().filter((x) => x.slug !== slug));
}
export type ImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors: number;
};export function upsertKoleksi(
  item: Partial<KoleksiItem> & { slug: string }
) {
  const list = loadKoleksi();
  const idx = list.findIndex((x) => x.slug === item.slug);
  const now = new Date().toISOString();

  if (idx >= 0) {
    // update
    list[idx] = {
      ...list[idx],
      ...item,
      updatedAt: now,
    };
  } else {
    // create
    const doc: KoleksiItem = {
      slug: item.slug,
      title: item.title || item.slug,
      category: item.category,
      description: item.description,
      noReg: item.noReg,
      noInv: item.noInv,
      period: item.period,
      material: item.material,
      dimensions: item.dimensions,
      status: item.status,
      origin: item.origin,
      condition: item.condition,
      tags: item.tags,
      images: item.images ?? [],
      isPublished: item.isPublished ?? false,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(doc);
  }

  saveKoleksi(list);
}

/** Import massal; update jika slug sudah ada, kalau tidak buat baru */
export function bulkImport(
  items: Array<Partial<KoleksiItem> & { slug: string }>
): ImportResult {
  const list = loadKoleksi();

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const raw of items) {
    try {
      if (!raw?.slug) {
        skipped++;
        continue;
      }
      const idx = list.findIndex((x) => x.slug === raw.slug);
      const now = new Date().toISOString();

      if (idx >= 0) {
        list[idx] = { ...list[idx], ...raw, updatedAt: now };
        updated++;
      } else {
        const doc: KoleksiItem = {
          slug: raw.slug,
          title: raw.title || raw.slug,
          category: raw.category,
          description: raw.description,
          noReg: raw.noReg,
          noInv: raw.noInv,
          period: raw.period,
          material: raw.material,
          dimensions: raw.dimensions,
          status: raw.status,
          origin: raw.origin,
          condition: raw.condition,
          tags: raw.tags,
          images: raw.images ?? [],
          isPublished: raw.isPublished ?? false,
          createdAt: now,
          updatedAt: now,
        };
        list.unshift(doc);
        created++;
      }
    } catch {
      errors++;
    }
  }

  saveKoleksi(list);
  return { created, updated, skipped, errors };
}