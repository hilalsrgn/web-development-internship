import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Order } from "@/models/Order";

export default async function AdminDashboard() {
  await connectDB();

  const [productCount, categoryCount, orderCount] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Order.countDocuments(),
  ]);

  const stats = [
    { label: "Ürün", value: productCount },
    { label: "Kategori", value: categoryCount },
    { label: "Sipariş", value: orderCount },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Özet</h1>
      <div className="mt-6 grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-paper-raised p-6"
          >
            <p className="font-display text-3xl text-clay-dark">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
