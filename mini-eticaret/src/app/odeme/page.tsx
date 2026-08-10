"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Button, LinkButton } from "@/components/ui/Button";

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function OdemePage() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCart();
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">Sepetiniz boş</p>
        <p className="mt-2 text-sm text-ink-muted">
          Ödemeye geçmeden önce sepetinize ürün ekleyin.
        </p>
        <LinkButton href="/urunler" variant="primary" className="mt-6">
          Ürünlere Göz At
        </LinkButton>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddress: form,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Sipariş oluşturulamadı");
        return;
      }

      clear();
      router.push(`/hesabim/siparisler/${data.orderId}`);
    } catch {
      setError("Sunucuya ulaşılamadı, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Ödeme</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-ink">Ad Soyad</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Adres</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-ink">Şehir</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Posta Kodu</label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
                className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
              />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-clay-tint px-4 py-3 text-sm text-clay-dark">
            Bu bir deneme (mock) ödeme akışıdır — gerçek bir kart bilgisi
            istenmiyor, &quot;Siparişi Onayla&quot; ödemeyi otomatik başarılı sayar.
          </div>

          {error && (
            <p className="rounded-lg bg-clay-tint px-3.5 py-2.5 text-sm text-clay-dark">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sipariş oluşturuluyor..." : "Siparişi Onayla"}
          </Button>
        </form>

        <div className="h-fit rounded-2xl border border-border bg-paper-raised p-6">
          <p className="font-display text-lg text-ink">Sipariş Özeti</p>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between text-sm"
              >
                <span className="text-ink-muted">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-ink">
                  {currency.format(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-4">
            <span className="text-ink-muted">Toplam</span>
            <span className="font-display text-lg text-clay-dark">
              {currency.format(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
