"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/sepet"
      className="relative text-sm text-ink-muted transition-colors hover:text-ink"
    >
      Sepet
      {totalItems > 0 && (
        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-xs font-medium text-paper">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
