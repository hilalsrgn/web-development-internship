"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function KayitPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Bir şeyler ters gitti");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Hesap Oluştur</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Zaten hesabın var mı?{" "}
        <Link href="/giris" className="text-clay hover:text-clay-dark">
          Giriş yap
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Ad Soyad
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
          />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink">
            E-posta
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-medium text-ink">
            Şifre
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
          />
          <p className="mt-1.5 text-xs text-ink-muted">En az 6 karakter</p>
        </div>

        {error && (
          <p className="rounded-lg bg-clay-tint px-3.5 py-2.5 text-sm text-clay-dark">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Hesap oluşturuluyor..." : "Hesap Oluştur"}
        </Button>
      </form>
    </div>
  );
}
