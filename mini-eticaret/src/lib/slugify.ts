// Türkçe karakterleri (ı, ğ, ü, ş, ö, ç) URL-dostu karşılıklarına çeviriyor,
// sonra boşlukları tire yapıyor. Örn: "Kadın Ayakkabı" -> "kadin-ayakkabi"
const TR_MAP: Record<string, string> = {
  ı: "i",
  İ: "i",
  ğ: "g",
  Ğ: "g",
  ü: "u",
  Ü: "u",
  ş: "s",
  Ş: "s",
  ö: "o",
  Ö: "o",
  ç: "c",
  Ç: "c",
};

export function slugify(text: string): string {
  const normalized = text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, (ch) => TR_MAP[ch] ?? ch);

  return normalized
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
