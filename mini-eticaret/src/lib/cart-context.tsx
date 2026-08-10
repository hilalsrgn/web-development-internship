"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  stock: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "mini-eticaret-sepet";

export function CartProvider({ children }: { children: ReactNode }) {
  // Sunucuda localStorage yok, bu yüzden başlangıç state'i her zaman boş
  // dizi — sunucu ve istemcinin ilk render'ı birebir aynı olmalı (hydration
  // uyuşmazlığı olmasın diye). Gerçek veriyi mount olduktan sonra, aşağıdaki
  // useEffect içinde okuyoruz.
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        // localStorage tarayıcıya özel, senkron bir dış sistem — React'in
        // "effect'ler dış sistemlerle senkronize eder" prensibine tam
        // uyuyor. Bunu render sırasında (lazy useState initializer ile)
        // okumak daha "doğrudan" görünse de, yukarıdaki yorumda açıklanan
        // hydration uyuşmazlığına geri döner; bu yüzden effect içinde
        // kalması bilinçli bir tercih.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(raw));
      } catch {
        // Bozuk veri varsa sessizce yok sayıyoruz, boş sepetle devam.
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    // İlk (boş) state'i localStorage'a yazıp gerçek veriyi ezmemek için,
    // yukarıdaki okuma tamamlanana kadar bekliyoruz.
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        const newQuantity = Math.min(
          existing.quantity + quantity,
          existing.stock
        );
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: newQuantity } : i
        );
      }
      return [...prev, { ...item, quantity: Math.min(quantity, item.stock) }];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function updateQuantity(productId: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
          : i
      )
    );
  }

  function clear() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart, CartProvider içinde kullanılmalı");
  }
  return ctx;
}
