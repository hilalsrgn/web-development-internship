"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Button } from "@/components/ui/Button";

function GirisForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Bir şeyler ters gitti");
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") ?? "/";
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı, tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="font-display text-3xl text-ink">Giriş Yap</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Hesabın yok mu?{" "}
        <Link href="/kayit" className="text-clay hover:text-clay-dark">
          Hesap oluştur
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-border bg-paper-raised px-3.5 py-2.5 text-ink outline-none focus:border-clay"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-clay-tint px-3.5 py-2.5 text-sm text-clay-dark">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>
    </div>
  );
}

export default function GirisPage() {
  // useSearchParams bir Suspense sınırı ister; App Router'da bu satır
  // olmadan build sırasında uyarı/hata alırsınız.
  return (
    <Suspense>
      <GirisForm />
    </Suspense>
  );
}
