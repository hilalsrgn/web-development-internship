import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

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

const statusLabels: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SiparisDetayPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  await connectDB();

  // Sorguya "user: user._id" şartını doğrudan ekliyoruz — böylece biri
  // başka bir kullanıcının sipariş ID'sini URL'e yazsa bile, o sipariş
  // bu kullanıcıya ait değilse sonuç boş döner (notFound). Önce siparişi
  // çekip sonra "sahibi bu mu?" diye ayrıca kontrol etmiyoruz; filtrenin
  // kendisi bunu garanti ediyor.
  const order = await Order.findOne({ _id: id, user: user._id }).lean();
  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-sm text-ink-muted">
        Sipariş #{String(order._id).slice(-6).toUpperCase()}
      </p>
      <div className="mt-1 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">
          {dateFormat.format(new Date(order.createdAt))}
        </h1>
        <span className="rounded-full bg-success/10 px-3 py-1 text-sm text-success">
          {statusLabels[order.status] ?? order.status}
        </span>
      </div>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
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
