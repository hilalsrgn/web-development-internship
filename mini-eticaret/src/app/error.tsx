"use client";

import { Button } from "@/components/ui/Button";

// Bu, sitenin genelinde (özel bir error.tsx tanımlanmamış her sayfada)
// devreye giren son çare hata yakalayıcı. /urunler/error.tsx gibi daha
// spesifik bir error.tsx varsa, o dosya bu genel olanın önüne geçer.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="font-display text-2xl text-ink">Bir şeyler ters gitti</p>
      <p className="mt-2 text-sm text-ink-muted">
        Beklenmedik bir hata oluştu. Tekrar denemek işe yarayabilir.
      </p>
      <Button onClick={reset} className="mt-6">
        Tekrar Dene
      </Button>
    </div>
  );
}
