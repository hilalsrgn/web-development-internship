"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Button } from "@/components/ui/Button";

interface Category {
  _id: string;
  name: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: string[];
}

interface ProductFormProps {
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}

const emptyValues: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category: "",
  images: [],
};

export default function ProductForm({
  productId,
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<ProductFormValues>({
    ...emptyValues,
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []));
  }, []);

  function update<K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  // @vercel/blob'un "client upload" fonksiyonu, dosyayı doğrudan Vercel
  // Blob'a yüklüyor (sunucumuzdan geçmiyor) — arka planda /api/upload'a
  // kısa ömürlü bir izin (token) istiyor, izni onaylanınca yüklemeyi
  // kendisi yürütüyor. Sonuçta elimize kalıcı (public) bir URL geçiyor.
  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      update("images", [...values.images, blob.url]);
    } catch {
      setError("Görsel yüklenemedi, tekrar deneyin");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    update(
      "images",
      values.images.filter((img) => img !== url)
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: values.name,
      description: values.description,
      price: values.price,
      stock: values.stock,
      category: values.category,
      images: values.images,
    };

    try {
      const url = productId ? `/api/products/${productId}` : "/api/products";
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Bir şeyler ters gitti");
        return;
      }

      router.push("/admin/urunler");
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-5">
      <div>
        <label className="text-sm font-medium text-ink">Ürün Adı</label>
        <input
          type="text"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Açıklama</label>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink">Fiyat (₺)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={values.price}
            onChange={(e) => update("price", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Stok</label>
          <input
            type="number"
            required
            min="0"
            value={values.stock}
            onChange={(e) => update("stock", e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Kategori</label>
        <select
          required
          value={values.category}
          onChange={(e) => update("category", e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
        >
          <option value="" disabled>
            Kategori seçin
          </option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="mt-1.5 text-xs text-ink-muted">
            Önce Kategoriler sayfasından bir kategori oluşturun.
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Ürün Görselleri</label>

        {values.images.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {values.images.map((url) => (
              <div key={url} className="group relative h-16 w-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-full w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Görseli kaldır"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3.5 py-2.5 text-sm text-ink-muted hover:border-clay hover:text-ink">
          {uploading ? "Yükleniyor..." : "Görsel Yükle"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        <p className="mt-1.5 text-xs text-ink-muted">
          Görseller Vercel Blob&apos;a yükleniyor. jpeg, png, webp veya avif.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-clay-tint px-3.5 py-2.5 text-sm text-clay-dark">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : productId ? "Güncelle" : "Ürün Oluştur"}
      </Button>
    </form>
  );
}
