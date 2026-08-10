import Link from "next/link";

// Bu sayfaların altına giren herkesin admin olduğunu src/proxy.ts zaten
// garanti ediyor (bkz. ADMIN_PREFIX kontrolü) — burada tekrar kontrol
// etmiyoruz, proxy tek yetkili nokta.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8 sm:py-12 lg:flex-row lg:gap-8">
      <aside className="lg:w-48 lg:shrink-0">
        <p className="font-display text-lg text-ink">Admin Panel</p>
        <nav className="mt-4 flex flex-wrap gap-1 text-sm lg:mt-6 lg:flex-col">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-ink-muted transition-colors hover:bg-paper-raised hover:text-ink"
          >
            Özet
          </Link>
          <Link
            href="/admin/urunler"
            className="rounded-lg px-3 py-2 text-ink-muted transition-colors hover:bg-paper-raised hover:text-ink"
          >
            Ürünler
          </Link>
          <Link
            href="/admin/kategoriler"
            className="rounded-lg px-3 py-2 text-ink-muted transition-colors hover:bg-paper-raised hover:text-ink"
          >
            Kategoriler
          </Link>
          <Link
            href="/admin/siparisler"
            className="rounded-lg px-3 py-2 text-ink-muted transition-colors hover:bg-paper-raised hover:text-ink"
          >
            Siparişler
          </Link>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
