import Link from "next/link";

interface Category {
  _id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: Category[];
  activeCategory?: string;
  activeQuery?: string;
}

// Bilerek istemci tarafı (client-side) JavaScript kullanmıyoruz: kategori
// linkleri düz <Link>, arama kutusu düz bir GET formu. İkisi de URL'i
// değiştirip sayfayı yeniden yüklüyor — JavaScript kapalı olsa bile çalışır,
// ve bu basit filtreleme için ekstra karmaşıklığa gerek yok.
export default function ProductFilters({
  categories,
  activeCategory,
  activeQuery,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/urunler"
          className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
            !activeCategory
              ? "bg-clay text-paper"
              : "border border-border text-ink-muted hover:text-ink"
          }`}
        >
          Tümü
        </Link>
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/urunler?category=${category._id}`}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              activeCategory === category._id
                ? "bg-clay text-paper"
                : "border border-border text-ink-muted hover:text-ink"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <form action="/urunler" method="GET" className="flex-shrink-0">
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <input
          type="search"
          name="q"
          defaultValue={activeQuery}
          placeholder="Ürün ara..."
          className="w-full rounded-full border border-border bg-paper-raised px-4 py-1.5 text-sm text-ink outline-none focus:border-clay sm:w-56"
        />
      </form>
    </div>
  );
}
