import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="font-display text-6xl text-clay-dark">404</p>
      <p className="mt-4 font-display text-2xl text-ink">Sayfa bulunamadı</p>
      <p className="mt-2 text-sm text-ink-muted">
        Aradığınız sayfa taşınmış ya da hiç var olmamış olabilir.
      </p>
      <LinkButton href="/" variant="primary" className="mt-6">
        Ana Sayfaya Dön
      </LinkButton>
    </div>
  );
}
