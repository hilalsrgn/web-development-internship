"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export default function AddToCartButton(props: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === props.productId);
  const remainingStock = props.stock - (inCart?.quantity ?? 0);
  const inStock = props.stock > 0;
  const canAddMore = remainingStock > 0;

  function handleClick() {
    addItem(props);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (!inStock) {
    return (
      <Button disabled className="w-full sm:w-auto">
        Stokta Yok
      </Button>
    );
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={!canAddMore}
        className="w-full sm:w-auto"
      >
        {added ? "Sepete Eklendi ✓" : "Sepete Ekle"}
      </Button>
      {!canAddMore && (
        <p className="mt-2 text-xs text-ink-muted">
          Bu üründen sepetinizde stok kadar var.
        </p>
      )}
    </div>
  );
}
