"use client";

import Link from "next/link";
import { useState } from "react";

interface NavbarUser {
  name: string;
  role: "user" | "admin";
}

// Navbar'daki orta nav linkleri (Ana Sayfa, Ürünler, ...) `sm:flex` ile
// küçük ekranlarda tamamen gizleniyor — bunlara mobilde erişebilmek için
// bu hamburger menü var. Sağdaki sepet/giriş linkleri zaten her zaman
// görünür olduğu için burada tekrarlanmıyor.
export default function MobileMenu({ user }: { user: NavbarUser | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menüyü aç"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:text-ink"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-border bg-paper px-6 py-3 text-sm">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-2 text-ink-muted hover:bg-paper-raised hover:text-ink"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/urunler"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-2 text-ink-muted hover:bg-paper-raised hover:text-ink"
          >
            Ürünler
          </Link>
          {user && (
            <Link
              href="/hesabim/siparisler"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-ink-muted hover:bg-paper-raised hover:text-ink"
            >
              Siparişlerim
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 text-ink-muted hover:bg-paper-raised hover:text-ink"
            >
              Admin Panel
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
