import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { LinkButton } from "@/components/ui/Button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

interface ProductRow {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: { name: string } | null;
}

export default async function UrunlerPage() {
  await connectDB();
  const rawProducts = (await Product.find()
    .populate("category", "name")
    .sort({ createdAt: -1 })
    .lean()) as unknown as Array<{
    _id: unknown;
    name: string;
    price: number;
    stock: number;
    category: { name: string } | null;
  }>;

  // Mongoose'un lean() sonucu hâlâ ObjectId gibi düz olmayan (plain object
  // olmayan) alanlar içerebiliyor. Server Component'ten Client Component'e
  // prop geçerken bunların düz string/number olması gerekiyor, aksi halde
  // Next.js seri hale getiremiyor.
  const products: ProductRow[] = rawProducts.map((p) => ({
    _id: String(p._id),
    name: p.name,
    price: p.price,
    stock: p.stock,
    category: p.category ? { name: p.category.name } : null,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Ürünler</h1>
        <LinkButton href="/admin/urunler/yeni" variant="primary">
          Yeni Ürün
        </LinkButton>
      </div>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
        {products.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">
            Henüz ürün yok. Yukarıdan ilk ürünü ekleyin.
          </p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="text-ink">{product.name}</p>
                <p className="text-xs text-ink-muted">
                  {product.category?.name ?? "Kategorisiz"} · {product.price}₺
                  · Stok: {product.stock}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href={`/admin/urunler/${product._id}/duzenle`}
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  Düzenle
                </Link>
                <DeleteProductButton productId={product._id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
