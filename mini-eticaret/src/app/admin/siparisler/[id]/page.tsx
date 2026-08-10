import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminSiparisDetayPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();

  const order = await Order.findById(id).populate("user", "name email").lean();
  if (!order) {
    notFound();
  }

  const orderUser = order.user as unknown as { name: string; email: string } | null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-muted">
            Sipariş #{String(order._id).slice(-6).toUpperCase()}
          </p>
          <h1 className="font-display text-2xl text-ink">
            {orderUser?.name ?? "Silinmiş kullanıcı"}
          </h1>
          <p className="text-sm text-ink-muted">{orderUser?.email}</p>
        </div>
        <OrderStatusSelect orderId={String(order._id)} currentStatus={order.status} />
      </div>

      <p className="mt-2 text-sm text-ink-muted">
        {dateFormat.format(new Date(order.createdAt))}
      </p>

      <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between p-5">
            <span className="text-ink">
              {item.name} × {item.quantity}
            </span>
            <span className="text-ink-muted">
              {currency.format(item.price * item.quantity)}
            </span>
          </div>
        ))}
        <div className="flex justify-between p-5">
          <span className="text-ink">Toplam</span>
          <span className="font-display text-lg text-clay-dark">
            {currency.format(order.totalPrice)}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-paper-raised p-5">
        <p className="text-sm font-medium text-ink">Teslimat Adresi</p>
        <p className="mt-2 text-sm text-ink-muted">
          {order.shippingAddress?.fullName}
          <br />
          {order.shippingAddress?.address}
          <br />
          {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
        </p>
      </div>
    </div>
  );
}
