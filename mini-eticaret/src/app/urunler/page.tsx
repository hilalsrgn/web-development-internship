import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import ProductFilters from "@/components/ProductFilters";
import ProductCard, { ProductCardData } from "@/components/ProductCard";

// Stok/fiyat gibi sık değişen canlı veri gösteriyor — build zamanında
// statik üretilmesin, her istekte veritabanından taze veri çeksin.
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function UrunlerPage({ searchParams }: PageProps) {
  const { category, q } = await searchParams;

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: "i" };

  const [rawProducts, categories] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean(),
    Category.find().sort({ name: 1 }).lean(),
  ]);

  const products: ProductCardData[] = rawProducts.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    images: p.images ?? [],
    categoryName: (p.category as unknown as { name?: string } | null)?.name,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Ürünler</h1>

      <div className="mt-6">
        <ProductFilters
          categories={categories.map((c) => ({
            _id: String(c._id),
            name: c.name,
          }))}
          activeCategory={category}
          activeQuery={q}
        />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-sm text-ink-muted">
          {q || category
            ? "Bu kriterlere uyan ürün bulunamadı."
            : "Henüz ürün eklenmedi."}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
