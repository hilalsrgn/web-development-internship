import Link from "next/link";
import Image from "next/image";

export interface ProductCardData {
  slug: string;
  name: string;
  price: number;
  images: string[];
  categoryName?: string;
}

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-paper-raised transition-colors hover:border-clay"
    >
      <div className="relative aspect-square overflow-hidden bg-clay-tint">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // Görsel yoksa boş bir kutu yerine, markanın rengiyle uyumlu
          // basit bir desen gösteriyoruz — kırık resim ikonundan daha iyi.
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-3xl text-clay-dark/40">
              {product.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.categoryName && (
          <p className="text-xs uppercase tracking-wide text-ink-muted">
            {product.categoryName}
          </p>
        )}
        <p className="mt-1 text-ink">{product.name}</p>
        <p className="mt-1 font-display text-lg text-clay-dark">
          {currency.format(product.price)}
        </p>
      </div>
    </Link>
  );
}
