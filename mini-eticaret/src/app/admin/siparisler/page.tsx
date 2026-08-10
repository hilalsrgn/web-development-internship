import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
});

const statusLabels: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

interface OrderRow {
  _id: string;
  createdAt: Date;
  totalPrice: number;
  status: string;
  user: { name: string; email: string } | null;
}

export default async function AdminSiparislerPage() {
  await connectDB();
  const rawOrders = (await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean()) as unknown as OrderRow[];

  // Admin/urunler sayfasındaki aynı sebep: Server -> Client Component
  // sınırından geçmeyecek bile olsa, ObjectId'leri burada da düz string'e
  // çevirip tutarlı bir alışkanlık sürdürüyoruz.
  const orders = rawOrders.map((o) => ({
    ...o,
    _id: String(o._id),
  }));

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Siparişler</h1>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
        {orders.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">Henüz sipariş yok.</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order._id}
              href={`/admin/siparisler/${order._id}`}
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-clay-tint/40"
            >
              <div>
                <p className="text-ink">
                  {order.user?.name ?? "Silinmiş kullanıcı"}
                </p>
                <p className="text-xs text-ink-muted">
                  {dateFormat.format(new Date(order.createdAt))} ·{" "}
                  {statusLabels[order.status] ?? order.status}
                </p>
              </div>
              <p className="text-ink">{currency.format(order.totalPrice)}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
