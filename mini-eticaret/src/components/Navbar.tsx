import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import CartIndicator from "@/components/CartIndicator";
import MobileMenu from "@/components/MobileMenu";

interface NavbarUser {
  name: string;
  role: "user" | "admin";
}

export default function Navbar({ user }: { user: NavbarUser | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-ink"
        >
          Mini Mağaza
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-muted sm:flex">
          <Link href="/" className="transition-colors hover:text-ink">
            Ana Sayfa
          </Link>
          <Link href="/urunler" className="transition-colors hover:text-ink">
            Ürünler
          </Link>
          {user && (
            <Link
              href="/hesabim/siparisler"
              className="transition-colors hover:text-ink"
            >
              Siparişlerim
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="transition-colors hover:text-ink">
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <MobileMenu user={user} />
          <CartIndicator />
          {user ? (
            <>
              <span className="hidden text-sm text-ink-muted sm:inline">
                Merhaba, {user.name}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/giris"
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Giriş Yap
              </Link>
              <Link
                href="/kayit"
                className="rounded-full bg-clay px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-clay-dark"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
