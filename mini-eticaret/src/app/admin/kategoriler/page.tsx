"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function KategorilerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data.categories ?? []);
  }

  useEffect(() => {
    // İlk yüklemede iskelet (skeleton) göstermek için ayrı bir yol
    // izliyoruz: setListLoading(false) burada bir .then() içinde çağrılıyor
    // — effect'in kendisi senkron bir state güncellemesi yapmıyor, sadece
    // dış sistemden (API) gelen sonucu bekleyip React'e aktarıyor.
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories ?? []))
      .finally(() => setListLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Bir şeyler ters gitti");
        return;
      }

      setName("");
      await loadCategories();
    } catch {
      setError("Sunucuya ulaşılamadı, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Silinemedi");
      return;
    }

    await loadCategories();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Kategoriler</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
        <input
          type="text"
          required
          placeholder="Yeni kategori adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Ekleniyor..." : "Ekle"}
        </Button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg bg-clay-tint px-3.5 py-2.5 text-sm text-clay-dark">
          {error}
        </p>
      )}

      <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-paper-raised">
        {listLoading ? (
          <p className="p-6 text-sm text-ink-muted">Yükleniyor...</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">
            Henüz kategori yok. Yukarıdan ilk kategoriyi ekleyin.
          </p>
        ) : (
          categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="text-ink">{category.name}</p>
                <p className="text-xs text-ink-muted">{category.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(category._id)}
                className="text-sm text-danger hover:underline"
              >
                Sil
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
