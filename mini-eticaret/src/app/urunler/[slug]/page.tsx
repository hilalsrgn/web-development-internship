import { notFound } from "next/navigation";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  await connectDB();

  const product = await Product.findOne({ slug })
    .populate<{ category: { name: string } | null }>("category", "name")
    .lean();

  if (!product) {
    notFound();
  }

  const image = product.images?.[0];
  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-clay-tint">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-6xl text-clay-dark/40">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div>
          {product.category?.name && (
            <p className="text-xs uppercase tracking-wide text-ink-muted">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 font-display text-3xl text-ink">
            {product.name}
          </h1>
          <p className="mt-4 font-display text-2xl text-clay-dark">
            {currency.format(product.price)}
          </p>

          <p className="mt-6 leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <p
            className={`mt-6 text-sm ${
              inStock ? "text-success" : "text-danger"
            }`}
          >
            {inStock ? `Stokta ${product.stock} adet var` : "Stokta yok"}
          </p>

          <div className="mt-6">
            <AddToCartButton
              productId={String(product._id)}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={image}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
