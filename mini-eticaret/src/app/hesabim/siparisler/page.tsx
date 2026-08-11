import Link from "next/link";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

// admin/layout.tsx'teki notla aynı sebep: bu sayfa kullanıcıya özel,
// canlı veri gösteriyor — build zamanında statik olarak üretilmemeli.
export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const dateFormat = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const statusLabels: Record<string, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  shipped: "Kargoda",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export default async function SiparislerimPage() {
  // Bu sayfaya sadece giriş yapmış kullanıcılar ulaşabiliyor (proxy.ts
  // /hesabim öneki için bunu zaten garanti ediyor), ama getCurrentUser()
  // null dönerse (örn. token tam bu sırada geçersiz olduysa) siparişleri
  // başka birine göstermemek için erken çıkıyoruz.
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  await connectDB();
  const orders = await Order.find({ user: user._id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Siparişlerim</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">
          Henüz bir siparişiniz yok.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
          {orders.map((order) => (
            <Link
              key={String(order._id)}
              href={`/hesabim/siparisler/${order._id}`}
              className="flex items-center justify-between p-5 transition-colors hover:bg-clay-tint/40"
            >
              <div>
                <p className="text-ink">
                  Sipariş #{String(order._id).slice(-6).toUpperCase()}
                </p>
                <p className="mt-1 text-sm text-ink-muted">
                  {dateFormat.format(new Date(order.createdAt))} ·{" "}
                  {statusLabels[order.status] ?? order.status}
                </p>
              </div>
              <p className="font-display text-lg text-clay-dark">
                {currency.format(order.totalPrice)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
