const KEY = "mulawarman:categories";

export function loadCategories(): string[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : null;
    return Array.isArray(list) && list.length ? list : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(list: string[]) {
  if (typeof window === "undefined") return;
  // simpan unique + trim + non-empty
  const clean = Array.from(new Set(list.map(x => x.trim()).filter(Boolean)));
  localStorage.setItem(KEY, JSON.stringify(clean));
}

export const DEFAULT_CATEGORIES = [
  "Geologika",
  "Biologika",
  "Etnografika",
  "Arkeologika",
  "Historika",
  "Numismatika/Heraldika",
  "Filologika",
  "Keramologika",
  "Seni Rupa",
  "Teknologika",
];

