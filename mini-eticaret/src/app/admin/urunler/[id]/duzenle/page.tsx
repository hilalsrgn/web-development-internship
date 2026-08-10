import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import ProductForm from "@/components/admin/ProductForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UrunDuzenlePage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  const product = await Product.findById(id).lean();
  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Ürünü Düzenle</h1>
      <ProductForm
        productId={id}
        initialValues={{
          name: product.name,
          description: product.description,
          price: String(product.price),
          stock: String(product.stock),
          category: product.category.toString(),
          images: product.images ?? [],
        }}
      />
    </div>
  );
}
