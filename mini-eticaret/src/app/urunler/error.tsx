"use client";

import { Button } from "@/components/ui/Button";

// Next.js hata sınırları (error.tsx) mutlaka Client Component olmak zorunda
// — sunucuda oluşan bir hatayı tarayıcıda yakalayıp bu bileşene "prop"
// olarak geçiriyor.
export default function UrunlerError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="font-display text-2xl text-ink">Bir şeyler ters gitti</p>
      <p className="mt-2 text-sm text-ink-muted">
        Ürünler yüklenirken bir hata oluştu. Muhtemelen geçici bir bağlantı
        sorunu.
      </p>
      <Button onClick={reset} className="mt-6">
        Tekrar Dene
      </Button>
    </div>
  );
}
