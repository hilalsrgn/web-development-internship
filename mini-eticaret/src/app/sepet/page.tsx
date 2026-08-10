"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { LinkButton } from "@/components/ui/Button";

const currency = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

export default function SepetPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">Sepetiniz boş</p>
        <p className="mt-2 text-sm text-ink-muted">
          Ürünler sayfasından sepetinize ekleme yapabilirsiniz.
        </p>
        <LinkButton href="/urunler" variant="primary" className="mt-6">
          Ürünlere Göz At
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Sepetim</h1>

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-5">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-clay-tint">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-lg text-clay-dark/40">
                    {item.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/urunler/${item.slug}`}
                className="text-ink hover:text-clay-dark"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-ink-muted">
                {currency.format(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="h-8 w-8 rounded-full border border-border text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
              >
                −
              </button>
              <span className="w-6 text-center text-ink">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="h-8 w-8 rounded-full border border-border text-ink-muted transition-colors hover:text-ink disabled:opacity-40"
              >
                +
              </button>
            </div>

            <p className="w-20 shrink-0 text-right text-ink">
              {currency.format(item.price * item.quantity)}
            </p>

            <button
              onClick={() => removeItem(item.productId)}
              className="shrink-0 text-sm text-danger hover:underline"
            >
              Sil
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-paper-raised p-5">
        <p className="text-ink-muted">Toplam</p>
        <p className="font-display text-2xl text-clay-dark">
          {currency.format(totalPrice)}
        </p>
      </div>

      <div className="mt-6">
        <LinkButton href="/odeme" variant="primary" className="w-full sm:w-auto">
          Ödemeye Geç
        </LinkButton>
      </div>
    </div>
  );
}
